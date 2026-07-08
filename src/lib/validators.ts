/**
 * Request validation utilities for the StadiaX API.
 * Provides structured, type-safe validation of incoming request bodies
 * without requiring external schema libraries.
 *
 * @module validators
 */

import { MAX_MESSAGE_LENGTH, SUPPORTED_LANGUAGES } from './constants';

/**
 * Result of a validation operation.
 * When invalid, includes a human-readable error description.
 */
export interface ValidationResult {
  /** Whether the input passed all validation checks */
  valid: boolean;
  /** Error message describing the first validation failure, if any */
  error?: string;
}

/**
 * Validates an incoming chat API request body.
 * Checks for required fields, correct types, length constraints,
 * and allowed values for persona and language.
 *
 * @param body - The raw parsed request body (unknown shape)
 * @returns A ValidationResult indicating pass/fail with an error message
 *
 * @example
 * ```ts
 * const result = validateChatRequest(await req.json());
 * if (!result.valid) {
 *   return NextResponse.json({ error: result.error }, { status: 400 });
 * }
 * ```
 */
export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const { message, persona, language } = body as Record<string, unknown>;

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Valid message string is required' };
  }

  if (message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  if (!persona || (persona !== 'fan' && persona !== 'staff')) {
    return { valid: false, error: 'Persona must be "fan" or "staff"' };
  }

  if (
    language !== undefined &&
    (typeof language !== 'string' ||
      !SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number]))
  ) {
    return {
      valid: false,
      error: `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`,
    };
  }

  return { valid: true };
}
