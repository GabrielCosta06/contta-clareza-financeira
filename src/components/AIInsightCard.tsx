import { cn } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ConfidenceLevel } from "@/domain/types";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface Props {
  title?: string;
  summary: string;
  details?: string[];
  confidence?: ConfidenceLevel;
  askHref?: string;
  askLabel?: string;
  className?: string;
}

export const AIInsightCard = ({ title = "Leitura do Contta AI", summary, details, confidence, askHref = "/app/ai", askLabel = "Aprofundar com Contta AI", className }: Props) => (
  <div className={cn("rounded-lg border border-primary/15 bg-gradient-to-br from-primary-soft/60 via-background to-background p-5 hover-lift animate-fade-in", className)}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">{title}</p>
        </div>
      </div>
      {confidence && <ConfidenceBadge level={confidence} />}
    </div>
    <p className="mt-3 text-[15px] leading-relaxed text-foreground text-balance">{summary}</p>
    {details && details.length > 0 && (
      <ul className="mt-3 space-y-1.5">
        {details.map((d, i) => (
          <li key={i} className="text-sm text-muted-foreground flex gap-2">
            <span className="mt-2 h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    )}
    <div className="mt-4">
      <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary-soft -ml-2">
        <Link to={askHref}>{askLabel} <ArrowRight className="h-4 w-4" /></Link>
      </Button>
    </div>
  </div>
);
