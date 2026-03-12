import type { RefObject, SubmitEvent } from 'react';
import { SendMessageButton } from './Buttons/SendMessageButton';
import { VoiceInputButton } from './Buttons/VoiceInputButton';
import styles from './ChatInput.module.css';

type ChatTextEntryProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onVoiceInputStart: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  isVoiceBusy: boolean;
  isVoiceRequesting: boolean;
};

export function ChatTextEntry({
  value,
  onChange,
  onSubmit,
  onVoiceInputStart,
  inputRef,
  placeholder,
  isSubmitting,
  canSubmit,
  isVoiceBusy,
  isVoiceRequesting,
}: ChatTextEntryProps) {
  return (
    <form className={styles.input} onSubmit={onSubmit}>
      <VoiceInputButton onClick={onVoiceInputStart} disabled={isSubmitting || isVoiceBusy} />

      <div className={styles.field}>
        <input
          ref={inputRef}
          type="text"
          name="message"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Ask a question"
          autoComplete="off"
          readOnly={isSubmitting}
          aria-busy={isSubmitting || isVoiceRequesting}
        />
      </div>

      <SendMessageButton disabled={!canSubmit || isVoiceRequesting} isLoading={isSubmitting} />
    </form>
  );
}
