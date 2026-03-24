import { NextRequest } from 'next/server';
import { dashboardService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';

const log = createLogger('api.dashboard');

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    log.debug({ userId: auth.userId }, 'Fetching dashboard data');
    const data = await dashboardService.getByUserId(auth.userId);
    log.info(
      { userId: auth.userId, campaigns: data.campaignCount, totalRaised: data.totalRaised },
      'Dashboard data loaded'
    );
    return successResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load dashboard';
    log.error({ err: error, userId: auth.userId }, 'Dashboard load failed');
    return errorResponse(message, 500);
  }
}
