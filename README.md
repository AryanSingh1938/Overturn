<div align="center">

# ⚖️ Overturn
### *The Autonomous Precedent-Backed Claim Denial & Civic Appeal Engine*

**Theme 1: Civic Pulse, Digital Governance & Public Information**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black.svg)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/React-19%20%2B%20Vite-61dafb.svg)](https://react.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20Vector%20Search-47A248.svg)](https://www.mongodb.com/atlas/database)
[![Google Gemini API](https://img.shields.io/badge/Google-Gemini%202.5%20%26%20Embeddings-orange.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Hackathon Submission](https://img.shields.io/badge/Hackathon-SUBMISSION.md-purple.svg)](SUBMISSION.md)

<p align="center">
  <b>Democratizing administrative justice against corporate procedural wear-out.</b><br/>
  Transform unfair health insurance repudiations, pension cancellations, and welfare rejections into citation-grounded legal representations with empirical win-probability scoring and automated statutory escalation.
</p>

---

[Hackathon Submission](SUBMISSION.md) • [Contributing](CONTRIBUTING.md) • [Features](#-key-features) • [System Architecture](#-system-architecture) • [Project Structure](#-project-structure) • [API Reference](#-api-specification) • [Zero Dummy Data](#-data-compliance--provenance) • [Quickstart](#-getting-started) • [Overturn vs ChatGPT](#-why-not-chatgpt)

</div>

---

> [!IMPORTANT]
> **For Hackathon Judges:** Please refer to [`SUBMISSION.md`](SUBMISSION.md) for the official Project Submission Form, live deployment URL, video demonstration link, 6-slide pitch deck, and detailed scoring rubric self-assessment.

---

## 📖 Overview

Every year, millions of working-class families face devastating out-of-pocket medical debt when legitimate insurance claims are summarily rejected using generic exclusion clauses (e.g., *"Clause 4.2: Pre-existing condition non-disclosure"* or *"Hospitalization deemed not medically active"*).

Institutional insurers rely on **procedural wear-out**:
* **The Abandonment Crisis:** Consumer advocacy surveys and legal aid audits indicate that **upwards of 80% of rejected policyholders abandon appeals** due to dense legal jargon and prohibitive legal costs.
* **Procedural Vulnerability:** Insurance Ombudsman annual reports consistently demonstrate that **a decisive majority of contested repudiations result in awards or mediated settlements** in favor of the policyholder, proving that initial denial letters often exploit technicalities that do not survive regulatory scrutiny (such as the mandatory IRDAI 60-Month Moratorium rule).

**Overturn** is an end-to-end procedural execution engine built on the MERN stack. Users upload a photo or PDF of their repudiation letter. Overturn automatically extracts the rejection grounds, cross-references them against **real-world Supreme Court and High Court precedents via MongoDB Atlas Vector Search**, calculates a data-backed **Win-Probability Score**, drafts a citation-grounded legal appeal, and provides **1-click official dispatch** with a live 30-day statutory countdown timer.

---

## ✨ Key Features

```
                       OVERTURN END-TO-END WORKFLOW

  ┌───────────────────────────────┐       ┌───────────────────────────────┐
  │ 1. MULTIMODAL DOCUMENT AUDIT  │       │ 2. REGULATORY RULE CHECKER    │
  │ • Uploads physical letter/PDF │ ────► │ • Catches illegal denials     │
  │ • Extracts clauses in 5s      │       │ • Flags IRDAI 2024 violations │
  └───────────────────────────────┘       └───────────────┬───────────────┘
                                                          │
  ┌───────────────────────────────┐                       ▼
  │ 4. WIN-PROBABILITY GAUGE      │       ┌───────────────────────────────┐
  │ • Calculates % chance to win  │ ◄──── │ 3. ATLAS PRECEDENT MATCHER    │
  │ • Based on empirical rules    │       │ • 3 real Ombudsman citations  │
  └───────────────┬───────────────┘       │ • Active links, grounded data │
                  │                       └───────────────────────────────┘
                  ▼
  ┌───────────────────────────────┐       ┌───────────────────────────────┐
  │ 5. PRECEDENT-ANCHORED APPEAL  │       │ 6. 1-CLICK DISPATCH & TRACKER │
  │ • Formal court-ready draft    │ ────► │ • Sends email to GRO desk     │
  │ • Downloadable PDF dossier    │       │ • 30-Day statutory countdown  │
  └───────────────────────────────┘       └───────────────────────────────┘
```

1. **Multimodal Document Auditor:** Ingests scanned PDFs or smartphone photos of repudiation letters. Extracts insurer name, policy number, denied amount, and stated exclusion clauses in under 5 seconds using `gemini-2.5-flash`.
2. **Statutory Rule Violation Detector:** Evaluates the repudiation clause against codified consumer protection rules (e.g., *IRDAI Master Circular 2024 Section 6: 60-Month Moratorium Rule*), flagging clear statutory discrepancies:
   * `⚠️ STATUTORY CONTRAVENTION IDENTIFIED: IRDAI Master Circular (Section 6) Breach`
   * Plain-English explanation: *"Your policy has been continuously active for over 5 years. Under IRDAI statutory regulations, insurers are strictly barred from repudiating claims based on pre-existing diseases after 60 continuous months of coverage."*
3. **Precedent Vector Matcher (Atlas Vector Search):** Converts the denial reason into 768-dimensional embeddings via `text-embedding-004` and queries MongoDB Atlas for semantically identical historical rulings from the **Supreme Court of India and High Courts** (e.g., landmark rulings on non-disclosure, moratoriums, and repudiation standards), complete with active links to public judicial records.
4. **Win-Probability & Arbitrage Gauge:** Calculates a heuristic success probability score (e.g., `87% High Probability of Overturn`) based on statutory non-compliance weightings and historical Ombudsman ruling patterns.
5. **Precedent-Anchored Appeal Generator & PDF Export:** Synthesizes an official representation letter strictly grounded in retrieved precedents and statutory circulars, ready for 1-click PDF dossier download.
6. **One-Click GRO Dispatch & 30-Day Statutory Countdown:** Pre-fills the official email of the insurer’s Grievance Redressal Officer (GRO) and dispatches the representation via SMTP. Initiates a 30-day statutory countdown on the user dashboard, automatically preparing **pre-filled Ombudsman Form VI packages** if the insurer fails to resolve the matter within the legally mandated window.
7. **"ChatGPT vs. Overturn" Live Comparison Toggle:** An interactive toggle showing the difference between an unverified, hallucinated LLM draft and Overturn's citation-grounded, circular-enforced legal representation.

---

## 🛠️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REACT 19 FRONTEND (Vite + Tailwind)                   │
│                                                                                 │
│  [ Upload Dropzone ]   [ Split-Pane Document Viewer ]   [ Win-Probability Gauge ]│
│  [ 1-Click GRO Dispatch ]   [ 30-Day Statutory Timer ]  [ Precedent Case Cards ] │
│  [ ChatGPT vs Overturn Toggle ]   [ Export PDF Dossier ]                        │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ (Multipart Form-Data / JSON REST)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          NODE.JS / EXPRESS.JS BACKEND                           │
│                                                                                 │
│  • Document Processing Controller     • Vector Search Orchestration             │
│  • Regulatory Rule Engine             • Nodemailer Automated Legal Dispatch     │
└─────────────┬──────────────────────────┬─────────────────────────┬──────────────┘
              │                          │                         │
              ▼                          ▼                         ▼
┌───────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────┐
│     AI REASONING ENGINE   │ │   MONGODB ATLAS DATABASE  │ │ STATUTORY REGISTRIES │
│ • Gemini 2.5 Flash        │ │ • Atlas Vector Search     │ │ • IRDAI Master Rules │
│   (Multimodal Vision OCR) │ │ • Precedents Collection   │ │ • GRO Directory      │
│ • text-embedding-004      │ │ • User Claims & Timelines │ │ • Ombudsman Regional │
│   (768-dim Vector Embeds) │ │ • Regulatory Rule Store   │ │   Jurisdictions      │
└───────────────────────────┘ └───────────────────────────┘ └──────────────────────┘
```

### Technology Stack
* **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, HTML5 Canvas Gauges.
* **Backend:** Node.js, Express.js REST API, Multer (file processing), Nodemailer (statutory notice dispatch).
* **Database & Vector Search:** MongoDB Atlas (Mongoose ODM, native Atlas Vector Search index using cosine distance).
* **AI & Document Intelligence:** 
  * `gemini-2.5-flash`: Zero-shot multimodal OCR and structured legal synthesis with strict JSON response schemas.
  * `text-embedding-004`: 768-dimensional semantic embeddings for legal precedent matching.
* **Export Engine:** Client-side court-ready PDF generation with evidence annexures (`jspdf` / `html2pdf.js`).

---

## 📂 Project Structure

```text
overturn/
├── client/                        # React 19 + Vite Frontend
│   ├── public/                    # Static assets & public icons
│   ├── src/
│   │   ├── components/            # Modular UI components
│   │   │   ├── Dropzone.tsx       # Drag-and-drop PDF/image uploader
│   │   │   ├── DocumentViewer.tsx # Split-pane rejection audit view
│   │   │   ├── WinGauge.tsx       # Circular Win-Probability score gauge
│   │   │   ├── PrecedentCard.tsx  # Verified Ombudsman case cards
│   │   │   ├── AppealPreview.tsx  # Generated legal appeal preview
│   │   │   ├── EscalationClock.tsx# 30-Day countdown timer & milestones
│   │   │   └── ComparisonView.tsx # ChatGPT vs. Overturn toggle view
│   │   ├── services/              # Axios/Fetch API client services
│   │   ├── App.tsx                # Main dashboard application shell
│   │   └── main.tsx               # React application entrypoint
│   └── package.json
├── server/                        # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                  # MongoDB Atlas connection
│   │   └── gemini.js              # Google Gemini API configuration
│   ├── controllers/
│   │   ├── auditController.js     # Multimodal extraction & rule checking
│   │   ├── vectorController.js    # Atlas Vector Search query handler
│   │   ├── appealController.js    # Grounded appeal drafting
│   │   └── dispatchController.js  # Nodemailer GRO dispatch service
│   ├── models/
│   │   ├── Precedent.js           # Mongoose model for historical court orders
│   │   ├── ClaimCase.js           # Mongoose model for user claim submissions
│   │   └── GroContact.js          # Mongoose model for insurer GRO directory
│   ├── routes/                    # REST API route handlers
│   │   └── api.js                 # Unified /api/v1 router
│   ├── server.js                  # Express backend entrypoint
│   └── package.json
├── scripts/
│   ├── seed_precedents.js         # Zero-Dummy Data: Seeds real Ombudsman awards
│   └── seed_gro_directory.js      # Seeds authentic IRDAI GRO email registry
├── SUBMISSION.md                  # Official Hackathon Submission Document
├── .env.example                   # Environment variables template
├── LICENSE                        # MIT License
└── README.md                      # Project documentation
```

---

## 📡 API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/analyze-rejection` | Accepts `multipart/form-data` (PDF/Image), runs Gemini OCR, extracts clauses, matches statutory rules, and returns win probability. |
| `POST` | `/api/search-precedents` | Generates text embedding of the denial reason and queries MongoDB Atlas Vector Search for top 3 matching awards. |
| `POST` | `/api/generate-appeal` | Synthesizes an appeal letter strictly grounded in retrieved precedents; enforces anti-hallucination guardrail fallback. |
| `POST` | `/api/generate-ombudsman-complaint` | Generates statutory Form VI Complaint to the Insurance Ombudsman under Rule 14(1) with territorial bench mapping. |
| `POST` | `/api/dispatch-gro` | Generates 1-click native `mailto:` URI, sets `Reply-To: claimant_email`, triggers SMTP dispatch, and initializes 30-day countdown. |
| `GET` | `/api/case-status/:claimId` | Retrieves active case status, countdown days remaining, and statutory milestones. |
| `GET` | `/api/gro-directory` | Returns verified contact directory for insurer Grievance Redressal Officers. |
| `GET` | `/api/ombudsman-directory` | Returns the complete directory of all 18 regional Insurance Ombudsman Benches across India. |

---

## 🛡️ Data Compliance & Provenance

Overturn adheres to a **Zero Dummy Data** standard by grounding all operations in authentic, published government records and open judicial corpora:

1. **Authentic Judicial Precedents:** Sourced directly from the public, requester-free eCourts judgments corpus on AWS S3 (`s3://indian-supreme-court-judgments/` and `s3://indian-high-court-judgments/`, CC-BY-4.0). Every citation references authentic Supreme Court and High Court rulings on insurance law.
2. **Statutory Regulatory Framework:** Codifies the **Insurance Ombudsman Rules, 2017 (amended 2021)** (Rules 13(1)(b), 14(3), 14(5), and 17) and the **IRDAI Master Circular on Protection of Policyholders' Interests (2024)** via the [IRDAI Official Portal](https://irdai.gov.in).
3. **Official Insurer GRO Registry:** Real-time lookup of official compliance emails (e.g., `gro@starhealth.in`, `gro@careinsurance.com`, `grievance@hdfcergo.com`) sourced from [IRDAI Bima Bharosa](https://bimabharosa.irdai.gov.in/).

---

## 🥊 Why Not ChatGPT?

| Capability | Generic LLM (ChatGPT / Claude) | Overturn Platform |
| :--- | :---: | :---: |
| **Citation Reliability** | ❌ Prone to hallucinating non-existent court cases | ✅ Decoupled RAG: Cites verified Supreme Court & High Court cases |
| **Regulatory Rule Verification** | ❌ Generic advice; unaware of active master circulars | ✅ Deterministic IRDAI moratorium violation checks |
| **Win-Probability Scoring** | ❌ Subjective, ungrounded conversational optimism | ✅ Heuristic Arbitrage Score based on precedent overlap |
| **Procedural Escalation** | ❌ Leaves user with unformatted text | ✅ 1-Click GRO Dispatch + 30-Day Statutory Timer |
| **Ombudsman Form VI Generation** | ❌ Not supported | ✅ Automated pre-filled jurisdiction dossier packaging |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** >= 18.x
* **MongoDB Atlas** account with Vector Search enabled
* **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AryanSingh1938/Overturn.git
cd Overturn

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/overturn?retryWrites=true&w=majority

# AI Engine
GEMINI_API_KEY=your_gemini_api_key_here

# Dispatch Service (Nodemailer / SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Seed Authentic Precedent Data
Populate your MongoDB database with authentic, published Ombudsman orders:
```bash
node scripts/seed_precedents.js
```

### 4. Create MongoDB Atlas Vector Search Index
In your MongoDB Atlas Dashboard, navigate to **Atlas Search & Vector Search** and create an index on the `precedents` collection named `precedent_vector_index`:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```

### 5. Launch Development Servers
```bash
# In server/ (Terminal 1)
npm run dev

# In client/ (Terminal 2)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚖️ Legal & Regulatory Notice

*Disclaimer: Overturn is an algorithmic consumer advocacy and procedural enablement tool designed to assist policyholders in understanding statutory rights, identifying regulatory discrepancies, and preparing formal representations. It does not provide formal legal advice, guarantee dispute outcomes, or act as a licensed legal practitioner. Final adjudication remains within the jurisdiction of the insurer, statutory Ombudsman, or consumer court.*

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">
  <sub>Built with conviction for the Civic Pulse & Digital Governance Track ⚖️</sub>
</div>
