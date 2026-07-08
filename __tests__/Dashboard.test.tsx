/**
 * Tests for the UnifiedDashboard page component.
 * Verifies tab rendering, switching, ARIA tab pattern, and keyboard navigation.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import UnifiedDashboard from '../src/app/page';

// Mock dynamic components explicitly
jest.mock('../src/components/FanView', () => {
  return function MockFanView() {
    return <div>StadiaBot</div>;
  };
});

jest.mock('../src/components/StaffView', () => {
  return function MockStaffView() {
    return <div>Operations AI</div>;
  };
});

describe('UnifiedDashboard', () => {
  it('renders Fan Experience tab by default', async () => {
    render(<UnifiedDashboard />);

    const fanTab = screen.getByRole('tab', { name: /Fan Experience/i });
    expect(fanTab).toBeInTheDocument();
    expect(fanTab).toHaveAttribute('aria-selected', 'true');

    // Check for mocked fan content
    expect(await screen.findByText('StadiaBot')).toBeInTheDocument();
  });

  it('switches to Staff Operations tab when clicked', async () => {
    render(<UnifiedDashboard />);

    const staffTab = screen.getByRole('tab', { name: /Staff Operations/i });
    fireEvent.click(staffTab);

    expect(staffTab).toHaveAttribute('aria-selected', 'true');

    // Check for mocked staff content
    expect(await screen.findByText('Operations AI')).toBeInTheDocument();
  });

  it('renders a proper tablist container', () => {
    render(<UnifiedDashboard />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute('aria-label', 'Dashboard views');
  });

  it('renders tabpanel with correct aria linkage', async () => {
    render(<UnifiedDashboard />);

    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toBeInTheDocument();
    expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-fan');
  });

  it('has proper aria-controls on tab buttons', () => {
    render(<UnifiedDashboard />);

    const fanTab = screen.getByRole('tab', { name: /Fan Experience/i });
    expect(fanTab).toHaveAttribute('aria-controls', 'tabpanel-fan');
    expect(fanTab).toHaveAttribute('id', 'tab-fan');
  });

  it('switches tabs with ArrowRight keyboard navigation', async () => {
    render(<UnifiedDashboard />);

    const fanTab = screen.getByRole('tab', { name: /Fan Experience/i });
    fanTab.focus();

    // Press ArrowRight to move to Staff tab
    fireEvent.keyDown(fanTab.parentElement!, { key: 'ArrowRight' });

    const staffTab = screen.getByRole('tab', { name: /Staff Operations/i });
    expect(staffTab).toHaveAttribute('aria-selected', 'true');

    expect(await screen.findByText('Operations AI')).toBeInTheDocument();
  });

  it('renders a visually hidden h1 for accessibility', () => {
    render(<UnifiedDashboard />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toMatch(/StadiaX/i);
  });
});
