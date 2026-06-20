function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 flex flex-col">
      <div className="h-44 rounded-xl bg-white/[0.06] mb-4" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
        <div className="h-5 w-20 rounded-full bg-white/[0.04]" />
      </div>
      <div className="h-5 w-full rounded-lg bg-white/[0.07] mb-2" />
      <div className="h-5 w-4/5 rounded-lg bg-white/[0.07] mb-3" />
      <div className="h-3.5 w-full rounded bg-white/[0.04] mb-1.5" />
      <div className="h-3.5 w-3/4 rounded bg-white/[0.04] mb-1.5" />
      <div className="h-3.5 w-2/3 rounded bg-white/[0.04]" />
    </div>
  );
}

export default function ResourcesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <section className="pt-16 pb-12 border-b border-white/[0.06]">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <div className="h-5 w-24 rounded-full bg-white/[0.08] mx-auto mb-5" />
          <div className="h-10 w-3/4 rounded-xl bg-white/[0.08] mx-auto mb-4" />
          <div className="h-5 w-2/3 rounded-xl bg-white/[0.05] mx-auto mb-2" />
          <div className="h-5 w-1/2 rounded-xl bg-white/[0.05] mx-auto" />
        </div>
      </section>

      {/* Filters skeleton */}
      <section className="pt-8 pb-6 border-b border-white/[0.06]">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-20 rounded-full bg-white/[0.06]" />
            ))}
          </div>
          <div className="mt-6 max-w-md mx-auto h-11 rounded-xl bg-white/[0.06]" />
        </div>
      </section>

      {/* Cards grid */}
      <div className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
