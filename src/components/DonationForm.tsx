'use client';

import { useState, type FormEvent } from 'react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { ApiResponse, Donation } from '@/types';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

interface DonationFormProps {
  campaignId: string;
  onSuccess: (donation: Donation) => void;
}

export function DonationForm({ campaignId, onSuccess }: DonationFormProps) {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function selectPreset(value: number) {
    setAmount(String(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiClient<ApiResponse<Donation>>('/api/donations', {
        method: 'POST',
        body: {
          campaignId,
          donorName,
          donorEmail,
          amount: parsedAmount,
          message: message || undefined,
        },
      });

      if (res.data) {
        onSuccess(res.data);
        setShowSuccess(true);
        setDonorName('');
        setDonorEmail('');
        setAmount('');
        setMessage('');

        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process donation');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="donate">
      <h2 className="text-xl font-bold text-gray-900">Make a donation</h2>

      {showSuccess && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          Thank you for your donation! Your support makes a real difference.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Preset amounts */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select amount</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  amount === String(preset)
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Custom amount ($)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          min={1}
          step="any"
        />

        <Input
          label="Your name"
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Jane Smith"
          required
        />

        <Input
          label="Your email"
          type="email"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          placeholder="jane@example.com"
          required
        />

        <Textarea
          label="Leave a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Good luck with your campaign!"
          rows={3}
          maxLength={500}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : `Donate${amount ? ` $${amount}` : ''}`}
        </Button>

        <p className="text-center text-xs text-gray-400">
          This is a demo platform. No real payment is processed.
        </p>
      </form>
    </div>
  );
}
