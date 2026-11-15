"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportedLanguage } from "@/lib/speech";

interface LiveVoiceRecorderProps {
  onTranscriptChange: (text: string) => void;
  onRecordingComplete: (text: string) => void;
  language: SupportedLanguage;
}

export function LiveVoiceRecorder({
  onTranscriptChange,
  onRecordingComplete,
  language,
}: LiveVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>("");

  const startRecording = async () => {
    try {
      setMicError(null);
      setRecordingSeconds(0);
      finalTranscriptRef.current = "";

      // 1. Get audio stream for live waveform visualizer
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Start canvas waveform animation loop
      renderWaveform();

      // 2. Start Speech Recognition if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        // Set locale
        switch (language) {
          case "bn":
            recognition.lang = "bn-BD";
            break;
          case "hi":
            recognition.lang = "hi-IN";
            break;
          default:
            recognition.lang = "en-US";
            break;
        }

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          finalTranscriptRef.current = currentTranscript;
          onTranscriptChange(currentTranscript);
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition notice:", e.error);
        };

        recognition.start();
      } else {
        console.warn("SpeechRecognition not natively supported, continuing with audio waveform.");
      }

      setIsRecording(true);

      // Start recording timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setMicError(
        err?.message || "Microphone access denied. Please allow microphone permissions to test live voice."
      );
      stopRecording();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (finalTranscriptRef.current.trim()) {
      onRecordingComplete(finalTranscriptRef.current.trim());
    }
  };

  const renderWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Gradient color: Cyan to Indigo
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "#06B6D4");
        gradient.addColorStop(1, "#818CF8");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight || 4);

        x += barWidth;
      }
    };

    draw();
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#080D1B] p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRecording ? "bg-rose-500 animate-ping" : "bg-slate-600"
            }`}
          />
          <span className="text-xs font-semibold text-slate-300">
            {isRecording
              ? `Live Audio Analyzing (${recordingSeconds}s)...`
              : "Live Microphone Voice Input"}
          </span>
        </div>

        {isRecording ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={stopRecording}
            className="h-8 gap-1.5 text-xs shadow-lg shadow-rose-500/20"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span>Stop & Analyze Call</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="cyber"
            size="sm"
            onClick={startRecording}
            className="h-8 gap-1.5 text-xs"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Start Live Mic Listening</span>
          </Button>
        )}
      </div>

      {/* Real-time Waveform Canvas */}
      {isRecording && (
        <div className="rounded-lg bg-[#040711] p-2 border border-cyan-500/30">
          <canvas
            ref={canvasRef}
            width={380}
            height={48}
            className="w-full h-12 block"
          />
          <p className="text-[10px] text-center text-cyan-300 mt-1 font-mono">
            Speak a suspicious distress message (e.g., "Mera accident ho gaya hai...")
          </p>
        </div>
      )}

      {micError && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-950/20 p-2 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{micError}</span>
        </div>
      )}
    </div>
  );
}
