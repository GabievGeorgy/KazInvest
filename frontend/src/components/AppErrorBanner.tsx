import crossIcon from '../assets/icons/cross.svg';
import { useAppError } from '../contexts/useAppError';
import baseStyles from './Buttons/IconButtonBase.module.css';
import { BodyText } from './Typography';
import styles from './AppErrorBanner.module.css';

export function AppErrorBanner() {
  const { errorMessage, clearError } = useAppError();

  if (!errorMessage) {
    return null;
  }

  return (
    <div className={styles.banner} role="alert">
      <BodyText>{errorMessage}</BodyText>
      <button
        type="button"
        className={`${baseStyles.button} ${styles.dismissButton}`}
        onClick={clearError}
        aria-label="Dismiss error"
      >
        <img src={crossIcon} alt="" className={baseStyles.icon} />
      </button>
    </div>
  );
}
