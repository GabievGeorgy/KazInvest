import { useLayoutEffect, type RefObject } from 'react';

export function useAutosizeTextarea(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows: number,
) {
  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';

    const { lineHeight } = window.getComputedStyle(textarea);
    const parsedLineHeight = Number.parseFloat(lineHeight);

    if (Number.isNaN(parsedLineHeight)) {
      return;
    }

    const maxHeight = parsedLineHeight * maxRows;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [maxRows, textareaRef, value]);
}
