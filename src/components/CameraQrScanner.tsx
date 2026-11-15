"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraQrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CameraQrScanner({ onScanSuccess, isOpen, onClose }: CameraQrScannerProps) {
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef<any>(null);
  const scannerContainerId = "omni-qr-reader-container";

  useEffect(() => {
    let mounted = true;

    if (!isOpen) {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current?.clear();
            setIsScanning(false);
          })
          .catch((err: any) => console.warn("Error stopping camera scanner:", err));
      }
      return;
    }

    const startScanner = async () => {
      try {
        setScannerError(null);
        // Dynamic import to prevent SSR issues
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!mounted) return;

        const html5QrCode = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: "environment" }, // Prefer rear camera on mobile
          config,
          (decodedText: string) => {
            // Success
            onScanSuccess(decodedText);
            // Stop scanning once detected
            html5QrCode
              .stop()
              .then(() => {
                html5QrCode.clear();
                setIsScanning(false);
                onClose();
              })
              .catch((e) => console.warn(e));
          },
          () => {
            // Frame error - ignore frames where no QR is in view
          }
        );

        if (mounted) {
          setIsScanning(true);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error("Camera scanner error:", err);
        setScannerError(
          err?.message || "Could not access camera. Please allow camera permissions in browser settings."
        );
        setIsScanning(false);
      }
    };

    // Small delay to ensure container DOM element exists
    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="relative rounded-2xl border border-cyan-500/40 bg-[#060A16] p-4 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            Live Counter Camera Scanner
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs h-7 border-slate-700 text-slate-400 hover:text-white"
        >
          <CameraOff className="h-3.5 w-3.5 mr-1" />
          <span>Close Camera</span>
        </Button>
      </div>

      {scannerError ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 text-center space-y-2">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto" />
          <p className="text-xs text-rose-300 font-semibold">{scannerError}</p>
          <p className="text-[11px] text-slate-400">
            If using a laptop or phone, ensure you granted camera permissions. You can also paste the QR text manually below.
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-black border border-slate-800 min-h-[260px] flex items-center justify-center">
          <div id={scannerContainerId} className="w-full max-w-sm mx-auto" />

          {/* Viewfinder Target Styling Overlay */}
          {isScanning && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-56 w-56 rounded-xl border-2 border-dashed border-cyan-400/80 shadow-2xl shadow-cyan-500/20">
                <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-center text-[11px] text-slate-400">
        Aim camera directly at the shop standee QR sticker. Detection happens automatically in under a second.
      </div>
    </div>
  );
}
