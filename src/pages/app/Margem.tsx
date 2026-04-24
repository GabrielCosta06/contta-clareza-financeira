import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FlaskConical, TrendingUp } from "lucide-react";

import { marginRepo } from "@/services";
import { useDemoScenario } from "@/hooks/useDemoScenario";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DataTrustBanner } from "@/components/DataTrustBanner";
import { AIInsightCard } from "@/components/AIInsightCard";
import { InlineAIEntryPoint } from "@/components/InlineAIEntryPoint";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCardSkeletonGrid } from "@/components/skeletons/StatCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { formatBRL, pct, useCompactCurrency } from "@/lib/format";

const subnav = [
  { to: "/app/margem", label: "Visão geral", value: "overview" },
  { to: "/app/margem/dre", label: "Resultado", value: "dre" },
  { to: "/app/margem/custos", label: "Custos", value: "costs" },
  { to: "/app/margem/orcamento", label: "Orçamento", value: "budget" },
  { to: "/app/margem/precificacao", label: "Preços", value: "pricing" },
];

export const MargemLayout = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const activeValue = useMemo(() => {
    if (loc.pathname === "/app/margem") return "overview";
    if (loc.pathname.startsWith("/app/margem/dre")) return "dre";
    if (loc.pathname.startsWith("/app/margem/custos")) return "costs";
    if (loc.pathname.startsWith("/app/margem/orcamento")) return "budget";
    if (loc.pathname.startsWith("/app/margem/precificacao")) return "pricing";
    return "overview";
  }, [loc.pathname]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Margem" subtitle="Veja onde sua margem está melhorando — e onde está caindo." />
      <Tabs value={activeValue} onValueChange={(value) => navigate(subnav.find((item) => item.value === value)?.to ?? "/app/margem")}>
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

export default function Margem() {
  const { setScenario } = useDemoScenario();
  const compactCurrency = useCompactCurrency();
  const { data: margin, isLoading, isError } = useQuery({ queryKey: ["margin"], queryFn: () => marginRepo.overview(), retry: false });

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

  if (isError || !margin) {
    return (
      <EmptyState
        icon={<TrendingUp className="h-5 w-5" />}
        title="Sem dados de margem ainda"
        description="Para calcular margem bruta e drivers de variação, precisamos de receitas, custos e categorias minimamente consistentes."
        action={
          <Button size="sm" asChild>
            <Link to="/app/transacoes">Importar transações</Link>
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

  return (
    <div className="space-y-6">
      <DataTrustBanner level={margin.confidence} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Receita"
          value={formatBRL(margin.revenue, { display: "card", compactViewport: compactCurrency })}
          delta={{ value: 4.1 }}
        />
        <StatCard
          label="Margem bruta"
          value={pct(margin.grossMarginPct)}
          delta={{ value: margin.delta.pct }}
          hint={formatBRL(margin.grossMargin, { display: "card", compactViewport: compactCurrency })}
          emphasis="warning"
        />
        <StatCard
          label="Margem de contribuição"
          value={pct(margin.contributionMarginPct)}
          delta={{ value: -3.1 }}
          hint={formatBRL(margin.contributionMargin, { display: "card", compactViewport: compactCurrency })}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="font-semibold">Receita vs. custo — últimas 8 semanas</h2>
          </div>
          <div className="h-72 -ml-2" role="img" aria-labelledby="margin-chart-title" aria-describedby="margin-chart-description">
            <p id="margin-chart-title" className="sr-only">Gráfico de receita e custo das últimas oito semanas</p>
            <p id="margin-chart-description" className="sr-only">
              Comparação semanal entre receita e custo para ajudar a identificar onde a margem está sendo pressionada.
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={margin.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => formatBRL(value as number, { display: "compact" })}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--primary-soft))" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                  formatter={(value) => formatBRL(Number(value), { display: "tooltip" })}
                />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="cost" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Custo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <AIInsightCard
          title="Leitura do Contta AI"
          summary="A pressão sobre margem vem majoritariamente do lado dos custos, não do volume de vendas."
          details={[
            "Insumos +18% indicam renegociação prioritária.",
            "Energia +12% pede revisão de contrato ou consumo.",
            "Atacado cresceu, mas ainda roda com margem mais apertada.",
          ]}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-semibold">Drivers de variação</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {margin.drivers.map((driver) => (
            <div key={driver.label} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">{driver.label}</p>
              <p className={`mt-1 font-semibold num ${driver.direction === "up" ? "text-destructive" : "text-success"}`}>
                {formatBRL(driver.value, { sign: true })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/app/margem/dre">Ver resultado mês a mês</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/margem/custos">Ver custos</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/margem/precificacao">Ajustar preços</Link>
        </Button>
      </div>

      <InlineAIEntryPoint prompt="Quais decisões sobre margem merecem atenção nesta tela?" />
    </div>
  );
}
