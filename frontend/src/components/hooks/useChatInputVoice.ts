import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { useVoiceRecognition } from '../../features/voice/hooks/useVoiceRecognition';
import type { VoiceLocale } from '../../features/voice/voiceLocale';

type UseChatInputVoiceOptions = {
  isSubmitting: boolean;
  onSubmit: () => void;
  onVoiceInput: (transcript: string) => void;
};

export function useChatInputVoice({
  isSubmitting,
  onSubmit,
  onVoiceInput,
}: UseChatInputVoiceOptions) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldRestoreFocusRef = useRef(false);
  const wasVoiceModeActiveRef = useRef(false);
  const [isVoiceLocalePickerOpen, setIsVoiceLocalePickerOpen] = useState(false);
  const { liveTranscript, status, startRecording, cancelRecording, confirmRecording } = useVoiceRecognition({
    onTranscript: onVoiceInput,
  });
  const isVoiceModeActive = status === 'recording' || status === 'processing';
  const isVoiceProcessing = status === 'processing';
  const isVoiceBusy = status !== 'idle';
  const isVoiceRequesting = status === 'requesting';

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isVoiceLocalePickerOpen || isVoiceModeActive || status === 'requesting') {
      return;
    }

    shouldRestoreFocusRef.current = document.activeElement === inputRef.current;
    onSubmit();
  }

  useEffect(() => {
    if (!isSubmitting && shouldRestoreFocusRef.current) {
      inputRef.current?.focus();
      shouldRestoreFocusRef.current = false;
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (wasVoiceModeActiveRef.current && !isVoiceModeActive && !isSubmitting) {
      inputRef.current?.focus();
    }

    wasVoiceModeActiveRef.current = isVoiceModeActive;
  }, [isSubmitting, isVoiceModeActive]);

  useEffect(() => {
    if (isVoiceModeActive || status === 'requesting') {
      setIsVoiceLocalePickerOpen(false);
    }
  }, [isVoiceModeActive, status]);

  function toggleVoiceLocalePicker() {
    if (isSubmitting || isVoiceBusy) {
      return;
    }

    setIsVoiceLocalePickerOpen((isOpen) => !isOpen);
  }

  function selectVoiceLocale(locale: VoiceLocale) {
    setIsVoiceLocalePickerOpen(false);
    startRecording(locale);
  }

  function closeVoiceLocalePicker() {
    setIsVoiceLocalePickerOpen(false);
  }

  return {
    closeVoiceLocalePicker,
    handleSubmit,
    inputRef,
    isVoiceBusy,
    isVoiceLocalePickerOpen,
    isVoiceModeActive,
    isVoiceProcessing,
    isVoiceRequesting,
    liveTranscript,
    toggleVoiceLocalePicker,
    selectVoiceLocale,
    cancelRecording,
    confirmRecording,
  };
}
