"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Radio,
  FileText,
  Activity,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  playPhoneRing,
  playSirenAlert,
  stopAllSounds,
} from "@/lib/soundEffects";
import { generateIncidentPdfReport } from "@/lib/pdfReport";

interface ScamScenario {
  id: string;
  title: string;
  category: string;
  callerName: string;
  callerNumber: string;
  transcript: string;
  spokenWarningBn: string;
  spokenWarningHi: string;
  spokenWarningEn: string;
  threatVerdict: string;
  threatDetails: string[];
}

const SCENARIOS: ScamScenario[] = [
  {
    id: "digital-arrest",
    title: "CBI 'Digital Arrest' Threat",
    category: "Extortion Fraud",
    callerName: "Inspector Vikram — Cyber Crime Cell",
    callerNumber: "+91 11-2436-8900 (Spoofed Official)",
    transcript:
      "Aapke Aadhaar card se 24 fake bank accounts khol kar 5 crore ka money laundering hua hai! Supreme Court ka digital arrest warrant issue hua hai. Turant camera on karke verification security deposit transfer karein!",
    spokenWarningBn:
      "সাবধান! এটি একটি সম্পূর্ণ অবৈধ ডিজিটাল অ্যারেস্ট ফ্রড! ভারতের বা বাংলাদেশের কোনো আইন শৃঙ্খলা রক্ষাকারী বাহিনী ভিডিও কলে ডিজিটাল অ্যারেস্ট করতে পারে না। অবিলম্বে কলটি কেটে ১৯৩০ হেল্পলাইনে জানান!",
    spokenWarningHi:
      "सावधान! यह एक फर्जी डिजिटल अरेस्ट फ्रॉड है! कोई भी पुलिस या सीबीआई अधिकारी ऑनलाइन डिजिटल अरेस्ट या पैसे की मांग नहीं करता। तुरंत 1930 पर शिकायत दर्ज करें!",
    spokenWarningEn:
      "Warning! Digital Arrest is completely illegal and non-existent. No police or court officer arrests people online or demands security deposits. Hang up immediately!",
    threatVerdict: "ILLEGAL DIGITAL ARREST EXTORTION",
    threatDetails: [
      "Caller claims authority from CBI / Supreme Court via telephone.",
      "Threatens immediate arrest unless 'clearance fee' is transferred.",
      "Digital arrest is legally non-existent in law enforcement procedures.",
    ],
  },
  {
    id: "ai-voice-clone",
    title: "AI Voice Clone Kidnap / Accident",
    category: "Deepfake Voice",
    callerName: "Arjun (Son) — Unknown Device",
    callerNumber: "+91 98210-44912 (Unrecognized)",
    transcript:
      "Papa! Meri car ka bohot bada accident ho gaya hai, ek aadmi hospital mein hai! Police mujhe pakadne waali hai, doctor operation ke liye turant ₹50,000 maang raha hai, please jaldi bhejo!",
    spokenWarningBn:
      "সতর্কবার্তা! এটি ৩-সেকেন্ড এআই ভয়েস ক্লোন প্রতারণা! ভয়েস ফ্রিকোয়েন্সিতে কৃত্রিম সিন্থেটিক আর্টিফ্যাক্ট পাওয়া গেছে। টাকা পাঠানোর আগে পরিবারের সদস্যকে অন্য নম্বরে ফোন করে যাচাই করুন!",
    spokenWarningHi:
      "सतर्कता! यह एआई वॉइस क्लोन फ्रॉड है! ऑडियो में वॉयस सिंथेसिस आर्टिफैक्ट्स पाए गए हैं। तुरंत अपने परिजन के निजी नंबर पर कॉल करके पुष्टि करें!",
    spokenWarningEn:
      "Alert! AI Voice Clone detected with 96% synthetic confidence. Vocoder pitch variance is flat. Do NOT transfer money; call family members on their known numbers directly!",
    threatVerdict: "AI VOICE CLONE EXTORTION TRAP",
    threatDetails: [
      "Acoustic frequency matches generative AI neural vocoder (Bark/ElevenLabs).",
      "Pitch jitter variance is under 0.03% (unnatural human speech).",
      "Coercive urgency keywords detected: 'accident', 'police', 'hospital'.",
    ],
  },
  {
    id: "electricity-urgency",
    title: "Urgent Power Cut Deception",
    category: "Utility Phishing",
    callerName: "Electricity Board Helpline",
    callerNumber: "WBSEDCL / Power Desk Alert",
    transcript:
      "Dear Consumer, your power supply will be disconnected tonight at 9:30 PM due to unpaid bill. Update bill immediately by downloading our officer verification APK file.",
    spokenWarningBn:
      "সতর্ক থাকুন! বিদ্যুৎ বিল প্রতারণা! বিদ্যুৎ দপ্তর কখনো এপিকে (APK) ফাইল ডাউনলোড করে বিল জমা দিতে বলে না। এই ফাইলটি মোবাইলে পাসওয়ার্ড চুরির ম্যালওয়্যার!",
    spokenWarningHi:
      "सावधान! यह बिजली बिल फ्रॉड है। कोई भी डिस्कॉम एपीके फाइल से बिल भरने को नहीं कहता। यह रिमोट एक्सेस ट्रोजन है!",
    spokenWarningEn:
      "Warning! Phishing alert. Utility companies never distribute APK files over call or SMS. This is an Android banking trojan (RAT).",
    threatVerdict: "ROGUE APK UTILITY PHISHING",
    threatDetails: [
      "Victim is coerced into installing remote administration tool (RAT).",
      "Fake power disconnect schedule designed to induce panic.",
    ],
  },
];

