import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, MinusCircle, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/domain/types";
import { companyRepo, reviewRepo, transactionsRepo } from "@/services";
import { relativeDays } from "@/lib/format";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const map: Record<
  ConfidenceLevel,
  { label: string; tone: string; dot: string; Icon: typeof ShieldCheck; hint: string }
> = {
  "no-data": {
    label: "Sem dados",
    tone: "text-muted-foreground",
    dot: "bg-muted-foreground",
    Icon: MinusCircle,
    hint: "Ainda não recebemos dados suficientes para esta visão.",
  },
  insufficient: {
    label: "Dados insuficientes",
    tone: "text-destructive",
    dot: "bg-destructive",
    Icon: ShieldAlert,
    hint: "Volume de dados muito baixo. Resultados podem mudar bastante.",
  },
  partial: {
    label: "Dados parciais",
    tone: "text-warning",
    dot: "bg-warning",
    Icon: AlertTriangle,
    hint: "Dados parciais. Use como direção, não como fechamento.",
  },
  "with-caveats": {
    label: "Com ressalvas",
    tone: "text-info",
    dot: "bg-info",
    Icon: ShieldQuestion,
    hint: "Dados utilizáveis, mas há pendências que podem alterar os números.",
  },
  reliable: {
    label: "Dados confiáveis",
    tone: "text-success",
    dot: "bg-success",
    Icon: ShieldCheck,
    hint: "Base conciliada e revisada. Confiança alta.",
  },
};

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

interface Props {
  level: ConfidenceLevel;
  className?: string;
}

/**
 * Compact, single-line trust indicator shown ONCE per page (near the top).
 * Replaces repeated "Dados parciais / Dados confiáveis" labels on every card.
 */
export const DataTrustBanner = ({ level, className }: Props) => {
  const { label, tone, dot, Icon, hint } = map[level];

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
    (t) => !t.categoryId || t.reviewStatus === "needs-categorization",
  ).length;

  const latestSync = accounts
    .map((a) => a.lastSyncAt)
    .filter((v): v is string => Boolean(v))
    .sort((l, r) => new Date(r).getTime() - new Date(l).getTime())[0];

  return (
    <Collapsible
      className={cn(
        "rounded-lg border border-border/70 bg-card/40 backdrop-blur-sm",
        className,
      )}
    >
      <CollapsibleTrigger
        className="group flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
        aria-label={`Confiança nos dados: ${label}. Clique para detalhes.`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn("relative flex h-2 w-2 shrink-0 items-center justify-center")}>
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-40", dot)} />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot)} />
          </span>
          <Icon className={cn("h-3.5 w-3.5 shrink-0", tone)} />
          <p className="truncate text-xs font-medium text-foreground">
            <span className={tone}>{label}</span>
            <span className="hidden text-muted-foreground sm:inline"> · {hint}</span>
          </p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="grid gap-2 border-t border-border/60 p-3 text-xs sm:grid-cols-3">
          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <p className="uppercase tracking-wider text-[10px] text-muted-foreground">Categorização</p>
            <p className="mt-1 font-medium text-foreground">
              {pluralize(uncategorizedCount, "transação sem categoria", "transações sem categoria")}
            </p>
          </div>
          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <p className="uppercase tracking-wider text-[10px] text-muted-foreground">Revisão</p>
            <p className="mt-1 font-medium text-foreground">
              {pluralize(review.length, "item em revisão", "itens em revisão")}
            </p>
          </div>
          <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2">
            <p className="uppercase tracking-wider text-[10px] text-muted-foreground">Atualização</p>
            <p className="mt-1 font-medium text-foreground">
              {latestSync ? `Sincronizado ${relativeDays(latestSync)}` : "Sem sincronização recente"}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
