import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = ({ height = "h-72" }: { height?: string }) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-6 w-24" />
    </div>
    <div className={`${height} flex items-end gap-2`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${30 + ((i * 13) % 60)}%` }} />
      ))}
    </div>
  </div>
);
