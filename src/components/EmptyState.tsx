import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: Props) => (
  <div className={cn("flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-12", className)}>
    {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">{icon}</div>}
    <h3 className="font-semibold text-base text-foreground">{title}</h3>
    <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
