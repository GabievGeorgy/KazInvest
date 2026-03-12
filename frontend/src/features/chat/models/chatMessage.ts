export type ChatMessageRole = 'assistant' | 'user';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  model?: string;
};

function createMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createChatMessage(role: ChatMessageRole, content: string, model?: string): ChatMessage {
  return {
    id: createMessageId(),
    role,
    content,
    model,
  };
}
