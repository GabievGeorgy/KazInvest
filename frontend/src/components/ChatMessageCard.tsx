import { useEffect, useRef, useState } from 'react';
import checkIcon from '../assets/icons/check.svg';
import copyIcon from '../assets/icons/copy.svg';
import type { ChatMessage } from '../features/chat/models/chatMessage';
import { ChatMarkdown } from './ChatMarkdown';
import { BodyText, Subtext } from './Typography';
import styles from './ChatMessageCard.module.css';

type ChatMessageCardProps = {
  message: ChatMessage;
};

export function ChatMessageCard({ message }: ChatMessageCardProps) {
  const isAssistant = message.role === 'assistant';
  const [isCopied, setIsCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const cardClassName = isAssistant
    ? `${styles.message} ${styles.assistantMessage}`
    : `${styles.message} ${styles.userMessage}`;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const copied = await copyTextToClipboard(message.content);

    if (!copied) {
      return;
    }

    setIsCopied(true);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setIsCopied(false);
      resetTimerRef.current = null;
    }, 1000);
  }

  return (
    <article className={cardClassName}>
      {isAssistant ? (
        <>
          <ChatMarkdown content={message.content} />
          <div className={styles.metaRow}>
            <button
              type="button"
              className={styles.copyButton}
              onClick={() => {
                void handleCopy();
              }}
              aria-label={isCopied ? 'Copied response' : 'Copy response'}
            >
              <img
                src={isCopied ? checkIcon : copyIcon}
                alt=""
                className={`${styles.copyIcon} ${isCopied ? styles.confirmIcon : ''}`}
              />
            </button>
            {message.model ? <Subtext className={styles.model}>{message.model}</Subtext> : null}
          </div>
        </>
      ) : (
        <BodyText className={styles.content}>{message.content}</BodyText>
      )}
    </article>
  );
}

async function copyTextToClipboard(text: string) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    return false;
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}
