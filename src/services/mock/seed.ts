// Seed data for "Padaria & Café Estrela" — a believable Brazilian SMB.
import type {
  Company, User, Transaction, TransactionCategory, ReviewItem,
  MarginView, DREView, CostBreakdownItem, BudgetLine, PricingInsight,
  CashView, CashProjectionPoint, ReceivableExpectation, PayableObligation,
  FinancialAlert, AIConversation, FinancialAccount, TaxContext, ReportingPeriod
} from "@/domain/types";

export const seedUser: User = {
  id: "u_1",
  name: "Natalia Amaral",
  email: "nati@estrelacafe.com.br",
  role: "controller",
};

export const seedCompany: Company = {
  id: "c_1",
  legalName: "Estrela Café e Padaria Ltda.",
  tradeName: "Padaria & Café Estrela",
  cnpj: "12.345.678/0001-90",
  segment: "Alimentação — padaria e cafeteria",
  taxRegime: "Simples Nacional",
  createdAt: "2022-03-14",
};

export const seedCategories: TransactionCategory[] = [
  { id: "cat_rev_balcao", name: "Vendas balcão", group: "Receita" },
  { id: "cat_rev_delivery", name: "Vendas delivery", group: "Receita" },
  { id: "cat_rev_atacado", name: "Vendas atacado", group: "Receita" },
  { id: "cat_cogs_insumos", name: "Insumos e matéria-prima", group: "Custo" },
  { id: "cat_cogs_embalagem", name: "Embalagens", group: "Custo" },
  { id: "cat_op_aluguel", name: "Aluguel", group: "Despesa Operacional" },
  { id: "cat_op_energia", name: "Energia", group: "Despesa Operacional" },
  { id: "cat_op_marketing", name: "Marketing", group: "Despesa Operacional" },
  { id: "cat_op_software", name: "Software e SaaS", group: "Despesa Operacional" },
  { id: "cat_pessoal_folha", name: "Folha de pagamento", group: "Pessoal" },
  { id: "cat_pessoal_pj", name: "Prestadores PJ", group: "Pessoal" },
  { id: "cat_imp_simples", name: "DAS — Simples Nacional", group: "Imposto" },
  { id: "cat_fin_taxas", name: "Taxas bancárias", group: "Financeiro" },
  { id: "cat_fin_maquininha", name: "Taxas maquininha", group: "Financeiro" },
];

export const seedAccounts: FinancialAccount[] = [
  { id: "acc_itau", companyId: "c_1", name: "Itaú PJ — Conta corrente", kind: "bank", status: "connected", lastSyncAt: new Date(Date.now() - 1000*60*60*4).toISOString(), balance: 48230.55 },
  { id: "acc_inter", companyId: "c_1", name: "Inter PJ — Conta", kind: "bank", status: "connected", lastSyncAt: new Date(Date.now() - 1000*60*60*26).toISOString(), balance: 12480.10 },
  { id: "acc_stone", companyId: "c_1", name: "Stone — Maquininha", kind: "erp", status: "connected", lastSyncAt: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: "acc_csv", companyId: "c_1", name: "Planilha mensal", kind: "csv", status: "pending", lastSyncAt: new Date(Date.now() - 1000*60*60*24*5).toISOString() },
];

// ---- transactions ----
const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const t = (over: Partial<Transaction>): Transaction => {
  const { date, ...rest } = over;
  return {
    id: crypto.randomUUID(),
    companyId: "c_1",
    date: typeof date === "string" ? date : daysAgo(1),
    description: "—",
    amount: 0,
    direction: "out",
    accountId: "acc_itau",
    source: "bank",
    reviewStatus: "reviewed",
    evidenceCount: 1,
    ...rest,
  };
};

