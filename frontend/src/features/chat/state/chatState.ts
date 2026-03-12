import type { ChatMessage } from '../models/chatMessage';

export type ChatState = {
  draft: string;
  messages: ChatMessage[];
  isSubmitting: boolean;
  errorMessage: string | null;
};

export type ChatAction =
  | { type: 'draftChanged'; draft: string }
  | { type: 'submissionStarted'; message: ChatMessage }
  | { type: 'submissionSucceeded'; message: ChatMessage }
  | { type: 'submissionFailed'; errorMessage: string }
  | { type: 'chatCleared' };

export const initialChatState: ChatState = {
  draft: '',
  messages: [],
  isSubmitting: false,
  errorMessage: null,
};

export function chatStateReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'draftChanged':
      return {
        ...state,
        draft: action.draft,
        errorMessage: null,
      };
    case 'submissionStarted':
      return {
        ...state,
        draft: '',
        isSubmitting: true,
        errorMessage: null,
        messages: [...state.messages, action.message],
      };
    case 'submissionSucceeded':
      return {
        ...state,
        isSubmitting: false,
        messages: [...state.messages, action.message],
      };
    case 'submissionFailed':
      return {
        ...state,
        isSubmitting: false,
        errorMessage: action.errorMessage,
      };
    case 'chatCleared':
      return initialChatState;
    default:
      return state;
  }
}
