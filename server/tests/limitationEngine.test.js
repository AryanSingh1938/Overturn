/**
 * =================================================================================================
 * OVERTURN UNIT TEST SUITE — STATUTORY LIMITATION & WIN-SCORING ENGINE
 * (tests/limitationEngine.test.js)
 * =================================================================================================
 *
 * 1. TEST SUITE PURPOSE & ARCHITECTURAL ROLE:
 *    This test suite verifies the mathematical and statutory core of Overturn (`engine/limitationEngine.js`).
 *    It guarantees that all procedural limitation calculations, statutory maintainability bars,
 *    pecuniary compensation caps, and moratorium rules execute deterministically in pure code
 *    without relying on subjective or hallucinated LLM outputs.
 *
 * 2. STATUTORY FRAMEWORKS TESTED:
 *    - Rule 14(3) Insurance Ombudsman Rules, 2017: 365-Day Hard Limitation Period.
 *    - Rule 14(5) Insurance Ombudsman Rules, 2017: Concurrent Litigation Maintainability Bar.
 *    - Rule 17(1) Insurance Ombudsman Rules, 2017: ₹30,00,000 Maximum Pecuniary Jurisdiction.
 *    - Section 6 IRDAI Master Circular 2024: 60-Month Continuous Coverage Moratorium Protection.
 *    - Calibrated Recovery Probability Formula: Explainable factor weighting (0-100 score).
 *
 * 3. TEST FRAMEWORK & EXECUTION SPEED:
 *    Uses Node.js standard library `node:test` and `node:assert`.
 *    Requires zero third-party testing bloat (Jest/Mocha), executing in under 60 milliseconds.
 * =================================================================================================
 */

const test = require('node:test');
const assert = require('node:assert');
const {
  evaluateDeadlines,
  evaluateMaintainability,
  evaluatePecuniaryLimit,
  evaluateMoratoriumRule,
  calculateWinProbability,
} = require('../engine/limitationEngine');

// =================================================================================================
// TEST 1: RULE 14(3) STATUTORY LIMITATION PERIOD (365 DAYS)
// =================================================================================================
test('Rule 14(3): Calculates 365-day statutory limitation cutoff accurately', () => {
  // Scenario A: Fresh claim rejection (30 days ago) — Must be valid and not time-barred
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 30);
  const result = evaluateDeadlines(recentDate);

  // Assertion: Claim is well within the 365-day window (~335 days remaining)
  assert.strictEqual(result.isValid, true, 'Result should be structurally valid');
  assert.strictEqual(result.isTimeBarred, false, '30-day-old claim must not be time-barred');
  assert.ok(result.daysUntilStatutoryBarred > 300, 'Expected >300 days remaining before statutory bar');

  // Scenario B: Expired claim (>365 days ago) — Must be flagged as isTimeBarred = true
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 400); // 400 days past rejection
  const oldResult = evaluateDeadlines(oldDate);

  // Assertion: Claims older than 1 year are legally barred from Ombudsman jurisdiction
  assert.strictEqual(oldResult.isTimeBarred, true, '400-day-old claim must be flagged as time-barred');
  assert.ok(oldResult.daysUntilStatutoryBarred <= 0, 'Days remaining must be <= 0');
});

// =================================================================================================
// TEST 2: RULE 14(5) MAINTAINABILITY BAR (CONCURRENT LITIGATION)
// =================================================================================================
test('Rule 14(5): Maintains bar if concurrent court proceeding is pending', () => {
  // Scenario A: Policyholder has NO active court or consumer forum cases
  const clean = evaluateMaintainability({ hasConcurrentCourtProceeding: false, previousArbitration: false });
  assert.strictEqual(clean.maintainable, true, 'Clean dispute must be maintainable before Ombudsman');
  assert.strictEqual(clean.barRule, null, 'No bar rule should be cited');

  // Scenario B: Policyholder already filed a lawsuit in Civil Court or Consumer Commission
  const barred = evaluateMaintainability({ hasConcurrentCourtProceeding: true, previousArbitration: false });
  assert.strictEqual(barred.maintainable, false, 'Concurrent court litigation must trigger statutory bar');
  assert.strictEqual(barred.barRule, 'Rule 14(5) Insurance Ombudsman Rules', 'Must cite Rule 14(5)');
});

