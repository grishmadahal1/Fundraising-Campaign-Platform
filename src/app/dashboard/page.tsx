'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/auth/use-require-auth';
import { apiClient } from '@/lib/api/client';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { ApiResponse, DashboardData } from '@/types';

export default function DashboardPage() {
  const { user, token, isLoading: authLoading } = useRequireAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    apiClient<ApiResponse<DashboardData>>('/api/dashboard', { token })
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-gray-500">Here&apos;s how your campaigns are performing</p>
        </div>
        <Link href="/campaigns/create">
          <Button size="lg">Start new campaign</Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total raised"
          value={`$${(data?.totalRaised ?? 0).toLocaleString()}`}
        />
        <StatCard
          label="Total donors"
          value={String(data?.totalDonors ?? 0)}
        />
        <StatCard
          label="Active campaigns"
          value={String(data?.campaignCount ?? 0)}
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Campaigns */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900">Your campaigns</h2>

          {!data?.campaigns.length ? (
            <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500">You haven&apos;t created any campaigns yet.</p>
              <Link href="/campaigns/create" className="mt-4 inline-block">
                <Button>Create your first campaign</Button>
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.campaigns.map((campaign) => (
                <li
                  key={campaign.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-brand-600"
                      >
                        {campaign.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                        {campaign.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="font-medium text-brand-600 hover:text-brand-500"
                    >
                      View page
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent donations */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900">Recent donations</h2>

          {!data?.recentDonations.length ? (
            <p className="mt-4 text-sm text-gray-500">
              No donations yet. Share your campaign to get started!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.recentDonations.map((donation) => (
                <li
                  key={donation.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                    {donation.donorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {donation.donorName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand-600">
                    ${donation.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
