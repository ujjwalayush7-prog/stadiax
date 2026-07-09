/**
 * Tests for the StaffView component.
 * Covers protected staff access, chat submission, operational metric cards,
 * real-time decision support, incident queue, and ARIA attributes.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffView from '../src/components/StaffView';

global.fetch = jest.fn();

function unlockStaffView() {
  const codeInput = screen.getByPlaceholderText('Demo code');
  fireEvent.change(codeInput, { target: { value: '2026' } });
  fireEvent.click(screen.getByRole('button', { name: /Unlock/i }));
}

describe('StaffView Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('protects the staff dashboard behind a demo access code', () => {
    render(<StaffView />);
    expect(screen.getByText('Staff Operations Access')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Demo code'), {
      target: { value: 'bad-code' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Unlock/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Use demo staff code 2026');
  });

  it('renders initial bot message after unlock', () => {
    render(<StaffView />);
    unlockStaffView();
    expect(screen.getByText(/Operations AI ready/i)).toBeInTheDocument();
  });

  it('submits a message and handles successful API response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Sending staff to Gate 4.' }),
    });

    render(<StaffView />);
    unlockStaffView();
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Fix Gate 4' } });
    fireEvent.click(button);

    expect(screen.getByText('Fix Gate 4')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText('Sending staff to Gate 4.')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('does not submit when already loading', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<StaffView />);
    unlockStaffView();
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Loading check' } });
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles API error response gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error occurred' }),
    });

    render(<StaffView />);
    unlockStaffView();
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Status' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error occurred')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles network failure gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    render(<StaffView />);
    unlockStaffView();
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Status' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('renders operational metric cards from the shared operations snapshot', () => {
    render(<StaffView />);
    unlockStaffView();

    expect(screen.getByText('Stadium Capacity')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Energy Usage')).toBeInTheDocument();
    expect(screen.getByText('4.2 MW')).toBeInTheDocument();
    expect(screen.getByText('Staff Deployed')).toBeInTheDocument();
    expect(screen.getByText('412')).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
    expect(screen.getByText('Sustainability')).toBeInTheDocument();
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('renders real-time decision support and incident queue', () => {
    render(<StaffView />);
    unlockStaffView();

    expect(screen.getByLabelText('Real-time decision support')).toBeInTheDocument();
    expect(screen.getByText('Priority Action')).toBeInTheDocument();
    expect(screen.getByText(/Open overflow lanes at Gates 2 and 6/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Incident queue')).toBeInTheDocument();
    expect(screen.getByText('Gate 4 Congestion')).toBeInTheDocument();
    expect(screen.getByText(/Gate 4 accessible ramp is slow/i)).toBeInTheDocument();
  });

  it('renders chat log with correct ARIA attributes', () => {
    render(<StaffView />);
    unlockStaffView();
    const chatLog = screen.getByRole('log');
    expect(chatLog).toBeInTheDocument();
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });
});
