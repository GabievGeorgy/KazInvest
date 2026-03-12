import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../features/chat/models/chatMessage';
import { ChatMessageCard } from './ChatMessageCard';
import styles from './ChatConversation.module.css';

type ChatConversationProps = {
  messages: ChatMessage[];
};

export function ChatConversation({ messages }: ChatConversationProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <section className={styles.conversation} aria-label="Chat conversation">
      {messages.map((message) => (
        <ChatMessageCard key={message.id} message={message} />
      ))}
      <div ref={endRef} aria-hidden="true" className={styles.endAnchor} />
    </section>
  );
}
