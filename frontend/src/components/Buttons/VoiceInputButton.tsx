import microphoneIcon from '../../assets/icons/microphone.svg';
import baseStyles from './IconButtonBase.module.css';
import styles from './VoiceInputButton.module.css';

type VoiceInputButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function VoiceInputButton({ onClick, disabled = false }: VoiceInputButtonProps) {
  return (
    <button
      type="button"
      className={`${baseStyles.button} ${baseStyles.roundButton}`}
      aria-label="Start voice input"
      onClick={onClick}
      disabled={disabled}
    >
      <img src={microphoneIcon} alt="" className={styles.icon} />
    </button>
  );
}
