// Mock implementations for the typed service contracts.
// TODO(backend): replace these with real fetch/RPC clients.
import type {
  TransactionsRepo, CategoriesRepo, ReviewRepo, MarginRepo, CashRepo,
  AlertsRepo, AIRepo, CompanyRepo, AuthService, SubscriptionRepo, NewCompanyInput
} from "@/services/contracts";
import type {
  AIMessage, User, Transaction, ReviewItem, MarginView, CashView,
  CashProjectionPoint, ReceivableExpectation, PayableObligation, FinancialAlert,
  Company, Subscription, SubscriptionPlan
} from "@/domain/types";
import {
  seedTransactions, seedCategories, seedReview, seedMargin, seedDRE,
  seedCosts, seedBudget, seedPricing, seedCash, seedCashProjection,
  seedReceivables, seedObligations, seedAlerts, seedConversations,
  seedCompany, seedAccounts, seedTax, seedPeriods, seedUser
} from "./seed";
import { getDemoScenario } from "@/hooks/useDemoScenario";

const delay = <T,>(v: T, ms = 280) => new Promise<T>(r => setTimeout(() => r(v), ms));

// ---- scenario shaping helpers ----
// Only "polish" transactions that already had a category — never overwrite
// user-created or needs-review transactions, so they keep their true status.
const reviewedTransaction = (transaction: Transaction): Transaction => {
  if (!transaction.categoryId) return transaction;
  return {
    ...transaction,
    reviewStatus: "reviewed",
    evidenceCount: Math.max(1, transaction.evidenceCount),
  };
};

const scenarioTransactions = (): Transaction[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "partial") return seedTransactions.slice(0, 8);
  if (s === "reliable") return seedTransactions.map(reviewedTransaction);
  return seedTransactions;
};

// User-created review items (e.g. from manual transactions) are always shown,
// regardless of demo scenario, so the user sees the result of their action.
const userReviewIds = new Set<string>();

const scenarioReview = (): ReviewItem[] => {
  const s = getDemoScenario();
  const userItems = seedReview.filter(r => userReviewIds.has(r.id));
  let base: ReviewItem[];
  if (s === "empty") base = [];
  else if (s === "partial") base = seedReview.filter(r => r.severity !== "critical" && !userReviewIds.has(r.id)).slice(0, 2);
  else if (s === "reliable") base = seedReview.filter(r => r.severity === "low" && !userReviewIds.has(r.id)).slice(0, 1);
  else base = seedReview.filter(r => !userReviewIds.has(r.id));
  return [...userItems, ...base];
};

const scenarioMargin = (): MarginView | null => {
  const s = getDemoScenario();
  if (s === "empty") return null;
  if (s === "partial") return { ...seedMargin, confidence: "partial" };
  if (s === "critical") return { ...seedMargin, confidence: "with-caveats", delta: { value: -14200, pct: -9.8, vs: "vs mês anterior" } };
  return { ...seedMargin, confidence: "reliable" };
};

const scenarioCash = (): CashView | null => {
  const s = getDemoScenario();
  if (s === "empty") return null;
  if (s === "partial") return { ...seedCash, confidence: "partial" };
  if (s === "critical") return { ...seedCash, riskLevel: "critical", projected30d: -8200, confidence: "with-caveats" };
  return { ...seedCash, riskLevel: "ok", projected30d: 42000, confidence: "reliable" };
};

const scenarioProjection = (): CashProjectionPoint[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "critical") return seedCashProjection.map((p, i) => ({ ...p, balance: p.balance - i * 600 }));
  if (s === "reliable") return seedCashProjection.map((p, i) => ({ ...p, balance: p.balance + i * 800 }));
  return seedCashProjection;
};

const scenarioReceivables = (): ReceivableExpectation[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "partial") return seedReceivables.slice(0, 2);
  return seedReceivables;
};

const scenarioObligations = (): PayableObligation[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "partial") return seedObligations.slice(0, 2);
  if (s === "reliable") return seedObligations.map(o => ({ ...o, severity: o.severity === "critical" ? "high" : "normal" }));
  return seedObligations;
};

const scenarioAlerts = (): FinancialAlert[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "reliable") return seedAlerts.filter(a => a.severity === "info");
  if (s === "partial") return seedAlerts.filter(a => a.severity !== "critical");
  return seedAlerts;
};

const scenarioAccounts = (): typeof seedAccounts => {
  const s = getDemoScenario();
  if (s === "empty") {
    return seedAccounts.map((account, index) => ({
      ...account,
      status: index === 0 ? "pending" : "disconnected",
      lastSyncAt: undefined,
      balance: undefined,
    }));
  }

  if (s === "partial") {
    return seedAccounts.map((account, index) => ({
      ...account,
      status: index === 2 ? "pending" : account.status,
      lastSyncAt:
        index === 0
          ? new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
          : index === 1
            ? new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
            : account.lastSyncAt,
    }));
  }

  if (s === "critical") {
    return seedAccounts.map((account, index) => ({
      ...account,
      status: index === 1 ? "error" : account.status,
      lastSyncAt:
        index === 0
          ? new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
          : index === 1
            ? new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
            : account.lastSyncAt,
    }));
  }

  return seedAccounts.map((account, index) => ({
    ...account,
    status: "connected",
    lastSyncAt: new Date(Date.now() - 1000 * 60 * (index + 1) * 45).toISOString(),
  }));
};

