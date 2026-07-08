'use client';

import { useState } from 'react';
import { Send, Users, AlertTriangle, BatteryCharging, ArrowUpRight } from 'lucide-react';
import styles from './staff.module.css';

export default function StaffDashboard() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'StadiaX Operations AI initialized. How can I assist you with venue management today?' }
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
        body: JSON.stringify({ message: userMessage, persona: 'staff' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + (error.message || 'Error connecting to operations server.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Stats Row */}
      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Users size={20} color="var(--neon-green)" />
            <span>Attendance</span>
          </div>
          <h2>68,402</h2>
          <span className={styles.trend}><ArrowUpRight size={14}/> 94% Capacity</span>
        </div>
        
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <AlertTriangle size={20} color="#f59e0b" />
            <span>Active Incidents</span>
          </div>
          <h2>3</h2>
          <span className={styles.trendNeutral}>Gate 4 Congestion</span>
        </div>
        
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <BatteryCharging size={20} color="var(--fifa-blue)" />
            <span>Energy Usage</span>
          </div>
          <h2>4.2 MW</h2>
          <span className={styles.trendGood}>-12% vs avg</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Operations Chat */}
        <div className={`glass-panel ${styles.chatContainer}`}>
          <div className={styles.chatHeader}>
            <h3>Operations Assistant</h3>
            <span className={styles.aiBadge}>GenAI Staff Mode</span>
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
              placeholder="e.g., Redirect fans from Gate 4 to Gate 6..." 
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
