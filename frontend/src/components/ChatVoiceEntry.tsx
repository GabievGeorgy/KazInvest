import checkIcon from '../assets/icons/check.svg';
import crossIcon from '../assets/icons/cross.svg';
import baseStyles from './Buttons/IconButtonBase.module.css';
import shellStyles from './ChatEntryShell.module.css';
import styles from './ChatVoiceEntry.module.css';
import { UiText } from './Typography';

type ChatVoiceEntryProps = {
  isProcessing: boolean;
  liveTranscript: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ChatVoiceEntry({
  isProcessing,
  liveTranscript,
  onCancel,
  onConfirm,
}: ChatVoiceEntryProps) {
  const statusText = liveTranscript || (isProcessing ? 'Transcribing...' : 'Recording...');

  return (
    <div className={`${shellStyles.surface} ${styles.surface}`}>
      <div className={styles.side}>
        <button
          type="button"
          className={`${baseStyles.button} ${baseStyles.roundButton}`}
          onClick={onCancel}
          disabled={isProcessing}
          aria-label="Cancel voice input"
        >
          <img src={crossIcon} alt="" className={styles.icon} />
        </button>
      </div>

      <div className={`${shellStyles.field} ${styles.field}`} role="status" aria-live="polite">
        <UiText>{statusText}</UiText>
      </div>

      <div className={styles.side}>
        <button
          type="button"
          className={`${baseStyles.button} ${baseStyles.sendButton} ${styles.confirmButton}`}
          onClick={onConfirm}
          disabled={isProcessing}
          aria-label="Use recognized text"
        >
          <img src={checkIcon} alt="" className={`${styles.icon} ${styles.confirmIcon}`} />
        </button>
      </div>
    </div>
  );
}
