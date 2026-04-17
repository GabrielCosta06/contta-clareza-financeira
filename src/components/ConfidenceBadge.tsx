import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/domain/types";
import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle, MinusCircle } from "lucide-react";

const map: Record<ConfidenceLevel, { label: string; className: string; Icon: typeof ShieldCheck; hint: string }> = {
  "no-data":      { label: "Sem dados",       className: "bg-muted text-muted-foreground border-border", Icon: MinusCircle, hint: "Ainda não recebemos dados suficientes para esta visão." },
  "insufficient": { label: "Insuficientes",   className: "bg-destructive-soft text-destructive border-destructive/20", Icon: ShieldAlert, hint: "Volume de dados muito baixo. Resultados podem mudar bastante." },
  "partial":      { label: "Parciais",        className: "bg-warning-soft text-warning border-warning/20", Icon: AlertTriangle, hint: "Dados parciais. Use como direção, não como fechamento." },
  "with-caveats": { label: "Com ressalvas",   className: "bg-info-soft text-info border-info/20", Icon: ShieldQuestion, hint: "Dados utilizáveis, mas há pendências que podem alterar os números." },
  "reliable":     { label: "Confiáveis",      className: "bg-success-soft text-success border-success/20", Icon: ShieldCheck, hint: "Base conciliada e revisada. Confiança alta." },
};

export const ConfidenceBadge = ({ level, className }: { level: ConfidenceLevel; className?: string }) => {
  const { label, className: c, Icon, hint } = map[level];
  return (
    <span title={hint} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", c, className)}>
      <Icon className="h-3.5 w-3.5" />
      Dados {label.toLowerCase()}
    </span>
  );
};