export const seedTransactions: Transaction[] = [
  t({ date: daysAgo(0), description: "Stone — repasse vendas", counterparty: "Stone", amount: 4820.40, direction: "in", categoryId: "cat_rev_balcao", accountId: "acc_itau", source: "bank" }),
  t({ date: daysAgo(0), description: "iFood repasse", counterparty: "iFood", amount: 1230.00, direction: "in", categoryId: "cat_rev_delivery", accountId: "acc_inter", source: "bank" }),
  t({ date: daysAgo(1), description: "Sacolão Central — frutas", counterparty: "Sacolão Central", amount: 612.30, direction: "out", categoryId: "cat_cogs_insumos", source: "bank", reviewStatus: "needs-evidence", evidenceCount: 0 }),
  t({ date: daysAgo(1), description: "Pagamento PIX — fornecedor café", counterparty: "Café Serra Mantiqueira", amount: 1980.00, direction: "out", source: "bank", reviewStatus: "needs-categorization", evidenceCount: 0 }),
  t({ date: daysAgo(2), description: "Conta de luz", counterparty: "Enel", amount: 1742.90, direction: "out", categoryId: "cat_op_energia", source: "bank" }),
  t({ date: daysAgo(2), description: "Folha — quinzenal", counterparty: "Folha 1ª quinzena", amount: 18230.00, direction: "out", categoryId: "cat_pessoal_folha", source: "manual" }),
  t({ date: daysAgo(3), description: "Aluguel loja matriz", counterparty: "Imobiliária Vergueiro", amount: 8200.00, direction: "out", categoryId: "cat_op_aluguel", source: "bank" }),
  t({ date: daysAgo(3), description: "Repasse maquininha — débito", counterparty: "Stone", amount: 3120.55, direction: "in", categoryId: "cat_rev_balcao", source: "erp" }),
  t({ date: daysAgo(4), description: "Embalagens — caixas e copos", counterparty: "Embalagens SP", amount: 845.20, direction: "out", categoryId: "cat_cogs_embalagem", source: "bank" }),
  t({ date: daysAgo(5), description: "Taxa maquininha", counterparty: "Stone", amount: 312.40, direction: "out", categoryId: "cat_fin_maquininha", source: "bank" }),
  t({ date: daysAgo(6), description: "Venda atacado — Hotel Praça", counterparty: "Hotel Praça", amount: 6420.00, direction: "in", categoryId: "cat_rev_atacado", source: "manual" }),
  t({ date: daysAgo(7), description: "Marketing — Instagram Ads", counterparty: "Meta", amount: 480.00, direction: "out", categoryId: "cat_op_marketing", source: "bank" }),
  t({ date: daysAgo(8), description: "Pagamento desconhecido", counterparty: "—", amount: 1240.00, direction: "out", source: "bank", reviewStatus: "needs-categorization", evidenceCount: 0 }),
  t({ date: daysAgo(9), description: "DAS — Simples", counterparty: "Receita Federal", amount: 4820.00, direction: "out", categoryId: "cat_imp_simples", source: "bank", taxRelevant: true }),
  t({ date: daysAgo(10), description: "Repasse iFood", counterparty: "iFood", amount: 2410.00, direction: "in", categoryId: "cat_rev_delivery", source: "bank" }),
  t({ date: daysAgo(12), description: "Insumos — laticínios", counterparty: "Laticínios Vale Verde", amount: 1820.00, direction: "out", categoryId: "cat_cogs_insumos", source: "bank" }),
  t({ date: daysAgo(14), description: "Folha — 2ª quinzena (anterior)", counterparty: "Folha", amount: 17980.00, direction: "out", categoryId: "cat_pessoal_folha", source: "manual" }),
  t({ date: daysAgo(15), description: "SaaS — sistema PDV", counterparty: "ConnectPDV", amount: 389.00, direction: "out", categoryId: "cat_op_software", source: "bank" }),
  t({ date: daysAgo(18), description: "Recebimento atacado — Restaurante Lume", counterparty: "Restaurante Lume", amount: 4280.00, direction: "in", categoryId: "cat_rev_atacado", source: "manual" }),
  t({ date: daysAgo(21), description: "Compra equipamento — moedor", counterparty: "Equip Café", amount: 3200.00, direction: "out", source: "bank", reviewStatus: "needs-categorization" }),
];

