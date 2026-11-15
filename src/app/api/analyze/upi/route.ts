import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { upiString, language = "hi" } = body;

    const raw = (upiString || "").trim();
    if (!raw) {
      return NextResponse.json(
        { error: "Please provide a UPI link, message, or QR payload." },
        { status: 400 }
      );
    }

    let isCollectRequest = false;
    let isDebitTrap = false;
    let payeeVpa = "";
    let payeeName = "";
    let amount = "";
    const suspiciousIndicators: string[] = [];

    // Analyze UPI URI scheme
    if (raw.toLowerCase().startsWith("upi://pay")) {
      try {
        const urlObj = new URL(raw.replace(/^upi:\/\//i, "https://upi/"));
        payeeVpa = urlObj.searchParams.get("pa") || "";
        payeeName = urlObj.searchParams.get("pn") || "";
        amount = urlObj.searchParams.get("am") || "";
        const mode = urlObj.searchParams.get("mode") || "";

        // Collect requests often masquerade as "refund" or "cashback" in note/pn
        const note = (urlObj.searchParams.get("tn") || "").toLowerCase();
        if (/cashback|refund|lottery|reward|claim|bonus|income tax/i.test(note)) {
          suspiciousIndicators.push(`Deceptive note detected: '${note}' used to trick payer.`);
          isDebitTrap = true;
        }

        // Generic checks
        if (payeeVpa.includes("free") || payeeVpa.includes("claim") || payeeVpa.includes("refund")) {
          suspiciousIndicators.push("Payee VPA contains suspicious deceptive terms.");
        }
      } catch {
        suspiciousIndicators.push("Malformed UPI URI payload structure.");
      }
    }

    // Text-based message detection (SMS / WhatsApp UPI Collect scam)
    const textLower = raw.toLowerCase();
    if (
      /request money|requested money|collect request|approve request|enter upi pin|pin dale|pay to receive/i.test(
        textLower
      )
    ) {
      isCollectRequest = true;
      isDebitTrap = true;
      suspiciousIndicators.push(
        "Message contains UPI 'Collect/Request' trap. Scammers tell you to enter PIN to 'receive' money."
      );
    }

    if (/congratulations|you won|lottery|electricity bill|kyc suspended/i.test(textLower)) {
      suspiciousIndicators.push("Social engineering lure (lottery/kyc urgency)");
      isDebitTrap = true;
    }

    const scamScore = isDebitTrap ? (isCollectRequest ? 95 : 82) : 18;
    const isDangerous = scamScore >= 60;

    const allSpokenWarnings: Record<string, string> = {
      hi: isDangerous
        ? "सावधान! यह बटन आपके बैंक खाते से पैसे निकाल लेगा! पैसे प्राप्त करने के लिए कभी भी UPI पिन दर्ज न करें!"
        : "यह एक सामान्य भुगतान लिंक प्रतीत होता है। भुगतान करने से पहले प्राप्तकर्ता का नाम अवश्य जांचें।",
      bn: isDangerous
        ? "সাবধান! এই বাটনে চাপ দিলে আপনার ব্যাংক থেকে টাকা কেটে নেওয়া হবে! টাকা পাওয়ার জন্য কখনও UPI পিন দেবেন না!"
        : "এটি একটি সাধারণ পেমেন্ট লিংক। পেমেন্ট করার আগে প্রাপকের নাম যাচাই করে নিন।",
      en: isDangerous
        ? "Warning! This button will take money OUT of your bank account! You never need a UPI PIN to receive money!"
        : "Standard payment link detected. Always confirm the payee name before approving.",
    };

    const goldenRules: Record<string, string> = {
      hi: "गोल्डन नियम: पैसे प्राप्त करने के लिए आपको कभी भी UPI पिन दर्ज करने की आवश्यकता नहीं होती है। पिन केवल पैसे भेजने के लिए होता है।",
      bn: "গোল্ডেন রুল: টাকা রিসিভ বা গ্রহণ করার জন্য কখনও UPI PIN দিতে হয় না। পিন শুধুমাত্র টাকা পাঠানোর জন্যই ব্যবহার হয়।",
      en: "GOLDEN RULE: You NEVER enter your UPI PIN to receive money. PIN is ONLY used to send money out.",
    };

    const chosenLang = language === "bn" ? "bn" : language === "en" ? "en" : "hi";
    const spokenWarning = allSpokenWarnings[chosenLang];
    const goldenRule = goldenRules[chosenLang];

    const verdict = {
      type: "upi_scam_scan",
      rawInput: raw,
      payeeVpa,
      payeeName,
      amount,
      isCollectRequest,
      scamScore,
      isDangerous,
      suspiciousIndicators,
      spokenWarning,
      allSpokenWarnings,
      goldenRule,
      goldenRules,
      timestamp: new Date().toISOString(),
    };

    // Store in MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("threat_scans").insertOne({
        ...verdict,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("MongoDB write skipped in dev fallback:", dbErr);
    }

    return NextResponse.json(verdict);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to analyze UPI payload" },
      { status: 500 }
    );
  }
}
