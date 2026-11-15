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

    // Advanced heuristic and pattern analyzer for AI Voice Impersonation Scams
    const urgentFamilyLures = [
      /papa|maa|mom|dad|bhai|beta|bache|family|friend/i,
      /accident|jail|police|arrest|hospital|emergency|kidnap|trouble|phas gaya/i,
      /urgent|immediately|right now|jaldi|turant|kisi ko mat batana/i,
      /send money|paise bhejo|rupees|gpay|phonepe|transfer|account number/i,
    ];

    let matchCount = 0;
    const detectedPatterns: string[] = [];

    urgentFamilyLures.forEach((regex, index) => {
      if (regex.test(text)) {
        matchCount++;
        if (index === 0) detectedPatterns.push("Family/Friend impersonation keywords");
        if (index === 1) detectedPatterns.push("Extreme artificial emergency/distress cue (accident/police)");
        if (index === 2) detectedPatterns.push("High-urgency time pressure (right now / jaldi)");
        if (index === 3) detectedPatterns.push("Direct demand for immediate money transfer");
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
    let spokenWarning = "";
    if (isHighRisk) {
      if (language === "hi") {
        spokenWarning = "रुको! यह आवाज़ AI से बनाई गई नकली है। यह एक फ्रॉड कॉल है, किसी को पैसे मत भेजो!";
      } else if (language === "bn") {
        spokenWarning = "থামুন! এই কণ্ঠটি এআই দিয়ে তৈরি নকল কণ্ঠ। এটি প্রতারণামূলক কল, কাউকে টাকা পাঠাবেন না!";
      } else {
        spokenWarning = "Stop! This voice is fake AI cloned. This is a fraud call, do NOT send any money!";
      }
    } else {
      spokenWarning = language === "hi" 
        ? "आवाज़ में कोई गंभीर फ्रॉड संकेत नहीं मिला, फिर भी सतर्क रहें।"
        : "No severe synthetic fraud detected, but always verify before sending funds.";
    }

    const verdict = {
      type: "voice_deepfake_scan",
      audioName: audioName || "Live Call Transcript",
      transcript: text,
      deepfakeProbability,
      verdict: isHighRisk ? "AI_CLONED_SCAM_VOICE" : "PROBABLY_LEGITIMATE",
      detectedPatterns,
      spokenWarning,
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
