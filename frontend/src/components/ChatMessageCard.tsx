import type { ChatMessage } from '../features/chat/models/chatMessage';
import { BodyText, SectionHeading } from './Typography';
import styles from './ChatMessageCard.module.css';

type ChatMessageCardProps = {
  message: ChatMessage;
};

function getMessageHeading(message: ChatMessage) {
  return message.role === 'user' ? 'You' : 'Assistant';
}

export function ChatMessageCard({ message }: ChatMessageCardProps) {
  const isAssistant = message.role === 'assistant';
  const cardClassName = isAssistant ? `${styles.card} ${styles.assistantCard}` : `${styles.card} ${styles.userCard}`;

  return (
    <article className={cardClassName}>
      <header className={styles.header}>
        <SectionHeading className={styles.heading}>{getMessageHeading(message)}</SectionHeading>
        {message.model ? <span className={styles.model}>{message.model}</span> : null}
      </header>

      <BodyText className={styles.content}>{message.content}</BodyText>
    </article>
  );
}
