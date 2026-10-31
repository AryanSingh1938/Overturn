# 🤝 Contributing to Project Overturn: Developer & Collaborator Guide

Welcome to the **Overturn** development team! This guide outlines our local environment setup, team workflows, Git conventions, and code-commenting standards so all teammates and contributors can write clean, cohesive, and award-winning code.

---

## ⚡ 3-Minute Developer Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AryanSingh1938/Overturn.git
cd Overturn

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Local Environment
Create `server/.env` using the template below (never commit your actual `.env` to Git):
```env
PORT=5000
NODE_ENV=development

# Database & Vector Search
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/overturn?retryWrites=true&w=majority

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_ID=gemini-3.5-flash
GEMINI_FALLBACK_MODEL_ID=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL_ID=text-embedding-004
EMBEDDING_DIMENSIONS=768
SIMILARITY_THRESHOLD=0.72

# Dispatch Service
DEMO_DISPATCH_EMAIL=team.overturn.demo@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Seed Precedent Database
Before running the frontend or backend, populate your MongoDB Atlas database with our 18 verified judicial precedents:
```bash
node scripts/seed_precedents.js
```

### 4. Launch Development Servers
```bash
# Terminal 1: Backend API (http://localhost:5000)
cd server && npm run dev

# Terminal 2: React Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## 🌳 Git & Branching Strategy

To avoid merge conflicts during fast-paced hackathon sprints, follow this branch naming convention:

* **Feature Branches:** `feat/<component-or-service>`  
  *(e.g., `feat/ocr-gemini-vision`, `feat/atlas-vector-search`, `feat/win-gauge-ui`)*
* **Bug Fixes:** `fix/<bug-description>`  
  *(e.g., `fix/pdf-lib-unicode-error`, `fix/mobile-responsive-dropzone`)*
* **Data & Scripts:** `data/<update-description>`  
  *(e.g., `data/add-high-court-cases`)*

### Commit Message Guidelines (Conventional Commits)
Write clear, imperative commit messages:
```text
feat(ocr): integrate gemini 2.5 flash structured json extraction
feat(vector): implement 768-dim normalized atlas vector search
feat(ui): add 30-day statutory countdown timer component
fix(verifier): reject appeal drafts containing hallucinated citations
docs: update DATA_SOURCES.md with verified s3 test commands
```

---

## 💬 Code Commenting & JSDoc Standards

Good comments explain **WHY** an algorithmic decision was made, not just *what* the code does. Every function in our backend controllers and React services should follow this standard:

### Example: Backend Vector Search Controller
```javascript
/**
 * Executes a semantic vector search on MongoDB Atlas over historical court precedents.
 * 
 * WHY:
 * 1. Insurers frequently use obscure clause names (e.g. "Code-Excl01").
 * 2. Vector search matches the underlying factual scenario (e.g. hypertension non-disclosure)
 *    even when the insurer renames the clause in their policy schedule.
 * 
 * @param {string} denialGround - Extracted plain-text repudiation reason from user letter
 * @param {number} limit - Maximum number of top precedent matches to return (default: 3)
 * @returns {Promise<Array<Precedent>>} Ranked list of authentic, citable court orders
 * @throws {VectorSearchError} If similarity score falls below SIMILARITY_THRESHOLD
 */
export async function searchPrecedents(denialGround, limit = 3) {
  // Step 1: Normalize query vector to unit length (L2 norm) for cosine distance
  const queryEmbedding = await generateNormalizedEmbedding(denialGround);

  // Step 2: Query MongoDB Atlas Vector Search index
  const results = await Precedent.aggregate([
    {
      $vectorSearch: {
        index: "precedent_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 20,
        limit: limit
      }
    }
  ]);

  // Step 3: Guardrail: Check confidence threshold (prevent hallucinated weak matches)
  if (!results.length || results[0].score < process.env.SIMILARITY_THRESHOLD) {
    console.warn(`[Guardrail]: Low confidence (${results[0]?.score || 0}). Abstaining from matching.`);
    return [];
  }

  return results;
}
```

### Example: Frontend React Component
```typescript
/**
 * WinGauge Component
 * 
 * Visualizes the claimant's probability of overturning the denial.
 * Computes score dynamically based on:
 * - Direct statutory circular violation (+40%)
 * - Precedent ruling similarity overlap (+35%)
 * - Timely claim intimation within statutory window (+12%)
 */
export const WinGauge: React.FC<WinGaugeProps> = ({ score, factorBreakdown }) => {
  // Avoid flashing 0% on initial load by applying a smooth CSS transition
  const strokeDashoffset = calculateCircumferenceOffset(score);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl">
      {/* Radial SVG Gauge */}
      ...
    </div>
  );
};
```

---

## 🛡️ The 5 Inviolable Rules for All Collaborators

1. **Zero Dummy Data:** Never commit mock JSON files disguised as real search results. All precedents must come from [`data/precedents.json`](data/precedents.json) or live external APIs.
2. **Never Fabricate Citations:** If Gemini generates a draft citing a case not present in our retrieved chunks, your code must reject and re-prompt the model.
3. **In-Memory File Processing Only:** Never save uploaded patient medical bills or rejection letters to disk. Process all buffers in RAM (`multer.memoryStorage()`) to protect user privacy.
4. **Deterministic Limitation Logic:** Compute all deadlines (e.g. 365-day Ombudsman window, ₹30L cap) using pure deterministic code (`server/engine/limitationEngine.js`)—never ask an LLM to do calendar math.
5. **Always Test on Dedicated Hotspot:** Before presenting to judges, test your full workflow on mobile data to ensure you don't hit venue Wi-Fi firewall blocks.

---

## 📋 Pull Request (PR) Checklist

Before submitting a PR for review by the Team Lead, verify that:

- [ ] Code passes linting and runs locally without terminal warnings (`npm run lint`).
- [ ] No `.env` secrets or personal test files are included in the git diff.
- [ ] New functions include JSDoc comments explaining parameters, return types, and architectural rationale.
- [ ] API endpoints handle error states gracefully with clean JSON error messages.
- [ ] React components look crisp on both desktop (1920x1080) and laptop (1366x768) resolutions.

Let's build a clean, bulletproof, 1st-place project! ⚖️
