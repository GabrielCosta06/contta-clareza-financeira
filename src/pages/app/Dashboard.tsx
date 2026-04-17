import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { marginRepo, cashRepo, reviewRepo, alertsRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { brl, pct } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, ShieldCheck, TrendingUp, Wallet, Sparkles, Receipt } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { StatCardSkeletonGrid } from "@/components/skeletons/StatCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

export default function Dashboard() {
  const { data: margin, isLoading: marginLoading } = useQuery({ queryKey: ["margin"], queryFn: () => marginRepo.overview(), retry: false });
  const { data: cash, isLoading: cashLoading } = useQuery({ queryKey: ["cash"], queryFn: () => cashRepo.overview(), retry: false });
  const { data: projection = [], isLoading: projLoading } = useQuery({ queryKey: ["projection"], queryFn: () => cashRepo.projection() });
  const { data: review = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: () => alertsRepo.list() });

  const critical = review.filter(r => r.severity === "critical");
  const statsLoading = marginLoading || cashLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Sua leitura semanal"
        title="Como estamos agora — e o que merece atenção primeiro."
        subtitle="Resumo direto da semana, com indicador de confiança em cada leitura."
        actions={<Button asChild variant="outline" size="sm"><Link to="/app/ai"><Sparkles className="h-4 w-4" /> Perguntar ao Contta AI</Link></Button>}
      />

      {/* Critical alerts band */}
      {alerts.filter(a => a.severity === "critical").length > 0 && (
        <div className="rounded-lg border border-destructive/25 bg-destructive-soft p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-foreground">{alerts.find(a => a.severity === "critical")?.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{alerts.find(a => a.severity === "critical")?.message}</p>
          </div>
          <Button asChild size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Link to={alerts.find(a => a.severity === "critical")?.actionHref ?? "#"}>Ver detalhes</Link>
          </Button>
        </div>
      )}

      {/* Top stats */}
      {statsLoading ? (
        <StatCardSkeletonGrid count={3} withFooter />
      ) : (
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Margem bruta — mês atual"
          value={margin ? pct(margin.grossMarginPct) : "—"}
          delta={margin ? { value: margin.delta.pct } : undefined}
          hint={margin ? `${brl(margin.grossMargin)} sobre ${brl(margin.revenue)}` : "Sem dados de margem ainda"}
          emphasis={margin ? "warning" : "default"}
          footer={
            <div className="flex items-center justify-between">
              {margin && <ConfidenceBadge level={margin.confidence} />}
              <Button asChild variant="ghost" size="sm" className="text-primary -mr-2"><Link to="/app/margem">Abrir margem <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            </div>
          }
        />
        <StatCard
          label="Caixa atual"
          value={cash ? brl(cash.currentBalance, { compact: true }) : "—"}
          hint={cash ? `Mínimo projetado: ${brl(cash.minProjected.balance)} em ${new Date(cash.minProjected.date).toLocaleDateString("pt-BR")}` : "Sem dados de caixa ainda"}
          emphasis={cash?.riskLevel === "tight" || cash?.riskLevel === "critical" ? "destructive" : "default"}
          footer={
            <div className="flex items-center justify-between">
              {cash && <ConfidenceBadge level={cash.confidence} />}
              <Button asChild variant="ghost" size="sm" className="text-primary -mr-2"><Link to="/app/caixa">Abrir caixa <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            </div>
          }
        />
        <StatCard
          label="Pendências críticas"
          value={critical.length}
          hint={critical.length ? "Itens que podem alterar o resultado do fechamento." : "Nenhuma pendência crítica."}
          emphasis={critical.length ? "destructive" : "default"}
          footer={
            <Button asChild variant="ghost" size="sm" className="text-primary -mr-2"><Link to="/app/revisao">Abrir revisão <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          }
        />
      </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Cash projection chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Projeção de caixa — próximos 30 dias</h2>
              <p className="text-sm text-muted-foreground">Saldo projetado considerando recebíveis e obrigações.</p>
            </div>
            {cash && <ConfidenceBadge level={cash.confidence} />}
          </div>
          {projLoading ? (
            <ChartSkeleton height="h-56" />
          ) : projection.length === 0 ? (
            <div className="h-64 grid place-items-center text-sm text-muted-foreground text-center px-4">
              Importe transações ou conecte uma conta para gerar a projeção.
            </div>
          ) : (
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection.map(p => ({ ...p, date: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) }))}>
                <defs>
                  <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => brl(v as number, { compact: true })} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v: any) => brl(v)} />
                <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cashFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          )}
        </div>

        <AIInsightCard
          summary="A margem caiu 5,2% este mês por pressão de custos de insumos (+18%) e energia (+12%). Recomendo agir antes do próximo fechamento."
          confidence="with-caveats"
          details={[
            "Renegociar 2 maiores fornecedores de insumos pode recuperar ~3 p.p.",
            "5 itens críticos na revisão podem alterar este cálculo.",
            "Caixa pode apertar em ~19 dias se recebíveis em atraso não forem cobrados.",
          ]}
        />
      </div>

      {/* Quick actions + drivers */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold">Drivers de variação na margem</h3>
          <ul className="mt-3 space-y-2.5">
            {margin?.drivers.map(d => (
              <li key={d.label} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{d.label}</span>
                <span className={`num font-medium ${d.direction === "up" ? "text-destructive" : "text-success"}`}>{brl(d.value, { sign: true })}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold">Itens críticos da revisão</h3>
          <ul className="mt-3 space-y-2.5">
            {critical.slice(0,4).map(r => (
              <li key={r.id} className="text-sm">
                <p className="font-medium text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.impact}</p>
              </li>
            ))}
            {critical.length === 0 && <p className="text-sm text-muted-foreground">Nada crítico no momento. ✨</p>}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold">Ações rápidas</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { to: "/app/margem", label: "Margem", Icon: TrendingUp },
              { to: "/app/caixa", label: "Caixa", Icon: Wallet },
              { to: "/app/revisao", label: "Revisão", Icon: ShieldCheck },
              { to: "/app/transacoes", label: "Transações", Icon: Receipt },
            ].map(a => (
              <Button key={a.to} asChild variant="outline" size="sm" className="justify-start gap-2">
                <Link to={a.to}><a.Icon className="h-4 w-4" /> {a.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