// =================================================================================================
// TEST 3: RULE 17(1) PECUNIARY JURISDICTION CAP (₹30 LAKHS)
// =================================================================================================
test('Rule 17: Checks ₹30,00,000 pecuniary compensation cap', () => {
  // Scenario A: Claim of ₹2,85,000 (2.85 Lakhs) — Within statutory jurisdiction
  const underLimit = evaluatePecuniaryLimit(285000);
  assert.strictEqual(underLimit.withinOmbudsmanLimit, true, '₹2.85 Lakhs is within ₹30L Ombudsman cap');
  assert.strictEqual(underLimit.cap, 3000000);

  // Scenario B: Claim of ₹35,00,000 (35 Lakhs) — Exceeds cap, recommend State Consumer Commission (SCDRC)
  const overLimit = evaluatePecuniaryLimit(3500000);
  assert.strictEqual(overLimit.withinOmbudsmanLimit, false, '₹35 Lakhs exceeds ₹30L Ombudsman cap');
  assert.strictEqual(overLimit.recommendation, 'State Consumer Disputes Redressal Commission (SCDRC)', 'Must recommend SCDRC via e-Daakhil');
});

// =================================================================================================
// TEST 4: IRDAI MASTER CIRCULAR 2024 (SECTION 6) — 60-MONTH MORATORIUM PROTECTION
// =================================================================================================
test('IRDAI Master Circular 2024 (Section 6): Detects 60-Month Moratorium breach', () => {
  // Scenario A: Policy continuously active for 68 months (>5 years) with Pre-Existing Disease repudiation
  const breach = evaluateMoratoriumRule(68, 'Repudiation under Clause 4.2: Pre-existing condition non-disclosure');
  assert.strictEqual(breach.breached, true, 'Insurers cannot cite PED exclusions after 60 continuous months');
  assert.strictEqual(breach.code, 'IRDAI_MORATORIUM_BREACH');
  assert.strictEqual(breach.severity, 'CRITICAL');

  // Scenario B: Policy active for only 24 months (<60 months) — Moratorium rule does not apply
  const underThreshold = evaluateMoratoriumRule(24, 'Clause 4.2: Pre-existing condition');
  assert.strictEqual(underThreshold.breached, false, 'Policy under 60 months does not trigger moratorium breach');
  assert.strictEqual(underThreshold.code, 'NO_MORATORIUM_BREACH');
});

// =================================================================================================
// TEST 5: EMPIRICAL CALIBRATED WIN-PROBABILITY SCORING ALGORITHM
// =================================================================================================
test('Win-Probability Engine computes calibrated score', () => {
  // Input: Strong case (68-month policy, moratorium breach, direct Supreme Court precedent, active deadline)
  const prob = calculateWinProbability({
    policyDurationMonths: 68,
    denialGrounds: 'Clause 4.2 Pre-existing non-disclosure',
    claimAmount: 285000,
    rejectionDate: new Date(),
    maxSimilarityScore: 0.88,
    hasDirectPrecedent: true,
  });

  // Score must reflect cumulative mathematical weights:
  // Base (10) + Moratorium (40) + Precedent (0.88 * 35 = 31) + Timely Intimation (15) = ~96 pts
  assert.ok(prob.score >= 80, `Expected score >= 80, received ${prob.score}`);
  assert.strictEqual(prob.verdict, 'High Probability of Overturn');
  assert.ok(prob.factors.length >= 3, 'Must return transparent factor breakdown for visual UI display');
});
