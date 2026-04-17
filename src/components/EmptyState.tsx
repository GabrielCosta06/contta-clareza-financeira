import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  illustration?: ReactNode;
  className?: string;
}

const EmptyIllustration = ({ icon }: { icon?: ReactNode }) => (
  <div className="relative isolate mb-5">
    <div className="absolute inset-x-6 top-2 h-16 rounded-full bg-primary-soft/60 blur-2xl" aria-hidden />
    <svg
      aria-hidden
      viewBox="0 0 220 120"
      className="h-28 w-52 text-primary/15"
      fill="none"
    >
      <path d="M28 78C40 53 64 34 95 30c28-4 48 8 68 24 12 10 22 23 29 38" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <circle cx="62" cy="77" r="11" fill="currentColor" />
      <circle cx="110" cy="58" r="8" fill="currentColor" />
      <circle cx="156" cy="76" r="14" fill="currentColor" opacity="0.75" />
    </svg>
    <div className="absolute inset-0 grid place-items-center">
      <div className="grid size-14 place-items-center rounded-2xl border border-primary/20 bg-background shadow-card text-primary">
        {icon ?? <Sparkles className="h-5 w-5" />}
      </div>
    </div>
  </div>
);

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center",
        className,
      )}
    >
      {illustration ?? <EmptyIllustration icon={icon} />}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {action}
        {secondaryAction}
      </div>
    </div>
  );
};
