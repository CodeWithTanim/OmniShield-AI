# OmniShield AI 🛡️
### Universal Cyber Safety — Protecting People, Shops & Factories from Scams

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-1.1-purple)](https://better-auth.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Zero--Config-black?logo=vercel)](https://vercel.com/)

> **VibeX Codes Hackathon Submission**  
> **Track 3**: CYBER SAFETY — PROTECTING PEOPLE, SHOPS & FACTORIES FROM SCAMS  
> **Team**: **VenoX**

---

## 📌 Executive Summary & Problem Solved

Modern cybercrime in India is no longer limited to enterprise data centers:
1. **Citizens & Daily Wage Workers** are losing life savings to **AI-cloned voice calls** ("Papa, I am in police trouble/hospital, send ₹50,000 right now") and **trick UPI "Collect Money" debit traps** disguised as rewards.
2. **Small Shopkeepers & Chaiwalas** suffer from **physical QR code tampering** (stickers pasted over merchant stands) and **fake payment screenshot apps (Paytm Spoof)** without time to read complex English security manuals.
3. **Small Factories & Startups** connect IoT sensors and use AI to write backend code quickly, resulting in **leaked cloud credentials, SQL injection, and unauthenticated machine sabotage**.

**OmniShield AI** delivers an automatic, zero-expert security shield with **audible spoken voice warnings in Hindi, Bengali, and English** that anyone can use in **10 seconds**.

---

## 🏛️ System Architecture: The 3 Protection Pillars

```
                                [ OMNISHIELD AI ]
                   Universal Next.js 15 + MongoDB Full-Stack Hub
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
 👥 CITIZEN SHIELD             🏪 SHOP ARMOR                 🏭 FACTORY & CODE
 (People & Workers)            (Retail & Chaiwalas)          (Industrial & Startups)
 ├─ AI Voice Deepfake Scanner  ├─ QR Tampering Detector      ├─ AI-Written Code Guard
 ├─ Trick UPI Debit Trap Catcher ├─ Fake UTR/Screen Verifier ├─ Automated Patch/Auto-Fix
 └─ Spoken Audio Alerts        └─ 1-Click WhatsApp Staff     └─ IoT Machine Isolation
    (Hindi / Bengali / EN)        Emergency Broadcast           Emergency Kill-Switch
```

---

## ⚡ Key Capabilities

### 1. Citizen Scam Shield (`/citizen`)
- **AI Voice Clone & Deepfake Audio Analyzer**: Computes synthetic artifact confidence and distress coercion signals.
- **Audible Emergency Warning**: Speaks out loud in the victim's mother tongue (*"Stop! This voice is fake AI / This button will take money OUT of your bank!"*).
- **UPI Collect Request Intent Decoder**: Verifies whether an incoming transaction is a DEBIT trap or a genuine credit before entering PIN.

### 2. Shop Counter Armor (`/shops`)
- **1-Click Counter Staff WhatsApp Broadcast**: Instantly formats and copies or opens a WhatsApp warning for counter employees so no cashier is deceived by a fraudster.
- **Physical QR Code Integrity**: Checks if a QR payload points to rogue redirectors or malware APK downloads.
- **Fake Payment Screen / UTR Verifier**: Validates 12-digit transaction sequence against spoof generators.

### 3. Factory & Code Guard (`/factory`)
- **AI Code Vulnerability Scanner**: Audits AI-generated code for hardcoded secrets, SQL injection, and dangerous `os.system()` / `eval()` primitives.
- **1-Click Auto-Remediation**: Generates secure replacement patches.
- **Factory IoT Telemetry Monitor**: Detects thermal, vibration, and sensor network flooding anomalies with an **Automated Machine Isolation Circuit Cutoff**.

### 4. Unified Telemetry Hub (`/dashboard`)
- Live MongoDB Atlas storage recording audit trails, threat scores, and analytics across all 3 pillars.

---

## 🛠️ Tech Stack & Unified Monorepo Design

This repository is built as a **single, full-stack Next.js 15 App Router codebase** where both the frontend UI and serverless backend API routes run in a single repository:

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Lucide React, Radix UI (shadcn/ui style), Web Speech API.
- **Backend API**: Next.js App Router Route Handlers (`src/app/api/.../route.ts`).
- **Database**: MongoDB Atlas with connection caching (`src/lib/db.ts`).
- **Authentication**: BetterAuth with MongoDB adapter (`src/lib/auth.ts`).
- **Deployment**: Zero-configuration on **Vercel** (`vercel.json`).

---

## 🚀 Running Locally

1. **Navigate to project directory**:
   ```bash
   cd OmniShield-AI
   ```

2. **Environment Variables**:
   Verify `.env` has your MongoDB Atlas URI and BetterAuth secret:
   ```env
   BETTER_AUTH_SECRET=your_32_character_secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   MONGODB_DB=omni-shield-ai
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deploying to Vercel (1-Click Zero-Config)

1. Push this repository to GitHub: `OmniShield-AI`.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select the `OmniShield-AI` repository.
4. Add the Environment Variables:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (set to your Vercel deployment URL, e.g., `https://omnishield-ai.vercel.app`)
   - `MONGODB_URI`
   - `MONGODB_DB`
5. Click **Deploy**! Both Frontend and Backend APIs deploy together seamlessly.

---

## 👥 Team VenoX

Built with pride for **VibeX Codes Hackathon (Track 3)**.
