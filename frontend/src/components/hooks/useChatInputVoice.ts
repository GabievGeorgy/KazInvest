import { useEffect, useRef, type SubmitEvent } from 'react';
import { useVoiceRecognition } from '../../features/voice/hooks/useVoiceRecognition';

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
  const { status, startRecording, cancelRecording, confirmRecording } = useVoiceRecognition({
    onTranscript: onVoiceInput,
  });
  const isVoiceModeActive = status === 'recording' || status === 'processing';
  const isVoiceProcessing = status === 'processing';
  const isVoiceBusy = status !== 'idle';
  const isVoiceRequesting = status === 'requesting';

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isVoiceModeActive || status === 'requesting') {
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

  return {
    handleSubmit,
    inputRef,
    isVoiceBusy,
    isVoiceModeActive,
    isVoiceProcessing,
    isVoiceRequesting,
    startRecording,
    cancelRecording,
    confirmRecording,
  };
}
