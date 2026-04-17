import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";

import { alertsRepo, cashRepo, companyRepo, marginRepo, reviewRepo, transactionsRepo } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dateBR, formatBRL, pct } from "@/lib/format";

export default function WeeklyReadingExport() {
  const [searchParams] = useSearchParams();
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: margin } = useQuery({ queryKey: ["margin"], queryFn: () => marginRepo.overview(), retry: false });
  const { data: cash } = useQuery({ queryKey: ["cash"], queryFn: () => cashRepo.overview(), retry: false });
  const { data: review = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: () => alertsRepo.list() });
  const { data: transactions = [] } = useQuery({ queryKey: ["transactions", "", "all", "all"], queryFn: () => transactionsRepo.list() });

  useEffect(() => {
    if (searchParams.get("print") !== "1") return;
    const timeout = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  const criticalReview = review.filter((item) => item.severity === "critical");
  const criticalAlert = alerts.find((alert) => alert.severity === "critical") ?? alerts[0];
  const weeklyRevenue = transactions
    .filter((transaction) => transaction.direction === "in")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="min-h-screen bg-background px-4 py-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-card print:max-w-none print:rounded-none print:border-0 print:p-10 print:shadow-none">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/app/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao dashboard
            </Link>
          </Button>
          <Button type="button" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>

        <header className="border-b border-border pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Compartilhar leitura</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Resumo semanal do Contta</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {company?.tradeName ?? "Empresa"} · gerado em {dateBR(new Date())}
              </p>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex">
              <Share2 className="mr-1 h-3.5 w-3.5" />
              Leitura pronta para PDF
            </Badge>
          </div>
        </header>

        <main className="space-y-8 pt-8">
          <section className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Próxima ação recomendada</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {criticalAlert?.title ?? "Acompanhar margem e caixa ao longo desta semana."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {criticalAlert?.message ?? "A base está estável. Use esta leitura como referência rápida para decisões de operação e fechamento."}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Margem bruta"
              value={margin ? pct(margin.grossMarginPct) : "—"}
              helper={margin ? `${formatBRL(margin.grossMargin)} sobre ${formatBRL(margin.revenue)}` : "Sem dados de margem"}
            />
            <MetricCard
              label="Caixa atual"
              value={cash ? formatBRL(cash.currentBalance) : "—"}
              helper={cash ? `Saldo mínimo projetado: ${formatBRL(cash.minProjected.balance)}` : "Sem dados de caixa"}
            />
            <MetricCard
              label="Pendências críticas"
              value={String(criticalReview.length)}
              helper={criticalReview.length ? "Itens ainda podem alterar o fechamento." : "Nenhuma pendência crítica ativa."}
            />
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Drivers da margem</h3>
              <ul className="mt-4 space-y-3">
                {margin?.drivers.slice(0, 4).map((driver) => (
                  <li key={driver.label} className="flex items-center justify-between gap-3 text-sm">
                    <span>{driver.label}</span>
                    <span className={driver.direction === "up" ? "text-destructive" : "text-success"}>
                      {formatBRL(driver.value, { sign: true })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Revisão prioritária</h3>
              <ul className="mt-4 space-y-3">
                {criticalReview.length > 0 ? (
                  criticalReview.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.impact}</p>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">Nenhuma pendência crítica encontrada nesta leitura.</li>
                )}
              </ul>
            </div>
          </section>

          <section className="rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Notas para compartilhamento</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Receita acumulada observada na base atual: {formatBRL(weeklyRevenue)}.</li>
              <li>Projeção de caixa considera recebíveis e obrigações já registrados até {dateBR(new Date())}.</li>
              <li>Este documento foi gerado em formato pronto para exportação em PDF pelo navegador.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

const MetricCard = ({ label, value, helper }: { label: string; value: string; helper: string }) => (
  <div className="rounded-xl border border-border p-5">
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground num">{value}</p>
    <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
  </div>
);
