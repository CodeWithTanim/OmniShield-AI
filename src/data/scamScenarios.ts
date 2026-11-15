// OmniShield AI — Pre-loaded Frontline Scam Scenario Dataset
// Curated by Team VenoX Product & Strategy Desk (Lead: MD Amit Hasan Robi)

export interface VoiceScamScenario {
  id: string;
  category: "DIGITAL_ARREST" | "VOICE_CLONE_EMERGENCY" | "UTILITY_PHISHING" | "NORMAL_CALL";
  title: string;
  sourceCaller: string;
  transcript: string;
  urgencyLevel: "CRITICAL" | "HIGH" | "LOW";
  coercionTriggers: string[];
}

export interface UpiScamScenario {
  id: string;
  title: string;
  payload: string;
  intentVerdict: "REVERSE_DEBIT_TRAP" | "LEGITIMATE_MERCHANT";
  expectedLossInr: number;
}

export const FRONTLINE_VOICE_SCENARIOS: VoiceScamScenario[] = [
  {
    id: "scam-cbi-arrest",
    category: "DIGITAL_ARREST",
    title: "CBI Cyber Cell Digital Arrest Warrant",
    sourceCaller: "Inspector Vikram Sharma — Central Crime Wing",
    transcript:
      "This is Inspector Sharma from Central Crime Branch. A consignment containing illegal narcotics has been seized with your Aadhaar credentials. Supreme Court has issued an online Digital Arrest warrant. Transfer ₹75,000 verification clearance fee immediately or a task force will raid your home within 30 minutes.",
    urgencyLevel: "CRITICAL",
    coercionTriggers: ["Digital Arrest", "Supreme Court", "Aadhaar", "Narcotics", "Immediate Transfer"],
  },
  {
    id: "scam-kidnap-hospital",
    category: "VOICE_CLONE_EMERGENCY",
    title: "AI Voice Clone Son Accident & Police Bail",
    sourceCaller: "Arjun (Son) — Unknown Device",
    transcript:
      "Papa, main bohot badi musibat mein phas gaya hoon. Meri car ka accident ho gaya hai aur police mujhe custody mein le rahi hai. Doctor operation ke liye turant ₹50,000 advance maang raha hai, please kisi ko bataye bina jaldi transfer karo!",
    urgencyLevel: "CRITICAL",
    coercionTriggers: ["Accident", "Custody", "Hospital", "₹50,000", "Don't tell anyone"],
  },
  {
    id: "scam-power-cut",
    category: "UTILITY_PHISHING",
    title: "Urgent Electricity Power Cut Disconnect Notice",
    sourceCaller: "State Electricity Board Officer",
    transcript:
      "Dear Consumer, your power supply will be disconnected tonight at 9:30 PM due to an unpaid previous month invoice. Update bill immediately by downloading our officer verification APK file.",
    urgencyLevel: "HIGH",
    coercionTriggers: ["Disconnected Tonight", "Unpaid Bill", "Download APK"],
  },
  {
    id: "legit-family-call",
    category: "NORMAL_CALL",
    title: "Legitimate Family Grocery Call",
    sourceCaller: "Home Landline",
    transcript:
      "Hey, are you free this evening? Mom asked to bring some fresh milk and vegetables while coming back from office. Let me know when you reach home.",
    urgencyLevel: "LOW",
    coercionTriggers: [],
  },
];

export const FRONTLINE_UPI_SCENARIOS: UpiScamScenario[] = [
  {
    id: "upi-olx-advance",
    title: "Fake OLX Advance (Collect Request Trap)",
    payload:
      "upi://pay?pa=refund-agent99@okhdfcbank&pn=OLX%20Cashback%20Agent&am=15000&cu=INR&tn=Cashback%20Approval%20Enter%20PIN",
    intentVerdict: "REVERSE_DEBIT_TRAP",
    expectedLossInr: 15000,
  },
  {
    id: "upi-subsidy-sms",
    title: "Government Subsidy Claim SMS Trap",
    payload:
      "upi://pay?pa=subsidy.portal-claim@ybl&pn=Govt%20Subsidy%20Disbursal&am=8500&cu=INR&tn=Enter%20PIN%20To%20Receive%20Amount",
    intentVerdict: "REVERSE_DEBIT_TRAP",
    expectedLossInr: 8500,
  },
  {
    id: "upi-genuine-mart",
    title: "Legitimate Supermarket Invoice",
    payload:
      "upi://pay?pa=supermart.billing@icici&pn=City%20Supermarket&am=640&cu=INR&tn=Invoice%204921",
    intentVerdict: "LEGITIMATE_MERCHANT",
    expectedLossInr: 0,
  },
];
