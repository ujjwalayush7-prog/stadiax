/**
 * Core Type Definitions for StadiaX Application.
 * Provides type safety across the fan experience and staff operations platform,
 * covering chat interactions, API contracts, and persona/language configuration.
 *
 * @module types
 */

/**
 * Supported persona types for routing AI behavior.
 * - `'fan'` — Stadium experience assistant for spectators
 * - `'staff'` — Operational intelligence assistant for organizers
 */
export type Persona = 'fan' | 'staff';

/**
 * Supported ISO 639-1 language codes for multilingual assistance.
 * Covers the primary languages spoken at FIFA World Cup 2026 venues.
 */
export type Language = 'en' | 'es' | 'fr' | 'ar' | 'pt' | 'de' | 'zh' | 'ja';

/**
 * Chat message role discriminator.
 * - `'user'` — Message sent by a fan or staff member
 * - `'bot'` — AI-generated response from StadiaBot or Operations AI
 */
export type MessageRole = 'user' | 'bot';

/**
 * Message interface for chat UI components.
 * Used by both FanView and StaffView to render conversation history.
 */
export interface ChatMessage {
  /** Identifies whether the message was sent by the user or the AI */
  role: MessageRole;
  /** The plain-text content of the message */
  text: string;
}

/**
 * Request body schema for the `/api/chat` endpoint.
 * Validated server-side before processing with the Gemini API.
 */
export interface ChatAPIRequest {
  /** The user's message text (max 500 characters) */
  message: string;
  /** The active persona determining AI system prompt behavior */
  persona: Persona;
  /** ISO 639-1 language code for multilingual response (defaults to 'en') */
  language?: Language;
}

/**
 * Successful response body from the `/api/chat` endpoint.
 */
export interface ChatAPIResponse {
  /** The AI-generated reply text */
  reply: string;
}

/**
 * Error response body from the `/api/chat` endpoint.
 */
export interface ChatAPIError {
  /** Human-readable error description */
  error: string;
}

export type IncidentSeverity = 'low' | 'medium' | 'high';

export interface OperationsIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  zone: string;
  status: 'active' | 'monitoring' | 'resolved';
  recommendation: string;
}

export interface OperationsSnapshot {
  match: {
    fixture: string;
    venue: string;
    minute: number;
    score: string;
    weather: string;
    updatedAt: string;
  };
  capacity: {
    current: number;
    maximum: number;
    percentage: number;
    trend: string;
  };
  incidents: OperationsIncident[];
  staff: {
    deployed: number;
    zones: number;
    gap: string;
  };
  transport: {
    parkingCapacity: number;
    metroStatus: string;
    rideshareStatus: string;
    recommendation: string;
  };
  sustainability: {
    wasteDiversion: number;
    target: number;
    energyMw: number;
    recommendation: string;
  };
  accessibility: {
    openRoutes: string[];
    alerts: string[];
    recommendation: string;
  };
}
