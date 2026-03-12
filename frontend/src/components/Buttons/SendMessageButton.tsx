import arrowRightIcon from '../../assets/icons/arrow-right.svg';
import { Spinner } from '../Spinner';
import baseStyles from './IconButtonBase.module.css';
import styles from './SendMessageButton.module.css';

type SendMessageButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
};

export function SendMessageButton({ disabled = false, isLoading = false }: SendMessageButtonProps) {
  return (
    <button
      type="submit"
      className={`${baseStyles.button} ${baseStyles.sendButton} ${styles.button}`}
      aria-label="Send message"
      disabled={disabled}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <img src={arrowRightIcon} alt="" className={`${baseStyles.icon} ${baseStyles.sendIcon}`} />
      )}
    </button>
  );
}
