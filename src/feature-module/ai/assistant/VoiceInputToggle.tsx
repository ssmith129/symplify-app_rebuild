import React, { useState, useCallback } from 'react';

interface VoiceInputToggleProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const MOCK_TRANSCRIPTS = [
  'Check drug interactions for metformin and lisinopril',
  'Show clinical alerts for my patients',
  'Schedule a follow-up appointment',
  'What is the bed availability in ICU',
  'Prepare shift handoff report',
];

const VoiceInputToggle: React.FC<VoiceInputToggleProps> = ({ onTranscript, disabled }) => {
  const [listening, setListening] = useState(false);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (listening) {
      setListening(false);
      return;
    }

    setListening(true);
    // Simulate voice recognition with a mock transcript after a delay
    setTimeout(() => {
      const transcript = MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
      onTranscript(transcript);
      setListening(false);
    }, 1500 + Math.random() * 1000);
  }, [listening, disabled, onTranscript]);

  return (
    <button
      type="button"
      className={`ai-voice-btn ${listening ? 'listening' : ''}`}
      onClick={handleToggle}
      disabled={disabled}
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={listening}
    >
      <i className={`ti ${listening ? 'ti-microphone' : 'ti-microphone'}`} />
      {listening && <span className="voice-pulse" />}
    </button>
  );
};

export default VoiceInputToggle;
