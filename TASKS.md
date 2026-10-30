# TASKS.md: Execution Sprint Plan & Critical Milestones

This sprint plan enforces the 3 Go/No-Go technical gates, assigns concrete tasks across teammates, and defines a strict triage cut-line to guarantee a functional submission.

---

## 🚦 Phase 0: The Three Go/No-Go Technical Gates

Before building UI or secondary features, the team must pass these three gates within the first 4 hours. **If Gate 2 or Gate 3 fails, pivot immediately to a pre-extracted local judicial subset.**

| Gate ID | Name | Objective | Owner | Done When |
| :--- | :--- | :--- | :--- | :--- |
| **G1** | **Model & Vector Gate** | Validate runtime model availability and 768-dim normalized embedding generation. | Teammate A (AI) | Node script calls `gemini-3.5-flash` and returns a 768-dim vector from `gemini-embedding-001`. |
| **G2** | **Corpus Access Gate** | Access public S3 bucket and download 1 full year of Supreme Court judgments without credentials. | Teammate B (Data) | `aws s3 sync --no-sign-request s3://indian-supreme-court-judgments/2023/ ./data/sc_2023/` downloads judgments successfully. |
| **G3** | **Retrieval Gate** | Ingest 50 insurance-related judgment chunks into Atlas and perform a test cosine search. | Teammate B (DB) | Querying `"pre-existing disease repudiation after 5 years"` returns relevant Supreme Court precedent with similarity > 0.75. |

---

## 🛠️ Phase 1: Core Processing Pipeline

| Task ID | Task Title | Owner | Done When |
| :--- | :--- | :--- | :--- |
| **P1-1** | In-Memory Document OCR | Teammate A (AI) | Express endpoint accepts PDF/photo into memory buffer and returns structured JSON (insurer, clause, amount, date) using Gemini vision. |
| **P1-2** | Atlas Vector Search Pipeline | Teammate B (DB) | Vector search endpoint takes query text, normalizes embedding, and returns top-3 chunks filtered by `grounds: "insurance"` above threshold. |
| **P1-3** | Deterministic Limitation Engine | Team Lead (Logic) | Node.js unit tests pass for Rule 14(3) (365-day cutoff), Rule 14(5) (court bar check), and Rule 17 (₹30L cap). |
| **P1-4** | Grounded Appeal Drafter | Teammate A (AI) | Generation prompt drafts formal appeal representation referencing *only* the retrieved precedent chunks and user facts. |
| **P1-5** | Programmatic Citation Verifier | Team Lead (Logic) | Verifier module throws an exception if the draft cites any case title or quotation not found verbatim in the retrieved database chunks. |

---

## 🎨 Phase 2: Output Engines & Frontend UI

| Task ID | Task Title | Owner | Done When |
| :--- | :--- | :--- | :--- |
| **P2-1** | React Audit & Fact Review UI | Team Lead (Frontend) | User can upload letter, view extracted facts in split-pane layout, and manually edit extracted values before proceeding. |
| **P2-2** | Win-Probability Gauge Component | Team Lead (Frontend) | Radial SVG gauge renders dynamic score with visual breakdown of statutory rule violation vs. precedent match strength. |
| **P2-3** | Precedent Card Explorer | Team Lead (Frontend) | Clickable cards render matched Supreme Court/High Court citations with court name, year, and direct public link. |
| **P2-4** | Court-Ready PDF Dossier Generator | Teammate A (Fullstack) | Client generates a downloadable PDF containing formal representation, citations, and evidence annexure checklist. |
| **P2-5** | "ChatGPT vs. Overturn" Toggle | Team Lead (Frontend) | UI toggle visually compares ungrounded, hallucinated generic LLM output with Overturn's citation-verified legal dossier. |

---

## ⚡ Phase 3: Action & Escalation Engine

| Task ID | Task Title | Owner | Done When |
| :--- | :--- | :--- | :--- |
| **P3-1** | Insurer GRO Directory Store | Teammate B (Data) | MongoDB collection seeded with verified Grievance Redressal Officer emails for top 10 health insurers. |
| **P3-2** | Human-Confirmed Email Dispatch | Teammate B (Backend) | User clicks "Confirm Dispatch"; Nodemailer sends legal dossier to `DEMO_DISPATCH_EMAIL` and returns a tracking token. |
| **P3-3** | 30-Day Statutory Countdown Clock | Team Lead (Frontend) | Dashboard tracks active claim status, displays 30-day resolution countdown, and unlocks Ombudsman Form VI download on day 31. |

---

## 🔒 Phase 4: Hardening & Submission Deliverables

| Task ID | Task Title | Owner | Done When |
| :--- | :--- | :--- | :--- |
| **P4-1** | Edge Case & Error State Auditing | Teammate A & Lead | Blurry images, non-insurance documents, missing dates, and API timeouts produce explicit, graceful error modals. |
| **P4-2** | Zero Dummy Data Verification | Teammate B (Data) | `DATA_SOURCES.md` evidence log is verified; live telemetry in header confirms active connection to Atlas and Gemini. |
| **P4-3** | Production Deployment | Team Lead (DevOps) | Frontend live on Vercel; Backend live on Render; health check endpoint returns `200 OK`. |
| **P4-4** | 2–3 Minute Video Demonstration | All Members | Recorded walkthrough demonstrating upload -> OCR -> vector retrieval -> citation verification -> dispatch. |
| **P4-5** | Final Submission Check | Team Lead | `SUBMISSION.md` and repository links verified against official hackathon criteria. |

---

## ✂️ The Critical Cut-Line (Emergency Triage Strategy)

If development time runs short (< 6 hours to submission deadline):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KEEP AT ALL COSTS (THE CORE)                    │
│  • In-Memory Multimodal OCR (P1-1)                                     │
│  • Atlas Vector Retrieval with Precedent Corpus (P1-2)                 │
│  • Deterministic Limitation & Ombudsman Rules Engine (P1-3)            │
│  • Grounded Appeal Drafter & Citation Verifier (P1-4, P1-5)            │
│  • React Split-Pane Fact Viewer & Win Gauge (P2-1, P2-2)               │
│  • Court-Ready PDF Dossier Export (P2-4)                               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         [ THE CUT LINE ─────────────────────────────────]
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                        DROP IF TIME RUNS SHORT                         │
│  • Outbound Email Dispatch Service (P3-2) ──► Replaced by PDF download │
│  • Automated Recurring Background Email Reminders                      │
│  • User Authentication / Multi-user login profiles                     │
└────────────────────────────────────────────────────────────────────────┘
```

By prioritizing the core retrieval, deterministic rule checking, citation verification, and PDF dossier export, the project remains a **complete, mathematically sound, award-winning entry** even if third-party email dispatching is dropped.
