import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

// Forensic database of fake legal pretexts used in Digital Arrest & Extortion scams
const FAKE_LEGAL_PRETEXTS = [
  {
    pattern: /digital\s*arrest/i,
    severity: "CRITICAL",
    name: "Non-Existent Legal Construct ('Digital Arrest')",
    explanation:
      "The concept of 'Digital Arrest' does NOT exist under the Code of Criminal Procedure (CrPC), Bharatiya Nagarik Suraksha Sanhita (BNSS), or any Indian/International law. Law enforcement never arrests citizens over Skype, WhatsApp, or video calls.",
  },
  {
    pattern: /(narcotics|mdma|drugs|contraband|customs\s*seizure).*(taiwan|cambodia|thailand|myanmar|parcel)/i,
    severity: "HIGH",
    name: "Courier / Customs Contraband Framing Pretext",
    explanation:
      "Fabricated FedEx/DHL courier parcel claim alleging illegal drugs sent in victim's name, used to induce terror and compliance.",
  },
  {
    pattern: /(rbi|reserve\s*bank).*(verification\s*account|secret\s*account|escrow|clearance\s*fund)/i,
    severity: "CRITICAL",
    name: "Fraudulent RBI 'Verification/Clearance Account' Demand",
    explanation:
      "The Reserve Bank of India does NOT maintain personal verification accounts. Demands to transfer money for 'asset verification' or 'bail clearance' are 100% fraudulent.",
  },
  {
    pattern: /(cbi|central\s*bureau\s*of\s*investigation|enforcement\s*directorate|ed|interpol|crime\s*branch|mumbai\s*police).*(video\s*call|skype|stay\s*on\s*camera|do\s*not\s*disconnect)/i,
    severity: "CRITICAL",
    name: "Camera Coercion & Digital Confinement",
    explanation:
      "Perpetrators force victims to stay on uninterrupted video call to isolate them from family, friends, or bank officials while executing extortion.",
  },
  {
    pattern: /(supreme\s*court|high\s*court|non-bailable\s*warrant|arrest\s*order).*(whatsapp|telegram|signal|email)/i,
    severity: "HIGH",
    name: "Unofficial Transmission of Judicial Warrants",
    explanation:
      "Courts and law enforcement agencies NEVER issue or execute non-bailable arrest warrants via WhatsApp or messaging applications.",
  },
  {
    pattern: /(settle|penalty|fine|bail|clearance\s*deposit).*(upi|rtgs|neft|crypto|usdt|gift\s*card)/i,
    severity: "CRITICAL",
    name: "Coerced Electronic / Crypto Asset Transfer Demand",
    explanation:
      "Official government fines and bail amounts are strictly deposited through court treasuries or recognized challan gateways—NEVER via individual UPI VPAs, RTGS to private accounts, or cryptocurrency.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documentText = "",
      fileName = "warrant_document.pdf",
      fileType = "text/plain",
      language = "bn",
    } = body;

    const cleanText = (documentText || "").trim();
    if (!cleanText) {
      return NextResponse.json(
        { error: "Please provide document text or upload a notice for forensic analysis." },
        { status: 400 }
      );
    }

    const forensicFindings: Array<{
      name: string;
      severity: string;
      explanation: string;
    }> = [];

    let riskScore = 15; // baseline

    // 1. Scan against Fake Legal Pretexts Matrix
    for (const item of FAKE_LEGAL_PRETEXTS) {
      if (item.pattern.test(cleanText)) {
        if (item.severity === "CRITICAL") riskScore += 35;
        else if (item.severity === "HIGH") riskScore += 20;

        forensicFindings.push({
          name: item.name,
          severity: item.severity,
          explanation: item.explanation,
        });
      }
    }

    // 2. High-pressure Time Limit Clues (Urgency Lure)
    if (/(within\s*\d+\s*(hours|minutes|hrs)|immediately|urgent|arrest\s*within)/i.test(cleanText)) {
      riskScore += 15;
      forensicFindings.push({
        name: "Artificial Time Duress / Urgency Coercion",
        severity: "HIGH",
        explanation: "Threatens immediate arrest within arbitrary deadlines to prevent victim from consulting a lawyer.",
      });
    }

    // 3. Fake Official Titles & Emblems
    if (/(national\s*cyber\s*crime\s*police|director\s*general\s*of\s*interpol|cyber\s*intelligence\s*task\s*force|anti-money\s*laundering\s*court)/i.test(cleanText)) {
      riskScore += 20;
      forensicFindings.push({
        name: "Fabricated Institutional Entity Title",
        severity: "HIGH",
        explanation: "Uses sensationalized, fictitious police nomenclature designed to intimidate lay citizens.",
      });
    }

    // Cap score at 99
    riskScore = Math.min(99, Math.max(10, riskScore));
    const isFake = riskScore >= 50;

    const verdict = isFake
      ? "FRAUDULENT_EXTORTION_DOCUMENT"
      : riskScore >= 35
      ? "SUSPICIOUS_UNVERIFIED_NOTICE"
      : "OFFICIALLY_FORMATTED_NOTICE";

    const spokenWarnings: Record<string, string> = {
      bn: isFake
        ? "সাবধান! এটি একটি ১০০% ভুয়া ডিজিটাল অ্যারেস্ট বা প্রতারণার নোটিশ! ভারতীয় বা আন্তর্জাতিক আইনে ডিজিটাল অ্যারেস্ট বলে কিছু নেই। কোনো পুলিশ ফোনে টাকা চায় না। কাউকে এক টাকাও পাঠাবেন না!"
        : "নোটিশটি আপাতদৃষ্টিতে নিয়ন্ত্রিত মনে হচ্ছে, তবুও কোনো অজ্ঞাত অ্যাকাউন্টে টাকা পাঠাবেন না।",
      hi: isFake
        ? "सावधान! यह 100% फर्जी डिजिटल अरेस्ट नोटिस है! भारतीय कानून में डिजिटल अरेस्ट का कोई प्रावधान नहीं है। किसी को पैसे न भेजें!"
        : "दस्तावेज़ सामान्य प्रतीत होता है, फिर भी किसी अज्ञात खाते में पैसे न भेजें।",
      en: isFake
        ? "Danger! 100% Fraudulent Digital Arrest Notice detected! Law enforcement agencies never arrest via video calls or demand funds over WhatsApp. Do NOT pay."
        : "Document structure appears standard, but never transfer funds on unverified claims.",
    };

    const chosenLang = language === "bn" ? "bn" : language === "hi" ? "hi" : "en";
    const spokenWarning = spokenWarnings[chosenLang];

    const result = {
      type: "document_forensic_scan",
      fileName,
      riskScore,
      verdict,
      isFake,
      forensicFindings:
        forensicFindings.length > 0
          ? forensicFindings
          : [
              {
                name: "Standard Judicial / Institutional Wording",
                severity: "LOW",
                explanation: "No overt coercion, fake legal pretexts, or extortion account demands detected.",
              },
            ],
      spokenWarning,
      allSpokenWarnings: spokenWarnings,
      legalDisclaimer:
        "According to official advisories by the Ministry of Home Affairs (MHA) & National Cybercrime Portal, there is NO provision of 'Digital Arrest' under Indian Law. Police do not conduct investigations or arrests via Skype/WhatsApp video calls.",
      timestamp: new Date().toISOString(),
      recommendations: isFake
        ? [
            "Do NOT send any money, UPI transfers, or crypto deposits under any circumstance.",
            "Immediately terminate any ongoing Skype / WhatsApp video or audio call.",
            "Block the sender's phone number.",
            "Lodge an immediate complaint on National Cybercrime Helpline 1930 / cybercrime.gov.in.",
          ]
        : [
            "Verify any official summons directly with your local police station or through official court registers (ecourts.gov.in).",
          ],
    };

    // Save to Database
    try {
      const { db } = await connectToDatabase();
      if (db) {
        await db.collection("document_threat_scans").insertOne({
          ...result,
          scannedAt: new Date(),
        });
      }
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Document Forensic API error:", err);
    return NextResponse.json(
      { error: "Failed to perform document forensic analysis." },
      { status: 500 }
    );
  }
}
