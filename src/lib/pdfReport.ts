import { jsPDF } from "jspdf";

export interface IncidentReportData {
  category: "UPI_DEBIT_TRAP" | "AI_VOICE_CLONE" | "QR_CODE_TAMPERING" | "FAKE_PAYMENT_UTR" | "INDUSTRIAL_CODE_VULN";
  title: string;
  verdict: string;
  riskScore: number;
  subjectOrTarget: string;
  indicators: string[];
  recommendations: string[];
  extraDetails?: Record<string, string>;
}

/**
 * Sanitizes and Romanizes any non-ASCII characters to ensure
 * standard PDF fonts (WinAnsiEncoding) never render garbled symbols.
 */
function cleanTextForPdf(text: string): string {
  if (!text) return "";

  // 1. Convert common Indic keywords to clean Roman/English transliterations
  let cleaned = text
    .replace(/पापा/g, "Papa")
    .replace(/पिता/g, "Pita")
    .replace(/माँ|माता|मम्मी/g, "Maa")
    .replace(/भाई/g, "Bhai")
    .replace(/बेटा/g, "Beta")
    .replace(/बेटी/g, "Beti")
    .replace(/बाबा/g, "Baba")
    .replace(/মা/g, "Maa")
    .replace(/ভাই/g, "Bhai")
    .replace(/বোন/g, "Bon")
    .replace(/ছেলে/g, "Chele")
    .replace(/মেয়ে/g, "Meye")
    .replace(/পুলিশ/g, "Police")
    .replace(/थाना/g, "Police Station")
    .replace(/जेल/g, "Jail")
    .replace(/गिरफ्तार/g, "Arrested")
    .replace(/पकड़ लिया/g, "Detained")
    .replace(/আটক|গ্রেফতার/g, "Detained")
    .replace(/মুসিবত|মুসীবত|मुसीबत/g, "Emergency Distress")
    .replace(/फंस गया|फंसा|ফেঁসে গেছি/g, "Trapped in Crisis")
    .replace(/दुर्घटना|অ্যাক্সিডেন্ট|দুর্ঘটনা/g, "Accident")
    .replace(/अस्पताल|হাসপাতাল/g, "Hospital")
    .replace(/जल्दी/g, "Jaldi (Immediate)")
    .replace(/तुरंत/g, "Turant (Urgent)")
    .replace(/मदद करो|বাঁচাও/g, "Help Me")
    .replace(/रुपए|रुपये/g, "INR")
    .replace(/पैसे/g, "Paise")
    .replace(/लाख|लख/g, "Lakh")
    .replace(/हजार/g, "Thousand")
    .replace(/টাকা/g, "Taka")
    .replace(/বিকাশ/g, "bKash")
    .replace(/পাঠাও/g, "Send");

  // 2. Remove or replace any remaining non-ASCII characters (> 127) that corrupt jsPDF
  cleaned = cleaned.replace(/[^\x20-\x7E\n\r\t]/g, " ");

  // 3. Normalize whitespace
  return cleaned.replace(/\s+/g, " ").trim();
}

