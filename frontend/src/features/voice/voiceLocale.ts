export type VoiceLocale = 'en-US' | 'ru-RU';

export const voiceLocaleOptions: Array<{
  label: string;
  shortLabel: string;
  value: VoiceLocale;
}> = [
  {
    label: 'English',
    shortLabel: 'EN',
    value: 'en-US',
  },
  {
    label: 'Russian',
    shortLabel: 'RU',
    value: 'ru-RU',
  },
];
