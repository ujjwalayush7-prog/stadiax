'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Send, MapPin, Coffee, Bus, Accessibility } from 'lucide-react';
import styles from '../app/page.module.css';

import { ChatMessage } from '../types';

/**
 * FanView Component
 * Renders the Fan Experience dashboard with live scores, quick actions, and the StadiaBot AI.
 * Optimizes performance by using useCallback for the chat submission function.
 */
export default function FanView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Welcome to StadiaX! How can I assist you with your match day experience today?' }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles sending a message to the Gemini backend API.
   * Wrapped in useCallback to prevent unnecessary re-renders.
   */
  const sendMessage = useCallback(async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, persona: 'fan' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to connect to servers.';
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <>
      <section className={`glass-panel ${styles.scorePanel}`} aria-label="Live Match Score">
        <div className={styles.matchInfo}>
          <span className={styles.liveBadge} role="status" aria-live="assertive" aria-atomic="true"><span className="live-indicator"></span> LIVE</span>
          <span className={styles.tournament}>FIFA World Cup 2026™</span>
        </div>
        <div className={styles.teams}>
          <div className={styles.team}>
            <Image src="https://flagcdn.com/w160/us.png" alt="USA Flag" width={60} height={40} className={styles.flag} priority />
            <h2>USA</h2>
          </div>
          <div className={styles.score}>
            <h1 tabIndex={0}>2 - 1</h1>
            <span>78&apos;</span>
          </div>
          <div className={styles.team}>
            <Image src="https://flagcdn.com/w160/gb-eng.png" alt="England Flag" width={60} height={40} className={styles.flag} priority />
            <h2>ENG</h2>
          </div>
        </div>
      </section>

      <section className={styles.mainContent} aria-label="Quick Actions and Chat">
        <nav className={styles.quickActions} aria-label="Quick action buttons">
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('Where is the nearest restroom from Block C?')} aria-label="Find Restrooms">
            <MapPin size={24} color="var(--neon-green)" aria-hidden="true" />
            <span>Find Restrooms</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('What food options are available right now?')} aria-label="Find Food and Drinks">
            <Coffee size={24} color="#f59e0b" aria-hidden="true" />
            <span>Food & Drinks</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('What are the sustainable transport options after the match?')} aria-label="Find Transport">
            <Bus size={24} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Transport</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('I need wheelchair accessible routes.')} aria-label="Find Accessibility options">
            <Accessibility size={24} color="var(--primary-purple)" aria-hidden="true" />
            <span>Accessibility</span>
          </button>
        </nav>

        <div className={`glass-panel ${styles.chatContainer}`}>
          <header className={styles.chatHeader}>
            <h3>StadiaBot</h3>
            <span className={styles.aiBadge}>Powered by Gemini 2.5 Flash</span>
          </header>
          
          <div className={styles.chatMessages} aria-live="polite" aria-atomic="true">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}>
                <div className={styles.msgBubble}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMsg}`}>
                <div className={styles.msgBubble}>
                  <div className={styles.typingDots} aria-label="AI is typing...">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className={styles.chatInput} onSubmit={sendMessage}>
            <label htmlFor="chat-input-fan" className="sr-only">Type your message</label>
            <input 
              id="chat-input-fan"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              disabled={isLoading}
              aria-label="Message StadiaBot"
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <Send size={20} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
