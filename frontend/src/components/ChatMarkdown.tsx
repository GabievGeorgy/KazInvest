import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatMarkdown.module.css';

type ChatMarkdownProps = {
  content: string;
};

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className={styles.markdown}>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
