import { describe, expect, it } from 'vitest';
import { createChatMessage } from '../models/chatMessage';
import { chatStateReducer, initialChatState } from './chatState';

describe('chatStateReducer', () => {
  it('updates the draft', () => {
    const nextState = chatStateReducer(initialChatState, {
      type: 'draftChanged',
      draft: 'How is my portfolio doing?',
    });

    expect(nextState.draft).toBe('How is my portfolio doing?');
  });

  it('starts submission and appends the user message', () => {
    const userMessage = createChatMessage('user', 'Hello');

    const nextState = chatStateReducer(initialChatState, {
      type: 'submissionStarted',
      message: userMessage,
    });

    expect(nextState.draft).toBe('');
    expect(nextState.isSubmitting).toBe(true);
    expect(nextState.errorMessage).toBeNull();
    expect(nextState.messages).toEqual([userMessage]);
  });

  it('appends the assistant message when submission succeeds', () => {
    const userMessage = createChatMessage('user', 'Hello');
    const pendingState = chatStateReducer(initialChatState, {
      type: 'submissionStarted',
      message: userMessage,
    });
    const assistantMessage = createChatMessage('assistant', 'Hi there', 'openrouter/model');

    const nextState = chatStateReducer(pendingState, {
      type: 'submissionSucceeded',
      message: assistantMessage,
    });

    expect(nextState.isSubmitting).toBe(false);
    expect(nextState.messages).toEqual([userMessage, assistantMessage]);
  });

  it('stores the error message when submission fails', () => {
    const pendingState = chatStateReducer(initialChatState, {
      type: 'submissionStarted',
      message: createChatMessage('user', 'Hello'),
    });

    const nextState = chatStateReducer(pendingState, {
      type: 'submissionFailed',
      errorMessage: 'Rate limit exceeded.',
    });

    expect(nextState.isSubmitting).toBe(false);
    expect(nextState.errorMessage).toBe('Rate limit exceeded.');
  });
});
