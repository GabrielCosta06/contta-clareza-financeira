import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = ({ withFooter = false }: { withFooter?: boolean }) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="mt-3 h-8 w-32" />
    <Skeleton className="mt-2 h-3 w-40" />
    {withFooter && (
      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
    )}
  </div>
);

export const StatCardSkeletonGrid = ({ count = 3, withFooter = false }: { count?: number; withFooter?: boolean }) => (
  <div className="grid gap-4 md:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <StatCardSkeleton key={i} withFooter={withFooter} />
    ))}
  </div>
);
