"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  PhoneCall,
  Download,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VoiceSpeakerButton } from "@/components/VoiceSpeakerButton";

interface GoldenHourDisputeGeneratorProps {
  language?: "bn" | "hi" | "en";
}

export function GoldenHourDisputeGenerator({ language = "bn" }: GoldenHourDisputeGeneratorProps) {
  const [victimName, setVictimName] = useState("Rajesh Kumar");
  const [victimPhone, setVictimPhone] = useState("+91 98765 43210");
  const [scammerPhone, setScammerPhone] = useState("+91 82345 67890");
  const [scammerUpiOrAccount, setScammerUpiOrAccount] = useState("cyber.arrest.cell@fakeupi");
  const [fraudAmount, setFraudAmount] = useState("250000");
  const [bankName, setBankName] = useState("State Bank of India (SBI)");
  const [transactionRef, setTransactionRef] = useState("UTR-20261115-99824");
  const [incidentType, setIncidentType] = useState("CBI_DIGITAL_ARREST_EXTORTION");
  const [evidenceSummary, setEvidenceSummary] = useState(
    "Suspect claimed to be Inspector Vikram from CBI Cyber Crime Branch, conducted a 45-minute video call threat, and demanded emergency collateral transfer under Digital Arrest."
  );

  const [activeTab, setActiveTab] = useState<"police" | "bank" | "checklist">("police");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const demoScenarios = [
    {
      label: "CBI Digital Arrest (₹2.5 Lakh)",
      type: "CBI_DIGITAL_ARREST_EXTORTION",
      victim: "Sunil Verma",
      scammerPhone: "+91 91234 56789",
      scammerUpi: "cbi.escrow.cell@oksbi",
      amount: "250000",
      bank: "State Bank of India (SBI)",
      evidence: "Threatened with fake digital warrant from Supreme Court claiming narcotics found in parcel.",
    },
    {
      label: "Son Voice Clone Kidnap (₹10 Lakh)",
      type: "AI_VOICE_CLONE_EXTORTION",
      victim: "Vikram Malhotra",
      scammerPhone: "+91 99887 66554",
      scammerUpi: "police.station.release@paytm",
      amount: "1000000",
      bank: "HDFC Bank",
      evidence: "AI Cloned audio voice of son pleading for bail transfer following fake drunk-driving police arrest.",
    },
    {
      label: "Urgent Power Cut Phishing (₹45,000)",
      type: "UTILITY_POWER_BILL_FRAUD",
      victim: "Ananya Ghosh",
      scammerPhone: "+91 88776 55443",
      scammerUpi: "discom.recovery.desk@axl",
      amount: "45000",
      bank: "ICICI Bank",
      evidence: "SMS warned electricity disconnection at 9:30 PM; forced QuickSupport APK install and debited funds.",
    },
  ];

  const handleGenerate = async (overrides?: any) => {
    setLoading(true);
    try {
      const payload = {
        victimName: overrides?.victim || victimName,
        victimPhone,
        incidentType: overrides?.type || incidentType,
        scammerPhone: overrides?.scammerPhone || scammerPhone,
        scammerUpiOrAccount: overrides?.scammerUpi || scammerUpiOrAccount,
        fraudAmount: overrides?.amount || fraudAmount,
        transactionRef,
        bankName: overrides?.bank || bankName,
        evidenceSummary: overrides?.evidence || evidenceSummary,
        language,
      };

      const res = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const downloadTextFile = () => {
    if (!result) return;
    const content = `======================================================
OMNISHIELD AI - GOLDEN HOUR CYBER DISPUTE PACKET
Generated: ${result.formattedDate}
Incident Reference: ${result.incidentRef}
======================================================

>>> PART 1: COMPLAINT TO NATIONAL CYBERCRIME PORTAL (1930 / cybercrime.gov.in)
${result.policeComplaintDraft}

------------------------------------------------------

>>> PART 2: EMERGENCY BANK DISPUTE & FREEZE LETTER
${result.bankDisputeDraft}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OmniShield_Dispute_Dossier_${result.incidentRef}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-amber-500/30 bg-[#060A18]/95 shadow-2xl backdrop-blur-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <span>"Golden Hour" 1-Click Police & Bank Dispute Generator</span>
                <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                  CRITICAL 120-MIN WINDOW
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Auto-generates legally formulated FIR drafts (IT Act Sec 66D, IPC 420) and Bank Nodal Officer freeze petitions before defrauded funds are laundered.
              </CardDescription>
            </div>
          </div>
          <a href="tel:1930" className="self-start sm:self-auto">
            <Button size="sm" variant="destructive" className="gap-2 text-xs font-bold animate-pulse">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Dial 1930 Helpline</span>
            </Button>
          </a>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Scenario Quick Picks */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Load Incident Template:</span>
          <div className="flex flex-wrap gap-2">
            {demoScenarios.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setVictimName(sc.victim);
                  setIncidentType(sc.type);
                  setScammerPhone(sc.scammerPhone);
                  setScammerUpiOrAccount(sc.scammerUpi);
                  setFraudAmount(sc.amount);
                  setBankName(sc.bank);
                  setEvidenceSummary(sc.evidence);
                  handleGenerate(sc);
                }}
                className="rounded-lg border border-slate-800 bg-[#080D1B] px-3 py-1 text-left text-xs text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Complainant Name</label>
            <Input
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Scammer Phone / WhatsApp</label>
            <Input
              value={scammerPhone}
              onChange={(e) => setScammerPhone(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9 font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Defrauded Amount (INR)</label>
            <Input
              value={fraudAmount}
              onChange={(e) => setFraudAmount(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9 font-mono font-bold text-amber-300"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Suspect Beneficiary UPI / Bank A/C</label>
            <Input
              value={scammerUpiOrAccount}
              onChange={(e) => setScammerUpiOrAccount(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9 font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Complainant Bank</label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Transaction ID / UTR</label>
            <Input
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="bg-[#080D1B] border-slate-700 text-xs h-9 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="cyber"
            size="sm"
            onClick={() => handleGenerate()}
            disabled={loading}
            className="gap-2 text-xs px-5 h-9"
          >
            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>{loading ? "Formulating Legal Drafts..." : "Generate Official Dispute Packet"}</span>
          </Button>
        </div>

        {/* Generated Result Section */}
        {result && (
          <div className="rounded-2xl border border-amber-500/40 bg-[#080D1B] p-4 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Dispute Dossier Formulated: {result.incidentRef}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Compliant with RBI Circular RBI/2017-18/15 & National Cybercrime Portal 1930
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VoiceSpeakerButton
                  text={result.spokenAdvice}
                  lang={language}
                  label={language === "bn" ? "নির্দেশনা শুনুন" : language === "hi" ? "सलाह सुनें" : "Play Advice"}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadTextFile}
                  className="gap-1.5 text-xs h-8 border-slate-700 text-slate-200"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download (.TXT)</span>
                </Button>
              </div>
            </div>

            {/* Sub-tabs: Police FIR vs Bank Nodal Letter vs Golden Hour Protocol */}
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("police")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "police"
                    ? "border-amber-400 text-amber-300 bg-amber-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>1930 Cybercrime Portal Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "bank"
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Bank Freeze Petition Letter</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checklist")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "checklist"
                    ? "border-rose-400 text-rose-300 bg-rose-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>Golden Hour 4-Step Protocol</span>
              </button>
            </div>

            {/* Active Content Tab */}
            {activeTab === "police" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Ready to paste directly at <strong>cybercrime.gov.in</strong> or read aloud on call <strong>1930</strong>:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(result.policeComplaintDraft, "police")}
                    className="h-7 text-xs gap-1.5 text-amber-300 hover:bg-amber-500/10"
                  >
                    {copiedType === "police" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedType === "police" ? "Copied!" : "Copy Police Draft"}</span>
                  </Button>
                </div>
                <pre className="rounded-xl border border-slate-800 bg-[#04060E] p-3 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {result.policeComplaintDraft}
                </pre>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Email to your bank's Nodal Grievance Officer & Customer Support immediately:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(result.bankDisputeDraft, "bank")}
                    className="h-7 text-xs gap-1.5 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    {copiedType === "bank" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedType === "bank" ? "Copied!" : "Copy Bank Notice"}</span>
                  </Button>
                </div>
                <pre className="rounded-xl border border-slate-800 bg-[#04060E] p-3 text-[11px] font-mono text-cyan-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {result.bankDisputeDraft}
                </pre>
              </div>
            )}

            {activeTab === "checklist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-[#04060E] p-3 space-y-1.5">
                  <span className="font-bold text-amber-300 block">Step 1: Immediate Call to 1930</span>
                  <p className="text-slate-400">
                    Call 1930 within the first 120 minutes. State the UTR Number ({transactionRef || "N/A"}) and beneficiary bank. Police will trigger the CFCFRMS system to freeze the destination account.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#04060E] p-3 space-y-1.5">
                  <span className="font-bold text-cyan-300 block">Step 2: Bank Hotlisting & Chargeback</span>
                  <p className="text-slate-400">
                    Send the generated Bank Dispute Letter to your bank's fraud email address. Request an immediate UTR Chargeback Token under RBI Circular RBI/2017-18/15.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#04060E] p-3 space-y-1.5">
                  <span className="font-bold text-emerald-300 block">Step 3: Freeze SIM & WhatsApp Session</span>
                  <p className="text-slate-400">
                    If any OTP or screen-share APK was installed, immediately put the phone on Airplane Mode and disconnect Wi-Fi to stop remote accessibility trojans.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#04060E] p-3 space-y-1.5">
                  <span className="font-bold text-rose-300 block">Step 4: Formal FIR Acknowledgment</span>
                  <p className="text-slate-400">
                    Submit the Police Complaint Draft on <strong>cybercrime.gov.in</strong> and retain the acknowledgment number for mandatory bank chargeback submission.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
