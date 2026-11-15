# 📝 Official Hackathon Submission Text (Devpost / Devfolio Copy-Paste)
> Prepared by **MD Amit Hasan Robi** (Pitch & Product Lead, Team VenoX)

Copy and paste these sections into your hackathon submission form:

---

### Project Title
**OmniShield AI — Universal Cyber Safety for Citizens, Shops & Factories**

### Tagline
Autonomous cyber safety intelligence with 4-second regional voice alerts and 1-click police forensic dossiers.

---

### Inspiration
Every day, senior citizens and rural families in South Asia are losing their life savings to 3-second AI-cloned distress calls ("Papa, accident ho gaya hai") and deceptive UPI "Collect Request" reverse-debit traps disguised as cashback. Meanwhile, retail shopkeepers and chaiwalas suffer from physical QR code tampering and fake payment spoof apps without time to read complex English manuals. We wanted to build a zero-expert, universal cyber safety shield that speaks out loud in regional languages (Bengali, Hindi, English) in under 4 seconds.

---

### What it does
OmniShield AI protects three vulnerable frontline frontiers:
1. **Citizen Scam Shield**: Intercepts AI-cloned distress calls with acoustic vocoder variance analysis, catches deceptive UPI reverse-debit traps, and issues audible alerts.
2. **Shop Counter Armor**: Features the **OmniSound™ Smart Merchant Audio Box** (Paytm/bKash replica announcing fake payments loudly), a live device camera QR tampering scanner, and 1-click WhatsApp staff emergency alerts.
3. **Factory & Code Guard**: Scans AI-generated source code for exposed credentials and SQLi, alongside factory IoT telemetry anomaly monitoring with an automated kill-switch.
4. **Official Forensic Dossier**: 1-click cryptographically signed incident PDF ready for instant submission to the National Cybercrime Helpline 1930 and cybercrime.gov.in.
5. **Progressive Web App (PWA)**: Works offline and installs on any device without app store barriers.

---

### How we built it
- **Framework & Client**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Audio Synthesizer & Speech**: Web Audio API oscillator synthesis (dual-tone ringtone, police sirens, soundbox chimes), Web Speech API, and high-definition serverless audio streams (`/api/tts`).
- **Vision & Scanning**: `html5-qrcode` camera integration for live physical standee integrity verification.
- **Forensic PDF Generator**: `jsPDF` generating standardized NCRP 1930 incident dossiers.
- **Database & Auth**: MongoDB Atlas connection pooling with BetterAuth authentication.

---

### Challenges we ran into
Achieving sub-4-second end-to-end voice scam detection without enterprise cloud latency required engineering client-side acoustic pitch analysis alongside serverless streaming. Ensuring Progressive Web App (PWA) service-worker caching operated cleanly on dev and production without stylesheet stale collisions also required custom cache invalidation pipelines.

---

### Accomplishments that we're proud of
- Intercepting voice scams and triggering a regional spoken alert in under 4 seconds.
- Building the tactile OmniSound Virtual Soundbox replicating ubiquitous merchant IoT speakers.
- Complete 1-click 1930 police incident dossier generation.
- 100% responsive, zero-jargon frontline design with instant mobile handoff QR for hackathon judges.

---

### What's next for OmniShield AI
- Integrating automated WhatsApp Business API / Twilio webhooks for automated neighborhood fraud broadcasts.
- Partnering with local police cyber cells for direct digital dossier intake.
