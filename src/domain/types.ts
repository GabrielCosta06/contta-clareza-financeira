// Contta — Domain types. Frontend-first contracts; backend will replace mocks.
import { z } from "zod";

// ============ Confidence (data trust) ============
export const ConfidenceLevel = z.enum([
  "no-data",       // sem dados
  "insufficient",  // dados insuficientes
  "partial",       // dados parciais
  "with-caveats",  // utilizáveis com ressalvas
  "reliable",      // confiáveis
]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevel>;

// ============ Identity ============
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "founder" | "controller" | "finance" | "viewer";
}

export interface Company {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  segment: string;
  taxRegime: "MEI" | "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
  createdAt: string;
}

export interface Membership {
  userId: string;
  companyId: string;
  role: "owner" | "admin" | "editor" | "viewer";
}

// ============ Financial inputs ============
export type DataSourceKind = "bank" | "csv" | "manual" | "erp" | "invoice";
export interface FinancialAccount {
  id: string;
  companyId: string;
  name: string;
  kind: DataSourceKind;
  status: "connected" | "pending" | "error" | "disconnected";
  lastSyncAt?: string;
  balance?: number;
}

export interface ImportJob {
  id: string;
  source: DataSourceKind;
  fileName?: string;
  startedAt: string;
  finishedAt?: string;
  status: "queued" | "running" | "succeeded" | "partial" | "failed";
  rowsTotal: number;
  rowsImported: number;
  errors?: string[];
}

export type TransactionDirection = "in" | "out";
export type ReviewStatus = "pending" | "needs-categorization" | "needs-evidence" | "reviewed";

export interface TransactionCategory {
  id: string;
  name: string;
  group: "Receita" | "Custo" | "Despesa Operacional" | "Imposto" | "Pessoal" | "Financeiro" | "Outros";
  color?: string;
}

export interface Transaction {
  id: string;
  companyId: string;
  date: string;
  description: string;
  counterparty?: string;
  amount: number; // positive number; sign comes from direction
  direction: TransactionDirection;
  categoryId?: string;
  accountId: string;
  source: DataSourceKind;
  reviewStatus: ReviewStatus;
  evidenceCount: number;
  notes?: string;
  taxRelevant?: boolean;
}

// ============ Confidence & review ============
export type ReviewItemKind =
  | "uncategorized"
  | "duplicate"
  | "missing-evidence"
  | "amount-anomaly"
  | "date-gap"
  | "tax-inconsistency";

export interface ReviewItem {
  id: string;
  kind: ReviewItemKind;
  severity: "low" | "medium" | "critical";
  title: string;
  description: string;
  impact: string; // explains user-facing impact
  transactionId?: string;
  createdAt: string;
}

// ============ Reading layer ============
export interface ReportingPeriod {
  id: string;
  label: string;
  start: string;
  end: string;
  granularity: "week" | "month" | "quarter";
}

export interface MarginView {
  period: ReportingPeriod;
  revenue: number;
  cogs: number;
  grossMargin: number;
  grossMarginPct: number;
  contributionMargin: number;
  contributionMarginPct: number;
  delta: { value: number; pct: number; vs: string };
  confidence: ConfidenceLevel;
  drivers: { label: string; value: number; pct: number; direction: "up" | "down" }[];
  series: { label: string; revenue: number; cost: number; margin: number }[];
}

export interface DRELine {
  key: string;
  label: string;
  value: number;
  isTotal?: boolean;
  level: 0 | 1 | 2;
  variationPct?: number;
}

export interface DREView {
  period: ReportingPeriod;
  comparison: ReportingPeriod;
  lines: DRELine[];
  confidence: ConfidenceLevel;
}

export interface CostBreakdownItem {
  category: string;
  current: number;
  previous: number;
  variationPct: number;
  share: number;
}

export interface BudgetLine {
  category: string;
  planned: number;
  actual: number;
  variancePct: number;
}

export interface PricingInsight {
  productOrService: string;
  currentMarginPct: number;
  benchmarkMarginPct: number;
  recommendation: string;
  priority: "low" | "medium" | "high";
}

// ============ Cash ============
export interface CashView {
  asOf: string;
  currentBalance: number;
  projected30d: number;
  minProjected: { date: string; balance: number };
  riskLevel: "ok" | "watch" | "tight" | "critical";
  inflows30d: number;
  outflows30d: number;
  confidence: ConfidenceLevel;
}

export interface CashProjectionPoint {
  date: string;
  balance: number;
  inflow: number;
  outflow: number;
  events?: string[];
}

export interface ReceivableExpectation {
  id: string;
  counterparty: string;
  dueDate: string;
  amount: number;
  status: "scheduled" | "overdue" | "received";
  source: string;
}

export interface PayableObligation {
  id: string;
  counterparty: string;
  dueDate: string;
  amount: number;
  category: string;
  severity: "normal" | "high" | "critical";
  status: "scheduled" | "overdue" | "paid";
}

export interface FinancialAlert {
  id: string;
  kind: "cash-tightening" | "margin-erosion" | "tax-deadline" | "review-critical" | "data-stale";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  createdAt: string;
}

// ============ AI ============
export interface AIContextReference {
  kind: "transaction" | "margin" | "cash" | "category" | "period";
  id: string;
  label: string;
  href?: string;
}

export interface AIInsightBlock {
  type: "summary" | "what-changed" | "causes" | "next-actions" | "related";
  title: string;
  content: string | string[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  blocks?: AIInsightBlock[];
  references?: AIContextReference[];
  confidence?: ConfidenceLevel;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: AIMessage[];
}

// ============ Tax (Brasil) ============
export interface TaxContext {
  regime: Company["taxRegime"];
  upcoming: { name: string; dueDate: string; amount?: number; status: "due" | "scheduled" | "overdue" }[];
  notes: string[];
}
