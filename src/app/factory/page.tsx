"use client";

import React, { useState } from "react";
import {
  Factory,
  Code2,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Zap,
  PowerOff,
  Flame,
  Activity,
  Wrench,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function FactoryPage() {
  const [activeTab, setActiveTab] = useState("code");

  // Code Guard State
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeResult, setCodeResult] = useState<any>(null);

  // IoT Sensor Telemetry State
  const [machineId, setMachineId] = useState("CNC-PUMP-02");
  const [temperature, setTemperature] = useState(48);
  const [vibration, setVibration] = useState(2.8);
  const [packetRate, setPacketRate] = useState(85);
  const [unauthorizedPort, setUnauthorizedPort] = useState(false);
  const [iotLoading, setIotLoading] = useState(false);
  const [iotResult, setIotResult] = useState<any>(null);

  const demoVulnerableCode = `# AI-Generated Factory Web API Backend
import os
import sqlite3
from flask import Flask, request

app = Flask(__name__)

# HARDCODED SECRETS (VULNERABILITY)
AWS_SECRET_KEY = "AKIA_FAKE_FACTORY_KEY_9988223311"
DB_PASSWORD = "factory_admin_secret_pass_2026"

@app.route("/api/machine/control", methods=["POST"])
def machine_control():
    machine_id = request.json.get("machine_id")
    action = request.json.get("action")
    
    # SQL INJECTION (VULNERABILITY)
    conn = sqlite3.connect("factory.db")
    query = f"SELECT * FROM machines WHERE id = '{machine_id}'"
    conn.execute(query)
    
    # REMOTE CODE EXECUTION (VULNERABILITY)
    os.system(f"python3 run_pump.py --cmd {action}")
    
    return {"status": "success"}
`;

  const handleScanCode = async (codeToScan: string) => {
    if (!codeToScan.trim()) return;
    setCodeLoading(true);
    setCodeResult(null);

    try {
      const res = await fetch("/api/analyze/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToScan }),
      });
      const data = await res.json();
      setCodeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCodeLoading(false);
    }
  };

  const handleScanIot = async () => {
    setIotLoading(true);
    setIotResult(null);

    try {
      const res = await fetch("/api/analyze/iot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId,
          temperatureCelsius: Number(temperature),
          vibrationMmS: Number(vibration),
          networkPacketRateHz: Number(packetRate),
          unauthorizedPortActivity: unauthorizedPort,
        }),
      });
      const data = await res.json();
      setIotResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIotLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-6xl space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-2">
            <Factory className="h-3.5 w-3.5" />
            <span>Pillar 3: Factory Machines & Code Guard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Factory & Code Guard
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Protect manufacturing factories and young startups from unauthenticated IoT machine takeovers, hardcoded secrets in AI-written code, and industrial cyber-attacks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
          <span>Automated Auto-Remediation Active</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="code" className="gap-2">
            <Code2 className="h-4 w-4" />
            <span>AI Code Security Guard</span>
          </TabsTrigger>
          <TabsTrigger value="iot" className="gap-2">
            <Cpu className="h-4 w-4" />
            <span>Factory IoT Sensor Guard</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AI CODE SECURITY SCANNER */}
        <TabsContent value="code" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-purple-400" />
                    <span>Scan AI-Written Code Before Deployment</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    SECURITY AUDIT
                  </Badge>
                </div>
                <CardDescription>
                  Startups rely on AI to write code quickly. Our guard detects hardcoded credentials, SQL injection, and dangerous shell execution before deployment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCodeSnippet(demoVulnerableCode);
                      handleScanCode(demoVulnerableCode);
                    }}
                  >
                    Load AI-Vulnerable Code Sample
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCodeSnippet("");
                      setCodeResult(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste Python, Node.js, Go, or Dockerfile code here..."
                    className="w-full rounded-lg border border-slate-700 bg-[#060A16] p-3 font-mono text-xs text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <Button
                  onClick={() => handleScanCode(codeSnippet)}
                  disabled={codeLoading || !codeSnippet.trim()}
                  className="w-full gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>{codeLoading ? "Auditing Codebase for Vulnerabilities..." : "Run Security Audit"}</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base">Vulnerability & Auto-Fix Report</CardTitle>
                <CardDescription>
                  Identifies the exact lines, threat severity, and provides automated secure patches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!codeResult ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 space-y-2 text-xs">
                    <Code2 className="h-8 w-8 text-slate-600" />
                    <p>Load the AI sample or paste code to see instant vulnerability detection.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Score Bar */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#080D1B] p-4">
                      <div>
                        <div className="text-xs text-slate-400">Codebase Security Score</div>
                        <div className="text-2xl font-black text-purple-400 font-mono">
                          {codeResult.securityScore} / 100
                        </div>
                      </div>
                      <Badge
                        variant={codeResult.securityScore < 50 ? "destructive" : "warning"}
                        className="text-xs px-3 py-1 uppercase"
                      >
                        {codeResult.verdict.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    {/* Vulnerabilities List */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {codeResult.vulnerabilities.map((v: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-rose-500/30 bg-rose-950/15 p-3.5 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-300 flex items-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                              Line {v.line}: {v.title}
                            </span>
                            <Badge variant="destructive" className="text-[10px]">
                              {v.severity}
                            </Badge>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{v.description}</p>
                          <div className="rounded bg-[#060A16] p-2 font-mono text-[11px] text-rose-200 border border-slate-800">
                            Trigger: {v.matchedSnippet}
                          </div>
                          <div className="rounded bg-emerald-950/30 p-2 font-mono text-[11px] text-emerald-300 border border-emerald-500/30 flex items-start gap-1.5">
                            <Wrench className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>Auto-Fix: {v.suggestedFix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: FACTORY IOT SENSOR & MACHINE MONITOR */}
        <TabsContent value="iot" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>Factory Sensor Telemetry Controls</span>
                </CardTitle>
                <CardDescription>
                  Simulate live factory machine metrics to test how OmniShield isolates machines under attack.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Machine Identifier:</label>
                  <Input value={machineId} onChange={(e) => setMachineId(e.target.value)} />
                </div>

                {/* Temperature Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Machine Temperature (°C):</span>
                    <span className={temperature > 75 ? "text-rose-400 font-mono font-bold" : "text-cyan-400 font-mono"}>
                      {temperature}°C {temperature > 75 && "(OVERHEAT ATTACK)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="95"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Vibration Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Mechanical Vibration (mm/s):</span>
                    <span className={vibration > 7.0 ? "text-rose-400 font-mono font-bold" : "text-cyan-400 font-mono"}>
                      {vibration} mm/s {vibration > 7.0 && "(CRITICAL STRESS)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={vibration}
                    onChange={(e) => setVibration(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Packet Rate Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Sensor Network Packets/sec:</span>
                    <span className={packetRate > 400 ? "text-rose-400 font-mono font-bold" : "text-cyan-400 font-mono"}>
                      {packetRate} pkts/s {packetRate > 400 && "(NETWORK FLOODING)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    value={packetRate}
                    onChange={(e) => setPacketRate(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Preset Attack Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(82);
                      setVibration(8.4);
                      setPacketRate(520);
                      setUnauthorizedPort(true);
                    }}
                    className="text-rose-300 border-rose-500/30 hover:bg-rose-950/20"
                  >
                    Simulate Ransomware / Sabotage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTemperature(42);
                      setVibration(2.2);
                      setPacketRate(70);
                      setUnauthorizedPort(false);
                    }}
                    className="text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/20"
                  >
                    Reset to Normal Production
                  </Button>
                </div>

                <Button onClick={handleScanIot} disabled={iotLoading} className="w-full">
                  {iotLoading ? "Analyzing Telemetry..." : "Inspect Machine Baseline"}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-base">Machine Health & Automated Isolation Status</CardTitle>
              </CardHeader>
              <CardContent>
                {!iotResult ? (
                  <div className="py-20 text-center text-slate-500 text-xs">
                    Click 'Inspect Machine Baseline' or simulate an attack to test automated factory machine isolation.
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div
                      className={`rounded-xl border p-4 ${
                        iotResult.status === "ATTACK_TRIGGER_ISOLATED"
                          ? "border-rose-500/50 bg-rose-950/25 text-rose-200"
                          : "border-emerald-500/50 bg-emerald-950/25 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm flex items-center gap-2">
                          {iotResult.status === "ATTACK_TRIGGER_ISOLATED" ? (
                            <>
                              <PowerOff className="h-4 w-4 text-rose-400" />
                              <span>CIRCUIT CUTOFF: MACHINE ISOLATED!</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              <span>NORMAL FACTORY PRODUCTION</span>
                            </>
                          )}
                        </div>
                        <Badge
                          variant={
                            iotResult.status === "ATTACK_TRIGGER_ISOLATED"
                              ? "destructive"
                              : "success"
                          }
                        >
                          Health: {iotResult.healthScore}%
                        </Badge>
                      </div>

                      <div className="mt-2.5 text-xs leading-relaxed bg-[#060A16] p-2.5 rounded-lg border border-slate-800">
                        {iotResult.containmentAction}
                      </div>
                    </div>

                    {iotResult.anomalies.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400">Detected Anomalies:</div>
                        <ul className="space-y-1.5 text-xs text-rose-300">
                          {iotResult.anomalies.map((a: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
