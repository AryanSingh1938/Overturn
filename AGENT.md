# AGENT.md: Operational Directives for Overturn Development

## 1. Product Identity & Track
**Product:** Overturn is an algorithmic legal-enablement and representation engine that analyzes unfair health insurance repudiation letters, cross-references them against genuine judicial precedents, and generates citation-verified appeal representations.
**Track:** Theme 1 — Civic Pulse, Digital Governance & Public Information.
**Objective:** End procedural wear-out by equipping citizens with deterministic statutory deadlines, precedent-grounded arguments, and structured grievance escalation.

---

## 2. Inviolable Hard Rules

1. **Zero Dummy Data:** Never use mock JSON files, synthetic case numbers, or placeholder statistics. Connect only to real databases, verified open S3 public buckets, and live regulatory rules.
2. **Never Fabricate a Citation:** The AI agent must never invent court citations, judge names, or statutory provisions. A separate programmatic verifier must assert that every cited case, citation ID, and quote exists verbatim within the retrieved text chunk before showing it to the user.
3. **Deterministic Procedural Logic:** Statutory limitation periods, maintainability tests, and financial compensation caps are computed using pure deterministic code (calendar math and switch logic)—never by LLM inference.
4. **Abstain Under Low Confidence:** If vector retrieval similarity scores fall below the configured threshold, the agent must explicitly abstain: `"No verified precedent matches this repudiation ground with sufficient confidence."` Never hallucinate an approximate ruling.
5. **Human-in-the-Loop Email Dispatch:** Never auto-send an email without explicit human review and confirmation. During development and live demos, dispatch outbound messages **only** to the verified team test inbox (`DEMO_DISPATCH_EMAIL`).
6. **Dynamic Model & Vector Configuration:** Never hardcode model IDs or embedding dimensions. Ingest them from environment variables and execute an automated validation check at server startup.
7. **Ephemeral Upload Processing:** Never persist uploaded rejection letters or personal health records to disk or unencrypted logs. Process documents entirely in memory buffers and purge immediately after extraction.
8. **Mandatory Statutory Disclaimer:** Every generated document and user-facing view must display the statutory disclaimer: *"Overturn is an automated procedural assistance platform, not a licensed legal practitioner or law firm, and does not provide formal legal advice."*

---

## 3. Technology Stack & Conventions

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide React.
* **Backend:** Node.js, Express.js (modular REST API), Multer (memory storage).
* **Database & Vector Search:** MongoDB Atlas with Atlas Vector Search (Cosine similarity).
* **Inference Models:** Models resolved dynamically from environment (`GEMINI_MODEL_ID`, `GEMINI_EMBEDDING_MODEL_ID`).
* **Dispatch & Export:** Nodemailer (SMTP transport), `pdf-lib` / `jspdf` for dossier generation.

---

## 4. Repository Layout

```text
overturn/
├── client/                        # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/            # UI components (Dropzone, Viewer, Gauge, Clock)
│   │   ├── services/              # API clients
│   │   └── App.tsx                # Dashboard shell
│   └── package.json
├── server/                        # Node.js + Express Backend
│   ├── config/                    # DB, Gemini, and env boot validators
│   ├── controllers/               # Extraction, vector search, drafting, dispatch
│   ├── engine/                    # Deterministic limitation and statutory rules
│   ├── verifier/                  # Citation and quote verifier logic
│   ├── models/                    # Mongoose schemas (Precedents, Cases)
│   ├── routes/                    # Express route definitions
│   └── server.js                  # Application entrypoint
├── scripts/                       # Ingestion & index verification scripts
├── AGENT.md                       # Builder agent rules
├── DATA_SOURCES.md                # Data provenance documentation
├── ARCHITECTURE.md                # System design & pipeline
├── TASKS.md                       # Execution sprint plan
└── package.json
```

---

## 5. Development Commands

```bash
# Install dependencies
npm run install:all

# Ingest and embed judicial precedents from open S3 corpus
npm run seed:precedents

# Verify vector index and API connectivity (Gate checks)
npm run verify:system

# Start full-stack development environment
npm run dev

# Run automated pipeline tests
npm test
```

---

## 6. Required Environment Variables

```env
PORT
NODE_ENV
MONGODB_URI
GEMINI_API_KEY
GEMINI_MODEL_ID
GEMINI_FALLBACK_MODEL_ID
GEMINI_EMBEDDING_MODEL_ID
GEMINI_FALLBACK_EMBEDDING_MODEL_ID
EMBEDDING_DIMENSIONS
SIMILARITY_THRESHOLD
DEMO_DISPATCH_EMAIL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

---

## 7. AI & Generation Conventions

* **Strict Structured Schemas:** All model extraction prompts must enforce a strict JSON schema (`responseSchema`) followed by server-side schema validation (Zod). Reject and retry if schema validation fails.
* **Resilience & Timeouts:** Set a strict 15-second timeout on LLM calls. Implement a retry strategy with exponential backoff (maximum 2 retries). On second failure, automatically switch to `GEMINI_FALLBACK_MODEL_ID`.
* **Vector Normalization:** Normalize all vectors (L2 norm) prior to database insertion and query execution. Confirm that the embedding dimension matches `EMBEDDING_DIMENSIONS` exactly.
* **Grounding Constraint:** The drafting prompt must only receive verified chunks passed by the retrieval engine. It must contain the strict directive: *"Rely solely on the provided excerpts. Do not reference outside case law or statutes not present in the context."*

---

## 8. Definition of Done (DoD)

A task or feature is complete only when:
1. It executes end-to-end against live external services (MongoDB Atlas, Gemini API, S3 judgment corpus).
2. It handles edge cases with an explicit, user-friendly error state (e.g., blurry image, API timeout, no matching precedent).
3. Every team member can independently explain the data flow, rule logic, and verification check without reading notes.
