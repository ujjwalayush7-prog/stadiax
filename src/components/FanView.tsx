'use client';

/**
 * FanView Component
 * Renders the Fan Experience dashboard with live match scores, quick action
 * buttons covering all challenge pillars (Navigation, Food, Transport,
 * Accessibility, Sustainability), and the StadiaBot AI chatbot with
 * multilingual support.
 *
 * Uses the shared `useChatBot` hook to eliminate code duplication.
 */

import Image from 'next/image';
import { Send, MapPin, Coffee, Bus, Accessibility, Compass, Leaf } from 'lucide-react';
import styles from '../app/page.module.css';
import { useChatBot } from '../hooks/useChatBot';

export default function FanView() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    language,
    setLanguage,
    sendMessage,
  } = useChatBot({
    persona: 'fan',
    initialMessage:
      'Welcome to StadiaX! How can I assist you with your match day experience today?',
    errorFallback: 'Unable to connect to servers.',
  });

  return (
    <>
      <section
        id="fan-score-panel"
        className={`glass-panel ${styles.scorePanel}`}
        aria-label="Live Match Score"
      >
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
        <div className={styles.teams}>
          <div className={styles.team}>
            <Image
              src="https://flagcdn.com/w160/us.png"
              alt="USA Flag"
              width={60}
              height={40}
              className={styles.flag}
              priority
            />
            <h2>USA</h2>
          </div>
          <div className={styles.score}>
            <h1 tabIndex={0}>2 - 1</h1>
            <span>78&apos;</span>
          </div>
          <div className={styles.team}>
            <Image
              src="https://flagcdn.com/w160/gb-eng.png"
              alt="England Flag"
              width={60}
              height={40}
              className={styles.flag}
              priority
            />
            <h2>ENG</h2>
          </div>
        </div>
      </section>

      <section className={styles.mainContent} aria-label="Quick Actions and Chat">
        <nav className={styles.quickActions} aria-label="Quick action buttons">
          <button
            id="action-navigate"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() => setInput('How do I get to my seat in Section 214, Row F?')}
            aria-label="Navigate to Seat"
          >
            <Compass size={24} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Navigate</span>
          </button>
          <button
            id="action-restrooms"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() => setInput('Where is the nearest restroom from Block C?')}
            aria-label="Find Restrooms"
          >
            <MapPin size={24} color="var(--neon-green)" aria-hidden="true" />
            <span>Find Restrooms</span>
          </button>
          <button
            id="action-food"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() => setInput('What food options are available right now?')}
            aria-label="Find Food and Drinks"
          >
            <Coffee size={24} color="#f59e0b" aria-hidden="true" />
            <span>Food &amp; Drinks</span>
          </button>
          <button
            id="action-transport"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() => setInput('What are the sustainable transport options after the match?')}
            aria-label="Find Transport"
          >
            <Bus size={24} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Transport</span>
          </button>
          <button
            id="action-accessibility"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() => setInput('I need wheelchair accessible routes to my seat.')}
            aria-label="Find Accessibility options"
          >
            <Accessibility size={24} color="var(--primary-purple)" aria-hidden="true" />
            <span>Accessibility</span>
          </button>
          <button
            id="action-sustainability"
            className={`glass-panel ${styles.actionBtn}`}
            onClick={() =>
              setInput(
                'What eco-friendly and sustainability initiatives are available at this stadium?'
              )
            }
            aria-label="Sustainability and Eco-friendly Tips"
          >
            <Leaf size={24} color="var(--neon-green)" aria-hidden="true" />
            <span>Eco Tips</span>
          </button>
        </nav>

        <div id="fan-chat" className={`glass-panel ${styles.chatContainer}`}>
          <header className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <h3>StadiaBot</h3>
              <span className={styles.aiBadge}>Powered by Gemini 2.5 Flash</span>
            </div>
            <select
              id="language-select"
              aria-label="Select Language for multilingual assistance"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as 'en' | 'es' | 'fr' | 'ar')
              }
              className={styles.languageSelect}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
              <option value="pt">PT</option>
              <option value="de">DE</option>
              <option value="zh">ZH</option>
              <option value="ja">JA</option>
            </select>
          </header>

          <div
            className={styles.chatMessages}
            aria-live="polite"
            aria-atomic="true"
            role="log"
            aria-label="Chat conversation history"
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
            <label htmlFor="chat-input-fan" className="sr-only">
              Type your message
            </label>
            <input
              id="chat-input-fan"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              aria-label="Message StadiaBot"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
