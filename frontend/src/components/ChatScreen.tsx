import { ClearChatButton } from './Buttons/ClearChatButton';
import { AppErrorBanner } from './AppErrorBanner';
import { ChatConversation } from './ChatConversation';
import { ChatInput } from './ChatInput';
import { EmptyChatState } from './EmptyChatState';
import { useChat } from '../features/chat/hooks/useChat';
import styles from './ChatScreen.module.css';

export function ChatScreen() {
  const {
    draft,
    messages,
    isSubmitting,
    hasMessages,
    canSubmit,
    setDraft,
    submitChat,
    clearChat,
  } = useChat();

  return (
    <main className={styles.pageShell}>
      <section className={`${styles.panel} ${hasMessages ? styles.conversationPanel : styles.landingPanel}`}>
        <div className={`${styles.content} ${hasMessages ? styles.conversationContent : styles.landingContent}`}>
          {hasMessages ? (
            <div className={`${styles.column} ${styles.toolbar}`}>
              <ClearChatButton onClick={clearChat} disabled={isSubmitting} />
            </div>
          ) : null}

          <div className={`${styles.column} ${styles.body}`}>
            {hasMessages ? <ChatConversation messages={messages} /> : <EmptyChatState />}
          </div>

          <div className={`${styles.column} ${styles.inputSlot}`}>
            <AppErrorBanner />
            <ChatInput
              value={draft}
              onChange={setDraft}
              onSubmit={submitChat}
              onVoiceInput={setDraft}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
