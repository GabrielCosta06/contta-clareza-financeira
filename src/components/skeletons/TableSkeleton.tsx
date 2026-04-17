import { Skeleton } from "@/components/ui/skeleton";

export const TableSkeleton = ({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="rounded-lg border border-border bg-card overflow-hidden">
    <div className="hidden md:block">
      <div className="px-4 py-3 bg-muted/40 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className="h-3 w-20" />)}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-4 py-4 border-t grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((_, c) => <Skeleton key={c} className="h-4" style={{ width: `${50 + ((r + c) * 11) % 40}%` }} />)}
        </div>
      ))}
    </div>
    <ul className="md:hidden divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <li key={r} className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </li>
      ))}
    </ul>
  </div>
);
