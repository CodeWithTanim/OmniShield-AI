"use client";

import React, { useEffect, useState } from "react";
import { Download, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register service worker if in browser
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("OmniShield PWA Service Worker Registered"))
        .catch((err) => console.warn("PWA SW registration:", err));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-cyan-500/40 bg-[#060A18]/95 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Install OmniShield App</span>
              <Sparkles className="h-3 w-3 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Add to Home Screen for instant offline cyber protection.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="cyber"
          onClick={handleInstallClick}
          className="w-full text-xs h-8"
        >
          Install to Phone / Desktop
        </Button>
      </div>
    </div>
  );
}
