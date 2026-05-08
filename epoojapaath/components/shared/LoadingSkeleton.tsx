export function CardSkeleton() {
  return (
    <div className="card-devotional animate-pulse">
      <div className="skeleton-shimmer h-48 rounded-xl mb-4" />
      <div className="skeleton-shimmer h-4 rounded w-3/4 mb-2" />
      <div className="skeleton-shimmer h-3 rounded w-1/2 mb-4" />
      <div className="skeleton-shimmer h-3 rounded w-full mb-1" />
      <div className="skeleton-shimmer h-3 rounded w-5/6" />
    </div>
  );
}

export function TempleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="section-padding max-w-7xl mx-auto">
      <div className="skeleton-shimmer h-8 rounded w-64 mx-auto mb-4" />
      <div className="skeleton-shimmer h-4 rounded w-96 mx-auto mb-12" />
      <TempleGridSkeleton />
    </div>
  );
}
