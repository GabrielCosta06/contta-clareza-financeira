import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  Receipt,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { alertsRepo, cashRepo, marginRepo, reviewRepo, transactionsRepo } from "@/services";
import { useDemoScenario, SCENARIO_LABELS } from "@/hooks/useDemoScenario";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { StatCardSkeletonGrid } from "@/components/skeletons/StatCardSkeleton";
import { dateBR, dateShort, formatBRL, pct, useCompactCurrency } from "@/lib/format";
import { toast } from "@/components/ui/sonner";

const ALERT_SNOOZE_KEY = "contta.dashboard.alert-snoozed-until";

type ActionTone = "primary" | "warning" | "destructive";

type RecommendedAction = {
  tone: ActionTone;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  context: string[];
};

const heroStyles: Record<ActionTone, string> = {
  primary: "border-primary/20 bg-gradient-to-br from-primary-soft via-card to-card",
  warning: "border-warning/25 bg-gradient-to-br from-warning-soft via-card to-card",
  destructive: "border-destructive/25 bg-gradient-to-br from-destructive-soft via-card to-card",
};

const getStoredSnoozeUntil = () => {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(ALERT_SNOOZE_KEY);
  return raw ? Number(raw) || 0 : 0;
};

const getRecommendedAction = ({
  scenario,
  criticalAlert,
  criticalReviewCount,
  weeklyRevenue,
  cashRiskLevel,
  cashMinProjectedDate,
  marginDeltaPct,
}: {
  scenario: ReturnType<typeof useDemoScenario>["scenario"];
  criticalAlert?: { title: string; message: string; actionHref?: string };
  criticalReviewCount: number;
  weeklyRevenue: number;
  cashRiskLevel?: "ok" | "watch" | "tight" | "critical";
  cashMinProjectedDate?: string;
  marginDeltaPct?: number;
}): RecommendedAction => {
  if (scenario === "empty") {
    return {
      tone: "primary",
      eyebrow: "Comece pela base",
      title: "Conecte uma conta ou importe o primeiro extrato.",
      description: "Sem dados recentes, o Contta ainda não consegue priorizar margem, caixa ou revisão com confiança.",
      ctaLabel: "Importar transações",
      ctaHref: "/app/transacoes",
      context: ["Sem transações classificadas", "Sem projeção de caixa", "Sem fila de revisão ativa"],
    };
  }

  if (criticalAlert) {
    return {
      tone: "destructive",
      eyebrow: "Próxima ação recomendada",
      title: criticalAlert.title,
      description: criticalAlert.message,
      ctaLabel: "Resolver agora",
      ctaHref: criticalAlert.actionHref ?? "/app/revisao",
      context: [
        `${criticalReviewCount} ${criticalReviewCount === 1 ? "pendência crítica" : "pendências críticas"} em revisão`,
        cashMinProjectedDate ? `Menor saldo previsto em ${dateBR(cashMinProjectedDate)}` : "Risco imediato no curto prazo",
        "Ação com maior impacto no fechamento atual",
      ],
    };
  }

  if (criticalReviewCount > 0) {
    return {
      tone: "warning",
      eyebrow: "Próxima ação recomendada",
      title: "Feche a fila crítica da revisão antes do próximo fechamento.",
      description: "As leituras já apontam direção, mas ainda há itens pendentes que podem mudar margem, caixa e tributação.",
      ctaLabel: "Abrir revisão",
      ctaHref: "/app/revisao",
      context: [
        `${criticalReviewCount} ${criticalReviewCount === 1 ? "item crítico" : "itens críticos"} aguardando decisão`,
        weeklyRevenue > 0 ? `Receita dos últimos 7 dias: ${formatBRL(weeklyRevenue, { display: "card", compactViewport: true })}` : "Receita semanal ainda sem base suficiente",
        "Prioridade operacional antes de decidir preço ou cobrança",
      ],
    };
  }

  if (cashRiskLevel === "critical" || cashRiskLevel === "tight") {
    return {
      tone: "warning",
      eyebrow: "Próxima ação recomendada",
      title: "Proteja o caixa das próximas semanas.",
      description: "A projeção já mostra aperto de curto prazo. Vale agir agora em cobrança, postergação ou antecipação de recebíveis.",
      ctaLabel: "Abrir caixa",
      ctaHref: "/app/caixa",
      context: [
        cashMinProjectedDate ? `Janela de aperto em ${dateBR(cashMinProjectedDate)}` : "Risco de caixa no horizonte de 30 dias",
        weeklyRevenue > 0 ? `Receita recente: ${formatBRL(weeklyRevenue, { display: "card", compactViewport: true })}` : "Receita semanal ainda baixa",
        "Foco em liquidez antes de expansão",
      ],
    };
  }

  if (typeof marginDeltaPct === "number" && marginDeltaPct <= -4) {
    return {
      tone: "warning",
      eyebrow: "Próxima ação recomendada",
      title: "Atue na margem antes do próximo fechamento.",
      description: "A receita continua acontecendo, mas o custo está subindo mais rápido do que o volume — e isso aperta sua margem.",
      ctaLabel: "Abrir margem",
      ctaHref: "/app/margem",
      context: [
        `Variação de margem: ${pct(marginDeltaPct, { sign: true })}`,
        weeklyRevenue > 0 ? `Receita dos últimos 7 dias: ${formatBRL(weeklyRevenue, { display: "card", compactViewport: true })}` : "Receita semanal ainda sem base suficiente",
        "Revisar insumos e energia tende a gerar impacto mais rápido",
      ],
    };
  }

  return {
    tone: "primary",
    eyebrow: "Próxima ação recomendada",
    title: "Sustente o ritmo desta semana e monitore sinais de desvio.",
    description: "A base está consistente. O melhor uso agora é acompanhar margem e caixa sem deixar a fila de revisão voltar a crescer.",
    ctaLabel: "Abrir visão geral de margem",
    ctaHref: "/app/margem",
    context: [
      weeklyRevenue > 0 ? `Receita dos últimos 7 dias: ${formatBRL(weeklyRevenue, { display: "card", compactViewport: true })}` : "Receita semanal em consolidação",
      "Sem alertas críticos ativos",
      "Boa janela para decisões de preço e mix",
    ],
  };
};

