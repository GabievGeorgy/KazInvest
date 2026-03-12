import { getApiBaseUrl } from '../../../lib/config';
import type { ChatMessageRole } from '../models/chatMessage';

export type CreateChatCompletionResponse = {
  reply: string;
  model: string;
};

export type ChatRequestMessage = {
  role: ChatMessageRole;
  content: string;
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export class ChatApiError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.name = 'ChatApiError';
    this.status = status;
  }
}

function buildProblemMessage(problem: ProblemDetails | null): string {
  if (!problem) {
    return 'Failed to get a chat response.';
  }

  const validationMessages = problem.errors
    ? Object.values(problem.errors)
        .flat()
        .filter(Boolean)
    : [];

  if (validationMessages.length > 0) {
    return validationMessages.join(' ');
  }

  return problem.detail || problem.title || 'Failed to get a chat response.';
}

async function readProblemDetails(response: Response): Promise<ProblemDetails | null> {
  try {
    return (await response.json()) as ProblemDetails;
  }
  catch {
    return null;
  }
}

export async function createChatCompletion(
  messages: ChatRequestMessage[],
  signal?: AbortSignal,
): Promise<CreateChatCompletionResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new ChatApiError(buildProblemMessage(problem), response.status);
  }

  return (await response.json()) as CreateChatCompletionResponse;
}

export function getChatErrorMessage(error: unknown): string {
  if (error instanceof ChatApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to get a chat response.';
}
