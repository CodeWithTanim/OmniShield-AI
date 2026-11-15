export interface ThreatRadarItem {
  id: string;
  title: string;
  category: "CITIZEN_SCAM" | "MERCHANT_FRAUD" | "INDUSTRIAL_SABOTAGE";
  severity: "CRITICAL" | "HIGH" | "ELEVATED";
  region: string;
  targetDemographic: string;
  attackVector: string;
  countermeasure: string;
  timestamp: string;
  activeCount: number;
}

export const LIVE_THREAT_RADAR_DATA: ThreatRadarItem[] = [
  {
    id: "RADAR-2026-001",
    title: "Electricity Power Disconnection SMS delivering Trojan APK",
    category: "CITIZEN_SCAM",
    severity: "CRITICAL",
    region: "West Bengal & Kolkata Metro",
    targetDemographic: "Domestic Electricity Consumers (WBSEDCL / CESC)",
    attackVector: "SMS warns power cut at 9:30 PM with malicious APK link (wbsedcl-bill.top)",
    countermeasure: "WBSEDCL never sends APK downloads. Pay exclusively via official wbsedcl.in portal.",
    timestamp: "12 mins ago",
    activeCount: 1420,
  },
  {
    id: "RADAR-2026-002",
    title: "CBI 'Digital Arrest' Video Call Extortion Racket",
    category: "CITIZEN_SCAM",
    severity: "CRITICAL",
    region: "National Capital Region (NCR) & Dhaka",
    targetDemographic: "Senior Citizens & Working Professionals",
    attackVector: "Impersonates CBI Cyber Cell over Skype claiming MDMA contraband seized in courier parcel",
    countermeasure: "Digital Arrest does not legally exist in CrPC / BNSS. Disconnect call and dial 1930 immediately.",
    timestamp: "24 mins ago",
    activeCount: 980,
  },
  {
    id: "RADAR-2026-003",
    title: "Retail Counter QR Sticker Overlay / Swap Tampering",
    category: "MERCHANT_FRAUD",
    severity: "HIGH",
    region: "Retail Markets (Kolkata, Mumbai, Bengaluru)",
    targetDemographic: "Street Vendors & Small Retail Grocery Merchants",
    attackVector: "Perpetrators stick look-alike QR stickers over genuine merchant soundbox QR codes",
    countermeasure: "Scan QR with OmniShield SoundBox verifier before opening shop every morning.",
    timestamp: "45 mins ago",
    activeCount: 615,
  },
  {
    id: "RADAR-2026-004",
    title: "Fake Bank SMS & WhatsApp Payment Confirmation Template",
    category: "MERCHANT_FRAUD",
    severity: "HIGH",
    region: "Pan-India Tier 1 & 2 Cities",
    targetDemographic: "Apparel, Electronics & Restaurant Cashiers",
    attackVector: "Fraudulent WhatsApp forward mimicking HDFC / SBI credit alerts to walk out with goods",
    countermeasure: "Never release goods without hearing OmniSoundBox audible spoken confirmation.",
    timestamp: "1 hr ago",
    activeCount: 840,
  },
  {
    id: "RADAR-2026-005",
    title: "Modbus/BACnet IoT Telemetry Temperature Spikes on Industrial HVAC",
    category: "INDUSTRIAL_SABOTAGE",
    severity: "CRITICAL",
    region: "Industrial Corridors (Faridabad, Pune, Chittagong)",
    targetDemographic: "Manufacturing Plants & Pharmaceutical Cold Storage",
    attackVector: "Remote buffer overflow targeting unpatched Modbus PLC gateway to spoof coil telemetry",
    countermeasure: "Deploy OmniShield Zero-Trust Air-Gap kill-switch to isolate PLC registers.",
    timestamp: "2 hrs ago",
    activeCount: 190,
  },
  {
    id: "RADAR-2026-006",
    title: "PaaS Spoofed Phishing Kit targeting Sicredi & Allegro Users",
    category: "CITIZEN_SCAM",
    severity: "CRITICAL",
    region: "Global & Regional Internet Gateways",
    targetDemographic: "E-Commerce Shoppers & Online Banking Users",
    attackVector: "Combosquatted domains on .rest and .cfd mimicking Allegro Lokalnie and Sicredi banking portals",
    countermeasure: "Scan URL with OmniShield Deep Phishing Neural Matrix before entering passwords.",
    timestamp: "3 hrs ago",
    activeCount: 3200,
  },
];
