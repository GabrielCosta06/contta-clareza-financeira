import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export const Delta = ({ value, suffix = "%", inverse = false, className }: { value: number; suffix?: string; inverse?: boolean; className?: string }) => {
  const positive = value >= 0;
  const good = inverse ? !positive : positive;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium num", good ? "text-success" : "text-destructive", className)}>
      <Icon className="h-3.5 w-3.5" />
      {positive ? "+" : "−"}{Math.abs(value).toFixed(1).replace(".", ",")}{suffix}
    </span>
  );
};
