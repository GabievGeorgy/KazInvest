import { useReducer } from 'react';
import { createChatCompletion, getChatErrorMessage } from '../api/chatApi';
import { createChatMessage } from '../models/chatMessage';
import { chatStateReducer, initialChatState } from '../state/chatState';

export function useChat() {
  const [state, dispatch] = useReducer(chatStateReducer, initialChatState);

  function setDraft(draft: string) {
    dispatch({ type: 'draftChanged', draft });
  }

  function submitChat() {
    void submitChatAsync();
  }

  async function submitChatAsync() {
    const message = state.draft.trim();

    if (!message || state.isSubmitting) {
      return;
    }

    dispatch({
      type: 'submissionStarted',
      message: createChatMessage('user', message),
    });

    try {
      const response = await createChatCompletion(message);

      dispatch({
        type: 'submissionSucceeded',
        message: createChatMessage('assistant', response.reply, response.model),
      });
    }
    catch (error) {
      dispatch({
        type: 'submissionFailed',
        errorMessage: getChatErrorMessage(error),
      });
    }
  }

  return {
    draft: state.draft,
    messages: state.messages,
    isSubmitting: state.isSubmitting,
    errorMessage: state.errorMessage,
    hasMessages: state.messages.length > 0,
    setDraft,
    submitChat,
  };
}
