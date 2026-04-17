import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation } from "react-router-dom";
import { marginRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { AIInsightCard } from "@/components/AIInsightCard";
import { brl, pct } from "@/lib/format";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Line, LineChart } from "recharts";
import { Button } from "@/components/ui/button";

const subnav = [
  { to: "/app/margem", label: "Visão geral", end: true },
  { to: "/app/margem/dre", label: "DRE" },
  { to: "/app/margem/custos", label: "Custos" },
  { to: "/app/margem/orcamento", label: "Orçamento" },
  { to: "/app/margem/precificacao", label: "Precificação" },
];

export const MargemLayout = () => {
  const loc = useLocation();
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Margem" subtitle="Onde a profitabilidade está sendo formada — e onde está sendo erodida." />
      <nav className="flex gap-1 border-b border-border -mb-px overflow-x-auto">
        {subnav.map(s => {
          const active = s.end ? loc.pathname === s.to : loc.pathname.startsWith(s.to);
          return (
            <Link key={s.to} to={s.to} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{s.label}</Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
};

export default function Margem() {
  const { data: m } = useQuery({ queryKey: ["margin"], queryFn: () => marginRepo.overview() });
  if (!m) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Receita" value={brl(m.revenue, { compact: true })} delta={{ value: 4.1 }} />
        <StatCard label="Margem bruta" value={pct(m.grossMarginPct)} delta={{ value: m.delta.pct }} hint={brl(m.grossMargin)} emphasis="warning" />
        <StatCard label="Margem de contribuição" value={pct(m.contributionMarginPct)} delta={{ value: -3.1 }} hint={brl(m.contributionMargin)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Receita vs. custo — últimas 8 semanas</h2>
            <ConfidenceBadge level={m.confidence} />
          </div>
          <div className="h-72 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => brl(v as number, { compact: true })} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: any) => brl(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} name="Receita" />
                <Bar dataKey="cost" fill="hsl(var(--chart-3))" radius={[4,4,0,0]} name="Custo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <AIInsightCard
          title="Leitura do Contta AI"
          summary="A pressão sobre margem vem majoritariamente do lado dos custos, não do volume de vendas."
          confidence={m.confidence}
          details={[
            "Insumos +18% — investigar fornecedor de laticínios",
            "Energia +12% — reajuste sazonal, considerar contrato",
            "Atacado cresceu 6% mas com margem mais apertada",
          ]}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-semibold">Drivers de variação</h3>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {m.drivers.map(d => (
            <div key={d.label} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">{d.label}</p>
              <p className={`mt-1 font-semibold num ${d.direction === "up" ? "text-destructive" : "text-success"}`}>{brl(d.value, { sign: true })}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm"><Link to="/app/margem/dre">Abrir DRE</Link></Button>
        <Button asChild variant="outline" size="sm"><Link to="/app/margem/custos">Ver custos</Link></Button>
        <Button asChild variant="outline" size="sm"><Link to="/app/margem/precificacao">Precificação</Link></Button>
      </div>
    </div>
  );
}
