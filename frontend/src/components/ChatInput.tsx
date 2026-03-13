import { ChatTextEntry } from './ChatTextEntry';
import { ChatVoiceEntry } from './ChatVoiceEntry';
import { useChatInputVoice } from './hooks/useChatInputVoice';
import { useViewport } from '../contexts/useViewport';

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceInput: (transcript: string) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onVoiceInput,
  isSubmitting,
  canSubmit,
}: ChatInputProps) {
  const { isMobile } = useViewport();
  const placeholder = isMobile ? 'Ask anything' : 'Ask whatever you want';
  const {
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
  } = useChatInputVoice({
    isSubmitting,
    onSubmit,
    onVoiceInput,
  });

  return (
    <>
      {isVoiceModeActive ? (
        <ChatVoiceEntry
          isProcessing={isVoiceProcessing}
          liveTranscript={liveTranscript}
          onCancel={cancelRecording}
          onConfirm={confirmRecording}
        />
      ) : (
        <ChatTextEntry
          value={value}
          onChange={onChange}
          onSubmit={handleSubmit}
          onVoiceLocalePickerClose={closeVoiceLocalePicker}
          onVoiceInputStart={toggleVoiceLocalePicker}
          onVoiceLocaleSelect={selectVoiceLocale}
          inputRef={inputRef}
          placeholder={placeholder}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          isVoiceBusy={isVoiceBusy}
          isVoiceLocalePickerOpen={isVoiceLocalePickerOpen}
          isVoiceRequesting={isVoiceRequesting}
        />
      )}
    </>
  );
}
