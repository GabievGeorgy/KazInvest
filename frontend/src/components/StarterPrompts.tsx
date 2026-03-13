import { UiText } from './Typography';
import styles from './StarterPrompts.module.css';

const starterPrompts = [
  'What is trending now?',
  'Which fruits are red?',
] as const;

type StarterPromptsProps = {
  onSelect: (prompt: string) => void;
};

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className={styles.grid} aria-label="Suggested prompts">
      {starterPrompts.map(prompt => (
        <button
          key={prompt}
          type="button"
          className={styles.prompt}
          onClick={() => onSelect(prompt)}
        >
          <UiText className={styles.label}>{prompt}</UiText>
        </button>
      ))}
    </div>
  );
}
