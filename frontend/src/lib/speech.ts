/**
 * Web Speech Synthesis (TTS) Engine for AgriDrone Platform
 * Enables illiterate farmers to listen to live diagnostic advice in their mother tongue
 */

export const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
};

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function speakText(
  text: string, 
  langCode: string = 'mr', 
  onStart?: () => void, 
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Stop any ongoing speech first
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetLang = SPEECH_LANG_MAP[langCode] || 'hi-IN';
  utterance.lang = targetLang;
  utterance.rate = 0.92; // Slightly slower for clarity in rural field environments
  utterance.pitch = 1.0;

  // Try to find a regional voice if loaded
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang.toLowerCase());
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
