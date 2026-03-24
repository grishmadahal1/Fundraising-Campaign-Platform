/**
 * @jest-environment node
 */
import { successResponse, errorResponse } from '@/lib/utils/api-helpers';

describe('API helpers', () => {
  describe('successResponse', () => {
    it('returns success with data and default 200 status', async () => {
      const res = successResponse({ id: '123' });
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toEqual({ success: true, data: { id: '123' } });
    });

    it('accepts a custom status code', async () => {
      const res = successResponse({ id: '123' }, 201);
      expect(res.status).toBe(201);
    });
  });

  describe('errorResponse', () => {
    it('returns error with message and default 400 status', async () => {
      const res = errorResponse('Something went wrong');
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toEqual({ success: false, error: 'Something went wrong' });
    });

    it('accepts a custom status code', async () => {
      const res = errorResponse('Not found', 404);
      expect(res.status).toBe(404);
    });
  });
});
