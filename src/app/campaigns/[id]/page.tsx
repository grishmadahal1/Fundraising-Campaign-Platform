'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { ApiResponse, CampaignWithDonorCount, Donation } from '@/types';

export default function CampaignPage() {
  const params = useParams<{ id: string }>();

  const [campaign, setCampaign] = useState<CampaignWithDonorCount | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;

    async function fetchData() {
      try {
        const [campaignRes, donationsRes] = await Promise.all([
          apiClient<ApiResponse<CampaignWithDonorCount>>(`/api/campaigns/${params.id}`),
          apiClient<ApiResponse<Donation[]>>(`/api/donations?campaignId=${params.id}`),
        ]);

        if (campaignRes.data) setCampaign(campaignRes.data);
        if (donationsRes.data) setDonations(donationsRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaign');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Campaign not found</h1>
        <p className="text-gray-500">{error || 'This campaign may have been removed.'}</p>
        <Link href="/">
          <Button variant="outline">Back to campaigns</Button>
        </Link>
      </div>
    );
  }

  const daysActive = Math.max(
    1,
    Math.floor((Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Campaign image placeholder */}
          <div className="aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-accent-100">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-200">
                  <svg
                    className="h-8 w-8 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-bold text-gray-900">{campaign.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {campaign.status}
            </span>
          </div>

          <div className="mt-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
            {campaign.description}
          </div>

          {/* Recent donations */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900">
              Recent donations ({donations.length})
            </h2>

            {donations.length === 0 ? (
              <p className="mt-4 text-gray-500">
                No donations yet. Be the first to support this campaign!
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-gray-100">
                {donations.map((donation) => (
                  <li key={donation.id} className="flex items-start gap-4 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {donation.donorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{donation.donorName}</p>
                        <p className="font-semibold text-brand-600">
                          ${donation.amount.toLocaleString()}
                        </p>
                      </div>
                      {donation.message && (
                        <p className="mt-1 text-sm text-gray-500">{donation.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{campaign.donorCount}</p>
                <p className="text-xs text-gray-500">donors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{daysActive}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(campaign.currentAmount / daysActive).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">per day</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/campaigns/${campaign.id}#donate`}>
                <Button className="w-full" size="lg">
                  Donate now
                </Button>
              </Link>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full" size="md">
                Share campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