export default function Dashboard() {
  const { scenario } = useDemoScenario();
  const compactCurrency = useCompactCurrency();
  const { data: margin, isLoading: marginLoading } = useQuery({
    queryKey: ["margin"],
    queryFn: () => marginRepo.overview(),
    retry: false,
  });
  const { data: cash, isLoading: cashLoading } = useQuery({
    queryKey: ["cash"],
    queryFn: () => cashRepo.overview(),
    retry: false,
  });
  const { data: projection = [], isLoading: projLoading } = useQuery({
    queryKey: ["projection"],
    queryFn: () => cashRepo.projection(),
  });
  const { data: review = [] } = useQuery({
    queryKey: ["review"],
    queryFn: () => reviewRepo.queue(),
  });
  const { data: alerts = [] } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertsRepo.list(),
  });
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", "", "all", "all"],
    queryFn: () => transactionsRepo.list(),
  });

  const [snoozedUntil, setSnoozedUntil] = useState(getStoredSnoozeUntil);
  const critical = review.filter((item) => item.severity === "critical");
  const activeCriticalAlert = alerts.find(
    (alert) => alert.severity === "critical" && (snoozedUntil <= Date.now() || alert.createdAt > new Date(snoozedUntil).toISOString()),
  );

  const now = Date.now();
  const weekStart = now - 7 * 24 * 60 * 60 * 1000;
  const previousWeekStart = now - 14 * 24 * 60 * 60 * 1000;

  const weeklyRevenue = transactions
    .filter((transaction) => transaction.direction === "in")
    .filter((transaction) => new Date(transaction.date).getTime() >= weekStart)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousWeekRevenue = transactions
    .filter((transaction) => transaction.direction === "in")
    .filter((transaction) => {
      const date = new Date(transaction.date).getTime();
      return date >= previousWeekStart && date < weekStart;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const recommendedAction = getRecommendedAction({
    scenario,
    criticalAlert: activeCriticalAlert,
    criticalReviewCount: critical.length,
    weeklyRevenue,
    cashRiskLevel: cash?.riskLevel,
    cashMinProjectedDate: cash?.minProjected.date,
    marginDeltaPct: margin?.delta.pct,
  });

  const statsLoading = marginLoading || cashLoading || transactionsLoading;

  const snoozeCriticalAlert = () => {
    const until = Date.now() + 24 * 60 * 60 * 1000;
    setSnoozedUntil(until);
    window.localStorage.setItem(ALERT_SNOOZE_KEY, String(until));
    toast("Alerta adiado por 24 horas", {
      description: "Ele volta a aparecer se continuar sendo o sinal mais crítico.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Sua leitura semanal"
        title="Como sua empresa está agora — e o que olhar primeiro."
        subtitle="Os números mais importantes da semana, com nível de confiança em cada um."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/compartilhar?print=1">
                <Share2 className="h-4 w-4" />
                Compartilhar leitura
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/app/ai">
                <Sparkles className="h-4 w-4" />
                Perguntar ao Contta AI
              </Link>
            </Button>
          </>
        }
      />

      <section className={`rounded-2xl border p-6 shadow-card ${heroStyles[recommendedAction.tone]}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-background/70 text-foreground">
                {recommendedAction.eyebrow}
              </Badge>
              <Badge variant="secondary" className="bg-background/70 text-foreground">
                Cenário: {SCENARIO_LABELS[scenario]}
              </Badge>
              {(margin?.confidence || cash?.confidence) && (
                <ConfidenceBadge level={margin?.confidence ?? cash?.confidence ?? "no-data"} />
              )}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {recommendedAction.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {recommendedAction.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {recommendedAction.context.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link to={recommendedAction.ctaHref}>
                {recommendedAction.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/ai?prompt=Qual%20%C3%A9%20a%20melhor%20pr%C3%B3xima%20a%C3%A7%C3%A3o%20financeira%20agora%3F">
                <Sparkles className="h-4 w-4" />
                Validar com o Contta AI
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {activeCriticalAlert && (
        <div className="flex flex-col gap-4 rounded-lg border border-destructive/25 bg-destructive-soft p-4 lg:flex-row lg:items-start">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-foreground">{activeCriticalAlert.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{activeCriticalAlert.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                Detectado em {dateShort(activeCriticalAlert.createdAt)}
              </span>
              <span>{critical.length} itens críticos na revisão</span>
            </div>
          </div>
          <div className="flex gap-2 self-start">
            <Button variant="outline" size="sm" onClick={snoozeCriticalAlert}>
              Adiar 24h
            </Button>
            <Button asChild size="sm">
              <Link to={activeCriticalAlert.actionHref ?? "/app/revisao"}>Resolver agora</Link>
            </Button>
          </div>
        </div>
      )}

      {statsLoading ? (
        <StatCardSkeletonGrid count={4} withFooter />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Margem bruta — mês atual"
            value={margin ? pct(margin.grossMarginPct) : "—"}
            delta={margin ? { value: margin.delta.pct } : undefined}
            hint={margin ? `${formatBRL(margin.grossMargin)} sobre ${formatBRL(margin.revenue)}` : "Sem dados de margem ainda"}
            emphasis={margin ? "warning" : "default"}
            footer={
              <div className="flex items-center justify-between gap-2">
                {margin && <ConfidenceBadge level={margin.confidence} />}
                <Button asChild variant="ghost" size="sm" className="-mr-2 text-primary">
                  <Link to="/app/margem">
                    Abrir margem
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            }
          />

          <StatCard
            label="Caixa atual"
            value={cash ? formatBRL(cash.currentBalance, { display: "card", compactViewport: compactCurrency }) : "—"}
            hint={
              cash
                ? `Mínimo projetado: ${formatBRL(cash.minProjected.balance)} em ${dateBR(cash.minProjected.date)}`
                : "Sem dados de caixa ainda"
            }
            emphasis={cash?.riskLevel === "tight" || cash?.riskLevel === "critical" ? "destructive" : "default"}
            footer={
              <div className="flex items-center justify-between gap-2">
                {cash && <ConfidenceBadge level={cash.confidence} />}
                <Button asChild variant="ghost" size="sm" className="-mr-2 text-primary">
                  <Link to="/app/caixa">
                    Abrir caixa
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            }
          />

          <StatCard
            label="Itens urgentes para revisar"
            value={critical.length}
            hint={critical.length ? "Itens que podem mudar o resultado do mês." : "Nada urgente para revisar agora."}
            emphasis={critical.length ? "destructive" : "default"}
            footer={
              <Button asChild variant="ghost" size="sm" className="-mr-2 text-primary">
                <Link to="/app/revisao">
                  Abrir revisão
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          />

          <StatCard
            label="Receita dos últimos 7 dias"
            value={weeklyRevenue ? formatBRL(weeklyRevenue, { display: "card", compactViewport: compactCurrency }) : "—"}
            delta={
              previousWeekRevenue > 0
                ? { value: ((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 }
                : undefined
            }
            hint={
              weeklyRevenue
                ? `${transactions.filter((transaction) => transaction.direction === "in" && new Date(transaction.date).getTime() >= weekStart).length} entradas confirmadas`
                : "Sem entradas suficientes nesta janela"
            }
            emphasis={weeklyRevenue > 0 ? "primary" : "default"}
            footer={
              <Button asChild variant="ghost" size="sm" className="-mr-2 text-primary">
                <Link to="/app/transacoes">
                  Abrir transações
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Projeção de caixa — próximos 30 dias</h2>
              <p className="text-sm text-muted-foreground">Saldo projetado considerando recebíveis e obrigações.</p>
            </div>
            {cash && <ConfidenceBadge level={cash.confidence} />}
          </div>
          {projLoading ? (
            <ChartSkeleton height="h-56" />
          ) : projection.length === 0 ? (
            <div className="grid h-64 place-items-center px-4 text-center text-sm text-muted-foreground">
              Importe transações ou conecte uma conta para gerar a projeção.
            </div>
          ) : (
            <div className="-ml-2 h-64" role="img" aria-labelledby="dashboard-cash-chart-title" aria-describedby="dashboard-cash-chart-description">
              <p id="dashboard-cash-chart-title" className="sr-only">Projeção de caixa do dashboard</p>
              <p id="dashboard-cash-chart-description" className="sr-only">
                Saldo projetado para os próximos 30 dias com base em recebíveis e obrigações registradas.
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projection.map((point) => ({
                    ...point,
                    date: new Date(point.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                  }))}
                >
                  <defs>
                    <linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(value) => formatBRL(value as number, { display: "compact" })} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: number) => formatBRL(value)}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cashFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <AIInsightCard
          summary="A próxima decisão financeira mudou de prioridade: primeiro proteja o caixa e a confiança da base, depois ajuste margem e preço."
          confidence={cash?.confidence ?? margin?.confidence ?? "with-caveats"}
          details={[
            critical.length > 0
              ? `${critical.length} itens críticos ainda podem alterar esta leitura.`
              : "Fila crítica controlada para esta semana.",
            cash?.minProjected?.date
              ? `O menor saldo previsto ocorre em ${dateBR(cash.minProjected.date)}.`
              : "A projeção de caixa ainda precisa de mais dados.",
            margin ? `Margem do mês está em ${pct(margin.grossMarginPct)}.` : "Margem ainda sem dados consolidados.",
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold">Drivers de variação na margem</h3>
          <ul className="mt-3 space-y-2.5">
            {margin?.drivers.map((driver) => (
              <li key={driver.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{driver.label}</span>
                <span className={`num font-medium ${driver.direction === "up" ? "text-destructive" : "text-success"}`}>
                  {formatBRL(driver.value, { sign: true })}
                </span>
              </li>
            ))}
            {!margin && <p className="text-sm text-muted-foreground">Sem dados de margem suficientes para explicar drivers.</p>}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-semibold">Itens críticos da revisão</h3>
          <ul className="mt-3 space-y-2.5">
            {critical.slice(0, 4).map((item) => (
              <li key={item.id} className="text-sm">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.impact}</p>
              </li>
            ))}
            {critical.length === 0 && <p className="text-sm text-muted-foreground">Nada crítico no momento.</p>}
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
            ].map((action) => (
              <Button key={action.to} asChild variant="outline" size="sm" className="justify-start gap-2">
                <Link to={action.to}>
                  <action.Icon className="h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
