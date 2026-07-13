import { CategoryHeroSkeleton, ProductGridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="animate-fade-in">
      {/* Hero Skeleton */}
      <CategoryHeroSkeleton />

      {/* Subcategories Filter Skeleton */}
      <section className="bg-sandstone/50 border-b border-sandstone">
        <div className="container">
          <div className="flex items-center gap-4 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-20 h-10 bg-sandstone/30 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Sort Bar Skeleton */}
      <section className="bg-white border-b border-sandstone/50">
        <div className="container">
          <div className="flex items-center justify-between py-3">
            <div className="w-48 h-5 bg-sandstone/30 rounded animate-pulse" />
            <div className="w-32 h-10 bg-sandstone/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="section bg-white">
        <div className="container">
          <ProductGridSkeleton count={12} />
        </div>
      </section>
    </div>
  );
}
