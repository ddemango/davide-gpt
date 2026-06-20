export default function BlogPostLoading() {
  return (
    <div className="animate-pulse">
      {/* Article header */}
      <section className="pt-12 pb-12 border-b border-white/[0.06]">
        <div className="container-wide max-w-4xl">
          <div className="h-4 w-24 rounded bg-white/[0.06] mb-8" />
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-20 rounded-full bg-white/[0.08]" />
            <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
            <div className="h-6 w-24 rounded-full bg-white/[0.06]" />
          </div>
          <div className="h-10 w-full rounded-xl bg-white/[0.09] mb-3" />
          <div className="h-10 w-4/5 rounded-xl bg-white/[0.09] mb-3" />
          <div className="h-10 w-2/3 rounded-xl bg-white/[0.09] mb-6" />
          <div className="h-6 w-full rounded-lg bg-white/[0.05] mb-2" />
          <div className="h-6 w-3/4 rounded-lg bg-white/[0.05] mb-8" />
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-white/[0.08]" />
            <div className="h-4 w-20 rounded bg-white/[0.06] self-center" />
            <div className="h-4 w-24 rounded bg-white/[0.05] self-center" />
            <div className="h-4 w-16 rounded bg-white/[0.05] self-center" />
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 max-w-6xl mx-auto">
            {/* Content */}
            <div className="lg:col-span-3 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full rounded bg-white/[0.06]" />
                  <div className="h-4 w-11/12 rounded bg-white/[0.05]" />
                  <div className="h-4 w-4/5 rounded bg-white/[0.05]" />
                  {i % 3 === 0 && <div className="h-8" />}
                </div>
              ))}
            </div>
            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
                <div className="h-4 w-28 rounded bg-white/[0.07] mb-4" />
                <div className="flex gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-white/[0.08] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-white/[0.07]" />
                    <div className="h-3 w-3/4 rounded bg-white/[0.05]" />
                  </div>
                </div>
                <div className="h-3 w-full rounded bg-white/[0.05] mb-1.5" />
                <div className="h-3 w-4/5 rounded bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
