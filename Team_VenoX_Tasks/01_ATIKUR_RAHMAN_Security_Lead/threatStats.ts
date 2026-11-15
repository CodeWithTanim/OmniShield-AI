// OmniShield AI — Regional Threat Intelligence & National Cybercrime Telemetry Data
// Curated by Team VenoX Cybersecurity & Forensic Research Desk (Lead: Atikur Rahman)

export interface CybercrimeMetric {
  category: string;
  annualLossInrCrores: number;
  yoyGrowthPercentage: number;
  primaryTargetDemographic: string;
  goldenHourWindowMinutes: number;
  ipcBnsSections: string[];
}

export const NATIONAL_CYBERCRIME_STATS: Record<string, CybercrimeMetric> = {
  DIGITAL_ARREST: {
    category: "CBI & Law Enforcement Impersonation Extortion",
    annualLossInrCrores: 1750,
    yoyGrowthPercentage: 240,
    primaryTargetDemographic: "Senior citizens, retired professionals & housewives",
    goldenHourWindowMinutes: 120,
    ipcBnsSections: ["BNS 318(4) - Cheating", "BNS 319(2) - Impersonation", "IT Act 66D"],
  },
  AI_VOICE_CLONE: {
    category: "Generative Neural Vocoder Distress Kidnapping / Hospital Scam",
    annualLossInrCrores: 680,
    yoyGrowthPercentage: 310,
    primaryTargetDemographic: "Parents of college students and expatriate families",
    goldenHourWindowMinutes: 60,
    ipcBnsSections: ["BNS 308(2) - Extortion", "BNS 336(3) - Forgery", "IT Act 66C"],
  },
  UPI_REVERSE_DEBIT: {
    category: "Deceptive 'Collect Request' Reverse-Debit Traps",
    annualLossInrCrores: 2400,
    yoyGrowthPercentage: 85,
    primaryTargetDemographic: "First-time digital payment users, rural shopkeepers & OLX sellers",
    goldenHourWindowMinutes: 30,
    ipcBnsSections: ["BNS 318(2) - Fraudulent Inducement", "IT Act 43 & 66"],
  },
  COUNTER_QR_TAMPERING: {
    category: "Physical Merchant Standee Sticker Swap & Soundbox Spoofing",
    annualLossInrCrores: 420,
    yoyGrowthPercentage: 115,
    primaryTargetDemographic: "High-volume retail cashiers, street vendors & chaiwalas",
    goldenHourWindowMinutes: 45,
    ipcBnsSections: ["BNS 318 - Cheating", "BNS 338 - Counterfeiting Device"],
  },
};

export const HELPLINE_1930_DISPATCH_RULES = [
  "Victims must dial 1930 within the 2-hour Golden Hour to freeze banking nodal switch accounts.",
  "OmniShield AI Cryptographic Incident PDF serves as primary pre-verified evidence for cybercrime.gov.in.",
  "Never reveal Aadhaar, OTP, or UPI PIN under any telephonic 'clearing account' instruction.",
];
