import { HeroSkeleton, CategoriesGridSkeleton, ProductGridSkeleton, TestimonialsSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="animate-fade-in">
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Trust Bar Skeleton */}
      <section className="bg-sandstone/30 border-y border-sandstone">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sandstone/50 rounded-full animate-pulse" />
                <div className="w-24 h-4 bg-sandstone/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <div className="w-48 h-8 bg-sandstone/30 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="w-64 h-5 bg-sandstone/30 rounded mx-auto animate-pulse" />
          </div>
          <CategoriesGridSkeleton count={8} />
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className="section bg-sandstone/20">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-2">
              <div className="w-56 h-8 bg-sandstone/30 rounded-lg animate-pulse" />
              <div className="w-40 h-5 bg-sandstone/30 rounded animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-sandstone/30 rounded-lg animate-pulse" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>

      {/* Why Choose Us Skeleton */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-10">
            <div className="w-48 h-8 bg-sandstone/30 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="w-64 h-5 bg-sandstone/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-sandstone/30 rounded-full mx-auto animate-pulse" />
                <div className="w-32 h-5 bg-sandstone/30 rounded mx-auto animate-pulse" />
                <div className="w-full h-14 bg-sandstone/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="section bg-sandstone/20">
        <div className="container">
          <div className="text-center mb-10">
            <div className="w-48 h-8 bg-sandstone/30 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="w-64 h-5 bg-sandstone/30 rounded mx-auto animate-pulse" />
          </div>
          <TestimonialsSkeleton count={3} />
        </div>
      </section>
    </div>
  );
}
