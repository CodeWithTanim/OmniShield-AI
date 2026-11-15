import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload = "", language = "bn" } = body;

    const qrData = (payload || "").trim();
    if (!qrData) {
      return NextResponse.json(
        { error: "Please provide scanned QR payload text to analyze." },
        { status: 400 }
      );
    }

    const vulnerabilities: string[] = [];
    let riskScore = 5;
    let qrType = "PLAIN_TEXT";

    // 1. Detect Rogue WiFi Network Setup Injection
    if (qrData.startsWith("WIFI:") || qrData.startsWith("wifi:")) {
      qrType = "WIFI_CREDENTIALS";
      riskScore += 65;
      vulnerabilities.push("Rogue WiFi Network Configuration: Scanning will force device to join unverified wireless network (Man-In-The-Middle threat)");
    }

    // 2. Detect UPI Payment QR
    else if (qrData.startsWith("upi://pay")) {
      qrType = "UPI_PAYMENT";
      try {
        const urlObj = new URL(qrData);
        const pa = urlObj.searchParams.get("pa") || "";
        const pn = urlObj.searchParams.get("pn") || "";
        const am = urlObj.searchParams.get("am");
        const tn = urlObj.searchParams.get("tn") || "";

        // Check for deceptive notes or altered parameters
        if (tn.toLowerCase().includes("pin") || tn.toLowerCase().includes("receive") || tn.toLowerCase().includes("cashback")) {
          riskScore += 55;
          vulnerabilities.push("Deceptive transaction note in QR misleading victim into approving debit");
        }

        // Suspicious VPA patterns
        if (pa.includes("refund") || pa.includes("cashback") || pa.includes("reward") || pa.includes("bonus")) {
          riskScore += 40;
          vulnerabilities.push("Payee VPA contains fraudulent impersonation keywords");
        }

        if (!am || parseFloat(am) === 0) {
          riskScore += 10;
          vulnerabilities.push("Zero/Unspecified amount allows user to be prompted for arbitrary transfer");
        }
      } catch {
        riskScore += 30;
        vulnerabilities.push("Malformed UPI URI structure");
      }
    }

    // 3. Detect Web URL / Quishing
    else if (qrData.startsWith("http://") || qrData.startsWith("https://") || qrData.includes(".com") || qrData.includes(".xyz") || qrData.includes(".apk")) {
      qrType = "WEB_URL";
      const lower = qrData.toLowerCase();

      // Malicious shorteners
      if (lower.includes("bit.ly") || lower.includes("tinyurl.com") || lower.includes("cutt.ly") || lower.includes("is.gd")) {
        riskScore += 35;
        vulnerabilities.push("Obfuscated URL shortener disguising final malicious web destination");
      }

      // APK Download
      if (lower.includes(".apk") || lower.includes("download") || lower.includes(".exe")) {
        riskScore += 60;
        vulnerabilities.push("Direct Android APK installer vector (Remote Administration Trojan / Banking Malware)");
      }

      // Insecure HTTP
      if (lower.startsWith("http://")) {
        riskScore += 20;
        vulnerabilities.push("Insecure unencrypted HTTP protocol used");
      }

      // IP address URL
      if (/\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
        riskScore += 50;
        vulnerabilities.push("Direct IP address used instead of legitimate merchant domain");
      }
    }

    // 4. Detect Intent Schemes (tel, smsto, mailto)
    else if (qrData.startsWith("tel:") || qrData.startsWith("smsto:")) {
      qrType = "TELEPHONY_INTENT";
      riskScore += 30;
      vulnerabilities.push("Automatic phone dialer or SMS sender trigger");
    }

    // Cap risk score
    riskScore = Math.min(99, Math.max(5, riskScore));
    const isDangerous = riskScore >= 55;

    const spokenWarnings: Record<string, string> = {
      bn: isDangerous
        ? "সাবধান! এই কিউআর কোডটি বিপজ্জনক ও ঝুঁকিপূর্ণ! এটি স্ক্যান করবেন না বা একাউন্টে যুক্ত করবেন না!"
        : "কিউআর কোডটি নিরাপদ ও সাধারণ মনে হচ্ছে।",
      hi: isDangerous
        ? "सावधान! यह क्यूआर कोड खतरनाक है! इसे कभी स्कैन न करें या किसी अनजान नेटवर्क से न जुड़ें!"
        : "क्यूआर कोड सुरक्षित प्रतीत होता है।",
      en: isDangerous
        ? "Warning! Vulnerable or malicious QR code detected! Do not proceed or connect to network."
        : "QR code payload appears safe and authentic.",
    };

    const chosenLang = language === "bn" ? "bn" : language === "hi" ? "hi" : "en";
    const spokenWarning = spokenWarnings[chosenLang];

    const verdict = {
      type: "qr_vulnerability_scan",
      payload: qrData,
      qrType,
      riskScore,
      verdict: isDangerous ? "VULNERABLE_MALICIOUS_QR" : "CLEAN_AUTHENTIC_QR",
      vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : ["No known exploits or rogue payloads detected"],
      spokenWarning,
      allSpokenWarnings: spokenWarnings,
      timestamp: new Date().toISOString(),
      recommendations: isDangerous
        ? [
            "Do NOT accept network connection or download files prompted by this QR.",
            "If this QR was pasted on a shop standee, peel off the fake sticker immediately.",
            "Report the fraud incident to 1930 / cybercrime.gov.in."
          ]
        : [
            "Always verify merchant payee name matches the physical store before paying."
          ]
    };

    // Store in MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("threat_scans").insertOne({
        ...verdict,
        createdAt: new Date(),
      });
    } catch {}

    return NextResponse.json(verdict);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to inspect QR vulnerability" },
      { status: 500 }
    );
  }
}