// ---- review queue ----
export const seedReview: ReviewItem[] = [
  { id: "rv_1", kind: "uncategorized", severity: "critical", title: "4 transações sem categoria", description: "R$ 6.640 em saídas sem categoria nos últimos 30 dias.", impact: "Sem categorização, a margem por linha de receita pode estar subestimada.", createdAt: daysAgo(1) },
  { id: "rv_2", kind: "missing-evidence", severity: "medium", title: "Saída de R$ 612,30 sem comprovante", description: "Sacolão Central — registrada no extrato mas sem nota anexada.", impact: "Pode prejudicar conciliação fiscal no fechamento mensal.", transactionId: "tx_sac", createdAt: daysAgo(1) },
  { id: "rv_3", kind: "amount-anomaly", severity: "medium", title: "Aumento de 38% em insumos vs média", description: "Compras de insumos saltaram acima do histórico das últimas 8 semanas.", impact: "Provável pressão sobre margem bruta no fechamento atual.", createdAt: daysAgo(2) },
  { id: "rv_4", kind: "duplicate", severity: "low", title: "Possível lançamento duplicado", description: "Repasse Stone aparece em duas contas com mesmo valor e data.", impact: "Receita pode estar inflada em ~R$ 3.120 se for duplicidade real.", createdAt: daysAgo(3) },
  { id: "rv_5", kind: "tax-inconsistency", severity: "critical", title: "DAS não conciliado", description: "Pagamento DAS sem vínculo ao mês de competência.", impact: "Risco em apuração tributária. Revisar antes do fechamento.", createdAt: daysAgo(4) },
];

// ---- periods ----
export const seedPeriods: ReportingPeriod[] = [
  { id: "p_curr", label: "Mês atual", start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(), end: today.toISOString(), granularity: "month" },
  { id: "p_prev", label: "Mês anterior", start: new Date(today.getFullYear(), today.getMonth()-1, 1).toISOString(), end: new Date(today.getFullYear(), today.getMonth(), 0).toISOString(), granularity: "month" },
  { id: "p_q", label: "Trimestre", start: new Date(today.getFullYear(), today.getMonth()-2, 1).toISOString(), end: today.toISOString(), granularity: "quarter" },
];

// ---- margin ----
export const seedMargin: MarginView = {
  period: seedPeriods[0],
  revenue: 142800,
  cogs: 58420,
  grossMargin: 84380,
  grossMarginPct: 59.1,
  contributionMargin: 52120,
  contributionMarginPct: 36.5,
  delta: { value: -8420, pct: -5.2, vs: "vs mês anterior" },
  confidence: "with-caveats",
  drivers: [
    { label: "Insumos +18%", value: 8920, pct: 18, direction: "up" },
    { label: "Energia +12%", value: 1820, pct: 12, direction: "up" },
    { label: "Vendas atacado +6%", value: 4280, pct: 6, direction: "up" },
    { label: "Marketing −22%", value: -1380, pct: -22, direction: "down" },
  ],
  series: Array.from({ length: 8 }).map((_, i) => ({
    label: `S${i+1}`,
    revenue: 32000 + Math.round(Math.sin(i) * 4200) + i * 600,
    cost: 13000 + Math.round(Math.cos(i) * 2200) + i * 400,
    margin: 19000 + Math.round(Math.sin(i+1) * 2200),
  })),
};

// ---- DRE ----
export const seedDRE: DREView = {
  period: seedPeriods[0],
  comparison: seedPeriods[1],
  confidence: "with-caveats",
  lines: [
    { key: "rev", label: "Receita bruta", value: 142800, isTotal: true, level: 0, variationPct: 4.1 },
    { key: "rev_balcao", label: "Vendas balcão", value: 88420, level: 1, variationPct: 2.1 },
    { key: "rev_delivery", label: "Vendas delivery", value: 32100, level: 1, variationPct: 8.4 },
    { key: "rev_atacado", label: "Vendas atacado", value: 22280, level: 1, variationPct: 6.2 },
    { key: "ded", label: "(−) Impostos sobre vendas", value: -8420, level: 0, variationPct: 4.0 },
    { key: "rev_liq", label: "Receita líquida", value: 134380, isTotal: true, level: 0, variationPct: 4.1 },
    { key: "cogs", label: "(−) Custos variáveis", value: -58420, level: 0, variationPct: 14.2 },
    { key: "lb", label: "Lucro bruto", value: 75960, isTotal: true, level: 0, variationPct: -2.4 },
    { key: "op", label: "(−) Despesas operacionais", value: -23840, level: 0, variationPct: 1.2 },
    { key: "people", label: "(−) Pessoal", value: -36210, level: 0, variationPct: 0.4 },
    { key: "ebitda", label: "Resultado operacional", value: 15910, isTotal: true, level: 0, variationPct: -28.1 },
  ],
};

