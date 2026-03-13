import type { VoiceLocale } from '../features/voice/voiceLocale';
import { voiceLocaleOptions } from '../features/voice/voiceLocale';
import styles from './VoiceLocaleSelector.module.css';

type VoiceLocaleSelectorProps = {
  onSelect: (locale: VoiceLocale) => void;
};

export function VoiceLocaleSelector({ onSelect }: VoiceLocaleSelectorProps) {
  return (
    <div className={styles.options}>
      {voiceLocaleOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.button}
          aria-label={`Use ${option.label} for voice input`}
          onClick={() => onSelect(option.value)}
        >
          {option.shortLabel}
        </button>
      ))}
    </div>
  );
}
