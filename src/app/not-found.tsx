import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center space-y-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-white">404 — Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        The requested security module or page does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="cyber" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to OmniShield Hub</span>
        </Button>
      </Link>
    </div>
  );
}
