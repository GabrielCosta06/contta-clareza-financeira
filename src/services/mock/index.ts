// Mock implementations for the typed service contracts.
// TODO(backend): replace these with real fetch/RPC clients.
import type {
  TransactionsRepo, CategoriesRepo, ReviewRepo, MarginRepo, CashRepo,
  AlertsRepo, AIRepo, CompanyRepo, AuthService
} from "@/services/contracts";
import type {
  AIMessage, User, Transaction, ReviewItem, MarginView, CashView,
  CashProjectionPoint, ReceivableExpectation, PayableObligation, FinancialAlert
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
const reviewedTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  categoryId: transaction.categoryId ?? (transaction.direction === "in" ? "cat_rev_balcao" : "cat_fin_taxas"),
  reviewStatus: "reviewed",
  evidenceCount: Math.max(1, transaction.evidenceCount),
});

const scenarioTransactions = (): Transaction[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "partial") return seedTransactions.slice(0, 8);
  if (s === "reliable") return seedTransactions.map(reviewedTransaction);
  return seedTransactions;
};

const scenarioReview = (): ReviewItem[] => {
  const s = getDemoScenario();
  if (s === "empty") return [];
  if (s === "partial") return seedReview.filter(r => r.severity !== "critical").slice(0, 2);
  if (s === "reliable") return seedReview.filter(r => r.severity === "low").slice(0, 1);
  if (s === "critical") return seedReview;
  return seedReview;
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
  async importFile() {
    return delay({
      id: crypto.randomUUID(),
      source: "csv" as const,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      status: "succeeded" as const,
      rowsTotal: 142,
      rowsImported: 138,
    });
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

export const companyRepo: CompanyRepo = {
  async current() { return delay(seedCompany); },
  async accounts() { return delay(scenarioAccounts()); },
  async taxContext() { return delay(seedTax); },
  async periods() { return delay(seedPeriods); },
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
