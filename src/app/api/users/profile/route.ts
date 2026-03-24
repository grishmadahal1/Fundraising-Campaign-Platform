import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { authenticate, isTokenPayload } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const auth = await authenticate(request);
  if (!isTokenPayload(auth)) return auth;

  try {
    const profile = await userService.getProfile(auth.userId);
    return successResponse(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return errorResponse(message, 404);
  }
}
