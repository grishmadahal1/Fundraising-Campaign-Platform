import { NextRequest } from 'next/server';
import { dashboardService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    const data = await dashboardService.getByUserId(auth.userId);
    return successResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load dashboard';
    return errorResponse(message, 500);
  }
}
