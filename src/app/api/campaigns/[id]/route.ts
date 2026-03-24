import { NextRequest } from 'next/server';
import { campaignService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';
import type { UpdateCampaignInput } from '@/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const campaign = await campaignService.getById(id);
    return successResponse(campaign);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Campaign not found';
    return errorResponse(message, 404);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateCampaignInput;
    const campaign = await campaignService.update(id, auth.userId, body);
    return successResponse(campaign);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update campaign';
    const status = message.includes('not found') ? 404 : message.includes('authorised') ? 403 : 500;
    return errorResponse(message, status);
  }
}
