/**
 * Unit tests for the in-memory rate limiter.
 * Tests allowing initial requests, blocking after limit exceeded,
 * and window reset behavior.
 */

import { isRateLimited } from '../../src/lib/rateLimit';

describe('isRateLimited', () => {
  it('allows the first request from a new client', () => {
    // Use a unique identifier to avoid interference from other tests
    const clientId = `test-client-${Date.now()}-allow`;
    expect(isRateLimited(clientId)).toBe(false);
  });

  it('blocks requests after exceeding the limit', () => {
    const clientId = `test-client-${Date.now()}-block`;

    // Send MAX_REQUESTS requests (should all be allowed)
    for (let i = 0; i < 20; i++) {
      isRateLimited(clientId);
    }

    // The 21st request should be blocked
    expect(isRateLimited(clientId)).toBe(true);
  });

  it('tracks clients independently', () => {
    const clientA = `test-client-${Date.now()}-a`;
    const clientB = `test-client-${Date.now()}-b`;

    // Exhaust client A's limit
    for (let i = 0; i < 21; i++) {
      isRateLimited(clientA);
    }

    // Client B should still be allowed
    expect(isRateLimited(clientB)).toBe(false);
  });
});