export const transactionsRepo: TransactionsRepo = {
  async list(query) {
    let data = [...scenarioTransactions()];
    if (query?.search) {
      const q = query.search.toLowerCase();
      data = data.filter(t =>
        t.description.toLowerCase().includes(q) ||
        (t.counterparty || "").toLowerCase().includes(q),
      );
    }
    if (query?.status && query.status !== "all") {
      data = data.filter(t => t.reviewStatus === query.status);
    }
    if (query?.categoryId && query.categoryId !== "all") {
      data = data.filter(t => t.categoryId === query.categoryId);
    }
    return delay(data);
  },
  async get(id) {
    return delay(seedTransactions.find(t => t.id === id) ?? null);
  },
  async update(id, patch) {
    const tx = seedTransactions.find(t => t.id === id);
    if (!tx) throw new Error("Transação não encontrada");
    Object.assign(tx, patch);
    return delay({ ...tx });
  },
  async create(input) {
    const needsCategory = !input.categoryId;
    const tx: Transaction = {
      id: `tx_${crypto.randomUUID().slice(0, 8)}`,
      companyId: seedCompany.id,
      date: input.date,
      description: input.description,
      counterparty: input.counterparty,
      amount: input.amount,
      direction: input.direction,
      categoryId: input.categoryId,
      accountId: input.accountId || seedAccounts[0]?.id || "acc_itau",
      source: "manual",
      reviewStatus: needsCategory ? "needs-categorization" : "reviewed",
      evidenceCount: 0,
      notes: input.notes,
    };
    seedTransactions.unshift(tx);
    if (needsCategory) {
      seedReview.unshift({
        id: `rv_${tx.id}`,
        kind: "uncategorized",
        severity: "medium",
        title: `Sem categoria: ${tx.description}`,
        description: `Lançamento manual de ${tx.direction === "in" ? "entrada" : "saída"} sem categoria definida.`,
        impact: "Sem categorização, este valor não entra corretamente nos cálculos de margem e DRE.",
        transactionId: tx.id,
        createdAt: new Date().toISOString(),
      });
    }
    return delay(tx, 350);
  },
  async importFile(file) {
    const total = 142;
    const imported = Math.max(80, total - Math.floor(Math.random() * 12));
    return delay({
      id: crypto.randomUUID(),
      source: "csv" as const,
      fileName: file?.name,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      status: "succeeded" as const,
      rowsTotal: total,
      rowsImported: imported,
    }, 700);
  },
};

export const categoriesRepo: CategoriesRepo = {
  async list() { return delay(seedCategories); },
};

export const reviewRepo: ReviewRepo = {
  async queue() { return delay(scenarioReview()); },
  async resolve(id) {
    const i = seedReview.findIndex(r => r.id === id);
    if (i >= 0) seedReview.splice(i, 1);
    return delay(undefined);
  },
  async dismiss(id) {
    const i = seedReview.findIndex(r => r.id === id);
    if (i >= 0) seedReview.splice(i, 1);
    return delay(undefined);
  },
};

export const marginRepo: MarginRepo = {
  async overview() {
    const m = scenarioMargin();
    if (!m) throw new Error("EMPTY_MARGIN");
    return delay(m);
  },
  async dre() { return delay(seedDRE); },
  async costs() { return delay(getDemoScenario() === "empty" ? [] : seedCosts); },
  async budget() { return delay(getDemoScenario() === "empty" ? [] : seedBudget); },
  async pricing() { return delay(getDemoScenario() === "empty" ? [] : seedPricing); },
};

export const cashRepo: CashRepo = {
  async overview() {
    const c = scenarioCash();
    if (!c) throw new Error("EMPTY_CASH");
    return delay(c);
  },
  async projection() { return delay(scenarioProjection()); },
  async receivables() { return delay(scenarioReceivables()); },
  async obligations() { return delay(scenarioObligations()); },
};

export const alertsRepo: AlertsRepo = {
  async list() { return delay(scenarioAlerts()); },
};

export const aiRepo: AIRepo = {
  async conversations() { return delay(getDemoScenario() === "empty" ? [] : seedConversations); },
  async ask(prompt) {
    const msg: AIMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      createdAt: new Date().toISOString(),
      confidence: "with-caveats",
      content: `Análise da sua pergunta: "${prompt}"`,
      blocks: [
        { type: "summary", title: "Resumo", content: "Com base nos seus dados atuais, identifiquei alguns padrões relevantes para essa pergunta." },
        { type: "what-changed", title: "O que observei", content: ["Receita do mês está 4% acima do mês anterior","Custo de insumos cresceu 18% no mesmo período","5 itens críticos pendentes na revisão podem alterar este cálculo"] },
        { type: "next-actions", title: "Próximas ações sugeridas", content: ["Revisar itens críticos antes do fechamento","Renegociar fornecedores de insumos","Avaliar reajuste em produtos de margem mais apertada"] },
      ],
      references: [
        { kind: "margin", id: "p_curr", label: "Margem — mês atual", href: "/app/margem" },
        { kind: "cash", id: "now", label: "Caixa — projeção 30d", href: "/app/caixa/projecao" },
      ],
    };
    return delay(msg, 700);
  },
  async starters() {
    return delay([
      "Por que a margem caiu este mês?",
      "Posso pagar a folha sem apertar o caixa?",
      "Quais despesas cresceram acima do esperado?",
      "Em quanto tempo o caixa pode ficar negativo?",
      "Quais clientes estão atrasando pagamento?",
    ]);
  },
};

