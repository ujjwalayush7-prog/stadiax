/**
 * Core Type Definitions for StadiaX Application
 */

/**
 * Message interface for chat UI components
 */
export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}
