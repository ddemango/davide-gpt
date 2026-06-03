import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center" aria-label="Page not found">
      <div className="container-wide text-center max-w-2xl">
        {/* Big 404 */}
        <div className="font-display text-[8rem] font-bold leading-none text-gradient opacity-30 select-none" aria-hidden="true">
          404
        </div>

        <h1 className="font-display text-3xl font-bold text-white -mt-4 mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          This page doesn&apos;t exist or has been moved. Head back to find what you&apos;re looking for.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowLeft className="h-5 w-5" />}
              iconPosition="left"
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/resources">
            <Button
              variant="secondary"
              size="lg"
              icon={<Search className="h-5 w-5" />}
              iconPosition="left"
            >
              Browse Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
