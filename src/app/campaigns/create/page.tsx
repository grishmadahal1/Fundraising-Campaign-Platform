'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth/use-require-auth';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { ApiResponse, Campaign } from '@/types';

export default function CreateCampaignPage() {
  const { token, isLoading } = useRequireAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const goal = parseFloat(goalAmount);
    if (isNaN(goal) || goal <= 0) {
      setError('Please enter a valid goal amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiClient<ApiResponse<Campaign>>('/api/campaigns', {
        method: 'POST',
        token: token ?? undefined,
        body: { title, description, goalAmount: goal },
      });

      if (res.data) {
        router.push(`/campaigns/${res.data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Start your campaign</h1>
        <p className="mt-2 text-gray-500">
          Tell your story and set a fundraising goal. You can always edit these details later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <Input
          label="Campaign title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mo'vember Marathon Challenge"
          required
          maxLength={100}
        />

        <Textarea
          label="Tell your story"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why are you fundraising? What impact will donations make? Share your motivation..."
          required
          rows={6}
          maxLength={2000}
        />

        <Input
          label="Fundraising goal ($)"
          type="number"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          placeholder="5000"
          required
          min={1}
          step="any"
        />

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Launch campaign'}
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
