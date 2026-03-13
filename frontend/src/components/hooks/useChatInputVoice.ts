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
  const [isVoiceLocalePickerRequested, setIsVoiceLocalePickerRequested] = useState(false);
  const { liveTranscript, status, startRecording, cancelRecording, confirmRecording } = useVoiceRecognition({
    onTranscript: onVoiceInput,
  });
  const isVoiceModeActive = status === 'recording' || status === 'processing';
  const isVoiceProcessing = status === 'processing';
  const isVoiceBusy = status !== 'idle';
  const isVoiceRequesting = status === 'requesting';
  const isVoiceLocalePickerOpen = isVoiceLocalePickerRequested && !isVoiceBusy;

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

  function toggleVoiceLocalePicker() {
    if (isSubmitting || isVoiceBusy) {
      return;
    }

    setIsVoiceLocalePickerRequested((isOpen) => !isOpen);
  }

  function selectVoiceLocale(locale: VoiceLocale) {
    setIsVoiceLocalePickerRequested(false);
    startRecording(locale);
  }

  function closeVoiceLocalePicker() {
    setIsVoiceLocalePickerRequested(false);
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
