import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cashRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { AIInsightCard } from "@/components/AIInsightCard";
import { brl, dateBR } from "@/lib/format";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const subnav = [
  { to: "/app/caixa", label: "Visão geral", end: true },
  { to: "/app/caixa/projecao", label: "Projeção" },
  { to: "/app/caixa/recebiveis", label: "Recebíveis" },
  { to: "/app/caixa/obrigacoes", label: "Obrigações" },
];

export const CaixaLayout = () => {
  const loc = useLocation();
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Caixa" subtitle="Saldo, projeção, recebíveis e obrigações em uma única leitura." />
      <nav className="flex gap-1 border-b border-border overflow-x-auto">
        {subnav.map(s => {
          const active = s.end ? loc.pathname === s.to : loc.pathname.startsWith(s.to);
          return (<Link key={s.to} to={s.to} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{s.label}</Link>);
        })}
      </nav>
      <Outlet />
    </div>
  );
};

const riskLabels = { ok: { label: "Saudável", variant: "outline" }, watch: { label: "Em observação", variant: "secondary" }, tight: { label: "Aperto previsto", variant: "destructive" }, critical: { label: "Crítico", variant: "destructive" } } as const;

export default function Caixa() {
  const { data: c } = useQuery({ queryKey: ["cash"], queryFn: () => cashRepo.overview() });
  if (!c) return null;
  const r = riskLabels[c.riskLevel];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Saldo atual" value={brl(c.currentBalance)} hint={`Em ${dateBR(c.asOf)}`} />
        <StatCard label="Saldo projetado em 30d" value={brl(c.projected30d)} emphasis="warning" delta={{ value: -32 }} />
        <StatCard label="Risco de curto prazo" value={<Badge variant={r.variant} className="text-sm">{r.label}</Badge>} hint={`Mínimo: ${brl(c.minProjected.balance)} em ${dateBR(c.minProjected.date)}`} emphasis={c.riskLevel === "tight" || c.riskLevel === "critical" ? "destructive" : "default"} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Projeção de 30 dias</h2>
            <ConfidenceBadge level={c.confidence} />
          </div>
          <ProjectionChart />
        </div>
        <AIInsightCard
          summary="Sem ação, o caixa pode ficar negativo em ~19 dias devido à concentração de obrigações entre dias 7 e 14."
          confidence={c.confidence}
          details={[
            "Cobrar Restaurante Lume (R$ 4.280, em atraso)",
            "Antecipar repasse Stone (R$ 18,4 mil) reduz aperto",
            "Postergar compra de equipamento não-essencial",
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm"><Link to="/app/caixa/projecao">Abrir projeção</Link></Button>
        <Button asChild variant="outline" size="sm"><Link to="/app/caixa/recebiveis">Recebíveis</Link></Button>
        <Button asChild variant="outline" size="sm"><Link to="/app/caixa/obrigacoes">Obrigações</Link></Button>
      </div>
    </div>
  );
}

export function ProjectionChart() {
  const { data = [] } = useQuery({ queryKey: ["projection"], queryFn: () => cashRepo.projection() });
  const formatted = data.map(p => ({ ...p, date: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) }));
  return (
    <div className="h-72 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="cashFill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={3} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => brl(v as number, { compact: true })} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: any) => brl(v)} />
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
      <div className="rounded-lg border border-border bg-card p-5"><ProjectionChart /></div>
      <p className="text-xs text-muted-foreground">Premissas: recebíveis confirmados, obrigações registradas e padrão histórico de entradas/saídas. Use como direção, não como fechamento.</p>
    </div>
  );
}

export function Recebiveis() {
  const { data = [] } = useQuery({ queryKey: ["receivables"], queryFn: () => cashRepo.receivables() });
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Recebíveis esperados</h2>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground"><tr><th className="text-left font-medium px-5 py-3">Contraparte</th><th className="text-left font-medium px-5 py-3">Vencimento</th><th className="text-left font-medium px-5 py-3">Origem</th><th className="text-left font-medium px-5 py-3">Status</th><th className="text-right font-medium px-5 py-3">Valor</th></tr></thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="border-t"><td className="px-5 py-3 font-medium">{r.counterparty}</td><td className="px-5 py-3 text-muted-foreground num">{dateBR(r.dueDate)}</td><td className="px-5 py-3 text-muted-foreground">{r.source}</td><td className="px-5 py-3"><Badge variant={r.status === "overdue" ? "destructive" : "outline"} className="text-[10px]">{r.status === "overdue" ? "Em atraso" : "Agendado"}</Badge></td><td className="px-5 py-3 text-right num font-medium">{brl(r.amount)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Obrigacoes() {
  const { data = [] } = useQuery({ queryKey: ["obligations"], queryFn: () => cashRepo.obligations() });
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Obrigações próximas</h2>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground"><tr><th className="text-left font-medium px-5 py-3">Contraparte</th><th className="text-left font-medium px-5 py-3">Vencimento</th><th className="text-left font-medium px-5 py-3">Categoria</th><th className="text-left font-medium px-5 py-3">Severidade</th><th className="text-right font-medium px-5 py-3">Valor</th></tr></thead>
          <tbody>
            {data.map(o => (
              <tr key={o.id} className="border-t"><td className="px-5 py-3 font-medium">{o.counterparty}</td><td className="px-5 py-3 text-muted-foreground num">{dateBR(o.dueDate)}</td><td className="px-5 py-3 text-muted-foreground">{o.category}</td><td className="px-5 py-3"><Badge variant={o.severity === "critical" ? "destructive" : o.severity === "high" ? "secondary" : "outline"} className="text-[10px]">{o.severity === "critical" ? "Crítica" : o.severity === "high" ? "Alta" : "Normal"}</Badge></td><td className="px-5 py-3 text-right num font-medium">{brl(o.amount)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
