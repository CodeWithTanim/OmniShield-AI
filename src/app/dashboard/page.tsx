"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ShieldAlert,
  Users,
  Store,
  Factory,
  Database,
  RefreshCw,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTimestamp } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");

  const fetchHistory = async (type = "") => {
    setLoading(true);
    try {
      const url = type ? `/api/history?type=${type}` : "/api/history";
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(filterType);
  }, [filterType]);

  const stats = data?.stats || {
    totalScans: 0,
    voiceScans: 0,
    upiScans: 0,
    codeScans: 0,
    iotScans: 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-6xl space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
            <Database className="h-3.5 w-3.5" />
            <span>MongoDB Atlas Live Threat Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Unified Threat Telemetry Hub
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time security logs across People (AI Voice & UPI), Shops (QR & Counter WhatsApp), and Factories (IoT & AI Code Guard).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchHistory(filterType)}
          disabled={loading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Database</span>
        </Button>
      </div>

      {/* Account Context Banner */}
      {session?.user ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-emerald-300">
                Authenticated Enterprise Account: {session.user.name}
              </span>
              <span className="text-slate-400 ml-2">({session.user.email})</span>
            </div>
          </div>
          <Badge variant="success" className="w-fit text-[10px]">
            MONGODB ATLAS SYNCED
          </Badge>
        </div>
      ) : (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            <span className="font-bold text-cyan-300">Public Live Demo Feed:</span> You are viewing anonymous system telemetry.{" "}
            <Link href="/auth/login" className="underline text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign In
            </Link>{" "}
            to link company sensors and save custom shop/factory incident logs.
          </div>
          <Link href="/auth/login">
            <Button size="sm" variant="outline" className="text-xs shrink-0 border-cyan-500/40 text-cyan-300">
              Sign In to Your Account
            </Button>
          </Link>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-[#080D1B]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Scans Logged</span>
              <BarChart3 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
              {stats.totalScans}
            </div>
            <p className="mt-1 text-[11px] text-cyan-400">Stored in MongoDB Atlas</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-[#080D1B]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">AI Voice Scans</span>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-300 font-mono">
              {stats.voiceScans}
            </div>
            <p className="mt-1 text-[11px] text-indigo-400">Voice deepfakes analyzed</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-[#080D1B]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">UPI Traps Blocked</span>
              <Store className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
              {stats.upiScans}
            </div>
            <p className="mt-1 text-[11px] text-emerald-400">Collect debit scams intercepted</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-[#080D1B]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Factory & Code Audits</span>
              <Factory className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-300 font-mono">
              {stats.codeScans + stats.iotScans}
            </div>
            <p className="mt-1 text-[11px] text-purple-400">Code & IoT machines guarded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Chips & Recent Events Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Recent Threat Detections in MongoDB</span>
              </CardTitle>
              <CardDescription>
                Auditable event ledger proving multi-tier threat classification.
              </CardDescription>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: "All Events", val: "" },
                { label: "AI Voice", val: "voice_deepfake_scan" },
                { label: "UPI", val: "upi_scam_scan" },
                { label: "Code Guard", val: "code_guard_scan" },
                { label: "Factory IoT", val: "factory_iot_telemetry" },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setFilterType(f.val)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterType === f.val
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "border border-slate-800 bg-[#080D1B] text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              Fetching threat events from MongoDB...
            </div>
          ) : !data?.items?.length ? (
            <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
              <Database className="h-8 w-8 text-slate-600 mx-auto" />
              <p>No recent events recorded in this filter view yet.</p>
              <p className="text-slate-500">
                Run an emergency scan in Citizen Shield, Shop Armor, or Factory Guard to populate this live feed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2.5 font-semibold">Event Type</th>
                    <th className="pb-2.5 font-semibold">Target / Subject</th>
                    <th className="pb-2.5 font-semibold">Verdict / Status</th>
                    <th className="pb-2.5 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.items.map((item: any, i: number) => {
                    const isVoice = item.type === "voice_deepfake_scan";
                    const isUpi = item.type === "upi_scam_scan";
                    const isCode = item.type === "code_guard_scan";
                    const isIot = item.type === "factory_iot_telemetry";

                    return (
                      <tr key={item._id || i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3">
                          <span className="font-mono font-semibold uppercase text-cyan-400">
                            {isVoice ? "AI Voice" : isUpi ? "UPI Scan" : isCode ? "Code Guard" : isIot ? "Factory IoT" : item.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-200 max-w-xs truncate">
                          {isVoice
                            ? item.audioName || item.transcript?.slice(0, 45) + "..."
                            : isUpi
                            ? item.payeeVpa || item.rawInput?.slice(0, 45) + "..."
                            : isCode
                            ? item.filename || "AI Source Code"
                            : isIot
                            ? item.machineId
                            : "System Threat Event"}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              item.verdict?.includes("SCAM") ||
                              item.isDangerous ||
                              item.status === "ATTACK_TRIGGER_ISOLATED" ||
                              item.verdict === "CRITICAL_RISK"
                                ? "destructive"
                                : "success"
                            }
                            className="text-[10px]"
                          >
                            {item.verdict || item.status || "COMPLETED"}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-400">
                          {formatTimestamp(item.timestamp || item.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
