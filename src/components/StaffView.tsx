'use client';

/**
 * StaffView Component
 * Renders the Staff Operations dashboard with operational metric cards
 * covering all challenge pillars (Crowd Management, Incidents, Energy/Sustainability,
 * Staff Deployment, Transportation) and the Operations AI chatbot for
 * real-time decision support.
 *
 * Uses the shared `useChatBot` hook to eliminate code duplication.
 */

import { Send, Users, Zap, AlertTriangle, ShieldCheck, Bus, Leaf } from 'lucide-react';
import styles from '../app/page.module.css';
import { useChatBot } from '../hooks/useChatBot';

export default function StaffView() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  } = useChatBot({
    persona: 'staff',
    initialMessage: 'Operations AI ready. Current active incidents: Gate 4 Congestion.',
    errorFallback: 'Error connecting to operations server.',
  });

  return (
    <div className={styles.staffContent}>
      <div className={styles.matchInfo}>
        <span
          className={styles.liveBadge}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          <span className="live-indicator"></span> LIVE
        </span>
        <span className={styles.tournament}>FIFA World Cup 2026™</span>
      </div>

      <section className={styles.statsGrid} aria-label="Operational Metrics">
        <div id="stat-capacity" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Users size={20} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Stadium Capacity</span>
          </div>
          <h2 tabIndex={0}>94%</h2>
          <span className={styles.trendGood}>+2% in last 15m (68,402 / 72,000)</span>
        </div>

        <div id="stat-incidents" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <AlertTriangle size={20} color="#f59e0b" aria-hidden="true" />
            <span>Active Incidents</span>
          </div>
          <h2 tabIndex={0} role="status" aria-live="assertive">
            3
          </h2>
          <span className={styles.trendNeutral}>Gate 4 Congestion requires attention</span>
        </div>

        <div id="stat-energy" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Zap size={20} color="var(--neon-green)" aria-hidden="true" />
            <span>Energy Usage</span>
          </div>
          <h2 tabIndex={0}>4.2 MW</h2>
          <span className={styles.trendGood}>-12% from baseline (Optimized)</span>
        </div>

        <div id="stat-staff" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <ShieldCheck size={20} color="var(--primary-purple)" aria-hidden="true" />
            <span>Staff Deployed</span>
          </div>
          <h2 tabIndex={0}>412</h2>
          <span className={styles.trend}>Optimal coverage across 6 zones</span>
        </div>

        <div id="stat-transport" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Bus size={20} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Transportation</span>
          </div>
          <h2 tabIndex={0}>88%</h2>
          <span className={styles.trendNeutral}>
            Parking Lots A, B near capacity — Metro on schedule
          </span>
        </div>

        <div id="stat-sustainability" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Leaf size={20} color="var(--neon-green)" aria-hidden="true" />
            <span>Sustainability</span>
          </div>
          <h2 tabIndex={0}>73%</h2>
          <span className={styles.trendGood}>
            Waste diversion rate — Target: 80%
          </span>
        </div>
      </section>

      <section
        id="staff-chat"
        className={`glass-panel ${styles.chatContainer} ${styles.staffChat}`}
        aria-label="Operations AI Chat"
      >
        <header className={styles.chatHeader}>
          <h3>Operations AI</h3>
          <span className={styles.aiBadge}>Secure Operations Link</span>
        </header>

        <div
          className={styles.chatMessages}
          aria-live="polite"
          aria-atomic="true"
          role="log"
          aria-label="Operations chat history"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}
            >
              <div className={styles.msgBubble}>{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.botMsg}`}>
              <div className={styles.msgBubble}>
                <div
                  className={styles.typingDots}
                  role="status"
                  aria-label="AI is typing..."
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className={styles.chatInput} onSubmit={sendMessage}>
          <label htmlFor="chat-input-staff" className="sr-only">
            Type your message
          </label>
          <input
            id="chat-input-staff"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query operational intelligence..."
            disabled={isLoading}
            aria-label="Query operational intelligence"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={20} aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}
