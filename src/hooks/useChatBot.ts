'use client';

/**
 * Custom hook encapsulating shared chat logic for the StadiaX AI assistants.
 * Eliminates duplication between FanView and StaffView by providing a
 * unified interface for message state, input handling, and API communication.
 *
 * @module useChatBot
 */

import { useState, useCallback } from 'react';
import type { ChatMessage, Persona, Language } from '../types';
import { CHAT_API_PATH } from '../lib/constants';

/**
 * Configuration options for the useChatBot hook.
 */
interface UseChatBotOptions {
  /** The persona type determining AI system prompt behavior */
  persona: Persona;
  /** The initial greeting message displayed to the user */
  initialMessage: string;
  /** Initial language for multilingual support (defaults to 'en') */
  language?: Language;
  /** Fallback error message when the error is not an Error instance */
  errorFallback?: string;
}

/**
 * Return type of the useChatBot hook, providing all state and handlers
 * needed to render and operate a chat interface.
 */
interface UseChatBotReturn {
  /** Array of all chat messages in chronological order */
  messages: ChatMessage[];
  /** Current value of the text input field */
  input: string;
  /** Setter for the text input field value */
  setInput: (value: string) => void;
  /** Whether a request is currently in flight */
  isLoading: boolean;
  /** Currently selected language code */
  language: Language;
  /** Setter for the active language */
  setLanguage: (lang: Language) => void;
  /** Handles form submission — sends the message to the API */
  sendMessage: (e?: React.FormEvent) => Promise<void>;
}

/**
 * Manages chat state and API communication for the StadiaX AI assistant.
 * Handles message submission, loading states, error handling, and
 * multilingual language selection.
 *
 * @param options - Configuration for persona, initial message, and language
 * @returns State values and handlers for rendering the chat UI
 *
 * @example
 * ```tsx
 * const { messages, input, setInput, isLoading, sendMessage } = useChatBot({
 *   persona: 'fan',
 *   initialMessage: 'Welcome! How can I help?',
 * });
 * ```
 */
export function useChatBot({
  persona,
  initialMessage,
  language: initialLanguage = 'en',
  errorFallback = 'Unable to connect to server.',
}: UseChatBotOptions): UseChatBotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: initialMessage },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  /**
   * Sends the current input message to the chat API.
   * Appends user and bot messages to the conversation history,
   * handling loading states and errors gracefully.
   */
  const sendMessage = useCallback(
    async (e?: React.FormEvent): Promise<void> => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = input.trim();
      setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch(CHAT_API_PATH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage, persona, language }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Server error');
        }
        setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : errorFallback;
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'Error: ' + errorMessage },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, persona, language, errorFallback]
  );

  return {
    messages,
    input,
    setInput,
    isLoading,
    language,
    setLanguage,
    sendMessage,
  };
}