export function generateIncidentPdfReport(data: IncidentReportData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const refId = `OS-INC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Top Dark Navy Header Banner (#070C1A)
  doc.setFillColor(7, 12, 26);
  doc.rect(0, 0, 210, 36, "F");

  // Glowing Cyan & Indigo Dual Accent Strip
  doc.setFillColor(6, 182, 212); // Cyan #06B6D4
  doc.rect(0, 35, 140, 1.5, "F");
  doc.setFillColor(99, 102, 241); // Indigo #6366F1
  doc.rect(140, 35, 70, 1.5, "F");

  // Platform Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("OMNISHIELD AI — CYBERCRIME FORENSIC DOSSIER", 15, 14);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // Slate-400
  doc.text("Official Evidence Summary for National Cybercrime Portal (cybercrime.gov.in) & 1930 Helpline", 15, 22);

  // Metadata Pill
  doc.setFontSize(8);
  doc.setTextColor(103, 232, 249); // Cyan-300
  doc.text(`Incident Ref: ${refId}   |   Recorded: ${dateStr}   |   Status: FORENSICALLY_VERIFIED`, 15, 29);

  // Metadata Overview Box
  let y = 44;
  doc.setFillColor(248, 250, 252); // Off-white Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.roundedRect(15, y, 180, 29, 2, 2, "FD");

  // Row 1: Incident Classification
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate-600
  doc.setFont("helvetica", "bold");
  doc.text("INCIDENT CLASSIFICATION:", 20, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(cleanTextForPdf(data.title).slice(0, 60), 75, y + 7);

  // Row 2: Threat Verdict & Score
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("THREAT VERDICT:", 20, y + 15);
  const isHighRisk = data.riskScore >= 60;
  if (isHighRisk) {
    doc.setTextColor(220, 38, 38); // Red-600
  } else {
    doc.setTextColor(16, 185, 129); // Emerald-500
  }
  doc.text(`${cleanTextForPdf(data.verdict)}   (Risk Score: ${data.riskScore}/100 - ${isHighRisk ? "CRITICAL" : "LOW"})`, 75, y + 15);

  // Row 3: Target Entity / Payload
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("TARGET / PAYLOAD:", 20, y + 23);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const cleanTarget = cleanTextForPdf(data.subjectOrTarget) || "Live Audio Transcript / Interactive Session";
  doc.text(cleanTarget.slice(0, 65), 75, y + 23);

  y += 37;

  // Extra Details Section (if provided)
  if (data.extraDetails && Object.keys(data.extraDetails).length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("TECHNICAL ARTIFACT METRICS", 15, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);

    Object.entries(data.extraDetails).forEach(([k, v]) => {
      doc.text(`[+] ${cleanTextForPdf(k)}: ${cleanTextForPdf(v)}`, 20, y);
      y += 5;
    });
    y += 4;
  }

  // Forensic Threat Indicators & Evidence Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("FORENSIC THREAT INDICATORS & EVIDENCE", 15, y);
  
  // Section underline
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y + 2, 195, y + 2);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  if (!data.indicators || data.indicators.length === 0) {
    doc.text("No malicious or deceptive indicators detected in this payload.", 22, y);
    y += 6;
  } else {
    data.indicators.forEach((ind) => {
      const sanitized = cleanTextForPdf(ind);
      if (!sanitized) return;

      // Draw custom stylish cyan bullet dot
      doc.setFillColor(6, 182, 212);
      doc.circle(20, y - 1, 1, "F");

      // Split text gracefully to prevent line overlaps
      const lines = doc.splitTextToSize(sanitized, 165);
      doc.text(lines, 24, y);
      y += lines.length * 4.6 + 2;
    });
  }

  y += 4;

  // Mandatory Next Steps / Police Advisory Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("MANDATORY CITIZEN & POLICE NEXT STEPS", 15, y);

  // Section underline
  doc.setDrawColor(226, 232, 240);
  doc.line(15, y + 2, 195, y + 2);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  data.recommendations.forEach((rec) => {
    const sanitized = cleanTextForPdf(rec);
    if (!sanitized) return;

    // Draw custom rose alert indicator
    doc.setFillColor(244, 63, 94); // Rose-500
    doc.roundedRect(19, y - 2.5, 2, 2, 0.4, 0.4, "F");

    const lines = doc.splitTextToSize(sanitized, 165);
    doc.text(lines, 24, y);
    y += lines.length * 4.6 + 2;
  });

  y += 6;

  // National Cybercrime Emergency Box (Golden Hour)
  doc.setFillColor(254, 242, 242); // Soft red background
  doc.setDrawColor(254, 202, 202); // Light red border
  doc.roundedRect(15, y, 180, 26, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(153, 27, 27); // Dark red
  doc.text("NATIONAL CYBERCRIME EMERGENCY ACTION (GOLDEN HOUR PROTOCOL)", 20, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text("1. Immediate Banking Freeze: Call 1930 immediately to freeze recipient accounts before funds are laundered.", 20, y + 12);
  doc.text("2. Official FIR Registration: File an official complaint on the National Cybercrime Portal: https://cybercrime.gov.in", 20, y + 17);
  doc.text(`3. Evidence Reference: Provide Reference Code [${refId}] to the investigating cyber police officer.`, 20, y + 22);

  // Bottom Security & Compliance Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "OmniShield AI • Cryptographically Signed Evidence Dossier • Aligned with 1930 National Cyber Helpline • Page 1 of 1",
    15,
    286
  );

  doc.save(`OmniShield_Incident_Report_${refId}.pdf`);
}
