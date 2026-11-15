import React from "react";
import Link from "next/link";
import { ShieldAlert, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#040711] py-8 text-xs text-slate-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              <span>OmniShield AI</span>
            </div>
            <p className="max-w-md text-slate-400 text-xs leading-relaxed">
              Real-world cyber safety platform for VibeX Codes Track 3: Protecting regular citizens, shopkeepers, and manufacturing factories from AI voice clones, fake UPI collect traps, QR tampering, and industrial vulnerabilities.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Emergency Cybercrime Helpline: <span className="font-mono font-bold text-cyan-400">1930</span> • Portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">cybercrime.gov.in</a>
            </div>
          </div>

          <div>
            <div className="font-semibold text-slate-200 mb-2.5">Protection Shields</div>
            <ul className="space-y-1.5">
              <li><Link href="/citizen" className="hover:text-cyan-300 transition-colors">Citizen Scam Shield</Link></li>
              <li><Link href="/shops" className="hover:text-cyan-300 transition-colors">Shop Counter Armor</Link></li>
              <li><Link href="/factory" className="hover:text-cyan-300 transition-colors">Factory & Code Guard</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Threat Telemetry Hub</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-slate-200 mb-2.5">Trust & Emergency</div>
            <ul className="space-y-1.5">
              <li className="text-slate-400">Cyber Helpline: <span className="text-cyan-300 font-semibold">1930</span></li>
              <li className="text-slate-400">National Portal: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-cyan-300">cybercrime.gov.in</a></li>
              <li className="text-slate-400">Client-Side Privacy (Zero Logging)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
          <p>© 2026 OmniShield AI • Public Cyber Safety Platform</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Team VenoX
          </p>
        </div>
      </div>
    </footer>
  );
}
