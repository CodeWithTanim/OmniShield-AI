"use client";

import React, { useState } from "react";
import {
  FileCheck,
  FileWarning,
  FileText,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";
import { generateIncidentPdfReport } from "@/lib/pdfReport";

interface DigitalArrestDocScannerProps {
  language?: "bn" | "hi" | "en";
}

export function DigitalArrestDocScanner({ language = "bn" }: DigitalArrestDocScannerProps) {
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("warrant_notice.pdf");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const demoDocuments = [
    {
      title: "Fake CBI Digital Arrest Warrant",
      file: "CBI_Arrest_Notice_Ref_982.pdf",
      text: `CENTRAL BUREAU OF INVESTIGATION (CBI) - CYBER CRIME CELL
ORDER OF DIGITAL ARREST & ASSET SEIZURE UNDER SECTION 420/120B IPC
Notice To: Rajesh Kumar | Case Ref: CBI/ND/2026/0942

A parcel dispatched in your name via FedEx contained 140 grams of MDMA narcotics and 16 fake passports destined for Taiwan. 
You are hereby placed under IMMEDIATE DIGITAL ARREST. 
You are strictly ordered to remain in front of the Skype video camera and do not disconnect. You must transfer INR 2,50,000 to the Reserve Bank of India Secret Escrow Account (cbi.escrow.cell@oksbi) within 2 hours for bail bond clearance, otherwise a tactical SWAT team will arrest you at your residential address.`,
    },
    {
      title: "Fake ED Asset Freezing Notice",
      file: "ED_Financial_Crimes_Order.pdf",
      text: `DIRECTORATE OF ENFORCEMENT (ED) - ANTI-MONEY LAUNDERING WING
NOTICE OF BANK ACCOUNT SUSPENSION & ARREST THREAT
Notice Ref: ED/PMLA/CASE-7718

Your Aadhaar card has been linked to 24 laundering bank accounts involved in international hawala transactions. 
To prove non-involvement, you are required to stay on WhatsApp video call for continuous surveillance. Transfer full account balance to the government clearance vault via RTGS within 45 minutes for digital asset verification. Failure to comply will lead to non-bailable arrest under PMLA.`,
    },
    {
      title: "Legitimate Court Hearing Summons",
      file: "Civil_Court_Summons_Sec138.pdf",
      text: `IN THE COURT OF CHIEF METROPOLITAN MAGISTRATE, SAKET COURTS, NEW DELHI
SUMMONS TO ACCUSED PERSON UNDER SECTION 61 Cr.P.C. / SECTION 63 BNSS
Criminal Case No: CC/4921/2026

Whereas your attendance is necessary to answer to a charge under Section 138 of Negotiable Instruments Act.
You are hereby required to appear in person or by advocate before this Court on 12th December 2026 at 10:00 AM. 
Herein fail not. Given under the seal of Court and signature of Presiding Magistrate.
Note: Court summons are never served over social media messaging platforms and do not demand instant electronic fund transfers.`,
    },
  ];

  const handleScan = async (textToScan?: string, customFileName?: string) => {
    const text = (textToScan || inputText).trim();
    if (!text) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: text,
          fileName: customFileName || fileName,
          language,
        }),
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
      category: "CBI_DIGITAL_ARREST",
      title: `Forensic Document Inspection: ${result.fileName}`,
      verdict: result.verdict,
      riskScore: result.riskScore,
      subjectOrTarget: result.fileName,
      indicators: result.forensicFindings.map((f: any) => `${f.name}: ${f.explanation}`),
      recommendations: result.recommendations,
      extraDetails: {
        "Document Ref": result.fileName,
        "Legal Status": "Digital Arrest does not exist under Indian CrPC / BNSS law",
      },
    });
  };

  return (
    <Card className="border border-slate-800 bg-[#060A18]/90 shadow-xl backdrop-blur-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-rose-400" />
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <span>Fake Digital Arrest & Police Notice Forensic Scanner</span>
                <Badge variant="outline" className="text-[10px] border-rose-500/40 text-rose-300">
                  COURT & POLICE DOCUMENT FORENSICS
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Examines WhatsApp/Telegram arrest warrants, fake CBI/ED notices, and extortion summons for fabricated legal pretexts and forced camera coercion.
              </CardDescription>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-cyan-950/30 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            CrPC / BNSS Compliance Engine
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pre-loaded Demo Scenarios */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Load Sample Police / Court Notice:</span>
          <div className="flex flex-wrap gap-2">
            {demoDocuments.map((doc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(doc.text);
                  setFileName(doc.file);
                  handleScan(doc.text, doc.file);
                }}
                className="rounded-lg border border-slate-800 bg-[#080D1B] px-2.5 py-1 text-left text-xs text-slate-300 hover:border-rose-500/40 hover:text-rose-300 transition-colors"
              >
                {doc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text from any WhatsApp arrest warrant, CBI notice, Supreme Court order, or extortion letter..."
            className="w-full rounded-xl border border-slate-700 bg-[#080D1B] p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-rose-400 focus:outline-none font-mono leading-relaxed"
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">
              * Official advisory: Indian Police / Courts NEVER arrest citizens via video calls or demand payments via WhatsApp.
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleScan()}
              disabled={loading || !inputText.trim()}
              className="gap-2 text-xs shrink-0 px-4"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{loading ? "Analyzing Document..." : "Inspect Legal Notice"}</span>
            </Button>
          </div>
        </div>

        {/* Forensic Results Display */}
        {result && (
          <div
            className={`rounded-2xl border p-4 space-y-3 animate-in fade-in duration-200 ${
              result.isFake
                ? "border-rose-500/60 bg-rose-950/20 text-rose-300"
                : "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {result.isFake ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                )}
                <div>
                  <span className="text-xs font-black tracking-wide text-white block">
                    {result.verdict}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: {result.fileName} • Engine: OmniShield Judicial Forensic Core
                  </span>
                </div>
              </div>
              <Badge
                className={`text-xs font-mono font-bold ${
                  result.isFake
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                Risk Score: {result.riskScore}/100
              </Badge>
            </div>

            {/* Findings List */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Forensic Legal Findings:
              </span>
              <div className="space-y-2">
                {result.forensicFindings.map((finding: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#060A18]/80 p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className={result.isFake ? "text-rose-400" : "text-emerald-400"}>•</span>
                        {finding.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] ${
                          finding.severity === "CRITICAL"
                            ? "border-rose-500/40 text-rose-300 bg-rose-500/10"
                            : "border-slate-700 text-slate-400"
                        }`}
                      >
                        {finding.severity}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {finding.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Warning and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <VoiceSpeakerButton
                text={result.spokenWarning}
                lang={language}
                label={language === "bn" ? "সতর্কবার্তা শুনুন" : language === "hi" ? "चेतावनी सुनें" : "Play Legal Warning"}
              />

              {result.isFake && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDownloadDossier}
                  className="gap-1.5 text-xs h-8"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download 1930 Forensic Dossier (PDF)</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
