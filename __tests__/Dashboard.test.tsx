import { render, screen, fireEvent, act } from '@testing-library/react';
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
});
