import { NextRequest } from 'next/server';
import { donationService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import type { CreateDonationInput } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const campaignId = request.nextUrl.searchParams.get('campaignId');
    if (!campaignId) {
      return errorResponse('campaignId query parameter is required');
    }

    const donations = await donationService.getByCampaignId(campaignId);
    return successResponse(donations);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donations';
    return errorResponse(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateDonationInput;

    if (!body.campaignId || !body.donorName || !body.donorEmail || !body.amount) {
      return errorResponse('campaignId, donorName, donorEmail, and amount are required');
    }

    if (body.amount <= 0) {
      return errorResponse('Donation amount must be greater than zero');
    }

    const donation = await donationService.create(body);
    return successResponse(donation, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process donation';
    const status = message.includes('not found') ? 404 : message.includes('not accepting') ? 400 : 500;
    return errorResponse(message, status);
  }
}
