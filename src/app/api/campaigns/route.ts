import { NextRequest } from 'next/server';
import { campaignService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';
import type { CreateCampaignInput } from '@/types';

export async function GET() {
  try {
    const campaigns = await campaignService.getActive();
    return successResponse(campaigns);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch campaigns';
    return errorResponse(message, 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    const body = (await request.json()) as CreateCampaignInput;

    if (!body.title || !body.description || !body.goalAmount) {
      return errorResponse('Title, description, and goal amount are required');
    }

    if (body.goalAmount <= 0) {
      return errorResponse('Goal amount must be greater than zero');
    }

    const campaign = await campaignService.create(auth.userId, body);
    return successResponse(campaign, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create campaign';
    return errorResponse(message, 500);
  }
}
