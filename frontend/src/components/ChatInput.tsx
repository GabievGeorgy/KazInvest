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
    handleSubmit,
    inputRef,
    isVoiceBusy,
    isVoiceModeActive,
    isVoiceProcessing,
    isVoiceRequesting,
    startRecording,
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
          onCancel={cancelRecording}
          onConfirm={confirmRecording}
        />
      ) : (
        <ChatTextEntry
          value={value}
          onChange={onChange}
          onSubmit={handleSubmit}
          onVoiceInputStart={startRecording}
          inputRef={inputRef}
          placeholder={placeholder}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          isVoiceBusy={isVoiceBusy}
          isVoiceRequesting={isVoiceRequesting}
        />
      )}
    </>
  );
}
