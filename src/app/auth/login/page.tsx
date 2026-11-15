"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res?.error) {
        setError(res.error.message || "Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = "demo.owner@omnishield.ai";
      const demoPass = "DemoPassword123!";
      const res = await signIn.email({
        email: demoEmail,
        password: demoPass,
      });

      if (res?.error) {
        const signUpRes = await signUp.email({
          name: "Ramesh Sharma (Demo Shop Owner)",
          email: demoEmail,
          password: demoPass,
        });
        if (signUpRes?.error) {
          setError(signUpRes.error.message || "Quick demo access failed");
          return;
        }
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-12">
      <Card className="w-full max-w-md border-cyan-500/20 bg-[#060A16]/95">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 mb-1">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Sign in to OmniShield AI</CardTitle>
          <CardDescription>
            Access your unified cyber safety telemetry, threat scans, and business protection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-950/20 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Authenticating..." : "Sign In with BetterAuth"}
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase tracking-wider">
                Or Judge / Fast Access
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full text-xs border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/40"
            >
              ⚡ 1-Click Demo Sign In (Shop Owner)
            </Button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-cyan-400 hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
