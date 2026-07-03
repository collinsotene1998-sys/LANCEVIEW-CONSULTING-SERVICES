# Lanceview Consulting LLC - Dual-Funnel Platform

A highly polished, high-conversion full-stack web platform built for **Lanceview Consulting LLC**, specializing in **Surplus Funds Recovery**, **Real Estate Contracting**, and **Section 8 Housing Compliance**.

The platform is designed around a prestige "Money Green & Gold" theme, featuring high-fidelity vector branding, a comprehensive Foreclosure Registry, an interactive case auditing progress tracker, and a grounded **AI Forensics Advisor** powered by the Gemini 3.5 API.

---

## 🎨 Visual Identity & Key Enhancements

- **Lanceview Gold & Green Branding**: Custom-crafted color palettes with deep forest tones and bright golden accents representing prosperity and precision.
- **Dynamic Interactive Logo (`LanceviewLogo.tsx`)**: Completely custom vector branding that scales gracefully and features high-fidelity visual assets.
- **AI Forensics Assistant (`StatusChecker.tsx`)**: Fully integrated server-side AI that can index unclaimed foreclosure records, answer user questions, and dynamically render actionable claim buttons so users can instantly link for assisted recovery.

---

## 🏗️ Repository Architecture

- `/index.html`: Main HTML document, configured with optimized display titles.
- `/server.ts`: Node.js Express server entrypoint which acts as a secure reverse-proxy to the Gemini API, preventing API keys from being exposed to the browser.
- `/src/App.tsx`: Main page layout coordinating segment routing (Funds Recovery vs. Corporate B2B Consulting).
- `/src/components/`:
  - `LanceviewLogo.tsx`: The high-fidelity company logo.
  - `StatusChecker.tsx`: The primary forensic search suite with the AI chatbot and registry browser.
  - `LeadCaptureFunnels.tsx`: Deep-funnel secure intake forms.
  - `SurplusLanding.tsx`: Value-proposition content for surplus recovery.
  - `B2BLanding.tsx`: B2B contract consulting services.
  - `FaqSection.tsx`: Direct answers regarding surplus equity rules.
- `/src/types.ts` & `/src/data.ts`: Shared static and runtime types and mock county dockets.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (packaged with Node.js)

### 2. Environment Variables
Create a `.env` file at the root of the repository and add your Gemini API Key:
```env
# Required for AI chat assistance
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"

# (Optional) Local host address
APP_URL="http://localhost:3000"
```

### 3. Installation
Install all required dependencies:
```bash
npm install
```

### 4. Running the Development Server
Launch the full-stack development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the live application.

### 5. Production Build & Start
Compile the client static files and bundle the server using esbuild:
```bash
npm run build
```
Launch the compiled production bundle:
```bash
npm run start
```

---

## 🛡️ License
Copyright © 2026 Lanceview Consulting LLC. All Rights Reserved.
Licensed under Apache-2.0.
