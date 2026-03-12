import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';
import { useChat } from '../features/chat/hooks/useChat';
import styles from './ChatScreen.module.css';

export function ChatScreen() {
  const { draft, setDraft, submitChat } = useChat();

  return (
    <main className={styles.pageShell}>
      <section className={styles.panel}>
        <div className={styles.content}>
          <EmptyChatState />

          <div className={styles.inputSlot}>
            <ChatInput
              value={draft}
              onChange={setDraft}
              onSubmit={submitChat}
              onVoiceInput={() => undefined}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
