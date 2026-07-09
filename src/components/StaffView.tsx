'use client';

import { useMemo, useState } from 'react';
import {
  Send,
  Users,
  Zap,
  AlertTriangle,
  ShieldCheck,
  Bus,
  Leaf,
  Lock,
  Accessibility,
} from 'lucide-react';
import styles from '../app/page.module.css';
import { useChatBot } from '../hooks/useChatBot';
import { operationsSnapshot } from '../lib/operations';

const DEMO_STAFF_CODE = '2026';

export default function StaffView() {
  const [staffCode, setStaffCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessError, setAccessError] = useState('');
  const { messages, input, setInput, isLoading, sendMessage } = useChatBot({
    persona: 'staff',
    initialMessage:
      'Operations AI ready. Gate 4 congestion is the highest priority. Ask for a deployment plan or accessible reroute.',
    errorFallback: 'Error connecting to operations server.',
  });

  const highPriorityIncident = useMemo(
    () => operationsSnapshot.incidents.find((incident) => incident.severity === 'high'),
    []
  );

  function unlockStaffView(e: React.FormEvent) {
    e.preventDefault();
    if (staffCode.trim() === DEMO_STAFF_CODE) {
      setIsAuthorized(true);
      setAccessError('');
      return;
    }
    setAccessError('Use demo staff code 2026');
  }

  if (!isAuthorized) {
    return (
      <section className={`glass-panel ${styles.accessPanel}`} aria-label="Staff access gate">
        <Lock size={32} color="var(--neon-green)" aria-hidden="true" />
        <div>
          <h2>Staff Operations Access</h2>
          <p>
            Protected demo console for incident response, crowd routing, accessibility
            support, transportation coordination, and sustainability operations.
          </p>
        </div>
        <form className={styles.accessForm} onSubmit={unlockStaffView}>
          <label htmlFor="staff-code" className="sr-only">
            Staff access code
          </label>
          <input
            id="staff-code"
            type="password"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            placeholder="Demo code"
            aria-describedby={accessError ? 'staff-code-error' : undefined}
          />
          <button type="submit">Unlock</button>
        </form>
        {accessError && (
          <p id="staff-code-error" className={styles.accessError} role="alert">
            {accessError}
          </p>
        )}
      </section>
    );
  }

  return (
    <div className={styles.staffContent}>
      <div className={styles.matchInfo}>
        <span
          className={styles.liveBadge}
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          <span className="live-indicator"></span> LIVE OPS
        </span>
        <span className={styles.tournament}>
          {operationsSnapshot.match.fixture} - {operationsSnapshot.match.venue}
        </span>
      </div>

      <section className={styles.statsGrid} aria-label="Operational Metrics">
        <div id="stat-capacity" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Users size={20} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Stadium Capacity</span>
          </div>
          <h2 tabIndex={0}>{operationsSnapshot.capacity.percentage}%</h2>
          <span className={styles.trendGood}>
            {operationsSnapshot.capacity.trend} ({operationsSnapshot.capacity.current.toLocaleString()} /{' '}
            {operationsSnapshot.capacity.maximum.toLocaleString()})
          </span>
        </div>

        <div id="stat-incidents" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <AlertTriangle size={20} color="#f59e0b" aria-hidden="true" />
            <span>Active Incidents</span>
          </div>
          <h2 tabIndex={0} role="status" aria-live="assertive">
            {operationsSnapshot.incidents.length}
          </h2>
          <span className={styles.trendNeutral}>{highPriorityIncident?.title} requires action</span>
        </div>

        <div id="stat-energy" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Zap size={20} color="var(--neon-green)" aria-hidden="true" />
            <span>Energy Usage</span>
          </div>
          <h2 tabIndex={0}>{operationsSnapshot.sustainability.energyMw} MW</h2>
          <span className={styles.trendGood}>Optimized below peak baseline</span>
        </div>

        <div id="stat-staff" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <ShieldCheck size={20} color="var(--primary-purple)" aria-hidden="true" />
            <span>Staff Deployed</span>
          </div>
          <h2 tabIndex={0}>{operationsSnapshot.staff.deployed}</h2>
          <span className={styles.trend}>{operationsSnapshot.staff.gap}</span>
        </div>

        <div id="stat-transport" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Bus size={20} color="var(--fifa-blue)" aria-hidden="true" />
            <span>Transportation</span>
          </div>
          <h2 tabIndex={0}>{operationsSnapshot.transport.parkingCapacity}%</h2>
          <span className={styles.trendNeutral}>{operationsSnapshot.transport.metroStatus}</span>
        </div>

        <div id="stat-sustainability" className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Leaf size={20} color="var(--neon-green)" aria-hidden="true" />
            <span>Sustainability</span>
          </div>
          <h2 tabIndex={0}>{operationsSnapshot.sustainability.wasteDiversion}%</h2>
          <span className={styles.trendGood}>
            Waste diversion - Target: {operationsSnapshot.sustainability.target}%
          </span>
        </div>
      </section>

      <section className={styles.decisionGrid} aria-label="Real-time decision support">
        <article className={`glass-panel ${styles.decisionCard}`}>
          <h3>Priority Action</h3>
          <p>{highPriorityIncident?.recommendation}</p>
        </article>
        <article className={`glass-panel ${styles.decisionCard}`}>
          <h3>Accessible Reroute</h3>
          <p>{operationsSnapshot.accessibility.recommendation}</p>
        </article>
        <article className={`glass-panel ${styles.decisionCard}`}>
          <h3>Transit Control</h3>
          <p>{operationsSnapshot.transport.recommendation}</p>
        </article>
        <article className={`glass-panel ${styles.decisionCard}`}>
          <h3>Sustainability Push</h3>
          <p>{operationsSnapshot.sustainability.recommendation}</p>
        </article>
      </section>

      <section className={styles.incidentList} aria-label="Incident queue">
        <h3>Incident Queue</h3>
        {operationsSnapshot.incidents.map((incident) => (
          <article key={incident.id} className={styles.incidentItem}>
            <div>
              <strong>{incident.title}</strong>
              <span>{incident.zone} - {incident.status}</span>
            </div>
            <span className={`${styles.severityBadge} ${styles[incident.severity]}`}>
              {incident.severity}
            </span>
          </article>
        ))}
        <div className={styles.accessibilityNote}>
          <Accessibility size={18} aria-hidden="true" />
          <span>{operationsSnapshot.accessibility.alerts[0]}</span>
        </div>
      </section>

      <section
        id="staff-chat"
        className={`glass-panel ${styles.chatContainer} ${styles.staffChat}`}
        aria-label="Operations AI Chat"
      >
        <header className={styles.chatHeader}>
          <h3>Operations AI</h3>
          <span className={styles.aiBadge}>Token-ready Operations Link</span>
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
