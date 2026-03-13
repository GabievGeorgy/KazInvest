import { ChatMarkdown } from './ChatMarkdown';
import type { ChatMessage } from '../features/chat/models/chatMessage';
import { BodyText } from './Typography';
import styles from './ChatMessageCard.module.css';

type ChatMessageCardProps = {
  message: ChatMessage;
};

export function ChatMessageCard({ message }: ChatMessageCardProps) {
  const isAssistant = message.role === 'assistant';
  const cardClassName = isAssistant
    ? `${styles.message} ${styles.assistantMessage}`
    : `${styles.message} ${styles.userMessage}`;

  return (
    <article className={cardClassName}>
      {isAssistant ? (
        <>
          <ChatMarkdown content={message.content} />
          {message.model ? <span className={styles.model}>{message.model}</span> : null}
        </>
      ) : (
        <BodyText className={styles.content}>{message.content}</BodyText>
      )}
    </article>
  );
}
