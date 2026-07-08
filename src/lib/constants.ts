/**
 * Application-wide constants for the StadiaX platform.
 * Centralizes configuration values, magic numbers, and string literals
 * to improve maintainability and prevent duplication.
 *
 * @module constants
 */

/** Maximum allowed character count for a single user chat message */
export const MAX_MESSAGE_LENGTH = 500;

/** Google Gemini model identifier used for all AI-generated responses */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/** Internal API endpoint path for chat requests */
export const CHAT_API_PATH = '/api/chat';

/**
 * Supported persona types that determine AI system prompt behavior.
 * - FAN: Stadium experience assistant for spectators
 * - STAFF: Operational intelligence assistant for organizers
 */
export const PERSONAS = {
  FAN: 'fan',
  STAFF: 'staff',
} as const;

/**
 * ISO 639-1 language codes supported for multilingual assistance.
 * Covers the primary languages spoken at FIFA World Cup 2026 venues.
 */
export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'fr',
  'ar',
  'pt',
  'de',
  'zh',
  'ja',
] as const;

/** Default language code when none is specified */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Rate limiting configuration for the chat API.
 * Prevents abuse by limiting requests per IP within a sliding window.
 */
export const RATE_LIMIT = {
  /** Duration of the sliding window in milliseconds (60 seconds) */
  WINDOW_MS: 60_000,
  /** Maximum number of requests allowed per window per client */
  MAX_REQUESTS: 20,
} as const;
