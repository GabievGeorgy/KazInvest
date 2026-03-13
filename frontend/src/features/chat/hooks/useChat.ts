import { useReducer } from 'react';
import { useAppError } from '../../../contexts/useAppError';
import { createChatCompletion, getChatErrorMessage } from '../api/chatApi';
import { createChatMessage, type ChatMessage } from '../models/chatMessage';
import { chatStateReducer, initialChatState } from '../state/chatState';

function toRequestMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export function useChat() {
  const [state, dispatch] = useReducer(chatStateReducer, initialChatState);
  const { clearError, showError } = useAppError();

  function setDraft(draft: string) {
    clearError();
    dispatch({ type: 'draftChanged', draft });
  }

  function submitChat() {
    void submitChatAsync();
  }

  function clearChat() {
    clearError();
    dispatch({ type: 'chatCleared' });
  }

  async function submitChatAsync() {
    const message = state.draft.trim();

    if (!message || state.isSubmitting) {
      return;
    }

    const userMessage = createChatMessage('user', message);
    const requestMessages = [...state.messages, userMessage];

    dispatch({
      type: 'submissionStarted',
      message: userMessage,
    });
    clearError();

    try {
      const response = await createChatCompletion(toRequestMessages(requestMessages));

      dispatch({
        type: 'submissionSucceeded',
        message: createChatMessage('assistant', response.reply, response.model),
      });
    }
    catch (error) {
      showError(getChatErrorMessage(error));
      dispatch({
        type: 'submissionFailed',
      });
    }
  }

  return {
    draft: state.draft,
    messages: state.messages,
    isSubmitting: state.isSubmitting,
    hasMessages: state.messages.length > 0,
    canSubmit: state.draft.trim().length > 0 && !state.isSubmitting,
    setDraft,
    submitChat,
    clearChat,
  };
}
