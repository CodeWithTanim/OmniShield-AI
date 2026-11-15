"use client";

import React, { useState } from "react";
import {
  QrCode,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Upload,
  Search,
  Volume2,
  Download,
  Wifi,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraQrScanner } from "@/components/CameraQrScanner";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";
import { generateIncidentPdfReport } from "@/lib/pdfReport";

interface VulnerableQrScannerProps {
  language?: "bn" | "hi" | "en";
}

export function VulnerableQrScanner({ language = "bn" }: VulnerableQrScannerProps) {
  const [qrInput, setQrInput] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const demoQrPayloads = [
    {
      title: "Rogue WiFi Injection Trap",
      payload: "WIFI:S:Free_Public_HighSpeed_WiFi;T:WPA;P:mall_free_login;;",
    },
    {
      title: "Quishing APK Trojan Download",
      payload: "http://45.142.12.89/order_receipt_download.apk",
    },
    {
      title: "Deceptive Reverse-Debit UPI",
      payload: "upi://pay?pa=refund-agent@okhdfc&pn=Cashback%20Refund&am=0&cu=INR&tn=Enter%20PIN%20To%20Claim%20Reward",
    },
    {
      title: "Clean Merchant QR Standee",
      payload: "upi://pay?pa=city.supermarket@icici&pn=City%20Supermarket&am=120&cu=INR&tn=Invoice%208492",
    },
  ];

  const handleInspectQr = async (payloadToInspect?: string) => {
    const data = (payloadToInspect || qrInput).trim();
    if (!data) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: data, language }),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDossier = () => {
    if (!result) return;
    generateIncidentPdfReport({
      category: "QR_CODE_TAMPERING",
      title: `Vulnerable QR Threat: ${result.qrType}`,
      verdict: result.verdict,
      riskScore: result.riskScore,
      subjectOrTarget: result.payload,
      indicators: result.vulnerabilities || [],
      recommendations: result.recommendations || [],
      extraDetails: {
        "QR Payload Type": result.qrType,
        "Detection Engine": "OmniShield Quishing & Rogue WiFi Auditor",
      },
    });
  };

  const isHighRisk = result && result.riskScore >= 55;

  return (
    <Card className="border border-slate-800 bg-[#060A18]/90 shadow-xl backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <QrCode className="h-4 w-4 text-cyan-400" />
            <span>Vulnerable QR &amp; Quishing Scanner</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-300">
            PAYLOAD DECODER
          </Badge>
        </div>
        <CardDescription>
          Inspect physical standees, WhatsApp QR screenshots, or suspicious codes before scanning. Detects rogue WiFi setups, APK download traps, and tampered UPI VPAs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pre-loaded Scenarios */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Load Threat Payload Demo:</span>
          <div className="flex flex-wrap gap-2">
            {demoQrPayloads.map((demo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQrInput(demo.payload);
                  handleInspectQr(demo.payload);
                }}
                className="rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Camera Trigger */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Paste raw QR decoded text, upi:// link, WIFI: config, or URL..."
              className="w-full rounded-xl border border-slate-700 bg-[#080D1B] p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCamera(!showCamera)}
              className="gap-1.5 text-xs border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/40"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{showCamera ? "Close Live Camera" : "Open Camera Viewfinder"}</span>
            </Button>

            <Button
              variant="cyber"
              size="sm"
              onClick={() => handleInspectQr()}
              disabled={loading || !qrInput.trim()}
              className="gap-2 text-xs px-4"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{loading ? "Analyzing..." : "Audit QR Payload"}</span>
            </Button>
          </div>
        </div>

        {/* Live Camera Scanner Viewfinder */}
        {showCamera && (
          <div className="mt-3">
            <CameraQrScanner
              isOpen={showCamera}
              onScanSuccess={(decodedText) => {
                setQrInput(decodedText);
                setShowCamera(false);
                handleInspectQr(decodedText);
              }}
              onClose={() => setShowCamera(false)}
            />
          </div>
        )}

        {/* Audit Result Display */}
        {result && (
          <div
            className={`rounded-2xl border p-4 space-y-3 animate-in fade-in duration-200 ${
              isHighRisk
                ? "border-rose-500/60 bg-rose-950/20 text-rose-300"
                : "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isHighRisk ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                )}
                <div>
                  <span className="text-xs font-black tracking-wide text-white block">
                    {result.verdict}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Type: {result.qrType}
                  </span>
                </div>
              </div>
              <Badge
                className={`text-xs font-mono font-bold ${
                  isHighRisk ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                Risk Score: {result.riskScore}/100
              </Badge>
            </div>

            {/* Vulnerabilities */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Detected Exploits &amp; Vulnerabilities:
              </span>
              <ul className="space-y-1 text-xs">
                {result.vulnerabilities.map((v: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-200">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audible Alert & PDF Download */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <VoiceSpeakerButton
                  text={result.spokenWarning}
                  lang={language}
                  label={language === "bn" ? "সতর্কবার্তা শুনুন" : language === "hi" ? "चेतावनी सुनें" : "Play Spoken Alert"}
                />
              </div>

              {isHighRisk && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDownloadDossier}
                  className="gap-1.5 text-xs h-8"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>1930 Forensic Dossier (PDF)</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
