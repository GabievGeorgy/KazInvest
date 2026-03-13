import { ChatBadge } from './ChatBadge';
import { HeroText } from './HeroText';
import { StarterPrompts } from './StarterPrompts';
import styles from './EmptyChatState.module.css';

type EmptyChatStateProps = {
  onPromptSelect: (prompt: string) => void;
};

export function EmptyChatState({ onPromptSelect }: EmptyChatStateProps) {
  return (
    <div className={styles.state}>
      <ChatBadge />
      <HeroText />
      <StarterPrompts onSelect={onPromptSelect} />
    </div>
  );
}
