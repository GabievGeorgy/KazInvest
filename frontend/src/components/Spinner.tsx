import styles from './Spinner.module.css';

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  const spinnerClassName = className ? `${styles.spinner} ${className}` : styles.spinner;

  return <span className={spinnerClassName} role="status" aria-label="Loading response" />;
}
