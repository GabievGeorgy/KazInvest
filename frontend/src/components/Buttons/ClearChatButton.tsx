import styles from './ClearChatButton.module.css';

type ClearChatButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function ClearChatButton({ onClick, disabled = false }: ClearChatButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick} disabled={disabled}>
      Clear chat
    </button>
  );
}
