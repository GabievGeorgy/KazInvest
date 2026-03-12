import arrowRightIcon from '../../assets/icons/arrow-right.svg';
import baseStyles from './IconButtonBase.module.css';
import styles from './SendMessageButton.module.css';

export function SendMessageButton() {
  return (
    <button
      type="submit"
      className={`${baseStyles.button} ${baseStyles.sendButton} ${styles.button}`}
      aria-label="Send message"
    >
      <img src={arrowRightIcon} alt="" className={`${baseStyles.icon} ${baseStyles.sendIcon}`} />
    </button>
  );
}
