/**
 * In-memory rate limiter for API routes.
 * Tracks request counts per unique client identifier within a
 * configurable sliding time window to prevent abuse.
 *
 * @module rateLimit
 */

import { RATE_LIMIT } from './constants';

/**
 * Internal tracking entry for a single client.
 */
interface RateLimitEntry {
  /** Number of requests made in the current window */
  count: number;
  /** Timestamp (ms) when the current window expires */
  resetAt: number;
}

/** In-memory store mapping client identifiers to their rate limit state */
const store = new Map<string, RateLimitEntry>();

/**
 * Determines whether a given client has exceeded the configured rate limit.
 * Automatically resets counters when the time window expires.
 *
 * @param identifier - Unique client identifier, typically an IP address
 * @returns `true` if the request should be blocked (rate limit exceeded),
 *          `false` if the request is within the allowed limit
 *
 * @example
 * ```ts
 * const clientIp = req.headers.get('x-forwarded-for') ?? 'unknown';
 * if (isRateLimited(clientIp)) {
 *   return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 * }
 * ```
 */
export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT.WINDOW_MS,
    });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.MAX_REQUESTS;
}
