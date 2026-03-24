/**
 * API client for making requests from client components.
 * Centralises fetch logic, auth header injection, and error handling.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? `Request failed with status ${response.status}`);
  }

  return data;
}
