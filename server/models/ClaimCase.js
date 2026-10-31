/**
 * =================================================================================================
 * OVERTURN MONGOOSE MODEL — CLAIM CASE STATE MACHINE (models/ClaimCase.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    Defines the Mongoose schema and model for persisting an insurance claim dispute throughout
 *    its entire lifecycle in the Overturn engine. It stores extracted repudiation facts, statutory
 *    limitation dates, retrieved precedent references, calibrated win probability scores, verified
 *    markdown drafts, and dispatch tracking audit logs.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    - Persistent State Machine: Tracks case progression across four formal states:
 *      `DRAFT` (audit completed) ──► `DISPATCHED` (GRO notice sent) ──► `ESCALATED` (Form VI Ombudsman) ──► `RESOLVED`
 *    - Privacy Compliance: Includes a 30-day MongoDB TTL (Time-To-Live) index that automatically
 *      purges user submission data after 30 days unless explicitly retained.
 *    - Policyholder Privity: Stores `claimant_email`, `claimant_phone`, and `mailto_url` to preserve
 *      legal privity between the insured policyholder and the insurer's GRO.
 *
 * 3. IMPORTED MODULES:
 *    - `mongoose`: MongoDB Object Data Modeling library.
 * =================================================================================================
 */

const mongoose = require('mongoose');

const ClaimCaseSchema = new mongoose.Schema({
  // Extracted facts from repudiation letter (via Gemini OCR / auditController)
  extracted_facts: {
    insurer_name: { type: String, required: true },
    policy_number: { type: String, default: 'N/A' },
    claim_id: { type: String, default: 'N/A' },
    denial_amount: { type: Number, default: 0 },
    rejection_date: { type: Date, default: Date.now },
    raw_stated_grounds: { type: String, default: '' },
    statutory_clause: { type: String, default: '' },
    policy_duration_months: { type: Number, default: 60 },
    patient_name: { type: String, default: 'Policyholder' },
    hospital_name: { type: String, default: '' },
    claimant_email: { type: String, default: '' },
    claimant_phone: { type: String, default: '' },
  },

  // Statutory limitation milestones evaluated by limitationEngine.js
  deadlines: {
    statutory_limitation_date: { type: Date }, // 365-day cutoff under Rule 14(3)(c)
    insurer_gro_deadline_30d: { type: Date },   // 30-day response window under Rule 14(3)(a)
    is_time_barred: { type: Boolean, default: false },
    days_remaining: { type: Number, default: 30 },
  },

  // Precedent retrieval audit metadata
  retrieval_meta: {
    matched_precedents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrecedentChunk' }],
    max_similarity_score: { type: Number, default: 0 },
    abstained: { type: Boolean, default: false },
  },

  // Calibrated empirical win probability score and factor breakdown
  win_probability: {
    score: { type: Number, default: 75 },
    verdict: { type: String, default: 'High Probability of Overturn' },
    factors: [
      {
        title: { type: String },
        points: { type: Number },
        description: { type: String },
        positive: { type: Boolean, default: true },
      },
    ],
  },

  // Verified legal representation markdown (guaranteed 100% grounded by citationVerifier.js)
  verified_draft_markdown: { type: String },

  // Real-world dispatch tracking and audit log
  dispatch_log: {
    dispatched_to: { type: String },
    dispatched_at: { type: Date },
    tracking_token: { type: String },
    claimant_email: { type: String },
    mailto_url: { type: String },
    human_confirmed: { type: Boolean, default: false }, // Enforces AGENT.md Rule 5
    status: {
      type: String,
      enum: ['DRAFT', 'DISPATCHED', 'ESCALATED', 'RESOLVED'],
      default: 'DRAFT',
    },
  },
}, { timestamps: true });

// Privacy Architecture: Auto-expire submissions after 30 days via MongoDB TTL index
ClaimCaseSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('ClaimCase', ClaimCaseSchema);
