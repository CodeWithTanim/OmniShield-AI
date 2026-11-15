"use client";

import React, { useState } from "react";
import {
  Users,
  Mic,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  Radio,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CreditCard,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";
import { LiveVoiceRecorder } from "@/components/LiveVoiceRecorder";
import { SupportedLanguage } from "@/lib/speech";
import { generateIncidentPdfReport } from "@/lib/pdfReport";

const getActiveUpiWarning = (res: any, lang: SupportedLanguage) => {
  if (!res) return "";
  if (res.allSpokenWarnings?.[lang]) return res.allSpokenWarnings[lang];
  if (res.isDangerous) {
    if (lang === "bn") return "সাবধান! এই বাটনে চাপ দিলে আপনার ব্যাংক থেকে টাকা কেটে নেওয়া হবে! টাকা পাওয়ার জন্য কখনও UPI পিন দেবেন না!";
    if (lang === "hi") return "सावधान! यह बटन आपके बैंक खाते से पैसे निकाल लेगा! पैसे प्राप्त करने के लिए कभी भी UPI पिन दर्ज न करें!";
    return "Warning! This button will take money OUT of your bank account! You never need a UPI PIN to receive money!";
  }
  if (lang === "bn") return "এটি একটি সাধারণ পেমেন্ট লিংক। পেমেন্ট করার আগে প্রাপকের নাম যাচাই করে নিন।";
  if (lang === "hi") return "यह एक सामान्य भुगतान लिंक प्रतीत होता है। भुगतान करने से पहले प्राप्तकर्ता का नाम अवश्य जांचें।";
  return "Standard payment link detected. Always confirm the payee name before approving.";
};

const getActiveVoiceWarning = (res: any, lang: SupportedLanguage) => {
  if (!res) return "";
  if (res.allSpokenWarnings?.[lang]) return res.allSpokenWarnings[lang];
  const isHighRisk = res.verdict === "AI_CLONED_SCAM_VOICE" || (res.deepfakeProbability && res.deepfakeProbability >= 60);
  if (isHighRisk) {
    if (lang === "bn") return "থামুন! এই কণ্ঠটি এআই দিয়ে তৈরি নকল কণ্ঠ। এটি প্রতারণামূলক কল, কাউকে টাকা পাঠাবেন না!";
    if (lang === "hi") return "रुको! यह आवाज़ AI से बनाई गई नकली है। यह एक फ्रॉड कॉल है, किसी को पैसे मत भेजो!";
    return "Stop! This voice is fake AI cloned. This is a fraud call, do NOT send any money!";
  }
  if (lang === "bn") return "কণ্ঠে কোনো জালিয়াতির স্পষ্ট লক্ষণ পাওয়া যায়নি, তবুও সতর্ক থাকুন।";
  if (lang === "hi") return "आवाज़ में कोई गंभीर फ्रॉड संकेत नहीं मिला, फिर भी सतर्क रहें।";
  return "No severe synthetic fraud detected, but always verify before sending funds.";
};

const getActiveGoldenRule = (res: any, lang: SupportedLanguage) => {
  if (!res) return "";
  if (res.goldenRules?.[lang]) return res.goldenRules[lang];
  if (lang === "bn") return "গোল্ডেন রুল: টাকা রিসিভ বা গ্রহণ করার জন্য কখনও UPI PIN দিতে হয় না। পিন শুধুমাত্র টাকা পাঠানোর জন্যই ব্যবহার হয়।";
  if (lang === "hi") return "गोल्डन नियम: पैसे प्राप्त करने के लिए आपको कभी भी UPI पिन दर्ज करने की आवश्यकता नहीं होती है। पिन केवल पैसे भेजने के लिए होता है।";
  return "GOLDEN RULE: You NEVER enter your UPI PIN to receive money. PIN is ONLY used to send money out.";
};

export default function CitizenShieldPage() {
  const [activeTab, setActiveTab] = useState("voice");
  const [language, setLanguage] = useState<SupportedLanguage>("hi");

  // Voice State
  const [transcript, setTranscript] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);

  // UPI State
  const [upiInput, setUpiInput] = useState("");
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);

  // Demo Scenarios
  const voiceDemos = [
    {
      title: "AI Voice Clone Emergency (Papa Scam)",
      text: "Papa, main bohot badi musibat mein phas gaya hoon. Mera accident ho gaya hai aur police mujhe jail le ja rahi hai. Please kisi ko mat batana aur turant is account mein 50,000 rupees bhej do varna case ho jayega!",
    },
    {
      title: "Digital Arrest (Fake Police/CBI)",
      text: "This is Inspector Sharma from Central Crime Branch. A consignment containing narcotics has been intercepted with your Aadhaar number. Transfer ₹75,000 to RBI secure escrow account immediately for clearance or team will reach your home.",
    },
    {
      title: "Normal Legitimate Call",
      text: "Hey, are you free this evening? Mom asked to bring some fresh milk and vegetables while coming back from office. Let me know when you reach.",
    },
  ];

  const upiDemos = [
    {
      title: "Fake OLX Advance (Collect Request Trap)",
      text: "upi://pay?pa=refund-agent99@okhdfcbank&pn=OLX%20Cashback%20Agent&am=15000&cu=INR&tn=Cashback%20Approval%20Enter%20PIN",
    },
    {
      title: "SMS: 'Enter PIN to Receive ₹8,500'",
      text: "Dear Customer, you have received ₹8,500 government subsidy reward! Click link or approve collect request in PhonePe and enter your UPI PIN to claim amount immediately into bank.",
    },
    {
      title: "Legitimate Merchant UPI",
      text: "upi://pay?pa=supermart.billing@icici&pn=City%20Supermarket&am=640&cu=INR&tn=Invoice%204921",
    },
  ];

  const handleAnalyzeVoice = async (textToScan: string) => {
    if (!textToScan.trim()) return;
    setVoiceLoading(true);
    setVoiceResult(null);

    try {
      const res = await fetch("/api/analyze/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: textToScan, language }),
      });
      const data = await res.json();
      setVoiceResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleAnalyzeUpi = async (payloadToScan: string) => {
    if (!payloadToScan.trim()) return;
    setUpiLoading(true);
    setUpiResult(null);

    try {
      const res = await fetch("/api/analyze/upi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiString: payloadToScan, language }),
      });
      const data = await res.json();
      setUpiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpiLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-6xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>Citizen & Family Scam Defense</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Citizen Scam Shield
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Detect AI-cloned distress voice calls and deceptive UPI "Collect Money" debit traps. Instant audible voice warnings in Hindi, Bengali, or English.
          </p>
        </div>

        {/* Language Selector for Voice Alert */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080D1B] p-1.5 self-start md:self-auto">
          <span className="text-xs text-slate-400 pl-2">Voice Alert:</span>
          {(["hi", "bn", "en"] as SupportedLanguage[]).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                language === l
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {l === "hi" ? "Hindi (हिंदी)" : l === "bn" ? "Bengali (বাংলা)" : "English"}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="voice" className="gap-2">
            <Mic className="h-4 w-4" />
            <span>AI Voice & Call Scams</span>
          </TabsTrigger>
          <TabsTrigger value="upi" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span>UPI Collect & QR Traps</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AI VOICE DEEPFAKE SCANNER */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Card */}
            <Card className="lg:col-span-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PhoneCall className="h-4 w-4 text-cyan-400" />
                    <span>Analyze Suspicious Call or Message</span>
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    INSTANT SCAN
                  </Badge>
                </div>
                <CardDescription>
                  Paste the transcript of a distress phone call or WhatsApp audio message. Scammers frequently clone family voices to create panic.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pre-loaded Scenarios */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400">Load Demo Scenario:</span>
                  <div className="flex flex-wrap gap-2">
                    {voiceDemos.map((demo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setTranscript(demo.text);
                          handleAnalyzeVoice(demo.text);
                        }}
                        className="rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                      >
                        {demo.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Microphone Recorder with Audio Visualizer */}
                <LiveVoiceRecorder
                  language={language}
                  onTranscriptChange={(text) => setTranscript(text)}
                  onRecordingComplete={(text) => {
                    setTranscript(text);
                    handleAnalyzeVoice(text);
                  }}
                />

                <div className="space-y-2">
                  <textarea
                    rows={5}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste incoming call transcript (e.g., 'Papa I am in trouble, send money right now...')"
                    className="w-full rounded-lg border border-slate-700 bg-[#080D1B] p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTranscript("");
                      setVoiceResult(null);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => handleAnalyzeVoice(transcript)}
                    disabled={voiceLoading || !transcript.trim()}
                    className="gap-2"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{voiceLoading ? "Analyzing Audio Signals..." : "Detect Deepfake / Scam"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verdict Card */}
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base">Scam & Deepfake Verdict</CardTitle>
                <CardDescription>
                  AI analysis of voice synthesis artifacts, emotional urgency cues, and distress coercion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!voiceResult ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-3">
                    <Radio className="h-10 w-10 text-slate-600 animate-pulse" />
                    <p className="text-sm">No call analyzed yet.</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select a demo scenario on the left or paste transcript text to inspect AI synthesis confidence and listen to the audible warning.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Gauge Box */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080D1B] p-4">
                      <div>
                        <div className="text-xs text-slate-400">Deepfake / AI Scam Risk</div>
                        <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
                          {voiceResult.deepfakeProbability}%
                        </div>
                      </div>
                      <Badge
                        variant={
                          voiceResult.verdict === "AI_CLONED_SCAM_VOICE" ? "destructive" : "success"
                        }
                        className="text-xs px-3 py-1 uppercase"
                      >
                        {voiceResult.verdict === "AI_CLONED_SCAM_VOICE"
                          ? "CRITICAL: AI VOICE CLONE"
                          : "PROBABLY LEGITIMATE"}
                      </Badge>
                    </div>

                    {/* Audible Warning Speaker Box */}
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                          <Volume2 className="h-4 w-4 text-rose-400" />
                          <span>Emergency Spoken Alert ({language.toUpperCase()})</span>
                        </div>
                        <VoiceSpeakerButton
                          text={getActiveVoiceWarning(voiceResult, language)}
                          lang={language}
                          label="Speak Alert Out Loud"
                        />
                      </div>
                      <p className="text-xs font-mono text-rose-200 bg-[#080D1B]/80 p-2.5 rounded-lg border border-rose-500/30">
                        "{getActiveVoiceWarning(voiceResult, language)}"
                      </p>
                    </div>

                    {/* Detected Patterns */}
                    {voiceResult.detectedPatterns?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400">Detected Indicators:</div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {voiceResult.detectedPatterns.map((pat: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                              <span>{pat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Safe Steps */}
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <div className="text-xs font-semibold text-slate-400">Immediate Safe Action:</div>
                      <ul className="space-y-1 text-xs text-emerald-300">
                        {voiceResult.recommendations?.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Official Cybercrime Incident PDF Report Download */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        generateIncidentPdfReport({
                          category: "AI_VOICE_CLONE",
                          title: "AI Voice Clone Emergency Distress Call",
                          verdict: voiceResult.verdict,
                          riskScore: voiceResult.deepfakeProbability,
                          subjectOrTarget: voiceResult.audioName || voiceResult.transcript?.slice(0, 80),
                          indicators: voiceResult.detectedPatterns || ["Synthetic vocal frequency match", "Emotional coercion signals"],
                          recommendations: voiceResult.recommendations || [
                            "Do NOT send funds via UPI, Bank Transfer or Gift Cards.",
                            "Report the scam caller number to National Cybercrime Helpline 1930.",
                          ],
                        });
                      }}
                      className="w-full text-xs gap-2 border-rose-500/40 text-rose-300 hover:bg-rose-950/30 shadow-md"
                    >
                      <FileText className="h-3.5 w-3.5 text-rose-400" />
                      <span>Download Cybercrime Incident Dossier (PDF)</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: UPI TRICK SCAM DETECTOR */}
        <TabsContent value="upi" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Card */}
            <Card className="lg:col-span-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4 text-cyan-400" />
                    <span>Scan UPI Link, QR Code or SMS</span>
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    INTENT DECODER
                  </Badge>
                </div>
                <CardDescription>
                  Scammers trick victims into entering their UPI PIN under the lie that PIN is required to "receive" payments or claim prizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400">Load UPI Demo:</span>
                  <div className="flex flex-wrap gap-2">
                    {upiDemos.map((demo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setUpiInput(demo.text);
                          handleAnalyzeUpi(demo.text);
                        }}
                        className="rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                      >
                        {demo.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={upiInput}
                    onChange={(e) => setUpiInput(e.target.value)}
                    placeholder="Paste upi:// link, QR string, or payment SMS..."
                    className="w-full rounded-lg border border-slate-700 bg-[#080D1B] p-3 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUpiInput("");
                      setUpiResult(null);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => handleAnalyzeUpi(upiInput)}
                    disabled={upiLoading || !upiInput.trim()}
                    className="gap-2"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{upiLoading ? "Inspecting UPI URI..." : "Check UPI Trap"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Verdict Card */}
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base">UPI Intent & Threat Verdict</CardTitle>
                <CardDescription>
                  Verifies whether the transaction sends money OUT (Debit) or into your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!upiResult ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-3">
                    <CreditCard className="h-10 w-10 text-slate-600 animate-pulse" />
                    <p className="text-sm">No UPI link scanned yet.</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select a demo sample above to test how OmniShield AI warns you before entering any PIN.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Warning Header Box */}
                    <div
                      className={`rounded-xl border p-4 ${
                        upiResult.isDangerous
                          ? "border-rose-500/40 bg-rose-950/20 text-rose-200"
                          : "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            {upiResult.isDangerous
                              ? "DANGER: DEBIT TRAP DETECTED!"
                              : "NORMAL PAYMENT INTENT"}
                          </span>
                        </div>
                        <Badge
                          variant={upiResult.isDangerous ? "destructive" : "success"}
                          className="font-mono text-xs"
                        >
                          Scam Score: {upiResult.scamScore}/100
                        </Badge>
                      </div>

                      {/* Golden Rule Highlight */}
                      <div className="mt-3 rounded-lg bg-[#080D1B] p-2.5 text-xs font-semibold text-amber-300 border border-amber-500/30">
                        {getActiveGoldenRule(upiResult, language)}
                      </div>
                    </div>

                    {/* Audio Alert Box */}
                    <div className="rounded-xl border border-slate-800 bg-[#080D1B] p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">
                          Audible Warning ({language.toUpperCase()})
                        </span>
                        <VoiceSpeakerButton
                          text={getActiveUpiWarning(upiResult, language)}
                          lang={language}
                          label="Speak Alert"
                        />
                      </div>
                      <p className="text-xs font-mono text-slate-300 italic">
                        "{getActiveUpiWarning(upiResult, language)}"
                      </p>
                    </div>

                    {/* Decoded Parameters */}
                    {upiResult.payeeVpa && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg border border-slate-800 bg-[#080D1B] p-2.5">
                          <div className="text-slate-400">Payee VPA:</div>
                          <div className="font-mono font-semibold text-cyan-300 break-all">
                            {upiResult.payeeVpa}
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-[#080D1B] p-2.5">
                          <div className="text-slate-400">Amount:</div>
                          <div className="font-mono font-semibold text-white">
                            {upiResult.amount ? `₹${upiResult.amount}` : "Dynamic / Unspecified"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Suspicious Indicators */}
                    {upiResult.suspiciousIndicators?.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-400">Why this was flagged:</div>
                        <ul className="space-y-1 text-xs text-rose-300">
                          {upiResult.suspiciousIndicators.map((ind: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Official Cybercrime Incident PDF Report Download */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        generateIncidentPdfReport({
                          category: "UPI_DEBIT_TRAP",
                          title: "UPI Collect Request Debit Trap Deception",
                          verdict: upiResult.isDangerous ? "DANGER_DEBIT_TRAP" : "NORMAL_PAYMENT",
                          riskScore: upiResult.scamScore,
                          subjectOrTarget: upiResult.payeeVpa || upiResult.rawInput?.slice(0, 80),
                          indicators: upiResult.suspiciousIndicators || ["Deceptive note requesting PIN to receive money"],
                          recommendations: [
                            "Never enter UPI PIN when expecting incoming payment.",
                            "Block the suspicious VPA immediately in your banking/UPI application.",
                            "Submit fraudulent payee details to 1930 helpline.",
                          ],
                          extraDetails: {
                            "Payee VPA": upiResult.payeeVpa || "N/A",
                            "Amount Requested": upiResult.amount ? `₹${upiResult.amount}` : "Dynamic",
                          },
                        });
                      }}
                      className="w-full text-xs gap-2 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/30 shadow-md"
                    >
                      <FileText className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Download Cybercrime Incident Dossier (PDF)</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
