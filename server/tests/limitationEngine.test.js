const test = require('node:test');
const assert = require('node:assert');
const {
  evaluateDeadlines,
  evaluateMaintainability,
  evaluatePecuniaryLimit,
  evaluateMoratoriumRule,
  calculateWinProbability,
} = require('../engine/limitationEngine');

test('Rule 14(3): Calculates 365-day statutory limitation cutoff accurately', () => {
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 30);
  const result = evaluateDeadlines(recentDate);

  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.isTimeBarred, false);
  assert.ok(result.daysUntilStatutoryBarred > 300);

  // Time-barred test (> 365 days)
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 400);
  const oldResult = evaluateDeadlines(oldDate);
  assert.strictEqual(oldResult.isTimeBarred, true);
});

test('Rule 14(5): Maintains bar if concurrent court proceeding is pending', () => {
  const clean = evaluateMaintainability({ hasConcurrentCourtProceeding: false });
  assert.strictEqual(clean.maintainable, true);

  const barred = evaluateMaintainability({ hasConcurrentCourtProceeding: true });
  assert.strictEqual(barred.maintainable, false);
  assert.strictEqual(barred.barRule, 'Rule 14(5) Insurance Ombudsman Rules');
});

test('Rule 17: Checks ₹30,00,000 pecuniary compensation cap', () => {
  const underLimit = evaluatePecuniaryLimit(285000); // 2.85 Lakhs
  assert.strictEqual(underLimit.withinOmbudsmanLimit, true);

  const overLimit = evaluatePecuniaryLimit(3500000); // 35 Lakhs
  assert.strictEqual(overLimit.withinOmbudsmanLimit, false);
});

test('IRDAI Master Circular 2024 (Section 6): Detects 60-Month Moratorium breach', () => {
  const breach = evaluateMoratoriumRule(68, 'Repudiation under Clause 4.2: Pre-existing condition non-disclosure');
  assert.strictEqual(breach.breached, true);
  assert.strictEqual(breach.code, 'IRDAI_MORATORIUM_BREACH');

  const underThreshold = evaluateMoratoriumRule(24, 'Clause 4.2: Pre-existing condition');
  assert.strictEqual(underThreshold.breached, false);
});

test('Win-Probability Engine computes calibrated score', () => {
  const prob = calculateWinProbability({
    policyDurationMonths: 68,
    denialGrounds: 'Clause 4.2 Pre-existing non-disclosure',
    claimAmount: 285000,
    rejectionDate: new Date(),
    maxSimilarityScore: 0.88,
    hasDirectPrecedent: true,
  });

  assert.ok(prob.score >= 80, `Expected score >= 80, received ${prob.score}`);
  assert.strictEqual(prob.verdict, 'High Probability of Overturn');
});

