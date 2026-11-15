import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniShield AI — Cyber Safety for People, Shops & Factories",
  description:
    "Universal cyber safety shield protecting citizens, shopkeepers, and manufacturing factories from fake AI voice scams, UPI traps, QR tampering, and industrial vulnerabilities.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#050814] text-slate-100 cyber-grid`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
