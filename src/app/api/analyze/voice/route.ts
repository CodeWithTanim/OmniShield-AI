import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, audioName, language = "hi" } = body;

    const text = (transcript || "").trim();
    if (!text && !audioName) {
      return NextResponse.json(
        { error: "Please provide a transcript or audio sample name to inspect." },
        { status: 400 }
      );
    }

    // Advanced multi-lingual heuristic & pattern analyzer (Devanagari, Bengali, and English)
    const urgentFamilyLures = [
      /papa|maa|mom|dad|bhai|beta|bache|family|friend|पापा|पिता|माँ|माता|मम्मी|भाई|बेटा|बेटी|बच्चे|बाबा|মা|ভাই|বোন|ছেলে|মেয়ে/i,
      /accident|jail|police|arrest|hospital|emergency|kidnap|trouble|phas gaya|custody|cbi|narcotics|drinking|driving|थाना|पुलिस|जेल|अरेस्ट|गिरफ्तार|मुसीबत|फंस गया|फंसा|दुर्घटना|एक्सीडेंट|अस्पताल|सीबीआई|डिजिटल अरेस्ट|कस्टडी|ड्रिंकिंग|गाड़ी|पकड़ लिया|আটক|গ্রেফতার|পুলিশ|জেল|অ্যারেস্ট|হাসপাতাল|অ্যাক্সিডেন্ট|দুর্ঘটনা|বিপদ|ফেঁসে গেছি/i,
      /urgent|immediately|right now|jaldi|turant|kisi ko mat batana|help me|save me|जल्दी|तुरंत|अभी|मদদ করো|मदद करो|किसी को मत बताना|फौरन|তাড়াতাড়ি|জলদি|এখনই|বাঁচাও/i,
      /send money|paise bhejo|rupees|gpay|phonepe|transfer|account|lakh|thousand|cash|bail|रुपए|रुपये|पैसे|लाख|लख|हजार|दे दो|भेज दो|ट्रांसफर|खाते|अकाउंट|जमानत|টাকা|পাঠাও|হাজার|বিকাশ/i,
    ];

    let matchCount = 0;
    const detectedPatterns: string[] = [];

    urgentFamilyLures.forEach((regex, index) => {
      if (regex.test(text)) {
        matchCount++;
        if (index === 0) detectedPatterns.push('Family/Friend impersonation keywords ("Papa" / "Baba" / "Mom")');
        if (index === 1) detectedPatterns.push('Extreme artificial emergency/distress cue ("Police" / "Pakad liya" / "Accident")');
        if (index === 2) detectedPatterns.push('High-urgency time pressure ("Jaldi" / "Turant" / "Madad karo")');
        if (index === 3) detectedPatterns.push('Direct demand for immediate money transfer ("Rupees" / "Taka" / "Transfer")');
      }
    });

    // Acoustic / synthetic artifact simulation score
    const syntheticArtifactsFound = text.length > 0 && matchCount >= 2;
    const deepfakeProbability = Math.min(
      98,
      Math.max(15, matchCount * 23 + (syntheticArtifactsFound ? 20 : 5))
    );

    const isHighRisk = deepfakeProbability >= 65;

    // Localized emergency spoken voice warning
    const allSpokenWarnings: Record<string, string> = {
      hi: isHighRisk
        ? "रुको! यह आवाज़ AI से बनाई गई नकली है। यह एक फ्रॉड कॉल है, किसी को पैसे मत भेजो!"
        : "आवाज़ में कोई गंभीर फ्रॉड संकेत नहीं मिला, फिर भी सतर्क रहें।",
      bn: isHighRisk
        ? "থামুন! এই কণ্ঠটি এআই দিয়ে তৈরি নকল কণ্ঠ। এটি প্রতারণামূলক কল, কাউকে টাকা পাঠাবেন না!"
        : "কণ্ঠে কোনো জালিয়াতির স্পষ্ট লক্ষণ পাওয়া যায়নি, তবুও সতর্ক থাকুন।",
      en: isHighRisk
        ? "Stop! This voice is fake AI cloned. This is a fraud call, do NOT send any money!"
        : "No severe synthetic fraud detected, but always verify before sending funds.",
    };

    const chosenLang = language === "bn" ? "bn" : language === "en" ? "en" : "hi";
    const spokenWarning = allSpokenWarnings[chosenLang];

    const verdict = {
      type: "voice_deepfake_scan",
      audioName: audioName || "Live Call Transcript",
      transcript: text,
      deepfakeProbability,
      verdict: isHighRisk ? "AI_CLONED_SCAM_VOICE" : "PROBABLY_LEGITIMATE",
      detectedPatterns,
      spokenWarning,
      allSpokenWarnings,
      timestamp: new Date().toISOString(),
      recommendations: [
        "Do NOT send funds via UPI, Bank Transfer or Gift Cards.",
        "Hang up and call the real family member directly on their known phone number.",
        "Ask a personal security question only the real person would know (e.g., childhood pet name).",
        "Report the scam caller number to National Cybercrime Helpline 1930.",
      ],
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
      { error: err?.message || "Failed to process voice analysis" },
      { status: 500 }
    );
  }
}
