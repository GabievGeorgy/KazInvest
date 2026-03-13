import type { KeyboardEvent, RefObject, SubmitEvent } from 'react';
import { SendMessageButton } from './Buttons/SendMessageButton';
import { VoiceInputButton } from './Buttons/VoiceInputButton';
import { useAutosizeTextarea } from './hooks/useAutosizeTextarea';
import styles from './ChatInput.module.css';

const maxTextareaRows = 5;

type ChatTextEntryProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onVoiceInputStart: () => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
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
  useAutosizeTextarea(inputRef, value, maxTextareaRows);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form className={styles.input} onSubmit={onSubmit}>
      <div className={styles.textSide}>
        <VoiceInputButton onClick={onVoiceInputStart} disabled={isSubmitting || isVoiceBusy} />
      </div>

      <div className={styles.field}>
        <textarea
          ref={inputRef}
          name="message"
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Ask a question"
          autoComplete="off"
          readOnly={isSubmitting}
          aria-busy={isSubmitting || isVoiceRequesting}
        />
      </div>

      <div className={`${styles.textSide} ${styles.sendSide}`}>
        <SendMessageButton disabled={!canSubmit || isVoiceRequesting} isLoading={isSubmitting} />
      </div>
    </form>
  );
}