// ---- companies (multi-company support) ----
const COMPANIES_KEY = "contta.companies";
const ACTIVE_COMPANY_KEY = "contta.activeCompanyId";

const loadCompanies = (): Company[] => {
  if (typeof window === "undefined") return [seedCompany];
  try {
    const raw = localStorage.getItem(COMPANIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Company[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const initial = [seedCompany];
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(initial));
  return initial;
};

const saveCompanies = (companies: Company[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
};

const getActiveCompanyId = (): string => {
  if (typeof window === "undefined") return seedCompany.id;
  return localStorage.getItem(ACTIVE_COMPANY_KEY) || seedCompany.id;
};

const setActiveCompanyId = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_COMPANY_KEY, id);
};

export const companyRepo: CompanyRepo = {
  async current() {
    const companies = loadCompanies();
    const activeId = getActiveCompanyId();
    const active = companies.find(c => c.id === activeId) ?? companies[0];
    return delay(active);
  },
  async list() {
    return delay(loadCompanies());
  },
  async create(input: NewCompanyInput) {
    const companies = loadCompanies();
    const newCompany: Company = {
      id: `c_${crypto.randomUUID().slice(0, 8)}`,
      tradeName: input.tradeName,
      legalName: input.legalName?.trim() || input.tradeName,
      cnpj: input.cnpj,
      segment: input.segment?.trim() || "—",
      taxRegime: input.taxRegime,
      createdAt: new Date().toISOString(),
    };
    const next = [...companies, newCompany];
    saveCompanies(next);
    setActiveCompanyId(newCompany.id);
    return delay(newCompany, 500);
  },
  async setActive(companyId: string) {
    const companies = loadCompanies();
    const found = companies.find(c => c.id === companyId);
    if (!found) throw new Error("Empresa não encontrada");
    setActiveCompanyId(companyId);
    return delay(found, 200);
  },
  async accounts() { return delay(scenarioAccounts()); },
  async taxContext() { return delay(seedTax); },
  async periods() { return delay(seedPeriods); },
};

// ---- subscription (mock) ----
const SUBSCRIPTION_KEY = "contta.subscription.plan";

const planConfig = (plan: SubscriptionPlan): Subscription => {
  if (plan === "essencial") {
    return {
      plan,
      planLabel: "Essencial",
      basePrice: 89,
      addonPricePerCompany: 0,
      includedCompanies: 1,
      maxCompanies: 1,
      status: "active",
    };
  }
  if (plan === "profissional") {
    return {
      plan,
      planLabel: "Profissional",
      basePrice: 249,
      addonPricePerCompany: 0,
      includedCompanies: 3,
      maxCompanies: 3,
      status: "active",
    };
  }
  return {
    plan: "personalizavel",
    planLabel: "Personalizável",
    basePrice: 249,
    addonPricePerCompany: 100,
    includedCompanies: 1,
    maxCompanies: Number.POSITIVE_INFINITY,
    status: "active",
  };
};

const loadPlan = (): SubscriptionPlan => {
  if (typeof window === "undefined") return "profissional";
  const raw = localStorage.getItem(SUBSCRIPTION_KEY) as SubscriptionPlan | null;
  return raw && ["essencial", "profissional", "personalizavel"].includes(raw) ? raw : "profissional";
};

export const subscriptionRepo: SubscriptionRepo = {
  async current() {
    return delay(planConfig(loadPlan()));
  },
  async setPlan(plan) {
    if (typeof window !== "undefined") localStorage.setItem(SUBSCRIPTION_KEY, plan);
    return delay(planConfig(plan), 200);
  },
};

// ---- fake auth ----
const STORAGE_KEY = "contta.session";
const ONBOARD_KEY = "contta.onboarded";

export const authService: AuthService = {
  current() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },
  async login(email) {
    const user: User = { ...seedUser, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return delay(user, 500);
  },
  async signup(input) {
    const user: User = { ...seedUser, name: input.name, email: input.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(ONBOARD_KEY, "false");
    return delay(user, 600);
  },
  async logout() {
    localStorage.removeItem(STORAGE_KEY);
    return delay(undefined, 200);
  },
  isOnboarded() {
    if (typeof window === "undefined") return true;
    const v = localStorage.getItem(ONBOARD_KEY);
    return v === null ? true : v === "true"; // default true so demo opens straight to dashboard
  },
  setOnboarded(v) { localStorage.setItem(ONBOARD_KEY, String(v)); },
};
