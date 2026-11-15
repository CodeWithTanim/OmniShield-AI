// Multi-language Audio Voice engine with HTML5 Audio & Web Speech API fallback

export type SupportedLanguage = "hi" | "bn" | "en";

export interface SpeechAlertOptions {
  text: string;
  lang?: SupportedLanguage;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: () => void;
}

let activeAudio: HTMLAudioElement | null = null;

export function playScamAlertAudio(options: SpeechAlertOptions): boolean {
  if (typeof window === "undefined") return false;

  stopScamAlertAudio();

  const lang = options.lang || "hi";
  const cleanText = (options.text || "").trim();
  if (!cleanText) return false;

  try {
    // 1. Primary: Use dedicated high-definition localized audio stream from /api/tts
    const ttsUrl = `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(ttsUrl);
    activeAudio = audio;

    audio.onended = () => {
      activeAudio = null;
      if (options.onEnd) options.onEnd();
    };

    audio.onerror = () => {
      activeAudio = null;
      // 2. Fallback: Browser Web Speech API if network audio fails
      playWebSpeechFallback(cleanText, lang, options.onEnd);
    };

    audio.play().catch(() => {
      // Browser autoplay policy might need fallback
      playWebSpeechFallback(cleanText, lang, options.onEnd);
    });

    return true;
  } catch {
    return playWebSpeechFallback(cleanText, lang, options.onEnd);
  }
}

function playWebSpeechFallback(text: string, lang: SupportedLanguage, onEnd?: () => void): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    switch (lang) {
      case "bn":
        utterance.lang = "bn-BD";
        break;
      case "hi":
        utterance.lang = "hi-IN";
        break;
      default:
        utterance.lang = "en-IN";
        break;
    }

    const voices = window.speechSynthesis.getVoices();
    const targetLang = lang.toLowerCase();
    const matchingVoice = voices.find((v) => {
      const code = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      if (targetLang === "bn") {
        return code.startsWith("bn") || name.includes("bengali") || name.includes("bangla");
      }
      if (targetLang === "hi") {
        return code.startsWith("hi") || name.includes("hindi");
      }
      return code.startsWith("en") || name.includes("english");
    });

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("WebSpeech fallback failed:", err);
    return false;
  }
}

export function stopScamAlertAudio() {
  if (typeof window !== "undefined") {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}
