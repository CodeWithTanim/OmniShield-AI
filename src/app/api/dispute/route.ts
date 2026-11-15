import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      victimName = "Citizen",
      victimPhone = "",
      victimEmail = "",
      incidentType = "AI_VOICE_CLONE_EXTORTION", // or UPI_FRAUD, PHISHING, QR_TAMPERING, DIGITAL_ARREST
      scammerPhone = "",
      scammerUpiOrAccount = "",
      fraudAmount = "0",
      transactionRef = "",
      dateTime = new Date().toISOString(),
      bankName = "State Bank of India (SBI)",
      evidenceSummary = "",
      language = "bn",
    } = body;

    const formattedDate = new Date(dateTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const incidentRef = `OS-DISP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. National Cybercrime Portal Draft (cybercrime.gov.in / 1930)
    const policeComplaintDraft = `
COMPLAINT TO NATIONAL CYBERCRIME REPORTING PORTAL (cybercrime.gov.in) / HELPLINE 1930
Reference No: ${incidentRef}
Date & Time of Incident: ${formattedDate}

1. COMPLAINANT DETAILS:
   - Full Name: ${victimName}
   - Contact Number: ${victimPhone || "Provided in portal registration"}
   - Email: ${victimEmail || "Provided in portal registration"}

2. INCIDENT CLASSIFICATION:
   - Nature of Fraud: ${incidentType.replace(/_/g, " ")}
   - Relevant Legal Sections: Section 66D, Information Technology Act, 2000 (Cheating by personation using computer resource) read with IPC Section 420 / Bharatiya Nyaya Sanhita (BNS) Section 318(4).

3. SUSPECT / SCAMMER PARTICULARS:
   - Suspect Caller Phone / WhatsApp: ${scammerPhone || "Not provided / Spoofed number"}
   - Fraudulent Beneficiary UPI / Account: ${scammerUpiOrAccount || "Direct Extortion / Impersonation"}
   - Fraud Amount Involved: INR ${fraudAmount}
   - Transaction Reference / UTR Number: ${transactionRef || "Attempted / Under Golden Hour Freeze"}

4. FORENSIC EVIDENCE & CHRONOLOGY:
${evidenceSummary || "The suspect impersonated law enforcement / family member using synthetic AI speech and demanded immediate transfer under emergency duress."}

5. RELIEF SOUGHT:
   - Immediate freeze of the suspect beneficiary bank account / UPI VPA under the Golden Hour protocol.
   - Registration of formal Cyber Crime First Information Report (FIR).
   - Reverse transaction request initiated with beneficiary bank.

Complainant Signature / Timestamp: ${victimName} (OmniShield AI Automated Telemetry Dossier)
`.trim();

    // 2. Bank Nodal Fraud Officer Immediate Freeze Notice (RBI Master Direction)
    const bankDisputeDraft = `
URGENT: GOLDEN HOUR FRAUD TRANSACTION DISPUTE & BENEFICIARY FREEZE REQUEST
To: Nodal Fraud & Grievance Redressal Officer, ${bankName}
Date: ${formattedDate}
Subject: Unauthorized / Coerced Electronic Transaction Dispute - UTR: ${transactionRef || "N/A"} - Immediate Freeze Requested under RBI Ombudsman Scheme

Dear Fraud Grievance Officer,

I am formally reporting an unauthorized / socially engineered fraudulent electronic transaction debited from my account.

TRANSACTION DETAILS:
- Complainant Name: ${victimName}
- Registered Phone: ${victimPhone || "As per bank records"}
- Disputed Amount: INR ${fraudAmount}
- Transaction Reference / UTR: ${transactionRef || "Under investigation"}
- Beneficiary Suspect UPI / Account: ${scammerUpiOrAccount}
- Date & Time: ${formattedDate}
- Forensic Case Reference: ${incidentRef}

In accordance with RBI Circular RBI/2017-18/15 (Limiting Liability of Customers in Unauthorized Electronic Banking Transactions) and Golden Hour cybercrime SOP:
1. I request you to immediately communicate with the beneficiary bank to FREEZE the recipient wallet / account holding the defrauded funds.
2. Please provide the Chargeback Reference Number and Acknowledgment Token.
3. This matter has been registered on the National Cybercrime Portal (cybercrime.gov.in) with Reference ${incidentRef}.

Kindly acknowledge receipt within 2 hours.

Sincerely,
${victimName}
`.trim();

    // 3. Spoken Audio Warning / Guidance
    const spokenAdvice = language === "bn"
      ? "অভিযোগ পত্র তৈরি হয়েছে। সোনালী সময় বা গোল্ডেন আওয়ার শেষ হওয়ার আগেই ১৯৩০ নম্বরে কল করুন এবং ব্যাংকে ডিসপিউট লেটারটি পাঠান।"
      : language === "hi"
      ? "शिकायत पत्र तैयार है। गोल्डन आवर समाप्त होने से पहले 1930 पर कॉल करें और बैंक को यह शिकायत पत्र भेजें।"
      : "Dispute dossier prepared. Call 1930 immediately within the Golden Hour and email your bank fraud nodal officer.";

    const result = {
      incidentRef,
      formattedDate,
      victimName,
      policeComplaintDraft,
      bankDisputeDraft,
      spokenAdvice,
      nationalHelpline: "1930",
      officialPortal: "https://cybercrime.gov.in",
      timestamp: new Date().toISOString(),
    };

    // Save to Database
    try {
      const { db } = await connectToDatabase();
      if (db) {
        await db.collection("dispute_records").insertOne({
          ...result,
          createdAt: new Date(),
        });
      }
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Dispute API error:", err);
    return NextResponse.json(
      { error: "Failed to generate Golden Hour dispute packet." },
      { status: 500 }
    );
  }
}
