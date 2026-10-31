const mongoose = require('mongoose');

const ClaimCaseSchema = new mongoose.Schema({
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
    claimant_phone: { type: String, default: '' }
  },
  deadlines: {
    statutory_limitation_date: { type: Date },
    insurer_gro_deadline_30d: { type: Date },
    is_time_barred: { type: Boolean, default: false },
    days_remaining: { type: Number, default: 30 }
  },
  retrieval_meta: {
    matched_precedents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PrecedentChunk' }],
    max_similarity_score: { type: Number, default: 0 },
    abstained: { type: Boolean, default: false }
  },
  win_probability: {
    score: { type: Number, default: 75 },
    verdict: { type: String, default: 'High Probability of Overturn' },
    factors: [
      {
        title: { type: String },
        points: { type: Number },
        description: { type: String },
        positive: { type: Boolean, default: true }
      }
    ]
  },
  verified_draft_markdown: { type: String },
  dispatch_log: {
    dispatched_to: { type: String },
    dispatched_at: { type: Date },
    tracking_token: { type: String },
    claimant_email: { type: String },
    mailto_url: { type: String },
    human_confirmed: { type: Boolean, default: false },
    status: { type: String, enum: ['DRAFT', 'DISPATCHED', 'ESCALATED', 'RESOLVED'], default: 'DRAFT' }
  }
}, { timestamps: true });

// Auto-expire submissions after 30 days per privacy architecture if needed
ClaimCaseSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

module.exports = mongoose.model('ClaimCase', ClaimCaseSchema);

