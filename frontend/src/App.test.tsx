import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the chat landing headline', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /what would you like to know\?/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/ask whatever you want/i)).toBeInTheDocument();
  });

  it('renders the conversation after sending a message', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn<typeof fetch>();
    const scrollIntoViewMock = vi.spyOn(Element.prototype, 'scrollIntoView');

    vi.stubGlobal(
      'fetch',
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ reply: 'Hello back', model: 'openrouter/model' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    render(<App />);

    const input = screen.getByRole('textbox', { name: /ask a question/i });
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /what would you like to know\?/i })).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText(/chat conversation/i)).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hello back')).toBeInTheDocument();
    expect(scrollIntoViewMock).toHaveBeenCalled();

    scrollIntoViewMock.mockRestore();
    vi.unstubAllGlobals();
  });
});