export const seedCosts: CostBreakdownItem[] = [
  { category: "Insumos e matéria-prima", current: 38420, previous: 32510, variationPct: 18.2, share: 0.42 },
  { category: "Folha de pagamento", current: 36210, previous: 36050, variationPct: 0.4, share: 0.40 },
  { category: "Aluguel", current: 8200, previous: 8200, variationPct: 0, share: 0.09 },
  { category: "Energia", current: 4120, previous: 3680, variationPct: 12.0, share: 0.05 },
  { category: "Embalagens", current: 2340, previous: 2180, variationPct: 7.3, share: 0.03 },
  { category: "Marketing", current: 1080, previous: 1380, variationPct: -21.7, share: 0.01 },
];

export const seedBudget: BudgetLine[] = [
  { category: "Receita", planned: 150000, actual: 142800, variancePct: -4.8 },
  { category: "Insumos", planned: 32000, actual: 38420, variancePct: 20.1 },
  { category: "Pessoal", planned: 36000, actual: 36210, variancePct: 0.6 },
  { category: "Marketing", planned: 2500, actual: 1080, variancePct: -56.8 },
  { category: "Resultado", planned: 22000, actual: 15910, variancePct: -27.7 },
];

export const seedPricing: PricingInsight[] = [
  { productOrService: "Cafés especiais", currentMarginPct: 64, benchmarkMarginPct: 70, recommendation: "Reajuste de R$ 0,50 a R$ 1,00 ainda absorvido pelo público de balcão.", priority: "medium" },
  { productOrService: "Salgados — atacado", currentMarginPct: 22, benchmarkMarginPct: 32, recommendation: "Custo de insumos subiu 18%. Renegociar tabela com 2 maiores clientes.", priority: "high" },
  { productOrService: "Almoço executivo", currentMarginPct: 38, benchmarkMarginPct: 40, recommendation: "Margem dentro da faixa. Acompanhar.", priority: "low" },
];

// ---- cash ----
export const seedCash: CashView = {
  asOf: new Date().toISOString(),
  currentBalance: 60710.65,
  projected30d: 18420,
  minProjected: { date: daysAgo(-19), balance: -4280 },
  riskLevel: "tight",
  inflows30d: 154200,
  outflows30d: 196490,
  confidence: "partial",
};

export const seedCashProjection: CashProjectionPoint[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  const base = 60710 - i * 1400 + Math.round(Math.sin(i / 2) * 4200);
  return {
    date: d.toISOString(),
    balance: base + (i > 14 ? 8000 : 0),
    inflow: 4000 + Math.round(Math.cos(i) * 1200),
    outflow: 5400 + Math.round(Math.sin(i) * 900),
    events: i === 5 ? ["Folha — quinzenal"] : i === 10 ? ["DAS — vencimento"] : i === 19 ? ["Saldo mínimo projetado"] : undefined,
  };
});

export const seedReceivables: ReceivableExpectation[] = [
  { id: "r_1", counterparty: "Stone — repasse 30d", dueDate: daysAgo(-2), amount: 18420, status: "scheduled", source: "Maquininha" },
  { id: "r_2", counterparty: "iFood — repasse semanal", dueDate: daysAgo(-5), amount: 6280, status: "scheduled", source: "Delivery" },
  { id: "r_3", counterparty: "Hotel Praça — boleto", dueDate: daysAgo(-12), amount: 6420, status: "scheduled", source: "Atacado" },
  { id: "r_4", counterparty: "Restaurante Lume", dueDate: daysAgo(2), amount: 4280, status: "overdue", source: "Atacado" },
  { id: "r_5", counterparty: "Buffet Aurora", dueDate: daysAgo(-22), amount: 8420, status: "scheduled", source: "Atacado" },
];

