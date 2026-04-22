// ============================================================
// FILE: src/components/VoiceInput.jsx
// PURPOSE: Voice input button + transcript display + text fallback
// ============================================================

import React, { useState } from 'react';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

export default function VoiceInput({ onSubmit, isLoading }) {
  const [textInput, setTextInput] = useState('');
  const [mode, setMode] = useState('text'); // 'text' | 'voice'

  const { isListening, transcript, isSupported, volume, startListening, stopListening } =
    useVoice({
      onResult: (text) => {
        setTextInput(text);
      },
    });

  const handleSubmit = () => {
    const query = textInput.trim();
    if (!query || isLoading) return;
    onSubmit(query);
    setTextInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      setMode('voice');
      startListening();
    }
  };

  // Voice level scale for visualizer
  const scale = 1 + volume * 0.4;

  return (
    <div className="flex flex-col gap-3">
      {/* Text input area */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(13, 17, 32, 0.9)',
          border: isListening
            ? '1px solid rgba(108, 99, 255, 0.6)'
            : '1px solid rgba(26, 32, 53, 0.8)',
          boxShadow: isListening ? '0 0 20px rgba(108, 99, 255, 0.15)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <textarea
          value={isListening ? transcript || '🎤 Listening...' : textInput}
          onChange={(e) => !isListening && setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask me anything… "Should I pull an all-nighter?" or "How do I budget this week?"'
          readOnly={isListening}
          rows={3}
          className="w-full bg-transparent px-4 pt-4 pb-12 text-white/90 placeholder-white/20 resize-none outline-none font-body text-sm leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
          <span className="text-xs text-white/30 font-mono">
            {isListening ? 'Speaking...' : `${textInput.length} chars`}
          </span>
          <div className="flex items-center gap-2">
            {textInput && !isListening && (
              <button
                onClick={() => setTextInput('')}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!textInput.trim() || isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: textInput.trim() && !isLoading
                  ? 'linear-gradient(135deg, #6C63FF, #00F5C4)'
                  : 'rgba(26, 32, 53, 0.8)',
                color: textInput.trim() && !isLoading ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            >
              <Send size={12} />
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* Voice button + divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Voice button */}
        <div className="relative flex items-center justify-center">
          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <div className="mic-ring" style={{ transform: `scale(${scale})` }} />
              <div className="mic-ring" style={{ animationDelay: '0.4s', transform: `scale(${scale * 0.8})` }} />
            </>
          )}

          <button
            onClick={toggleVoice}
            disabled={!isSupported}
            className={`voice-btn relative z-10 ${isListening ? 'listening' : ''}`}
            style={{
              background: isListening
                ? 'rgba(108, 99, 255, 0.2)'
                : 'rgba(26, 32, 53, 0.9)',
              transform: isListening ? `scale(${scale})` : 'scale(1)',
              transition: 'transform 0.1s ease',
            }}
            title={isSupported ? 'Click to speak' : 'Voice not supported in this browser'}
          >
            {isListening ? (
              <MicOff size={24} color="#FF6B6B" />
            ) : (
              <Mic size={24} color={isSupported ? '#6C63FF' : '#555'} />
            )}
          </button>
        </div>

        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Voice hint */}
      <p className="text-center text-xs text-white/30 font-body">
        {isSupported
          ? isListening
            ? 'Tap the mic to stop — I\'ll read your words'
            : 'Tap the mic to speak, or type above'
          : 'Voice input not available — use text input'}
      </p>
    </div>
  );
}
