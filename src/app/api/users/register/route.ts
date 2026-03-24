import { NextRequest } from 'next/server';
import { userService } from '@/services';
import { successResponse, errorResponse } from '@/lib/utils';
import type { CreateUserInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateUserInput;

    if (!body.email || !body.password || !body.name) {
      return errorResponse('Name, email, and password are required');
    }

    const result = await userService.register(body);
    return successResponse(result, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return errorResponse(message, message.includes('already') ? 409 : 500);
  }
}