interface ScamCallSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  language?: "hi" | "bn" | "en";
}

export function ScamCallSimulator({
  isOpen,
  onClose,
  language = "bn",
}: ScamCallSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario>(
    SCENARIOS[0]
  );
  const [callState, setCallState] = useState<
    "idle" | "ringing" | "in-call" | "alert" | "ended"
  >("idle");
  const [callTimer, setCallTimer] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [typedTranscript, setTypedTranscript] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLang, setAudioLang] = useState<"hi" | "bn" | "en">(language);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const ringAudioTimeoutRef = useRef<any>(null);

  // Clean state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState("idle");
      setCallTimer(0);
      setScanProgress(0);
      setTypedTranscript("");
      stopAllSounds();
    } else {
      handleEndCall();
    }
  }, [isOpen]);

  // Audio Equalizer visualizer animation during in-call & alert
  useEffect(() => {
    if (callState !== "in-call" && callState !== "alert") {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let step = 0;
    const renderBars = () => {
      step += 0.15;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 28;
      const barWidth = canvas.width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        // Compute pseudo-random frequency heights that pulse with speech
        const freq =
          callState === "alert"
            ? Math.sin(step + i * 0.4) * 25 + 35 + (Math.random() * 15)
            : Math.sin(step + i * 0.3) * 18 + 22 + (Math.random() * 8);

        const x = i * (barWidth + 2);
        const y = (canvas.height - freq) / 2;

        // Gradient colors: cyan for in-call, flashing red for alert
        const gradient = ctx.createLinearGradient(0, y, 0, y + freq);
        if (callState === "alert") {
          gradient.addColorStop(0, "#f43f5e");
          gradient.addColorStop(1, "#fb7185");
        } else {
          gradient.addColorStop(0, "#06b6d4");
          gradient.addColorStop(1, "#6366f1");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, freq);
      }

      animFrameRef.current = requestAnimationFrame(renderBars);
    };

    renderBars();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [callState]);

  // Handle ringing simulation
  const handleStartRinging = () => {
    setCallState("ringing");
    setCallTimer(0);
    setScanProgress(0);
    setTypedTranscript("");
    playPhoneRing(8000);
  };

  // Accept call action
  const handleAcceptCall = () => {
    stopAllSounds();
    setCallState("in-call");
    setCallTimer(0);
    setScanProgress(15);

    // Call timer tick
    timerIntervalRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);

    // Type out the scammer speech progressively
    const fullText = selectedScenario.transcript;
    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx < fullText.length) {
        setTypedTranscript(fullText.substring(0, charIdx + 3));
        charIdx += 3;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    // Progress bar milestones:
    setTimeout(() => {
      setScanProgress(45);
    }, 1200);

    setTimeout(() => {
      setScanProgress(75);
    }, 2400);

    // After 3.8s, trigger the RED STROBE ALERT
    setTimeout(() => {
      setScanProgress(98);
      triggerScamAlert();
    }, 3800);
  };

  const triggerScamAlert = () => {
    setCallState("alert");
    playSirenAlert(2600);

    // Play regional spoken warning
    const warningText =
      audioLang === "bn"
        ? selectedScenario.spokenWarningBn
        : audioLang === "hi"
        ? selectedScenario.spokenWarningHi
        : selectedScenario.spokenWarningEn;

    speakAlertMessage(warningText, audioLang);
  };

  const speakAlertMessage = (text: string, lang: "hi" | "bn" | "en") => {
    setIsAudioPlaying(true);

    // Try server-side TTS first
    const langCode = lang === "bn" ? "bn-IN" : lang === "hi" ? "hi-IN" : "en-US";
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${langCode}`;
    const audio = new Audio(audioUrl);

    audio.onended = () => setIsAudioPlaying(false);
    audio.onerror = () => {
      // Browser Web Speech API fallback
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.rate = 1.0;
        utter.onend = () => setIsAudioPlaying(false);
        window.speechSynthesis.speak(utter);
      } else {
        setIsAudioPlaying(false);
      }
    };

    audio.play().catch(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.onend = () => setIsAudioPlaying(false);
        window.speechSynthesis.speak(utter);
      }
    });
  };

  const handleEndCall = () => {
    stopAllSounds();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (ringAudioTimeoutRef.current) clearTimeout(ringAudioTimeoutRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallState("ended");
    setIsAudioPlaying(false);
  };

  const handleDownloadDossier = () => {
    generateIncidentPdfReport({
      category: "AI_VOICE_CLONE",
      title: `Live Phone Call: ${selectedScenario.threatVerdict}`,
      verdict: selectedScenario.threatVerdict,
      riskScore: 98,
      subjectOrTarget: `${selectedScenario.callerName} (${selectedScenario.callerNumber})`,
      indicators: [
        `Extortion Mechanism: ${selectedScenario.category}`,
        `Transcribed Speech: "${selectedScenario.transcript}"`,
        ...selectedScenario.threatDetails,
      ],
      recommendations: [
        "Block caller immediately.",
        "Do NOT transfer funds or provide Aadhaar/OTP.",
        "Report to National Cybercrime Helpline 1930 and file online at cybercrime.gov.in.",
      ],
      extraDetails: {
        "Incident Channel": "Live Incoming Telephony Call",
        "Caller ID": selectedScenario.callerNumber,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700/80 bg-[#060A18] p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Top Header & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI Scam Call Simulator</span>
                <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/30">
                  Live Stage Demo
                </Badge>
              </h3>
              <p className="text-[11px] text-slate-400">
                Experience frontline extortion calls & automated 4-second AI defense.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleEndCall();
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scenario Selection (When idle or ended) */}
        {(callState === "idle" || callState === "ended") && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block">
                Select Scam Attack Scenario for Judges:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedScenario.id === sc.id
                        ? "border-cyan-500/60 bg-cyan-950/30 text-white shadow-lg shadow-cyan-500/10"
                        : "border-slate-800 bg-[#080D1F] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        selectedScenario.id === sc.id
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <Radio className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{sc.title}</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {sc.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        Caller: {sc.callerName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector for Spoken Warning */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#080D1F] border border-slate-800">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                Spoken Warning Language:
              </span>
              <div className="flex gap-1.5">
                {(["bn", "hi", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setAudioLang(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      audioLang === l
                        ? "bg-cyan-500 text-slate-950 shadow-md"
                        : "bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {l === "bn" ? "বাংলা" : l === "hi" ? "हिंदी" : "EN"}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <Button
              variant="cyber"
              size="lg"
              onClick={handleStartRinging}
              className="w-full gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20"
            >
              <PhoneCall className="h-4 w-4 animate-bounce" />
              <span>Launch Live Incoming Call Simulation</span>
            </Button>
          </div>
        )}

        {/* PHONE INTERFACE (Ringing, In-Call, Alert) */}
        {(callState === "ringing" ||
          callState === "in-call" ||
          callState === "alert") && (
          <div
            className={`mt-4 rounded-3xl border p-5 transition-all duration-300 ${
              callState === "alert"
                ? "border-rose-500 bg-gradient-to-b from-rose-950/40 via-[#060A18] to-rose-950/20 ring-4 ring-rose-500/20 animate-pulse"
                : "border-slate-800 bg-[#050813]"
            }`}
          >
            {/* Caller Profile Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-xl ${
                    callState === "alert"
                      ? "border-rose-500 bg-rose-500/20 text-rose-400 animate-bounce"
                      : "border-cyan-500/50 bg-cyan-950/40 text-cyan-400 animate-pulse"
                  }`}
                >
                  {callState === "alert" ? (
                    <ShieldAlert className="h-10 w-10 text-rose-500" />
                  ) : (
                    <User className="h-10 w-10 text-slate-200" />
                  )}
                </div>
                {callState === "ringing" && (
                  <span className="absolute top-0 right-0 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedScenario.callerName}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedScenario.callerNumber}
                </p>
                <div className="mt-1">
                  {callState === "ringing" && (
                    <span className="text-xs text-cyan-400 animate-pulse font-medium">
                      Incoming Call Ringing...
                    </span>
                  )}
                  {callState === "in-call" && (
                    <span className="text-xs text-emerald-400 font-mono">
                      Connected • 00:
                      {callTimer < 10 ? `0${callTimer}` : callTimer}
                    </span>
                  )}
                  {callState === "alert" && (
                    <span className="text-xs text-rose-400 font-bold tracking-wide animate-pulse">
                      🚨 SCAM INTERCEPTED IN 03 SECONDS
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Audio Waveform Canvas */}
            {(callState === "in-call" || callState === "alert") && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-[#030611] p-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 px-1">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-cyan-400" />
                    Live Neural Vocoder Acoustic Stream:
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      callState === "alert" ? "text-rose-400" : "text-cyan-400"
                    }`}
                  >
                    AI Score: {scanProgress}%
                  </span>
                </div>
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={50}
                  className="w-full h-12 rounded-lg bg-black/40"
                />
              </div>
            )}

            {/* Live Typing Transcript */}
            {callState !== "ringing" && typedTranscript && (
              <div className="mt-3 rounded-xl border border-slate-800 bg-[#080D1D]/70 p-3 text-xs text-slate-300 font-sans leading-relaxed">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Real-time Call Transcript:
                </span>
                &quot;{typedTranscript}&quot;
              </div>
            )}

            {/* Intercept Alert Verdict Banner */}
            {callState === "alert" && (
              <div className="mt-4 rounded-2xl border border-rose-500/60 bg-rose-950/40 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{selectedScenario.threatVerdict}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {audioLang === "bn"
                    ? selectedScenario.spokenWarningBn
                    : audioLang === "hi"
                    ? selectedScenario.spokenWarningHi
                    : selectedScenario.spokenWarningEn}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDownloadDossier}
                    className="gap-2 text-xs font-bold w-full"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download 1930 Forensic Dossier (PDF)</span>
                  </Button>
                </div>
              </div>
            )}

            {/* In-Call Controls */}
            <div className="mt-6 flex items-center justify-around pt-2">
              {callState === "ringing" ? (
                <>
                  <button
                    onClick={handleEndCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-transform active:scale-95"
                    title="Decline Call"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>

                  <button
                    onClick={handleAcceptCall}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 hover:bg-emerald-400 transition-transform active:scale-95 animate-bounce"
                    title="Accept Call"
                  >
                    <Phone className="h-7 w-7" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-transform active:scale-95"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span>Hang Up Simulation</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Powered by OmniShield Acoustic Neural Engine</span>
          <span className="text-cyan-400 font-semibold">Zero PIN Stored</span>
        </div>
      </div>
    </div>
  );
}
