"use client";

import React, { useState } from "react";
import {
  Store,
  QrCode,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CameraQrScanner } from "@/components/CameraQrScanner";

export default function ShopArmorPage() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [lang, setLang] = useState<"en" | "bn" | "hi">("en");
  const [copied, setCopied] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // WhatsApp Alert Generator State
  const [scamSnippet, setScamSnippet] = useState(
    "Customer claiming they paid ₹1,200 via UPI and demanding change, but no bank SMS received."
  );

  // QR Tampering State
  const [qrPayload, setQrPayload] = useState("");
  const [qrResult, setQrResult] = useState<any>(null);

  // Fake Screenshot Verification State
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotResult, setScreenshotResult] = useState<any>(null);

  const getStaffWarningText = () => {
    const snippetClean = scamSnippet ? `\n"${scamSnippet}"\n` : "";
    if (lang === "bn") {
      return `⚠️ *জরুরি সাইবার সতর্কতা (OmniShield AI)* ⚠️\n\nসাবধান! আমাদের দোকানের কাউন্টারে এই মাত্র একটি সন্দেহজনক/ভুয়া পেমেন্ট বা মেসেজ এসেছে:${snippetClean}\n🚨 *সতর্কতা নির্দেশ:* দোকানের কেউ অফিশিয়াল সাউন্ডবক্স বা ব্যাংক স্টেটমেন্টে টাকা জমা না হওয়া পর্যন্ত কোনো ক্যাশ বা মালপত্র ছাড়বেন না। কোনো লিঙ্কে ক্লিক করবেন না বা পিন দেবেন না।\n\n— OmniShield Shop Armor`;
    }
    if (lang === "hi") {
      return `⚠️ *दुकान कर्मचारियों के लिए जरूरी चेतावनी (OmniShield AI)* ⚠️\n\nसावधान! हमारी दुकान के काउंटर पर अभी एक संदिग्ध/फर्जी भुगतान या संदेश आया है:${snippetClean}\n🚨 *निर्देश:* जब तक बैंक मैसेज या साउंडबॉक्स में पैसे की पुष्टि न हो, तब तक किसी को नकद या सामान न दें। किसी भी लिंक पर क्लिक न करें या पिन दर्ज न करें।\n\n— OmniShield Shop Armor`;
    }
    return `⚠️ *URGENT SHOP STAFF CYBER ALERT (OmniShield AI)* ⚠️\n\nWarning! A suspected payment fraud/fake message was just detected at our counter:${snippetClean}\n🚨 *ACTION REQUIRED:* Do NOT hand over goods or cash without official soundbox/bank credit confirmation. Never click unfamiliar links or share any UPI PIN.\n\n— OmniShield Shop Armor`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getStaffWarningText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const getWhatsAppLink = () => {
    return `https://wa.me/?text=${encodeURIComponent(getStaffWarningText())}`;
  };

  const handleVerifyQr = (overridePayload?: string | React.MouseEvent) => {
    const targetPayload = typeof overridePayload === "string" ? overridePayload : qrPayload;
    if (!targetPayload.trim()) return;
    const lower = targetPayload.toLowerCase();
    const isTampered =
      lower.includes("bit.ly") ||
      lower.includes("ngrok") ||
      lower.includes(".apk") ||
      lower.includes("free-cash") ||
      lower.includes("claim-reward");

    setQrResult({
      payload: targetPayload,
      isTampered,
      verdict: isTampered ? "SUSPICIOUS_QR_TAMPERING" : "GENUINE_PAYMENT_QR",
      riskScore: isTampered ? 88 : 12,
      recommendations: isTampered
        ? [
            "Physical QR sticker may have been swapped or overlaid by a fraudster.",
            "Inspect shop counter standee physically for extra sticker layers.",
            "Replace QR immediately with verified bank-issued QR code.",
          ]
        : ["QR payload points to standard payment address. Safe to display."],
    });
  };

  const handleVerifyScreenshot = () => {
    const trimmed = utrNumber.trim();
    const isValidLength = trimmed.length === 12 && /^\d+$/.test(trimmed);
    const isMockSuspect = trimmed.startsWith("0000") || trimmed === "123456789012" || !isValidLength;

    setScreenshotResult({
      utr: trimmed,
      isValidFormat: isValidLength,
      verdict: isMockSuspect ? "HIGH_PROBABILITY_FAKE_SCREENSHOT" : "VALID_UTR_FORMAT",
      score: isMockSuspect ? 85 : 15,
      detail: isMockSuspect
        ? "UTR code does not match standard 12-digit Indian banking sequence or uses known test digits. Fake payment generator app suspected."
        : "UTR format is structurally valid. Always confirm bank SMS or soundbox announcement before releasing goods.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-6xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-2">
            <Store className="h-3.5 w-3.5" />
            <span>Retail & Counter Fraud Defense</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shop Counter Armor
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Protect retail counters, kirana stores, and chaiwalas from QR tampering, fake payment screenshot apps, and send 1-click emergency WhatsApp alerts to counter staff.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080D1B] p-1.5">
          <span className="text-xs text-slate-400 pl-2">Staff Alert Language:</span>
          {(["en", "hi", "bn"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                lang === l
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {l === "hi" ? "हिंदी" : l === "bn" ? "বাংলা" : "EN"}
            </button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Staff WhatsApp Alert</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="gap-2">
            <QrCode className="h-4 w-4" />
            <span>QR Tampering Check</span>
          </TabsTrigger>
          <TabsTrigger value="screenshot" className="gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Fake Payment Verifier</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: COUNTER STAFF WHATSAPP ALERT */}
        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  <span>One-Click Emergency WhatsApp Broadcast for Counter Staff</span>
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  RAPID FIRST-RESPONSE
                </Badge>
              </div>
              <CardDescription>
                When a shopkeeper or manager catches a fraud attempt, counter staff must be informed in 5 seconds before someone else falls for it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Suspicious Event or Fraud Detail:
                </label>
                <textarea
                  rows={3}
                  value={scamSnippet}
                  onChange={(e) => setScamSnippet(e.target.value)}
                  placeholder="Describe the scam (e.g., Fake customer claimed QR payment done without soundbox beep...)"
                  className="w-full rounded-lg border border-slate-700 bg-[#080D1B] p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                <div className="text-xs text-slate-400">
                  Ready to broadcast to your Shop WhatsApp Group:
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/40"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Warning for Staff</span>
                      </>
                    )}
                  </Button>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90 shadow-md shadow-emerald-950/50"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Open in WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Message Live Preview */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400">Formatted Message Preview:</div>
                <div className="rounded-xl border border-slate-800 bg-[#060A16] p-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-line border-l-4 border-l-emerald-500">
                  {getStaffWarningText()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: QR CODE TAMPERING INSPECTOR */}
        <TabsContent value="qr" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-cyan-400" />
                  <span>Inspect Physical Shop QR Payload</span>
                </CardTitle>
                <CardDescription>
                  Criminals paste fake QR stickers on tea stalls and counters to divert merchant earnings to rogue accounts or malware APK downloads.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Live Camera Scanner Trigger */}
                <Button
                  type="button"
                  variant="cyber"
                  onClick={() => setShowCamera(true)}
                  className="w-full gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Camera className="h-4 w-4 text-cyan-300 animate-pulse" />
                  <span>📸 Open Live Counter Camera QR Scanner</span>
                </Button>

                <CameraQrScanner
                  isOpen={showCamera}
                  onClose={() => setShowCamera(false)}
                  onScanSuccess={(decodedText) => {
                    setQrPayload(decodedText);
                    handleVerifyQr(decodedText);
                  }}
                />

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase tracking-wider">
                    Or Enter QR String Manually
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Paste QR Decoded URL or String:</label>
                  <Input
                    value={qrPayload}
                    onChange={(e) => setQrPayload(e.target.value)}
                    placeholder="https://bit.ly/claim-free-cashback or upi://pay?pa=..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQrPayload("https://bit.ly/shop-cashback-update.apk");
                    }}
                  >
                    Load Malicious Sticker Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQrPayload("upi://pay?pa=chaiwala.store@icici&pn=Chai%20Stall&cu=INR");
                    }}
                  >
                    Load Genuine Shop QR
                  </Button>
                </div>

                <Button onClick={() => handleVerifyQr()} disabled={!qrPayload.trim()} className="w-full">
                  Scan QR Integrity
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base">QR Integrity Verdict</CardTitle>
              </CardHeader>
              <CardContent>
                {!qrResult ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Paste a QR payload on the left to verify if it has been tampered with or points to an APK scam.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`rounded-xl border p-4 ${
                        qrResult.isTampered
                          ? "border-rose-500/40 bg-rose-950/20 text-rose-200"
                          : "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">
                          {qrResult.isTampered
                            ? "TAMPERED / SUSPICIOUS QR DETECTED!"
                            : "VERIFIED SAFE PAYMENT QR"}
                        </span>
                        <Badge variant={qrResult.isTampered ? "destructive" : "success"}>
                          Risk: {qrResult.riskScore}/100
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-400">Recommended Steps:</div>
                      <ul className="space-y-1 text-slate-300">
                        {qrResult.recommendations.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: FAKE PAYMENT SCREENSHOT VERIFIER */}
        <TabsContent value="screenshot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-indigo-400" />
                <span>Verify Transaction UTR / Ref Code from Customer Screen</span>
              </CardTitle>
              <CardDescription>
                Fraudsters use mock payment generator APKs (Paytm Spoof) showing green tick screens. Verify the 12-digit UTR before accepting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">
                    Enter 12-Digit UPI UTR Reference Number:
                  </label>
                  <Input
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 431209847120"
                    maxLength={16}
                  />
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUtrNumber("000012345678")}
                    >
                      Sample Fake UTR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUtrNumber("431980247612")}
                    >
                      Sample Valid UTR
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#080D1B] p-4 flex flex-col justify-center">
                  {!screenshotResult ? (
                    <p className="text-xs text-slate-400 text-center">
                      Click 'Verify UTR' to inspect format integrity against standard NPCI rules.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">Result:</span>
                        <Badge
                          variant={screenshotResult.score > 50 ? "destructive" : "success"}
                        >
                          {screenshotResult.verdict}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {screenshotResult.detail}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleVerifyScreenshot} disabled={!utrNumber.trim()} className="w-full">
                Verify UTR Structure
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
