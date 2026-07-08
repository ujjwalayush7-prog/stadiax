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
    });
  });

  it('handles API error response gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Connection Error' }),
    });

    render(<StaffView />);
    const input = screen.getByPlaceholderText('Query operational intelligence...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Status' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Connection Error')).toBeInTheDocument();
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
    });
  });
});
