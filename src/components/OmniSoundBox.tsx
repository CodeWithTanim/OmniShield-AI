"use client";

import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Radio,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  playPaymentChime,
  playWarningBuzzer,
  playSirenAlert,
  stopAllSounds,
} from "@/lib/soundEffects";

interface OmniSoundBoxProps {
  language?: "hi" | "bn" | "en";
  className?: string;
  onBroadcast?: (message: string) => void;
}

export function OmniSoundBox({
  language = "bn",
  className = "",
  onBroadcast,
}: OmniSoundBoxProps) {
  const [selectedLang, setSelectedLang] = useState<"hi" | "bn" | "en">(language);
  const [soundboxState, setSoundboxState] = useState<
    "idle" | "playing-fake" | "playing-tamper" | "playing-success"
  >("idle");
  const [lcdText, setLcdText] = useState("OMNISHIELD ACTIVE");
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);

  const speakAudio = (text: string, lang: "hi" | "bn" | "en") => {
    if (isMuted) return;

    const langCode = lang === "bn" ? "bn-IN" : lang === "hi" ? "hi-IN" : "en-US";
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${langCode}`;
    const audio = new Audio(audioUrl);
    audio.volume = volume / 100;

    audio.onended = () => {
      setSoundboxState("idle");
      setLcdText("OMNISHIELD ACTIVE");
    };

    audio.onerror = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.volume = volume / 100;
        utter.onend = () => {
          setSoundboxState("idle");
          setLcdText("OMNISHIELD ACTIVE");
        };
        window.speechSynthesis.speak(utter);
      } else {
        setSoundboxState("idle");
        setLcdText("OMNISHIELD ACTIVE");
      }
    };

    audio.play().catch(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.volume = volume / 100;
        utter.onend = () => {
          setSoundboxState("idle");
          setLcdText("OMNISHIELD ACTIVE");
        };
        window.speechSynthesis.speak(utter);
      } else {
        setSoundboxState("idle");
        setLcdText("OMNISHIELD ACTIVE");
      }
    });
  };

  // 1. Trigger Fake Payment Screenshot / Fake UTR Voice Warning
  const handleTriggerFakePayment = async () => {
    stopAllSounds();
    setSoundboxState("playing-fake");
    setLcdText("ALERT: ₹0 RECD / FAKE");
    await playWarningBuzzer();

    const phrases = {
      bn: "সাবধান! সতর্ক থাকুন! এটি একটি জাল পেমেন্ট স্ক্রিনশট! আপনার ব্যাংক অ্যাকাউন্টে কোনো টাকা জমা হয়নি! শূন্য টাকা প্রাপ্ত হয়েছে!",
      hi: "सावधान! यह एक फर्जी पेमेंट स्क्रीनशॉट है! आपके खाते में कोई पैसा जमा नहीं हुआ! शून्य रुपये प्राप्त हुए!",
      en: "Alert! Fake payment screenshot detected! Zero rupees received in your bank. Do not hand over goods!",
    };

    speakAudio(phrases[selectedLang], selectedLang);
    onBroadcast?.(phrases[selectedLang]);
  };

  // 2. Trigger Tampered Counter QR Voice Warning
  const handleTriggerTamperedQr = async () => {
    stopAllSounds();
    setSoundboxState("playing-tamper");
    setLcdText("QR TAMPER DETECTED");
    await playSirenAlert(1200);

    const phrases = {
      bn: "সতর্কতা! আপনার দোকানের কিউআর কোডের ওপর ভুয়া স্টিকার লাগানো হয়েছে! অবিলম্বে স্টিকারটি সরিয়ে ফেলুন এবং সঠিক কিউআর প্রদর্শন করুন!",
      hi: "चेतावनी! आपके काउंटर क्यूआर पर नकली स्टीकर लगाया गया है! तुरंत क्यूआर स्टीकर हटाएं!",
      en: "Warning! Counter QR code tampering detected! An unauthorized sticker has been pasted over your merchant QR code!",
    };

    speakAudio(phrases[selectedLang], selectedLang);
    onBroadcast?.(phrases[selectedLang]);
  };

  // 3. Trigger Authentic Clean Payment Announcement
  const handleTriggerCleanPayment = async () => {
    stopAllSounds();
    setSoundboxState("playing-success");
    setLcdText("₹50.00 RECEIVED");
    await playPaymentChime();

    const phrases = {
      bn: "অমনিশিল্ড পে: পঞ্চাশ টাকা সফলভাবে জমা হয়েছে।",
      hi: "অমনিশিল্ড পে: पचास रुपये सफलतापूर्वक प्राप्त हुए।",
      en: "OmniShield Pay: Fifty rupees received successfully.",
    };

    speakAudio(phrases[selectedLang], selectedLang);
    onBroadcast?.(phrases[selectedLang]);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-[#0B132B] via-[#070D1F] to-[#040814] p-5 shadow-2xl ${className}`}
    >
      {/* Decorative Speaker Top Mesh Ring */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-wide text-white">
                OmniSound™ Smart Merchant Audio Box
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                IoT Audio Hub
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              High-decibel audible shopkeeper alerts for fake UPI screenshots & sticker swaps.
            </p>
          </div>
        </div>

        {/* Status LED */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          <Wifi className="h-3 w-3 text-cyan-400" />
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              soundboxState === "playing-fake" || soundboxState === "playing-tamper"
                ? "bg-rose-500 animate-ping"
                : soundboxState === "playing-success"
                ? "bg-emerald-400 animate-pulse"
                : "bg-cyan-400"
            }`}
          />
          <span className="text-[10px] font-mono font-bold text-slate-300">
            {soundboxState === "idle" ? "STANDBY" : "BROADCASTING"}
          </span>
        </div>
      </div>

      {/* HARDWARE REPLICA CHASSIS */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: LCD Display & Speaker Grille Visual */}
        <div className="md:col-span-5 flex flex-col items-center">
          {/* LCD Backlit Screen */}
          <div className="w-full rounded-xl border border-cyan-500/30 bg-[#031525] p-3 shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400/80 pb-1 border-b border-cyan-900/40">
              <span>OMNI-SOUND v2.4</span>
              <span>VOL: {volume}%</span>
            </div>
            <div
              className={`mt-2 py-2 text-center font-mono font-black text-sm tracking-wider transition-colors ${
                soundboxState === "playing-fake" || soundboxState === "playing-tamper"
                  ? "text-rose-400 animate-pulse"
                  : soundboxState === "playing-success"
                  ? "text-emerald-400"
                  : "text-cyan-300"
              }`}
            >
              {lcdText}
            </div>
          </div>

          {/* Hexagonal Speaker Mesh Simulation */}
          <div className="mt-3 w-full h-24 rounded-2xl border border-slate-800 bg-[#050A18] flex items-center justify-center relative overflow-hidden p-3">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px]" />
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-transform duration-300 ${
                soundboxState !== "idle"
                  ? "scale-110 border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse"
                  : "border-slate-700 bg-slate-900/70 text-slate-400"
              }`}
            >
              <Volume2 className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Right: Soundbox Quick Controls & Language Selector */}
        <div className="md:col-span-7 space-y-3">
          {/* Language Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#060D1E] border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              Soundbox Spoken Language:
            </span>
            <div className="flex gap-1">
              {(["bn", "hi", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLang === lang
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिंदी" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Quick Action Demonstrations */}
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={handleTriggerFakePayment}
              disabled={soundboxState !== "idle"}
              className="flex items-center justify-between p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 text-left transition-all group active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-300">
                    Broadcast Fake Payment Warning
                  </div>
                  <div className="text-[11px] text-slate-400">
                    &quot;সাবধান! এটি একটি জাল পেমেন্ট স্ক্রিনশট...&quot;
                  </div>
                </div>
              </div>
              <Play className="h-4 w-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleTriggerTamperedQr}
              disabled={soundboxState !== "idle"}
              className="flex items-center justify-between p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 text-left transition-all group active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300">
                    Broadcast Tampered QR Sticker Warning
                  </div>
                  <div className="text-[11px] text-slate-400">
                    &quot;সতর্কতা! আপনার কাউন্টারের কিউআর টেম্পার করা হয়েছে...&quot;
                  </div>
                </div>
              </div>
              <Play className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleTriggerCleanPayment}
              disabled={soundboxState !== "idle"}
              className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-left transition-all group active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    Announce Clean Payment (₹50 Received)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    &quot;অমনিশিল্ড পে: ৫০ টাকা সফলভাবে জমা হয়েছে&quot;
                  </div>
                </div>
              </div>
              <Play className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
