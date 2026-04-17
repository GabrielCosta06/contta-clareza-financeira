import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/domain/types";
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, MinusCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { companyRepo, reviewRepo, transactionsRepo } from "@/services";
import { relativeDays } from "@/lib/format";

const map: Record<ConfidenceLevel, { label: string; className: string; Icon: typeof ShieldCheck; hint: string }> = {
  "no-data":      { label: "Sem dados",       className: "bg-muted text-muted-foreground border-border", Icon: MinusCircle, hint: "Ainda não recebemos dados suficientes para esta visão." },
  "insufficient": { label: "Insuficientes",   className: "bg-destructive-soft text-destructive border-destructive/20", Icon: ShieldAlert, hint: "Volume de dados muito baixo. Resultados podem mudar bastante." },
  "partial":      { label: "Parciais",        className: "bg-warning-soft text-warning border-warning/20", Icon: AlertTriangle, hint: "Dados parciais. Use como direção, não como fechamento." },
  "with-caveats": { label: "Com ressalvas",   className: "bg-info-soft text-info border-info/20", Icon: ShieldQuestion, hint: "Dados utilizáveis, mas há pendências que podem alterar os números." },
  "reliable":     { label: "Confiáveis",      className: "bg-success-soft text-success border-success/20", Icon: ShieldCheck, hint: "Base conciliada e revisada. Confiança alta." },
};

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export const ConfidenceBadge = ({ level, className }: { level: ConfidenceLevel; className?: string }) => {
  const { label, className: c, Icon, hint } = map[level];

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", "", "all", "all"],
    queryFn: () => transactionsRepo.list(),
  });
  const { data: review = [] } = useQuery({
    queryKey: ["review"],
    queryFn: () => reviewRepo.queue(),
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => companyRepo.accounts(),
  });

  const uncategorizedCount = transactions.filter(
    (transaction) => !transaction.categoryId || transaction.reviewStatus === "needs-categorization",
  ).length;

  const latestSync = accounts
    .map((account) => account.lastSyncAt)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  const summary =
    level === "reliable"
      ? "A leitura está apoiada em dados recentes e poucos pontos de atenção."
      : level === "with-caveats"
        ? "A base já direciona decisões, mas ainda tem pontos que podem alterar o fechamento."
        : hint;

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:border-foreground/20",
            c,
            className,
          )}
          aria-label={`Explicar confiança dos dados: ${label}`}
        >
          <Icon className="h-3.5 w-3.5" />
          Dados {label.toLowerCase()}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Por que este nível?</p>
            <p className="mt-1 text-sm font-medium text-foreground">{summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Categorização</p>
              <p className="mt-1 font-medium text-foreground">
                {pluralize(uncategorizedCount, "transação sem categoria", "transações sem categoria")}
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Revisão</p>
              <p className="mt-1 font-medium text-foreground">
                {pluralize(review.length, "item em revisão", "itens em revisão")}
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Atualização de fontes</p>
              <p className="mt-1 font-medium text-foreground">
                {latestSync ? `Última sincronização ${relativeDays(latestSync)}` : "Nenhuma sincronização recente"}
              </p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
