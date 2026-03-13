import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import { useState } from 'react';
import { AppErrorProvider } from '../contexts/AppErrorProvider';
import { AppErrorBanner } from './AppErrorBanner';
import { ChatInput } from './ChatInput';

// Builds the minimal SpeechRecognition result shape consumed by the hook.
function createRecognitionResults(transcript: string) {
  const alternative = {
    confidence: 0.99,
    transcript,
  };
  const result = {
    0: alternative,
    isFinal: true,
    length: 1,
    item: () => alternative,
  };

  return {
    0: result,
    length: 1,
    item: () => result,
  } as unknown as SpeechRecognitionResultList;
}

// Browser speech recognition is not available in jsdom, so tests drive this mock manually.
class MockSpeechRecognition {
  static instances: MockSpeechRecognition[] = [];

  continuous = false;
  interimResults = false;
  lang = 'en-US';
  maxAlternatives = 1;
  onaudioend: SpeechRecognition['onaudioend'] = null;
  onend: SpeechRecognition['onend'] = null;
  onerror: SpeechRecognition['onerror'] = null;
  onresult: SpeechRecognition['onresult'] = null;
  onstart: SpeechRecognition['onstart'] = null;
  abort = vi.fn();
  start = vi.fn();
  stop = vi.fn();

  constructor() {
    MockSpeechRecognition.instances.push(this);
  }

  addEventListener() {
    return undefined;
  }

  dispatchEvent() {
    return true;
  }

  removeEventListener() {
    return undefined;
  }

  emitStart() {
    const handler = this.onstart;

    if (handler) {
      handler.call(this as unknown as SpeechRecognition, new Event('start'));
    }
  }

  emitResult(transcript: string) {
    const handler = this.onresult;

    if (handler) {
      handler.call(this as unknown as SpeechRecognition, {
        resultIndex: 0,
        results: createRecognitionResults(transcript),
      } as SpeechRecognitionEvent);
    }
  }

  emitEnd() {
    const handler = this.onend;

    if (handler) {
      handler.call(this as unknown as SpeechRecognition, new Event('end'));
    }
  }
}

// Keeps ChatInput controlled in tests so voice transcripts update the visible draft value.
function ChatInputHarness({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);

  return (
    <AppErrorProvider>
      <AppErrorBanner />
      <ChatInput
        value={value}
        onChange={setValue}
        onSubmit={() => undefined}
        onVoiceInput={setValue}
        isSubmitting={false}
        canSubmit={value.trim().length > 0}
      />
    </AppErrorProvider>
  );
}

describe('ChatInput', () => {
  afterEach(() => {
    MockSpeechRecognition.instances = [];
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fills the draft with recognized text after confirming voice input', async () => {
    const user = userEvent.setup();

    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    render(<ChatInputHarness />);

    await user.click(screen.getByRole('button', { name: /start voice input/i }));
    await user.click(screen.getByRole('button', { name: /use english for voice input/i }));

    const recognition = MockSpeechRecognition.instances[0];

    expect(recognition.start).toHaveBeenCalledTimes(1);

    act(() => {
      recognition.emitStart();
    });

    expect(screen.queryByRole('textbox', { name: /ask a question/i })).not.toBeInTheDocument();
    expect(screen.getByText(/recording\.\.\./i)).toBeInTheDocument();

    act(() => {
      recognition.emitResult('Recognized voice draft');
    });

    expect(screen.getByText(/recognized voice draft/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /use recognized text/i }));

    expect(recognition.stop).toHaveBeenCalledTimes(1);

    act(() => {
      recognition.emitEnd();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /ask a question/i })).toHaveValue(
        'Recognized voice draft',
      );
    });
  });

  it('keeps the existing draft when voice input is cancelled', async () => {
    const user = userEvent.setup();

    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    render(<ChatInputHarness initialValue="Keep this text" />);

    await user.click(screen.getByRole('button', { name: /start voice input/i }));
    await user.click(screen.getByRole('button', { name: /use english for voice input/i }));

    const recognition = MockSpeechRecognition.instances[0];

    act(() => {
      recognition.emitStart();
      recognition.emitResult('Discarded transcript');
    });

    await user.click(screen.getByRole('button', { name: /cancel voice input/i }));

    expect(recognition.abort).toHaveBeenCalledTimes(1);

    act(() => {
      recognition.emitEnd();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /ask a question/i })).toHaveValue('Keep this text');
    });
  });

  it('disables send while microphone permission is still pending', async () => {
    const user = userEvent.setup();

    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    render(<ChatInputHarness initialValue="Draft message" />);

    const sendButton = screen.getByRole('button', { name: /send message/i });

    expect(sendButton).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /start voice input/i }));
    await user.click(screen.getByRole('button', { name: /use english for voice input/i }));

    expect(MockSpeechRecognition.instances[0].start).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('starts voice recognition with the selected language', async () => {
    const user = userEvent.setup();

    vi.stubGlobal('webkitSpeechRecognition', MockSpeechRecognition);

    render(<ChatInputHarness />);

    await user.click(screen.getByRole('button', { name: /start voice input/i }));
    await user.click(screen.getByRole('button', { name: /use russian for voice input/i }));

    expect(MockSpeechRecognition.instances[0].lang).toBe('ru-RU');
    expect(MockSpeechRecognition.instances[0].start).toHaveBeenCalledTimes(1);
  });

  it('shows unsupported browser errors in the shared banner', async () => {
    const user = userEvent.setup();

    render(<ChatInputHarness />);

    await user.click(screen.getByRole('button', { name: /start voice input/i }));
    await user.click(screen.getByRole('button', { name: /use english for voice input/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /voice input is not supported in this browser\./i,
    );
  });
});
