import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import type { LoginInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginInput;

    if (!body.email || !body.password) {
      return errorResponse('Email and password are required');
    }

    const result = await userService.login(body);
    return successResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return errorResponse(message, 401);
  }
}
