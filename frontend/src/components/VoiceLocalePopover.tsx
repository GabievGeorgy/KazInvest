import type { VoiceLocale } from '../features/voice/voiceLocale';
import { UiText } from './Typography';
import { VoiceLocaleSelector } from './VoiceLocaleSelector';
import styles from './VoiceLocalePopover.module.css';

type VoiceLocalePopoverProps = {
  onSelect: (locale: VoiceLocale) => void;
};

export function VoiceLocalePopover({ onSelect }: VoiceLocalePopoverProps) {
  return (
    <div className={styles.popover} role="group" aria-label="Voice input language">
      <UiText>Choose language</UiText>
      <VoiceLocaleSelector onSelect={onSelect} />
    </div>
  );
}
