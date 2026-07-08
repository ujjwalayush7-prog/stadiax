'use client';

/**
 * UnifiedDashboard Component
 * Root page component hosting the tabbed interface that switches between
 * the Fan Experience view and the Staff Operations view.
 *
 * Implements the WAI-ARIA Tabs pattern with proper tablist, tab, and tabpanel
 * roles, keyboard navigation (ArrowLeft/ArrowRight), and focus management.
 */

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

/* Dynamically import views to improve initial load time (Efficiency) */
const FanView = dynamic(() => import('../components/FanView'), {
  ssr: false,
});

const StaffView = dynamic(() => import('../components/StaffView'), {
  ssr: false,
});

/** Available tab identifiers */
type TabId = 'fan' | 'staff';

/**
 * Tab configuration mapping tab IDs to their display labels.
 * Each entry defines a tab in the dashboard navigation.
 */
const TABS: { id: TabId; label: string }[] = [
  { id: 'fan', label: 'Fan Experience' },
  { id: 'staff', label: 'Staff Operations' },
];

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('fan');

  /**
   * Handles keyboard navigation within the tab list.
   * ArrowRight moves to the next tab, ArrowLeft to the previous,
   * following the WAI-ARIA Tabs pattern.
   */
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTab);
      let newIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % TABS.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = TABS.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      setActiveTab(TABS[newIndex].id);

      /* Focus the newly activated tab button */
      const tabElement = document.getElementById(`tab-${TABS[newIndex].id}`);
      tabElement?.focus();
    },
    [activeTab]
  );

  return (
    <main id="main-content" className={styles.main}>
      <a href="#main-content" className="sr-only">
        Skip to content
      </a>

      <h1 className="sr-only">
        StadiaX — Generative AI Stadium Operations Platform for FIFA World Cup 2026
      </h1>

      <nav
        className={styles.tabsContainer}
        role="tablist"
        aria-label="Dashboard views"
        onKeyDown={handleTabKeyDown}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Suspense
        fallback={
          <div role="status" aria-busy="true">
            Loading dashboard...
          </div>
        }
      >
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {activeTab === 'fan' ? <FanView /> : <StaffView />}
        </div>
      </Suspense>
    </main>
  );
}
