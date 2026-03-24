import Link from 'next/link';
import { Button } from './ui/Button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">
            Peer-to-Peer Fundraising
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Raise funds for the causes that matter
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-brand-100">
            Create your campaign page, share it with your network, and watch the support roll in.
            Every dollar makes a difference in the fight for men&apos;s health.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/campaigns/create">
              <Button variant="secondary" size="lg">
                Start a Campaign
              </Button>
            </Link>
            <Link href="#campaigns">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Browse Campaigns
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-8 border-t border-white/20 pt-8">
            <div>
              <p className="text-3xl font-bold text-white">150+</p>
              <p className="text-sm text-brand-200">Active Campaigns</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$2.4M</p>
              <p className="text-sm text-brand-200">Total Raised</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12K+</p>
              <p className="text-sm text-brand-200">Donors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
