import microphoneIcon from '../../assets/icons/microphone.svg';
import baseStyles from './IconButtonBase.module.css';

type VoiceInputButtonProps = {
  onClick: () => void;
};

export function VoiceInputButton({ onClick }: VoiceInputButtonProps) {
  return (
    <button
      type="button"
      className={`${baseStyles.button} ${baseStyles.roundButton}`}
      aria-label="Start voice input"
      onClick={onClick}
    >
      <img src={microphoneIcon} alt="" className={baseStyles.icon} />
    </button>
  );
}
