import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Delta } from "./Delta";

interface Props {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  delta?: { value: number; inverse?: boolean; vs?: string };
  className?: string;
  emphasis?: "default" | "primary" | "warning" | "destructive";
  footer?: ReactNode;
}

const tones = {
  default: "border-border bg-card",
  primary: "border-primary/20 bg-primary-soft/40",
  warning: "border-warning/20 bg-warning-soft",
  destructive: "border-destructive/20 bg-destructive-soft",
};

export const StatCard = ({ label, value, hint, delta, className, emphasis = "default", footer }: Props) => (
  <div className={cn("rounded-lg border p-5 hover-lift animate-fade-in", tones[emphasis], className)}>
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    <div className="mt-2 flex items-baseline gap-3 flex-wrap">
      <div className="text-[28px] font-semibold tracking-tight text-foreground num">{value}</div>
      {delta && <Delta value={delta.value} inverse={delta.inverse} />}
    </div>
    {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    {footer && <div className="mt-4 pt-4 border-t border-border/60">{footer}</div>}
  </div>
);
