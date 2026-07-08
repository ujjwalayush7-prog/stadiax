'use client';

import { useState } from 'react';
import { Send, MapPin, Coffee, Bus, Accessibility } from 'lucide-react';
import styles from './fan.module.css';

export default function FanDashboard() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Welcome to StadiaX! How can I assist you with your match day experience today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
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
    } catch (error: any) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + (error.message || 'Unable to connect to servers.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Live Score Panel */}
      <div className={`glass-panel ${styles.scorePanel}`}>
        <div className={styles.matchInfo}>
          <span className={styles.liveBadge}><span className="live-indicator"></span> LIVE</span>
          <span className={styles.tournament}>FIFA World Cup 2026™</span>
        </div>
        <div className={styles.teams}>
          <div className={styles.team}>
            <img src="https://flagcdn.com/w160/us.png" alt="USA Flag" className={styles.flag} />
            <h2>USA</h2>
          </div>
          <div className={styles.score}>
            <h1>2 - 1</h1>
            <span>78&apos;</span>
          </div>
          <div className={styles.team}>
            <img src="https://flagcdn.com/w160/gb-eng.png" alt="England Flag" className={styles.flag} />
            <h2>ENG</h2>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('Where is the nearest restroom from Block C?')}>
            <MapPin size={24} color="var(--neon-green)" />
            <span>Find Restrooms</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('What food options are available right now?')}>
            <Coffee size={24} color="#f59e0b" />
            <span>Food & Drinks</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('What are the sustainable transport options after the match?')}>
            <Bus size={24} color="var(--fifa-blue)" />
            <span>Transport</span>
          </button>
          <button className={`glass-panel ${styles.actionBtn}`} onClick={() => setInput('I need wheelchair accessible routes.')}>
            <Accessibility size={24} color="var(--primary-purple)" />
            <span>Accessibility</span>
          </button>
        </div>

        {/* StadiaBot Chat */}
        <div className={`glass-panel ${styles.chatContainer}`}>
          <div className={styles.chatHeader}>
            <h3>StadiaBot</h3>
            <span className={styles.aiBadge}>Powered by Gemini 2.5 Flash</span>
          </div>
          
          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.botMsg}`}>
                <div className={styles.msgBubble}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMsg}`}>
                <div className={styles.msgBubble}>
                  <div className={styles.typingDots}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className={styles.chatInput} onSubmit={sendMessage}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
