import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createChatMessage } from '../features/chat/models/chatMessage';
import { ChatMessageCard } from './ChatMessageCard';

describe('ChatMessageCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('copies assistant responses and resets the confirmation state after one second', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
      clipboard: {
        writeText,
      },
    });

    render(<ChatMessageCard message={createChatMessage('assistant', 'Copied answer')} />);

    const copyButton = screen.getByRole('button', { name: /copy response/i });

    fireEvent.click(copyButton);

    await act(async () => {
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith('Copied answer');
    expect(screen.getByRole('button', { name: /copied response/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('button', { name: /copy response/i })).toBeInTheDocument();
  });

  it('does not render a copy button for user messages', () => {
    render(<ChatMessageCard message={createChatMessage('user', 'Question')} />);

    expect(screen.queryByRole('button', { name: /copy response/i })).not.toBeInTheDocument();
  });
});
