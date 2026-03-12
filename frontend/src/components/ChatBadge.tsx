import chatBubbleIcon from '../assets/icons/chat-bubble.svg';
import styles from './ChatBadge.module.css';

export function ChatBadge() {
  return (
    <div className={styles.badge} aria-hidden="true">
      <img src={chatBubbleIcon} alt="" className={styles.icon} />
    </div>
  );
}
