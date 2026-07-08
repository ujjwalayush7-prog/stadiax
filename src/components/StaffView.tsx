'use client';

import { useState, useCallback } from 'react';
import { Send, Users, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import styles from '../app/page.module.css';

import { ChatMessage } from '../types';

/**
 * StaffView Component
 * Renders the Staff Operations dashboard with operational metrics and Operations AI.
 * Optimizes performance by using useCallback for the chat submission function.
 */
export default function StaffView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Operations AI ready. Current active incidents: Gate 4 Congestion.' }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles sending a message to the Gemini backend API for staff.
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
        body: JSON.stringify({ message: userMessage, persona: 'staff' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error connecting to operations server.';
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className={styles.staffContent}>
      <div className={styles.matchInfo}>
        <span className={styles.liveBadge} role="status" aria-live="assertive" aria-atomic="true"><span className="live-indicator"></span> LIVE</span>
        <span className={styles.tournament}>FIFA World Cup 2026™</span>
      </div>
      <section className={styles.statsGrid} aria-label="Operational Metrics">
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Users size={20} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Stadium Capacity</span>
          </div>
          <h2 tabIndex={0}>94%</h2>
          <span className={styles.trendGood}>+2% in last 15m (68,402 / 72,000)</span>
        </div>
        
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <AlertTriangle size={20} color="#f59e0b" aria-hidden="true" />
            <span>Active Incidents</span>
          </div>
          <h2 tabIndex={0} role="status" aria-live="assertive">3</h2>
          <span className={styles.trendNeutral}>Gate 4 Congestion requires attention</span>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Zap size={20} color="var(--neon-green)" aria-hidden="true" />
            <span>Energy Usage</span>
          </div>
          <h2 tabIndex={0}>4.2 MW</h2>
          <span className={styles.trendGood}>-12% from baseline (Optimized)</span>
        </div>

        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <ShieldCheck size={20} color="var(--primary-purple)" aria-hidden="true" />
            <span>Staff Deployed</span>
          </div>
          <h2 tabIndex={0}>412</h2>
          <span className={styles.trend}>Optimal coverage</span>
        </div>
      </section>

      <section className={`glass-panel ${styles.chatContainer} ${styles.staffChat}`} aria-label="Operations AI Chat">
        <header className={styles.chatHeader}>
          <h3>Operations AI</h3>
          <span className={styles.aiBadge}>Secure Operations Link</span>
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
          <label htmlFor="chat-input-staff" className="sr-only">Type your message</label>
          <input 
            id="chat-input-staff"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query operational intelligence..." 
            disabled={isLoading}
            aria-label="Query operational intelligence"
          />
          <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
            <Send size={20} aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}
