export default function ResourceLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <section className="pt-12 pb-16 border-b border-white/[0.06]">
        <div className="container-wide">
          <div className="h-4 w-28 rounded bg-white/[0.06] mb-8" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left */}
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 rounded-full bg-white/[0.07]" />
                ))}
              </div>
              <div className="h-9 w-full rounded-xl bg-white/[0.09] mb-3" />
              <div className="h-9 w-3/4 rounded-xl bg-white/[0.09] mb-6" />
              <div className="h-5 w-full rounded bg-white/[0.05] mb-2" />
              <div className="h-5 w-11/12 rounded bg-white/[0.05] mb-2" />
              <div className="h-5 w-2/3 rounded bg-white/[0.05] mb-8" />
              <div className="flex gap-6 pb-8 border-b border-white/[0.06]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 w-24 rounded bg-white/[0.06]" />
                ))}
              </div>
              <div className="mt-8 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-white/[0.07] flex-shrink-0" />
                    <div className="h-4 w-full rounded bg-white/[0.05]" />
                  </div>
                ))}
              </div>
            </div>
            {/* Right CTA card */}
            <div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                <div className="h-48 rounded-xl bg-white/[0.07] mb-6" />
                <div className="h-9 w-20 rounded-lg bg-white/[0.09] mx-auto mb-1" />
                <div className="h-4 w-28 rounded bg-white/[0.05] mx-auto mb-6" />
                <div className="h-12 w-full rounded-xl bg-white/[0.08] mb-3" />
                <div className="h-3 w-3/4 rounded bg-white/[0.05] mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
