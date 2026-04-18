import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FlaskConical, Wallet } from "lucide-react";

import { cashRepo } from "@/services";
import { useDemoScenario } from "@/hooks/useDemoScenario";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { AIInsightCard } from "@/components/AIInsightCard";
import { InlineAIEntryPoint } from "@/components/InlineAIEntryPoint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCardSkeletonGrid } from "@/components/skeletons/StatCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { dayAndWeekday, formatBRL, dateBR, useCompactCurrency } from "@/lib/format";
import type { PayableObligation, ReceivableExpectation } from "@/domain/types";

const subnav = [
  { to: "/app/caixa", label: "Visão geral", value: "overview" },
  { to: "/app/caixa/projecao", label: "Projeção", value: "projection" },
  { to: "/app/caixa/recebiveis", label: "Recebíveis", value: "receivables" },
  { to: "/app/caixa/obrigacoes", label: "Obrigações", value: "obligations" },
];

const riskLabels = {
  ok: { label: "Saudável", variant: "outline" },
  watch: { label: "Em observação", variant: "secondary" },
  tight: { label: "Aperto previsto", variant: "destructive" },
  critical: { label: "Crítico", variant: "destructive" },
} as const;

export const CaixaLayout = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const activeValue = useMemo(() => {
    if (loc.pathname === "/app/caixa") return "overview";
    if (loc.pathname.startsWith("/app/caixa/projecao")) return "projection";
    if (loc.pathname.startsWith("/app/caixa/recebiveis")) return "receivables";
    if (loc.pathname.startsWith("/app/caixa/obrigacoes")) return "obligations";
    return "overview";
  }, [loc.pathname]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Caixa" subtitle="Saldo, projeção, recebíveis e obrigações em uma única leitura." />
      <Tabs value={activeValue} onValueChange={(value) => navigate(subnav.find((item) => item.value === value)?.to ?? "/app/caixa")}>
        <div className="overflow-x-auto">
          <TabsList className="h-auto w-full min-w-max justify-start gap-1 rounded-lg bg-muted/50 p-1">
            {subnav.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="rounded-md px-4 py-2.5">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default function Caixa() {
  const { setScenario } = useDemoScenario();
  const compactCurrency = useCompactCurrency();
  const { data: cash, isLoading, isError } = useQuery({ queryKey: ["cash"], queryFn: () => cashRepo.overview(), retry: false });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatCardSkeletonGrid count={3} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <ChartSkeleton height="h-48" />
        </div>
      </div>
    );
  }

  if (isError || !cash) {
    return (
      <EmptyState
        icon={<Wallet className="h-5 w-5" />}
        title="Sem dados de caixa ainda"
        description="Para gerar a projeção de 30 dias, precisamos de saldo atual, recebíveis previstos e obrigações registradas."
        action={
          <Button size="sm" asChild>
            <Link to="/app/configuracoes">Conectar conta</Link>
          </Button>
        }
        secondaryAction={
          <Button type="button" variant="outline" size="sm" onClick={() => setScenario("reliable")}>
            <FlaskConical className="h-4 w-4" />
            Ver dados de exemplo
          </Button>
        }
      />
    );
  }

  const risk = riskLabels[cash.riskLevel];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Saldo atual"
          value={formatBRL(cash.currentBalance, { display: "card", compactViewport: compactCurrency })}
          hint={`Em ${dateBR(cash.asOf)}`}
        />
        <StatCard
          label="Saldo projetado em 30d"
          value={formatBRL(cash.projected30d, { display: "card", compactViewport: compactCurrency })}
          emphasis="warning"
          delta={{ value: -32 }}
        />
        <StatCard
          label="Risco de curto prazo"
          value={<Badge variant={risk.variant} className="text-sm">{risk.label}</Badge>}
          hint={`Mínimo: ${formatBRL(cash.minProjected.balance)} em ${dateBR(cash.minProjected.date)}`}
          emphasis={cash.riskLevel === "tight" || cash.riskLevel === "critical" ? "destructive" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Projeção de 30 dias</h2>
            <ConfidenceBadge level={cash.confidence} />
          </div>
          <ProjectionChart />
        </div>
        <AIInsightCard
          summary="Sem ação, o caixa pode ficar negativo em ~19 dias devido à concentração de obrigações entre dias 7 e 14."
          confidence={cash.confidence}
          details={[
            "Cobrar Restaurante Lume (R$ 4.280, em atraso).",
            "Antecipar repasse Stone (R$ 18,4 mil) reduz o aperto.",
            "Postergar compra de equipamento não essencial preserva liquidez.",
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/app/caixa/projecao">Abrir projeção</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/caixa/recebiveis">Recebíveis</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/caixa/obrigacoes">Obrigações</Link>
        </Button>
      </div>

      <InlineAIEntryPoint prompt="Qual decisão protege melhor o caixa observando esta tela?" />
    </div>
  );
}

export function ProjectionChart() {
  const { setScenario } = useDemoScenario();
  const { data = [], isLoading } = useQuery({ queryKey: ["projection"], queryFn: () => cashRepo.projection() });

  if (isLoading) {
    return (
      <div className="h-72">
        <ChartSkeleton height="h-60" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sem dados para projeção"
        description="Precisamos de saldo atual, agenda de recebíveis e obrigações futuras para estimar a janela de aperto no caixa."
        action={
          <Button size="sm" asChild>
            <Link to="/app/configuracoes">Conectar fontes</Link>
          </Button>
        }
        secondaryAction={
          <Button type="button" variant="outline" size="sm" onClick={() => setScenario("reliable")}>
            <FlaskConical className="h-4 w-4" />
            Ver dados de exemplo
          </Button>
        }
      />
    );
  }

  const formatted = data.map((point) => ({
    ...point,
    label: dayAndWeekday(point.date),
  }));

  const pressureWindow = formatted.filter((point) => point.balance < 15000);
  const pressureStart = pressureWindow[0]?.label;
  const pressureEnd = pressureWindow.at(-1)?.label;

  return (
    <div className="h-72 -ml-2" role="img" aria-labelledby="cash-chart-title" aria-describedby="cash-chart-description">
      <p id="cash-chart-title" className="sr-only">Gráfico de projeção de caixa</p>
      <p id="cash-chart-description" className="sr-only">
        Evolução diária do saldo projetado para os próximos 30 dias, com destaque para a janela de aperto quando o saldo fica abaixo de quinze mil reais.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="cashFill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          {pressureStart && pressureEnd && (
            <ReferenceArea x1={pressureStart} x2={pressureEnd} fill="hsl(var(--warning))" fillOpacity={0.08} />
          )}
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={3} />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => formatBRL(value as number, { display: "compact" })}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--primary))", strokeDasharray: "4 4", strokeOpacity: 0.35 }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--popover))",
              color: "hsl(var(--popover-foreground))",
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
            itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            formatter={(value) => formatBRL(Number(value), { display: "tooltip" })}
          />
          <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cashFill2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Projecao() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Projeção detalhada</h2>
      <div className="rounded-lg border border-border bg-card p-5">
        <ProjectionChart />
      </div>
      <p className="text-xs text-muted-foreground">
        Premissas: recebíveis confirmados, obrigações registradas e padrão histórico de entradas e saídas. Use como direção, não como fechamento.
      </p>
    </div>
  );
}

