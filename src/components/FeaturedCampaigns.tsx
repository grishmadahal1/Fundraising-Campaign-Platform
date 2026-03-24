'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CampaignCard } from './CampaignCard';
import { Button } from './ui/Button';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Campaign } from '@/types';

export function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient<ApiResponse<Campaign[]>>('/api/campaigns')
      .then((res) => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {
        // Silently fail — homepage still renders
      })
      .finally(() => setIsLoading(false));
  }, []);

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

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mt-10 rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
            <p className="text-lg text-gray-500">No active campaigns yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Be the first to start fundraising!
            </p>
            <Link href="/campaigns/create" className="mt-6 inline-block">
              <Button size="lg">Start a campaign</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
