// Contta — Service contracts. Mock implementations live in src/services/mock/*.
// When backend is built, swap implementations without touching call sites.
import type {
  Transaction, TransactionCategory, ReviewItem, MarginView, DREView,
  CostBreakdownItem, BudgetLine, PricingInsight, CashView, CashProjectionPoint,
  ReceivableExpectation, PayableObligation, FinancialAlert, AIConversation,
  AIMessage, Company, User, FinancialAccount, ImportJob, TaxContext, ReportingPeriod
} from "@/domain/types";

export interface TransactionsRepo {
  list(query?: { search?: string; status?: string; categoryId?: string }): Promise<Transaction[]>;
  get(id: string): Promise<Transaction | null>;
  update(id: string, patch: Partial<Transaction>): Promise<Transaction>;
  importFile(file: File): Promise<ImportJob>;
}

export interface CategoriesRepo {
  list(): Promise<TransactionCategory[]>;
}

export interface ReviewRepo {
  queue(): Promise<ReviewItem[]>;
  resolve(id: string): Promise<void>;
}

export interface MarginRepo {
  overview(periodId?: string): Promise<MarginView>;
  dre(periodId?: string): Promise<DREView>;
  costs(): Promise<CostBreakdownItem[]>;
  budget(): Promise<BudgetLine[]>;
  pricing(): Promise<PricingInsight[]>;
}

export interface CashRepo {
  overview(): Promise<CashView>;
  projection(): Promise<CashProjectionPoint[]>;
  receivables(): Promise<ReceivableExpectation[]>;
  obligations(): Promise<PayableObligation[]>;
}

export interface AlertsRepo {
  list(): Promise<FinancialAlert[]>;
}

export interface AIRepo {
  conversations(): Promise<AIConversation[]>;
  ask(prompt: string, context?: { kind: string; id: string }): Promise<AIMessage>;
  starters(): Promise<string[]>;
}

export interface CompanyRepo {
  current(): Promise<Company>;
  accounts(): Promise<FinancialAccount[]>;
  taxContext(): Promise<TaxContext>;
  periods(): Promise<ReportingPeriod[]>;
}

export interface AuthService {
  current(): User | null;
  login(email: string, password: string): Promise<User>;
  signup(input: { name: string; email: string; password: string; companyName: string }): Promise<User>;
  logout(): Promise<void>;
  isOnboarded(): boolean;
  setOnboarded(v: boolean): void;
}
