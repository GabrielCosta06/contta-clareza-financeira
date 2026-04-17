// Mock implementations for the typed service contracts.
// TODO(backend): replace these with real fetch/RPC clients.
import type {
  TransactionsRepo, CategoriesRepo, ReviewRepo, MarginRepo, CashRepo,
  AlertsRepo, AIRepo, CompanyRepo, AuthService
} from "@/services/contracts";
import type { AIMessage, User } from "@/domain/types";
import {
  seedTransactions, seedCategories, seedReview, seedMargin, seedDRE,
  seedCosts, seedBudget, seedPricing, seedCash, seedCashProjection,
  seedReceivables, seedObligations, seedAlerts, seedConversations,
  seedCompany, seedAccounts, seedTax, seedPeriods, seedUser
} from "./seed";

const delay = <T,>(v: T, ms = 280) => new Promise<T>(r => setTimeout(() => r(v), ms));

export const transactionsRepo: TransactionsRepo = {
  async list(query) {
    let data = [...seedTransactions];
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
  async queue() { return delay(seedReview); },
  async resolve(id) {
    const i = seedReview.findIndex(r => r.id === id);
    if (i >= 0) seedReview.splice(i, 1);
    return delay(undefined);
  },
};

export const marginRepo: MarginRepo = {
  async overview() { return delay(seedMargin); },
  async dre() { return delay(seedDRE); },
  async costs() { return delay(seedCosts); },
  async budget() { return delay(seedBudget); },
  async pricing() { return delay(seedPricing); },
};

export const cashRepo: CashRepo = {
  async overview() { return delay(seedCash); },
  async projection() { return delay(seedCashProjection); },
  async receivables() { return delay(seedReceivables); },
  async obligations() { return delay(seedObligations); },
};

export const alertsRepo: AlertsRepo = {
  async list() { return delay(seedAlerts); },
};

export const aiRepo: AIRepo = {
  async conversations() { return delay(seedConversations); },
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
  async accounts() { return delay(seedAccounts); },
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
