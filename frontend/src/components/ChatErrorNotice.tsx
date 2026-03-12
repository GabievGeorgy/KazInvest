import styles from './ChatErrorNotice.module.css';

type ChatErrorNoticeProps = {
  message: string;
};

export function ChatErrorNotice({ message }: ChatErrorNoticeProps) {
  return (
    <div className={styles.notice} role="alert">
      {message}
    </div>
  );
}