export const seedObligations: PayableObligation[] = [
  { id: "o_1", counterparty: "Folha — 2ª quinzena", dueDate: daysAgo(-3), amount: 18230, category: "Pessoal", severity: "critical", status: "scheduled" },
  { id: "o_2", counterparty: "Aluguel matriz", dueDate: daysAgo(-7), amount: 8200, category: "Operacional", severity: "high", status: "scheduled" },
  { id: "o_3", counterparty: "DAS — Simples Nacional", dueDate: daysAgo(-10), amount: 4820, category: "Imposto", severity: "high", status: "scheduled" },
  { id: "o_4", counterparty: "Café Serra Mantiqueira", dueDate: daysAgo(-4), amount: 1980, category: "Insumos", severity: "normal", status: "scheduled" },
  { id: "o_5", counterparty: "Energia — Enel", dueDate: daysAgo(-12), amount: 1742, category: "Operacional", severity: "normal", status: "scheduled" },
];

export const seedAlerts: FinancialAlert[] = [
  { id: "a_1", kind: "cash-tightening", severity: "critical", title: "Caixa pode ficar negativo em ~19 dias", message: "Projeção indica saldo mínimo de R$ −4.280 caso recebíveis em atraso não sejam quitados.", actionLabel: "Ver projeção", actionHref: "/app/caixa/projecao", createdAt: daysAgo(0) },
  { id: "a_2", kind: "margin-erosion", severity: "warning", title: "Margem bruta caiu 5,2% no mês", message: "Insumos +18% e energia +12% explicam a maior parte da queda.", actionLabel: "Abrir margem", actionHref: "/app/margem", createdAt: daysAgo(1) },
  { id: "a_3", kind: "review-critical", severity: "warning", title: "5 itens críticos na revisão", message: "Categorize e concilie para confiar nos números do fechamento.", actionLabel: "Abrir revisão", actionHref: "/app/revisao", createdAt: daysAgo(0) },
  { id: "a_4", kind: "tax-deadline", severity: "info", title: "DAS vence em 10 dias", message: "Estimativa baseada nas receitas declaradas até o momento.", actionLabel: "Ver obrigações", actionHref: "/app/caixa/obrigacoes", createdAt: daysAgo(1) },
];

export const seedTax: TaxContext = {
  regime: "Simples Nacional",
  upcoming: [
    { name: "DAS — Simples Nacional", dueDate: daysAgo(-10), amount: 4820, status: "scheduled" },
    { name: "DCTFWeb", dueDate: daysAgo(-15), status: "scheduled" },
    { name: "Declaração mensal — competência anterior", dueDate: daysAgo(-2), status: "due" },
  ],
  notes: [
    "Empresa enquadrada no Simples Nacional, anexo I.",
    "Receita acumulada nos últimos 12 meses dentro do sublimite.",
  ],
};

export const seedConversations: AIConversation[] = [
  {
    id: "conv_1",
    title: "Por que a margem caiu este mês?",
    updatedAt: daysAgo(0),
    messages: [
      { id: "m1", role: "user", content: "Por que a margem caiu este mês?", createdAt: daysAgo(0) },
      {
        id: "m2", role: "assistant", createdAt: daysAgo(0),
        content: "A margem bruta caiu 5,2 pontos vs o mês anterior, principalmente por pressão de custos.",
        confidence: "with-caveats",
        blocks: [
          { type: "summary", title: "Resumo", content: "Margem bruta passou de 64,3% para 59,1%. A receita cresceu 4%, mas os custos cresceram 14%." },
          { type: "what-changed", title: "O que mudou", content: ["Insumos: +18% (R$ 8.920)","Energia: +12% (R$ 1.820)","Marketing: −22% (R$ −1.380)"] },
          { type: "causes", title: "Possíveis causas", content: ["Aumento sazonal de preço de laticínios","Tarifa de energia reajustada em maio","Possível ineficiência na compra de insumos (verificar fornecedor)"] },
          { type: "next-actions", title: "Próximas ações sugeridas", content: ["Renegociar contrato com 2 maiores fornecedores de insumos","Revisar precificação de salgados de atacado","Conferir 4 transações sem categoria que podem alterar o cálculo"] },
          { type: "related", title: "Relacionado", content: ["Margem — visão atual","Revisão — 5 itens críticos","Custos — ver detalhamento"] },
        ],
        references: [
          { kind: "margin", id: "p_curr", label: "Margem — mês atual", href: "/app/margem" },
          { kind: "category", id: "cat_cogs_insumos", label: "Insumos e matéria-prima", href: "/app/margem/custos" },
        ],
      },
    ],
  },
];
