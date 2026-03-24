import { CampaignCard } from './CampaignCard';
import type { Campaign } from '@/types';

/**
 * Hardcoded sample campaigns for the initial build.
 * These will be replaced with real data from the API once
 * the campaign creation flow is built.
 */
const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'sample-1',
    userId: 'user-1',
    title: "Mo'vember Marathon Challenge",
    description:
      "I'm running a marathon this November to raise funds for men's mental health awareness. Every kilometre counts, and every dollar helps fund vital research and support programs.",
    goalAmount: 5000,
    currentAmount: 3250,
    status: 'active',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'sample-2',
    userId: 'user-2',
    title: 'Grow a Mo, Save a Bro',
    description:
      "Growing a moustache and raising awareness for prostate cancer research. Help me reach my goal and let's make a difference together.",
    goalAmount: 2000,
    currentAmount: 1800,
    status: 'active',
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
  },
  {
    id: 'sample-3',
    userId: 'user-3',
    title: 'Cycling for Mental Health',
    description:
      "I'm cycling 500km to raise awareness about men's mental health. Depression and anxiety affect millions of men — let's break the stigma.",
    goalAmount: 3000,
    currentAmount: 750,
    status: 'active',
    createdAt: '2024-11-05T00:00:00Z',
    updatedAt: '2024-11-12T00:00:00Z',
  },
  {
    id: 'sample-4',
    userId: 'user-4',
    title: "Dad's Health Matters",
    description:
      "Fundraising in honour of my dad's cancer battle. All proceeds go towards early detection programs that save lives.",
    goalAmount: 10000,
    currentAmount: 6420,
    status: 'active',
    createdAt: '2024-10-28T00:00:00Z',
    updatedAt: '2024-11-14T00:00:00Z',
  },
  {
    id: 'sample-5',
    userId: 'user-5',
    title: 'Shave It Off Challenge',
    description:
      "If I hit my goal, I'm shaving my head live on stream! All funds support men's health initiatives in our local community.",
    goalAmount: 1500,
    currentAmount: 1500,
    status: 'active',
    createdAt: '2024-11-02T00:00:00Z',
    updatedAt: '2024-11-13T00:00:00Z',
  },
  {
    id: 'sample-6',
    userId: 'user-6',
    title: 'Tech Bros for Testicular Health',
    description:
      "Our dev team is fundraising together for testicular cancer research. We're matching every donation dollar-for-dollar.",
    goalAmount: 8000,
    currentAmount: 4200,
    status: 'active',
    createdAt: '2024-11-03T00:00:00Z',
    updatedAt: '2024-11-11T00:00:00Z',
  },
];

export function FeaturedCampaigns() {
  return (
    <section id="campaigns" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Active campaigns
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Support a fundraiser or start your own
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CAMPAIGNS.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}
