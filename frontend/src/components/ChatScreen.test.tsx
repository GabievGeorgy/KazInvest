import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import { ChatScreen } from './ChatScreen';
import { AppErrorProvider } from '../contexts/AppErrorProvider';

function renderChatScreen() {
  return render(
    <AppErrorProvider>
      <ChatScreen />
    </AppErrorProvider>,
  );
}

describe('ChatScreen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the conversation after sending a message', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn<typeof fetch>();
    const scrollIntoViewMock = vi.spyOn(Element.prototype, 'scrollIntoView');

    vi.stubGlobal(
      'fetch',
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ reply: '**Hello** back', model: 'openrouter/model' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /what would you like to know\?/i })).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText(/chat conversation/i)).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hello', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('disables send and shows a spinner while waiting for the response', async () => {
    const user = userEvent.setup();
    let resolveResponse!: (response: Response) => void;

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            resolveResponse = resolve;
          }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    expect(screen.getByRole('status', { name: /loading response/i })).toBeInTheDocument();

    resolveResponse(
      new Response(JSON.stringify({ reply: 'Hello back', model: 'openrouter/model' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole('status', { name: /loading response/i })).not.toBeInTheDocument();
    });

    expect(screen.getByRole('textbox', { name: /ask a question/i })).not.toBeDisabled();
  });

  it('keeps the input focused after submitting with enter', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ reply: 'Hello back', model: 'openrouter/model' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    input.focus();

    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('shows an error message when the chat request fails', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Provider timeout.' }), {
          status: 504,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent(/provider timeout\./i);
  });

  it('dismisses the shared error banner', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Provider timeout.' }), {
          status: 504,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    await screen.findByRole('alert');
    await user.click(screen.getByRole('button', { name: /dismiss error/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('clears the conversation and returns to the empty state', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ reply: 'Hello back', model: 'openrouter/model' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderChatScreen();

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear chat/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /clear chat/i }));

    expect(
      screen.getByRole('heading', {
        name: /what would you like to know\?/i,
      }),
    ).toBeInTheDocument();

    expect(screen.queryByLabelText(/chat conversation/i)).not.toBeInTheDocument();
  });
});
