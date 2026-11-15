"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playScamAlertAudio, stopScamAlertAudio, SupportedLanguage } from "@/lib/speech";

interface VoiceSpeakerButtonProps {
  text: string;
  lang?: SupportedLanguage;
  label?: string;
  className?: string;
}

export function VoiceSpeakerButton({
  text,
  lang = "hi",
  label = "Listen Warning Out Loud",
  className = "",
}: VoiceSpeakerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    if (isPlaying) {
      stopScamAlertAudio();
      setIsPlaying(false);
    } else {
      const success = playScamAlertAudio({ text, lang });
      if (success) {
        setIsPlaying(true);
        // Reset state after approximate audio length
        const duration = Math.min(12000, Math.max(3000, text.length * 80));
        setTimeout(() => setIsPlaying(false), duration);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="cyber"
      size="sm"
      onClick={handleToggle}
      className={`gap-2 font-medium ${className} ${
        isPlaying ? "bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse" : ""
      }`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="h-4 w-4 text-rose-400" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 text-cyan-400" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
