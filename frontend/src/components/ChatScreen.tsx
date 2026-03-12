import { useState } from 'react';
import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';
import styles from './ChatScreen.module.css';

export function ChatScreen() {
  const [message, setMessage] = useState('');

  return (
    <main className={styles.pageShell}>
      <section className={styles.panel}>
        <div className={styles.content}>
          <EmptyChatState />

          <div className={styles.inputSlot}>
            <ChatInput
              value={message}
              onChange={setMessage}
              onSubmit={() => undefined}
              onVoiceInput={() => undefined}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
