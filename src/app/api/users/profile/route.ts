import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';

const log = createLogger('api.users.profile');

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    log.debug({ userId: auth.userId }, 'Fetching user profile');
    const profile = await userService.getProfile(auth.userId);
    return successResponse(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    log.error({ err: error, userId: auth.userId }, 'Profile fetch failed');
    return errorResponse(message, 404);
  }
}
