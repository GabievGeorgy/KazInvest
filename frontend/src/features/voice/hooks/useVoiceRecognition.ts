import { useEffect, useRef, useState } from 'react';

export type VoiceRecognitionStatus = 'idle' | 'requesting' | 'recording' | 'processing';

type UseVoiceRecognitionOptions = {
  onTranscript: (transcript: string) => void;
};

function getRecognitionConstructor() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function getVoiceErrorMessage(error: string) {
  switch (error) {
    case 'audio-capture':
      return 'Voice input is unavailable. Check your microphone settings and try again.';
    case 'network':
      return 'Voice input requires a network connection. Try again in a moment.';
    case 'no-speech':
      return 'Voice input did not detect speech. Try again and speak closer to the microphone.';
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Voice input is unavailable because microphone access was blocked.';
    default:
      return 'Voice input could not be completed. Try again.';
  }
}

function collectTranscript(results: SpeechRecognitionResultList) {
  const segments: string[] = [];

  for (let index = 0; index < results.length; index += 1) {
    const alternative = results[index]?.[0];

    if (alternative?.transcript) {
      segments.push(alternative.transcript.trim());
    }
  }

  return segments.join(' ').trim();
}

export function useVoiceRecognition({ onTranscript }: UseVoiceRecognitionOptions) {
  const [status, setStatus] = useState<VoiceRecognitionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const statusRef = useRef<VoiceRecognitionStatus>('idle');
  const transcriptRef = useRef('');
  const shouldCommitRef = useRef(false);
  const shouldDiscardRef = useRef(false);
  const hasErrorRef = useRef(false);

  function updateStatus(nextStatus: VoiceRecognitionStatus) {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }

  function updateTranscript(nextTranscript: string) {
    transcriptRef.current = nextTranscript;
  }

  function commitTranscript(nextTranscript: string) {
    onTranscriptRef.current(nextTranscript);
  }

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  function getRecognition() {
    if (recognitionRef.current) {
      return recognitionRef.current;
    }

    const Recognition = getRecognitionConstructor();

    if (!Recognition) {
      return null;
    }

    const recognition = new Recognition();

    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      hasErrorRef.current = false;
      updateStatus('recording');
    };

    recognition.onresult = (event) => {
      updateTranscript(collectTranscript(event.results));
    };

    recognition.onerror = (event) => {
      if (shouldDiscardRef.current) {
        return;
      }

      hasErrorRef.current = true;
      shouldCommitRef.current = false;
      setErrorMessage(getVoiceErrorMessage(event.error));
      updateStatus('idle');
    };

    recognition.onend = () => {
      const previousStatus = statusRef.current;
      const nextTranscript = transcriptRef.current.trim();

      updateStatus('idle');
      updateTranscript('');

      if (shouldDiscardRef.current) {
        shouldDiscardRef.current = false;
        shouldCommitRef.current = false;
        hasErrorRef.current = false;
        return;
      }

      if (hasErrorRef.current) {
        hasErrorRef.current = false;
        return;
      }

      const shouldCommit =
        shouldCommitRef.current ||
        ((previousStatus === 'recording' || previousStatus === 'processing') && nextTranscript.length > 0);

      shouldCommitRef.current = false;

      if (shouldCommit && nextTranscript) {
        setErrorMessage(null);
        commitTranscript(nextTranscript);
        return;
      }

      if (previousStatus === 'processing') {
        setErrorMessage('Voice input could not recognize speech. Try again.');
      }
    };

    recognitionRef.current = recognition;

    return recognition;
  }

  function startRecording() {
    if (statusRef.current !== 'idle') {
      return;
    }

    const recognition = getRecognition();

    if (!recognition) {
      setErrorMessage('Voice input is not supported in this browser.');
      return;
    }

    shouldCommitRef.current = false;
    shouldDiscardRef.current = false;
    hasErrorRef.current = false;
    updateTranscript('');
    setErrorMessage(null);
    updateStatus('requesting');

    try {
      recognition.start();
    }
    catch {
      updateStatus('idle');
      setErrorMessage('Voice input could not be started. Try again.');
    }
  }

  function cancelRecording() {
    shouldDiscardRef.current = true;
    shouldCommitRef.current = false;
    hasErrorRef.current = false;
    updateTranscript('');
    updateStatus('idle');

    try {
      recognitionRef.current?.abort();
    }
    catch {
      shouldDiscardRef.current = false;
    }
  }

  function confirmRecording() {
    if (statusRef.current !== 'recording') {
      return;
    }

    shouldCommitRef.current = true;
    updateStatus('processing');

    try {
      recognitionRef.current?.stop();
    }
    catch {
      shouldCommitRef.current = false;
      updateStatus('idle');
      setErrorMessage('Voice input could not be completed. Try again.');
    }
  }

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      }
      catch {
        // Ignore browser-specific cleanup errors during unmount.
      }
    };
  }, []);

  return {
    errorMessage,
    status,
    startRecording,
    cancelRecording,
    confirmRecording,
  };
}
