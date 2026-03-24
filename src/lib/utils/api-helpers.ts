/**
 * Shared helpers for API route handlers.
 */
import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error }, { status });
}
