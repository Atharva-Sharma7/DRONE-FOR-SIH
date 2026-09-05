/**
 * Advanced Multilingual Speech Synthesis (TTS) Engine for AgriDrone Platform
 * Dual-Engine Architecture:
 * 1. High-Fidelity Regional Audio Streaming via Backend TTS API (Natural native voices)
 * 2. Browser Web Speech Synthesis Fallback with Smart Phonetic Voice Selection
 *
 * Supports: Marathi (mr), Hindi (hi), Telugu (te), Tamil (ta), Gujarati (gu), Punjabi (pa), English (en)
 */

import { API_BASE_URL } from '@/lib/constants';

export const SPEECH_LANG_MAP: Record<string, string[]> = {
  mr: ['mr-IN', 'mr', 'hi-IN', 'hi'],      // Marathi with Hindi phonetic fallback for Devanagari
  hi: ['hi-IN', 'hi'],
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  te: ['te-IN', 'te'],
  ta: ['ta-IN', 'ta'],
  gu: ['gu-IN', 'gu', 'hi-IN'],
  pa: ['pa-IN', 'pa', 'hi-IN'],
};

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeEndCallback: (() => void) | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined') {
    // 1. Stop HTML5 Audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    // 2. Stop Web Speech Synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }

    if (activeEndCallback) {
      const cb = activeEndCallback;
      activeEndCallback = null;
      cb();
    }
  }
}

/**
 * Fallback to browser's SpeechSynthesis API
 */
function speakViaSpeechSynthesis(
  cleanText: string,
  langCode: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const preferredLangs = SPEECH_LANG_MAP[langCode] || ['hi-IN', 'en-IN'];
  utterance.lang = preferredLangs[0];
  utterance.rate = 0.90; // Optimized pace for rural comprehension
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  let selectedVoice: SpeechSynthesisVoice | null = null;

  // Search through preferred language codes
  for (const code of preferredLangs) {
    const target = code.toLowerCase().replace('_', '-');
    const match = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === target || vLang.startsWith(target.split('-')[0]);
    });
    if (match) {
      selectedVoice = match;
      utterance.lang = match.lang;
      break;
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    activeEndCallback = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    currentUtterance = null;
    activeEndCallback = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Primary Speak function — plays natural regional speech
 */
export function speakText(
  text: string,
  langCode: string = 'mr',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined') return;

  // Stop any ongoing speech first
  stopSpeaking();

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  activeEndCallback = onEnd || null;

  // Try Engine 1: High quality native audio via Backend TTS Stream
  try {
    const ttsUrl = `${API_BASE_URL}/tts/speak?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(langCode)}`;
    const audio = new Audio(ttsUrl);
    currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      activeEndCallback = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // If streaming fails (e.g. backend unreachable or offline), smoothly fallback to SpeechSynthesis
      currentAudio = null;
      speakViaSpeechSynthesis(cleanText, langCode, onStart, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to SpeechSynthesis if autoplay or codec is blocked
        currentAudio = null;
        speakViaSpeechSynthesis(cleanText, langCode, onStart, onEnd);
      });
    }
  } catch (err) {
    // Immediate fallback
    speakViaSpeechSynthesis(cleanText, langCode, onStart, onEnd);
  }
}
