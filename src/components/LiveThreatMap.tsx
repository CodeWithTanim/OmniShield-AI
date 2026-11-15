"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Radio,
  MapPin,
  Activity,
  AlertTriangle,
  Users,
  Store,
  Factory,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ThreatHotspot {
  id: string;
  city: string;
  region: string;
  threatType: "UPI_TRAP" | "VOICE_CLONE" | "QR_SPOOF" | "IOT_SABOTAGE";
  severity: "CRITICAL" | "HIGH" | "ELEVATED";
  targetDescription: string;
  x: number; // percentage on map
  y: number; // percentage on map
  interceptTime: string;
  scamScore: number;
}

const mockHotspots: ThreatHotspot[] = [
  {
    id: "th-1",
    city: "New Delhi",
    region: "NCR Cyber Hub",
    threatType: "VOICE_CLONE",
    severity: "CRITICAL",
    targetDescription: "AI Voice Clone 'Hospital Distress' call intercepted before fund transfer",
    x: 42,
    y: 32,
    interceptTime: "2 mins ago",
    scamScore: 94,
  },
  {
    id: "th-2",
    city: "Mumbai",
    region: "Maharashtra Central",
    threatType: "UPI_TRAP",
    severity: "CRITICAL",
    targetDescription: "Deceptive 'Refund Claim' UPI debit request blocked before PIN entry",
    x: 32,
    y: 58,
    interceptTime: "Just now",
    scamScore: 91,
  },
  {
    id: "th-3",
    city: "Kolkata",
    region: "Eastern Sector",
    threatType: "QR_SPOOF",
    severity: "HIGH",
    targetDescription: "Counter standee sticker swapped with rogue APK download link",
    x: 74,
    y: 49,
    interceptTime: "6 mins ago",
    scamScore: 88,
  },
  {
    id: "th-4",
    city: "Bengaluru",
    region: "Southern Corridor",
    threatType: "IOT_SABOTAGE",
    severity: "HIGH",
    targetDescription: "Vibration telemetry anomaly triggered automated machine kill-switch",
    x: 46,
    y: 78,
    interceptTime: "11 mins ago",
    scamScore: 85,
  },
  {
    id: "th-5",
    city: "Guwahati",
    region: "North East Front",
    threatType: "VOICE_CLONE",
    severity: "CRITICAL",
    targetDescription: "Digital arrest extortion call mimicking police officer intercepted",
    x: 88,
    y: 36,
    interceptTime: "18 mins ago",
    scamScore: 96,
  },
  {
    id: "th-6",
    city: "Jaipur",
    region: "Western Front",
    threatType: "UPI_TRAP",
    severity: "ELEVATED",
    targetDescription: "Fake lottery cashback message with hidden payment collect trigger",
    x: 35,
    y: 38,
    interceptTime: "24 mins ago",
    scamScore: 78,
  },
  {
    id: "th-7",
    city: "Hyderabad",
    region: "Deccan Plateau",
    threatType: "QR_SPOOF",
    severity: "HIGH",
    targetDescription: "Retail counter fake soundbox screen attempt detected by staff alert",
    x: 48,
    y: 64,
    interceptTime: "30 mins ago",
    scamScore: 86,
  },
];

export function LiveThreatMap() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatHotspot>(mockHotspots[0]);
  const [filter, setFilter] = useState<string>("ALL");

  const filteredHotspots =
    filter === "ALL"
      ? mockHotspots
      : mockHotspots.filter((h) => h.threatType === filter);

  return (
    <Card className="border-cyan-500/30 bg-[#060A18]/90 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>LIVE GEOGRAPHIC RADAR</span>
            </div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Interactive Threat Telemetry Radar</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Live geographic nodes intercepting AI voice clones, UPI traps, and counter fraud across regional hubs.
            </CardDescription>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: "All Hubs", val: "ALL" },
              { label: "Voice Clones", val: "VOICE_CLONE" },
              { label: "UPI Traps", val: "UPI_TRAP" },
              { label: "QR Spoofs", val: "QR_SPOOF" },
              { label: "IoT Sabotage", val: "IOT_SABOTAGE" },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilter(f.val)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filter === f.val
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                    : "border border-slate-800 bg-[#080D1B] text-slate-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Visual Radar Map Grid */}
          <div className="lg:col-span-7 relative h-[360px] rounded-2xl border border-slate-800 bg-[#040711] overflow-hidden cyber-grid flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-72 w-72 rounded-full border border-cyan-500/10" />
              <div className="h-48 w-48 rounded-full border border-cyan-500/20" />
              <div className="h-24 w-24 rounded-full border border-cyan-500/30" />
              {/* Rotating Radar Sweep */}
              <div className="absolute h-72 w-72 rounded-full border-r-2 border-cyan-400/40 animate-spin [animation-duration:8s] pointer-events-none" />
            </div>

            {/* Ambient Background Grid Outline */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500">
              RADAR ACTIVE: 28.6139° N, 77.2090° E (BHARAT FRONTLINE)
            </div>

            {/* Pulsating Hotspot Pins */}
            {filteredHotspots.map((node) => {
              const isSelected = selectedThreat.id === node.id;
              const isCrit = node.severity === "CRITICAL";

              return (
                <div
                  key={node.id}
                  style={{ top: `${node.y}%`, left: `${node.x}%` }}
                  onClick={() => setSelectedThreat(node)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  {/* Outer Pulsing Ping */}
                  <span
                    className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                      isCrit ? "bg-rose-500" : "bg-cyan-400"
                    }`}
                  />

                  {/* Core Node */}
                  <div
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-125 shadow-lg ${
                      isSelected
                        ? "border-white bg-cyan-400 text-black scale-110"
                        : isCrit
                        ? "border-rose-400 bg-rose-950 text-rose-300"
                        : "border-cyan-400 bg-cyan-950 text-cyan-300"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>

                  {/* Node Label on Hover or Active */}
                  <div
                    className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-mono font-bold tracking-tight shadow-md transition-opacity pointer-events-none ${
                      isSelected
                        ? "bg-cyan-500/30 text-cyan-200 border border-cyan-500/60 opacity-100"
                        : "bg-[#080D1B]/90 text-slate-300 border border-slate-800 opacity-75 group-hover:opacity-100"
                    }`}
                  >
                    {node.city}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#080D1B] p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="font-bold text-sm text-white">
                    {selectedThreat.city} ({selectedThreat.region})
                  </span>
                </div>
                <Badge
                  variant={selectedThreat.severity === "CRITICAL" ? "destructive" : "warning"}
                  className="text-[10px]"
                >
                  {selectedThreat.severity}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400">Classified Threat Vector:</span>
                  <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                    {selectedThreat.threatType.replace("_", " ")}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#060A16] p-3 text-xs text-slate-300 leading-relaxed">
                  "{selectedThreat.targetDescription}"
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-slate-800/80 bg-[#040711] p-2.5">
                    <div className="text-[10px] text-slate-400">Threat Score</div>
                    <div className="text-base font-black text-rose-400 font-mono">
                      {selectedThreat.scamScore}/100
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-800/80 bg-[#040711] p-2.5">
                    <div className="text-[10px] text-slate-400">Intercepted</div>
                    <div className="text-xs font-bold text-slate-200 mt-1">
                      {selectedThreat.interceptTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Automated Shield Interception Active (Zero PIN / Data Leakage)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
