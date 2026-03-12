import checkIcon from '../assets/icons/check.svg';
import crossIcon from '../assets/icons/cross.svg';
import baseStyles from './Buttons/IconButtonBase.module.css';
import styles from './ChatInput.module.css';

type ChatVoiceEntryProps = {
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ChatVoiceEntry({ isProcessing, onCancel, onConfirm }: ChatVoiceEntryProps) {
  return (
    <div className={`${styles.input} ${styles.voiceInput}`}>
      <div className={styles.voiceSide}>
        <button
          type="button"
          className={`${baseStyles.button} ${baseStyles.roundButton} ${styles.voiceCancelButton}`}
          onClick={onCancel}
          disabled={isProcessing}
          aria-label="Cancel voice input"
        >
          <img src={crossIcon} alt="" className={styles.voiceIcon} />
        </button>
      </div>

      <div className={`${styles.field} ${styles.voiceField}`} role="status" aria-live="polite">
        <span className={styles.voiceStatusLabel}>
          {isProcessing ? 'Transcribing...' : 'Recording...'}
        </span>
      </div>

      <div className={styles.voiceSide}>
        <button
          type="button"
          className={`${baseStyles.button} ${baseStyles.sendButton} ${styles.voiceConfirmButton}`}
          onClick={onConfirm}
          disabled={isProcessing}
          aria-label="Use recognized text"
        >
          <img src={checkIcon} alt="" className={`${styles.voiceIcon} ${styles.voiceConfirmIcon}`} />
        </button>
      </div>
    </div>
  );
}
