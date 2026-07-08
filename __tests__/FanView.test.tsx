import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FanView from '../src/components/FanView';

// Mock fetch API globally
global.fetch = jest.fn();

describe('FanView Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders initial bot message', () => {
    render(<FanView />);
    expect(screen.getByText(/Welcome to StadiaX!/i)).toBeInTheDocument();
  });

  it('submits a message and handles successful API response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Here is the restroom.' }),
    });

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Where is the restroom?' } });
    fireEvent.click(button);

    // Ensure user message is rendered
    expect(screen.getByText('Where is the restroom?')).toBeInTheDocument();

    // Ensure fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Wait for the bot response to render
    await waitFor(() => {
      expect(screen.getByText('Here is the restroom.')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles API error response gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error occurred' }),
    });

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Trigger error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: API Error occurred')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles network failure gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Trigger network error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('does not submit empty messages', () => {
    render(<FanView />);
    const button = screen.getByRole('button', { name: /Send message/i });
    fireEvent.click(button);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not submit when already loading', async () => {
    // Return a promise that never resolves so it stays in loading state
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    // First click initiates loading state
    fireEvent.change(input, { target: { value: 'Loading check' } });
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second click should return early due to isLoading
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles server error with specific data.error message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // no data.error provided, hits fallback
    });

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Trigger server error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Server error')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles non-Error objects in catch block', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce('String error, not Error instance');

    render(<FanView />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Trigger string error' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error: Unable to connect to servers.')).toBeInTheDocument();
      expect(screen.queryByLabelText('AI is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles quick action buttons correctly', () => {
    render(<FanView />);
    const findRestroomsBtn = screen.getByRole('button', { name: /Find Restrooms/i });

    // Click quick action should populate input
    fireEvent.click(findRestroomsBtn);
    const input = screen.getByPlaceholderText('Ask me anything...') as HTMLInputElement;
    expect(input.value).toBe('Where is the nearest restroom from Block C?');
  });
});
