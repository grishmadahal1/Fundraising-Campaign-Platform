import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import type { LoginInput } from '@/types';

const log = createLogger('api.users.login');

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginInput;

    if (!body.email || !body.password) {
      log.warn('Login attempt with missing fields');
      return errorResponse('Email and password are required');
    }

    log.info({ email: body.email }, 'Login attempt');
    const result = await userService.login(body);
    log.info({ userId: result.user.id }, 'Login successful');
    return successResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    log.warn({ err: error }, 'Login failed: %s', message);
    return errorResponse(message, 401);
  }
}
