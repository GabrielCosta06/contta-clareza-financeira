import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  eyebrow?: string;
}

export const PageHeader = ({ title, subtitle, actions, eyebrow, className }: Props) => (
  <header className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between animate-fade-in-up", className)}>
    <div className="min-w-0">
      {eyebrow && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{eyebrow}</p>}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
      {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>
);
