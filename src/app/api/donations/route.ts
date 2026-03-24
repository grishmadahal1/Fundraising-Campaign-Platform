import { NextRequest } from 'next/server';
import { donationService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import type { CreateDonationInput } from '@/types';

const log = createLogger('api.donations');

export async function GET(request: NextRequest) {
  try {
    const campaignId = request.nextUrl.searchParams.get('campaignId');
    if (!campaignId) {
      return errorResponse('campaignId query parameter is required');
    }

    log.debug({ campaignId }, 'Fetching donations');
    const donations = await donationService.getByCampaignId(campaignId);
    log.info({ campaignId, count: donations.length }, 'Returned donations');
    return successResponse(donations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donations';
    log.error({ err: error }, 'Failed to fetch donations');
    return errorResponse(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateDonationInput;

    if (!body.campaignId || !body.donorName || !body.donorEmail || !body.amount) {
      log.warn('Donation attempt with missing fields');
      return errorResponse('campaignId, donorName, donorEmail, and amount are required');
    }

    if (body.amount <= 0) {
      return errorResponse('Donation amount must be greater than zero');
    }

    log.info({ campaignId: body.campaignId, amount: body.amount, donor: body.donorName }, 'Processing donation');
    const donation = await donationService.create(body);
    log.info({ donationId: donation.id, campaignId: body.campaignId, amount: body.amount }, 'Donation processed');
    return successResponse(donation, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process donation';
    const status = message.includes('not found') ? 404 : message.includes('not accepting') ? 400 : 500;
    log.error({ err: error }, 'Donation failed: %s', message);
    return errorResponse(message, status);
  }
}
