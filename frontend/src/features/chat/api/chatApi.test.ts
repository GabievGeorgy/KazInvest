import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatApiError, createChatCompletion } from './chatApi';

describe('createChatCompletion', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it('posts the message to the backend chat endpoint', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ reply: 'Hello back', model: 'openrouter/model' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await createChatCompletion([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
      { role: 'user', content: 'Can you elaborate?' },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there' },
            { role: 'user', content: 'Can you elaborate?' },
          ],
        }),
      }),
    );

    expect(response).toEqual({
      reply: 'Hello back',
      model: 'openrouter/model',
    });
  });

  it('maps problem details responses to a typed API error', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ detail: 'Provider timeout.' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(createChatCompletion([{ role: 'user', content: 'Hello' }])).rejects.toEqual(
      new ChatApiError('Provider timeout.', 504),
    );
  });
});
