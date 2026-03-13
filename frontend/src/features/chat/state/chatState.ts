import type { ChatMessage } from '../models/chatMessage';

export type ChatState = {
  draft: string;
  messages: ChatMessage[];
  isSubmitting: boolean;
};

export type ChatAction =
  | { type: 'draftChanged'; draft: string }
  | { type: 'submissionStarted'; message: ChatMessage }
  | { type: 'submissionSucceeded'; message: ChatMessage }
  | { type: 'submissionFailed' }
  | { type: 'chatCleared' };

export const initialChatState: ChatState = {
  draft: '',
  messages: [],
  isSubmitting: false,
};

export function chatStateReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'draftChanged':
      return {
        ...state,
        draft: action.draft,
      };
    case 'submissionStarted':
      return {
        ...state,
        draft: '',
        isSubmitting: true,
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
      };
    case 'chatCleared':
      return initialChatState;
    default:
      return state;
  }
}
