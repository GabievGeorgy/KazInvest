import { useEffect, useRef, type KeyboardEvent, type RefObject, type SubmitEvent } from 'react';
import type { VoiceLocale } from '../features/voice/voiceLocale';
import { voiceLocaleOptions } from '../features/voice/voiceLocale';
import { SendMessageButton } from './Buttons/SendMessageButton';
import { VoiceInputButton } from './Buttons/VoiceInputButton';
import shellStyles from './ChatEntryShell.module.css';
import styles from './ChatTextEntry.module.css';
import { useAutosizeTextarea } from './hooks/useAutosizeTextarea';
import { UiText } from './Typography';

const maxTextareaRows = 5;
const maxMessageLength = 4096;

type ChatTextEntryProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onVoiceLocalePickerClose: () => void;
  onVoiceInputStart: () => void;
  onVoiceLocaleSelect: (locale: VoiceLocale) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  placeholder: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  isVoiceBusy: boolean;
  isVoiceLocalePickerOpen: boolean;
  isVoiceRequesting: boolean;
};

export function ChatTextEntry({
  value,
  onChange,
  onSubmit,
  onVoiceLocalePickerClose,
  onVoiceInputStart,
  onVoiceLocaleSelect,
  inputRef,
  placeholder,
  isSubmitting,
  canSubmit,
  isVoiceBusy,
  isVoiceLocalePickerOpen,
  isVoiceRequesting,
}: ChatTextEntryProps) {
  const inputShellRef = useRef<HTMLDivElement>(null);

  useAutosizeTextarea(inputRef, value, maxTextareaRows);

  useEffect(() => {
    if (!isVoiceLocalePickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!inputShellRef.current?.contains(event.target as Node)) {
        onVoiceLocalePickerClose();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isVoiceLocalePickerOpen, onVoiceLocalePickerClose]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <div className={styles.shell} ref={inputShellRef}>
      {isVoiceLocalePickerOpen ? (
        <div className={styles.localePopover} role="group" aria-label="Voice input language">
          <UiText>Choose language</UiText>
          <div className={styles.localeOptions}>
            {voiceLocaleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.localeButton}
                aria-label={`Use ${option.label} for voice input`}
                onClick={() => onVoiceLocaleSelect(option.value)}
              >
                {option.shortLabel}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form className={shellStyles.surface} onSubmit={onSubmit}>
        <div className={styles.side}>
          <VoiceInputButton onClick={onVoiceInputStart} disabled={isSubmitting || isVoiceBusy} />
        </div>

        <div className={shellStyles.field}>
          <textarea
            className={styles.textarea}
            ref={inputRef}
            name="message"
            rows={1}
            maxLength={maxMessageLength}
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

        <div className={`${styles.side} ${styles.sendSide}`}>
          <SendMessageButton
            disabled={isVoiceLocalePickerOpen || !canSubmit || isVoiceRequesting}
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
