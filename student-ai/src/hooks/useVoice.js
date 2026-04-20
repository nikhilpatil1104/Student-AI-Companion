// ============================================================
// FILE: src/hooks/useVoice.js
// PURPOSE: Web Speech API voice recognition hook
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export function useVoice({ onResult, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported] = useState(!!SpeechRecognition);
  const [volume, setVolume] = useState(0);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);

  // ── Setup audio analyser for visualizer ──────────────────
  const startAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(avg / 128); // normalize 0–1
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Mic access denied — visual fallback only
    }
  }, []);

  const stopAudioAnalyser = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    audioContextRef.current?.close();
    setVolume(0);
  }, []);

  // ── Start listening ───────────────────────────────────────
  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      startAudioAnalyser();
    };

    recognition.onresult = (e) => {
      const current = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setTranscript(current);

      // Final result
      if (e.results[e.results.length - 1].isFinal) {
        onResult?.(current);
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      onError?.(e.error);
      setIsListening(false);
      stopAudioAnalyser();
    };

    recognition.onend = () => {
      setIsListening(false);
      stopAudioAnalyser();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, isListening, onResult, onError, startAudioAnalyser, stopAudioAnalyser]);

  // ── Stop listening ────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    stopAudioAnalyser();
  }, [stopAudioAnalyser]);

  // ── Text-to-speech for AI responses ──────────────────────
  const speak = useCallback((text, { rate = 0.95, pitch = 1.05 } = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 0.8;

    // Prefer a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US'
    );
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      stopAudioAnalyser();
      window.speechSynthesis?.cancel();
    };
  }, [stopAudioAnalyser]);

  return {
    isListening,
    transcript,
    isSupported,
    volume,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
  };
}
