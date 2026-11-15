// Multi-language Text-To-Speech engine using Web Speech API

export type SupportedLanguage = "hi" | "bn" | "en";

export interface SpeechAlertOptions {
  text: string;
  lang?: SupportedLanguage;
  rate?: number;
  pitch?: number;
}

export function playScamAlertAudio(options: SpeechAlertOptions): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis is not supported in this environment");
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(options.text);
    utterance.rate = options.rate ?? 0.95; // Slightly slower for clear emergency delivery
    utterance.pitch = options.pitch ?? 1.05;

    // Language locale mapping
    switch (options.lang) {
      case "hi":
        utterance.lang = "hi-IN";
        break;
      case "bn":
        utterance.lang = "bn-IN";
        break;
      default:
        utterance.lang = "en-IN";
        break;
    }

    // Try finding matching native voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = (options.lang || "hi").toLowerCase();
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

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("Speech alert failed:", err);
    return false;
  }
}

export function stopScamAlertAudio() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