export function Recebiveis() {
  const { setScenario } = useDemoScenario();
  const { data = [], isLoading } = useQuery({ queryKey: ["receivables"], queryFn: () => cashRepo.receivables() });
  const columns: DataTableColumn<ReceivableExpectation>[] = [
    { key: "counterparty", header: "Contraparte", cell: (row) => <span className="font-medium">{row.counterparty}</span> },
    { key: "due", header: "Vencimento", cell: (row) => <span className="num text-muted-foreground">{dateBR(row.dueDate)}</span> },
    { key: "source", header: "Origem", cell: (row) => <span className="text-muted-foreground">{row.source}</span> },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "overdue" ? "destructive" : "outline"} className="text-[10px]">
          {row.status === "overdue" ? "Em atraso" : "Agendado"}
        </Badge>
      ),
    },
    { key: "amount", header: "Valor", align: "right", cell: (row) => <span className="num font-medium">{formatBRL(row.amount, { display: "table" })}</span> },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Recebíveis esperados</h2>
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <DataTable
          rows={data}
          columns={columns}
          rowKey={(row) => row.id}
          caption="Recebíveis esperados"
          empty={
            <EmptyState
              title="Nenhum recebível registrado"
              description="Quando houver vendas a prazo ou repasses agendados, esta visão mostra o que entra, quando entra e qual fonte sustenta a previsão."
              secondaryAction={
                <Button type="button" variant="outline" size="sm" onClick={() => setScenario("reliable")}>
                  <FlaskConical className="h-4 w-4" />
                  Ver dados de exemplo
                </Button>
              }
            />
          }
        />
      )}
    </div>
  );
}

export function Obrigacoes() {
  const { setScenario } = useDemoScenario();
  const { data = [], isLoading } = useQuery({ queryKey: ["obligations"], queryFn: () => cashRepo.obligations() });
  const columns: DataTableColumn<PayableObligation>[] = [
    { key: "counterparty", header: "Contraparte", cell: (row) => <span className="font-medium">{row.counterparty}</span> },
    { key: "due", header: "Vencimento", cell: (row) => <span className="num text-muted-foreground">{dateBR(row.dueDate)}</span> },
    { key: "category", header: "Categoria", cell: (row) => <span className="text-muted-foreground">{row.category}</span> },
    {
      key: "severity",
      header: "Severidade",
      cell: (row) => (
        <Badge variant={row.severity === "critical" ? "destructive" : row.severity === "high" ? "secondary" : "outline"} className="text-[10px]">
          {row.severity === "critical" ? "Crítica" : row.severity === "high" ? "Alta" : "Normal"}
        </Badge>
      ),
    },
    { key: "amount", header: "Valor", align: "right", cell: (row) => <span className="num font-medium">{formatBRL(row.amount, { display: "table" })}</span> },
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Obrigações próximas</h2>
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <DataTable
          rows={data}
          columns={columns}
          rowKey={(row) => row.id}
          caption="Obrigações próximas"
          empty={
            <EmptyState
              title="Nenhuma obrigação registrada"
              description="Cadastre boletos, folha e impostos para acompanhar saídas previstas, severidade e data de aperto no caixa."
              secondaryAction={
                <Button type="button" variant="outline" size="sm" onClick={() => setScenario("reliable")}>
                  <FlaskConical className="h-4 w-4" />
                  Ver dados de exemplo
                </Button>
              }
            />
          }
        />
      )}
    </div>
  );
}
