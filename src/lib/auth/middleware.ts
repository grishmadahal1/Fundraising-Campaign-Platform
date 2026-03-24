/**
 * Auth middleware for protected API routes.
 * Extracts and verifies the JWT from the Authorization header.
 */
import { NextRequest } from 'next/server';
import { verifyToken, type TokenPayload } from './jwt';
import { errorResponse } from '@/lib/utils/api-helpers';

export async function authenticate(
  request: NextRequest
): Promise<TokenPayload | ReturnType<typeof errorResponse>> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Missing or invalid authorization header', 401);
  }

  try {
    const token = authHeader.slice(7);
    return await verifyToken(token);
  } catch {
    return errorResponse('Invalid or expired token', 401);
  }
}

export function isTokenPayload(
  result: TokenPayload | ReturnType<typeof errorResponse>
): result is TokenPayload {
  return 'userId' in result;
}
