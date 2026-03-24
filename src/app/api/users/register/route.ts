import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import { createLogger } from '@/lib/logger';
import type { CreateUserInput } from '@/types';

const log = createLogger('api.users.register');

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserInput;

    if (!body.email || !body.password || !body.name) {
      log.warn('Registration attempt with missing fields');
      return errorResponse('Name, email, and password are required');
    }

    log.info({ email: body.email }, 'Registration attempt');
    const result = await userService.register(body);
    log.info({ userId: result.user.id, email: body.email }, 'User registered successfully');
    return successResponse(result, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    log.error({ err: error }, 'Registration failed: %s', message);
    return errorResponse(message, message.includes('already') ? 409 : 500);
  }
}
