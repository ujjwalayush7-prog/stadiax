/**
 * Tests for the StaffView component.
 * Covers initial rendering, chat submission, error handling, loading guards,
 * operational metric stat cards (including new Transportation and
 * Sustainability cards), and ARIA accessibility attributes.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffView from '../src/components/StaffView';

// Mock fetch API globally
global.fetch = jest.fn();

describe('StaffView Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders initial bot message', () => {
    render(<StaffView />);
    expect(screen.getByText(/Operations AI ready/i)).toBeInTheDocument();
  });

  it('submits a message and handles successful API response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Sending staff to Gate 4.' }),
    });

    render(<StaffView />);
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
    // Return a promise that never resolves so it stays in loading state
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<StaffView />);
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    // First click initiates loading state
    fireEvent.change(input, { target: { value: 'Loading check' } });
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second click should return early due to isLoading
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles API error response gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error occurred' }),
    });

    render(<StaffView />);
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
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Status' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('renders Stadium Capacity stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Stadium Capacity')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
  });

  it('renders Active Incidents stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders Energy Usage stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Energy Usage')).toBeInTheDocument();
    expect(screen.getByText('4.2 MW')).toBeInTheDocument();
  });

  it('renders Staff Deployed stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Staff Deployed')).toBeInTheDocument();
    expect(screen.getByText('412')).toBeInTheDocument();
  });

  it('renders Transportation stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('renders Sustainability stat card', () => {
    render(<StaffView />);
    expect(screen.getByText('Sustainability')).toBeInTheDocument();
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('renders operational metrics section with correct ARIA label', () => {
    render(<StaffView />);
    const section = screen.getByLabelText('Operational Metrics');
    expect(section).toBeInTheDocument();
  });

  it('renders chat log with correct ARIA attributes', () => {
    render(<StaffView />);
    const chatLog = screen.getByRole('log');
    expect(chatLog).toBeInTheDocument();
    expect(chatLog).toHaveAttribute('aria-live', 'polite');
  });
});
