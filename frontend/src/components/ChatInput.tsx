import { SubmitEvent } from 'react';
import { useViewport } from '../contexts/useViewport';
import { SendMessageButton } from './Buttons/SendMessageButton';
import { VoiceInputButton } from './Buttons/VoiceInputButton';
import styles from './ChatInput.module.css';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceInput: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onVoiceInput,
  isSubmitting,
  canSubmit,
}: ChatInputProps) {
  const { isMobile } = useViewport();
  const placeholder = isMobile ? 'Ask anything' : 'Ask whatever you want';

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className={styles.input} onSubmit={handleSubmit}>
      <VoiceInputButton onClick={onVoiceInput} disabled={isSubmitting} />

      <div className={styles.field}>
        <input
          type="text"
          name="message"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Ask a question"
          autoComplete="off"
          disabled={isSubmitting}
        />
      </div>

      <SendMessageButton disabled={!canSubmit} isLoading={isSubmitting} />
    </form>
  );
}
