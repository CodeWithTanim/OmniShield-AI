"use client";

import React, { useState } from "react";
import {
  Link2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Volume2,
  Download,
  Sparkles,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";
import { generateIncidentPdfReport } from "@/lib/pdfReport";

interface PhishingLinkScannerProps {
  language?: "bn" | "hi" | "en";
}

export function PhishingLinkScanner({ language = "bn" }: PhishingLinkScannerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const demoLinks = [
    {
      title: "SBI KYC Verification Trap",
      url: "http://sbi-kyc-verify-portal.apk.xyz/login.php",
    },
    {
      title: "Electricity Power Cut SMS",
      url: "http://wbsedcl-bill-clearance.top/download/bill.apk",
    },
    {
      title: "Shortened Reward Link",
      url: "https://bit.ly/claim-pm-subsidy-reward",
    },
    {
      title: "Legitimate HDFC Portal",
      url: "https://netbanking.hdfcbank.com/netbanking/",
    },
  ];

  const handleScanUrl = async (targetUrl?: string) => {
    const urlToTest = (targetUrl || urlInput).trim();
    if (!urlToTest) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToTest, language }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDossier = () => {
    if (!result) return;
    generateIncidentPdfReport({
      category: "UPI_DEBIT_TRAP",
      title: `Phishing Link Threat: ${result.hostname || result.url}`,
      verdict: result.verdict,
      riskScore: result.riskScore,
      subjectOrTarget: result.url,
      indicators: result.vulnerabilities || [],
      recommendations: result.recommendations || [],
      extraDetails: {
        "Target Hostname": result.hostname,
        "Scanner Engine": "OmniShield AI Deep Phishing Neural Matrix",
      },
    });
  };

  const isMalicious = result && (result.verdict === "MALICIOUS_PHISHING_LINK" || result.riskScore >= 50);
  const isSuspicious = result && !isMalicious && (result.verdict === "SUSPICIOUS_HIGH_RISK" || result.riskScore >= 35);
  const isDangerous = isMalicious || isSuspicious;

  return (
    <Card className="border border-slate-800 bg-[#060A18]/90 shadow-xl backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Link2 className="h-4 w-4 text-cyan-400" />
            <span>Phishing & Malicious Link Inspector</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-300">
            URL DECONSTRUCTOR
          </Badge>
        </div>
        <CardDescription>
          Paste any SMS link, WhatsApp forward, or suspicious domain before clicking. Detects banking trojans, deceptive subdomains, and credential harvesters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pre-loaded Demo Scenarios */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Load Demo Threat Link:</span>
          <div className="flex flex-wrap gap-2">
            {demoLinks.map((demo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setUrlInput(demo.url);
                  handleScanUrl(demo.url);
                }}
                className="rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-left text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. sbi-kyc-verify-portal.apk.xyz or bit.ly/..."
              className="w-full rounded-xl border border-slate-700 bg-[#080D1B] px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <Button
            variant="cyber"
            size="sm"
            onClick={() => handleScanUrl()}
            disabled={loading || !urlInput.trim()}
            className="gap-2 shrink-0 text-xs px-4"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{loading ? "Inspecting..." : "Scan Link"}</span>
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <div
            className={`rounded-2xl border p-4 space-y-3 animate-in fade-in duration-200 ${
              isMalicious
                ? "border-rose-500/60 bg-rose-950/20 text-rose-300"
                : isSuspicious
                ? "border-amber-500/60 bg-amber-950/20 text-amber-300"
                : "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isMalicious ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                ) : isSuspicious ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wide text-white block">
                      {result.verdict}
                    </span>
                    {result.phishTankVerified && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[9px]">
                        PhishTank Verified #{result.phishTankId}
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Host: {result.hostname} • Source: {result.sourceAttribution || "OmniShield Heuristics"}
                  </span>
                </div>
              </div>
              <Badge
                className={`text-xs font-mono font-bold ${
                  isMalicious
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : isSuspicious
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                Risk Score: {result.riskScore}/100
              </Badge>
            </div>

            {/* Detected Vulnerabilities */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Forensic Indicators:
              </span>
              <ul className="space-y-1 text-xs">
                {result.vulnerabilities.map((v: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-200">
                    <span className={isMalicious ? "text-rose-400 font-bold" : isSuspicious ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                      •
                    </span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Audible Spoken Warning */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <VoiceSpeakerButton
                  text={result.spokenWarning}
                  lang={language}
                  label={language === "bn" ? "সতর্কবার্তা শুনুন" : language === "hi" ? "चेतावनी सुनें" : "Play Spoken Alert"}
                />
              </div>

              {isDangerous && (
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
