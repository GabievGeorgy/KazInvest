import { ClearChatButton } from './Buttons/ClearChatButton';
import { ChatErrorNotice } from './ChatErrorNotice';
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
    errorMessage,
    hasMessages,
    canSubmit,
    setDraft,
    submitChat,
    clearChat,
  } = useChat();

  return (
    <main className={styles.pageShell}>
      <section className={styles.panel}>
        <div className={styles.content}>
          {hasMessages ? (
            <div className={styles.toolbar}>
              <ClearChatButton onClick={clearChat} disabled={isSubmitting} />
            </div>
          ) : null}

          <div className={styles.body}>
            {hasMessages ? <ChatConversation messages={messages} /> : <EmptyChatState />}
          </div>

          <div className={styles.inputSlot}>
            {errorMessage ? <ChatErrorNotice message={errorMessage} /> : null}
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
