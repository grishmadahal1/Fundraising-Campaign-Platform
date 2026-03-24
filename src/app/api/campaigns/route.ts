import { NextRequest } from 'next/server';
import { campaignService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import type { CreateCampaignInput } from '@/types';

const log = createLogger('api.campaigns');

export async function GET() {
  try {
    log.debug('Fetching active campaigns');
    const campaigns = await campaignService.getActive();
    log.info({ count: campaigns.length }, 'Returned active campaigns');
    return successResponse(campaigns);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch campaigns';
    log.error({ err: error }, 'Failed to fetch campaigns');
    return errorResponse(message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    const body = (await request.json()) as CreateCampaignInput;

    if (!body.title || !body.description || !body.goalAmount) {
      log.warn({ userId: auth.userId }, 'Campaign creation with missing fields');
      return errorResponse('Title, description, and goal amount are required');
    }

    if (body.goalAmount <= 0) {
      return errorResponse('Goal amount must be greater than zero');
    }

    log.info({ userId: auth.userId, title: body.title }, 'Creating campaign');
    const campaign = await campaignService.create(auth.userId, body);
    log.info({ campaignId: campaign.id, userId: auth.userId }, 'Campaign created');
    return successResponse(campaign, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create campaign';
    log.error({ err: error, userId: auth.userId }, 'Campaign creation failed');
    return errorResponse(message, 500);
  }
}
