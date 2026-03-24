import Link from 'next/link';
import Image from 'next/image';
import { ProgressBar } from './ui/ProgressBar';
import type { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
        {/* Image placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-brand-100 to-accent-100">
          {campaign.imageUrl ? (
            <Image
              src={campaign.imageUrl}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-200">
                  <svg
                    className="h-6 w-6 text-brand-600"
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
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{campaign.description}</p>

          <div className="mt-4">
            <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
          </div>
        </div>
      </article>
    </Link>
  );
}
