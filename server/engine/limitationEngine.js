/**
 * Deterministic Limitation & Regulatory Rules Engine
 * Implements pure-code evaluation for statutory limits, procedural bars,
 * and empirical win-probability scoring without LLM subjectivity.
 */

const OMBUDSMAN_MAX_COMPENSATION_INR = 3000000; // ₹30 Lakhs (Rule 17)
const STATUTORY_LIMITATION_DAYS = 365;          // 1 Year (Rule 14(3))
const MORATORIUM_MONTHS_THRESHOLD = 60;         // 5 continuous years (IRDAI 2024 Section 6)

/**
 * Calculates statutory deadlines and flags limitation status
 */
function evaluateDeadlines(rejectionDate = new Date(), dispatchDate = null) {
  const rej = new Date(rejectionDate);
  if (isNaN(rej.getTime())) {
    return {
      isValid: false,
      error: 'Invalid rejection date provided',
    };
  }

  const statutoryLimitationDate = new Date(rej);
  statutoryLimitationDate.setDate(statutoryLimitationDate.getDate() + STATUTORY_LIMITATION_DAYS);

  const now = new Date();
  const msRemaining = statutoryLimitationDate.getTime() - now.getTime();
  const daysUntilStatutoryBarred = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  const isTimeBarred = daysUntilStatutoryBarred <= 0;

  // 30-day insurer GRO response window
  const anchorDate = dispatchDate ? new Date(dispatchDate) : now;
  const groDeadline30d = new Date(anchorDate);
  groDeadline30d.setDate(groDeadline30d.getDate() + 30);

  const msGroRemaining = groDeadline30d.getTime() - now.getTime();
  const daysRemainingGro = Math.max(0, Math.ceil(msGroRemaining / (1000 * 60 * 60 * 24)));

  return {
    rejectionDate: rej.toISOString(),
    statutoryLimitationDate: statutoryLimitationDate.toISOString(),
    daysUntilStatutoryBarred,
    isTimeBarred,
    insurerGroDeadline30d: groDeadline30d.toISOString(),
    daysRemainingGro,
    isValid: true,
  };
}

/**
 * Evaluates Rule 14(5) Maintainability Bar
 */
function evaluateMaintainability({ hasConcurrentCourtProceeding = false, previousArbitration = false }) {
  if (hasConcurrentCourtProceeding || previousArbitration) {
    return {
      maintainable: false,
      barRule: 'Rule 14(5) Insurance Ombudsman Rules',
      reason: 'A complaint cannot be entertained by the Ombudsman if the matter is currently pending before, or has been decided by, any court, consumer forum, or arbitrator.',
    };
  }
  return {
    maintainable: true,
    barRule: null,
    reason: 'Clear of statutory maintainability bars under Rule 14(5).',
  };
}

/**
 * Evaluates Pecuniary Jurisdiction under Rule 17(1)
 */
function evaluatePecuniaryLimit(claimAmount = 0) {
  const numericAmount = Number(claimAmount) || 0;
  if (numericAmount > OMBUDSMAN_MAX_COMPENSATION_INR) {
    return {
      withinOmbudsmanLimit: false,
      cap: OMBUDSMAN_MAX_COMPENSATION_INR,
      claimAmount: numericAmount,
      recommendation: 'State Consumer Disputes Redressal Commission (SCDRC)',
      note: `Claim exceeds the ₹30,00,000 Insurance Ombudsman statutory cap. Escalate directly to District/State Consumer Commission via e-Daakhil.`,
    };
  }
  return {
    withinOmbudsmanLimit: true,
    cap: OMBUDSMAN_MAX_COMPENSATION_INR,
    claimAmount: numericAmount,
    recommendation: 'Insurance Ombudsman Bench',
    note: `Claim of ₹${numericAmount.toLocaleString('en-IN')} is within the ₹30,00,000 statutory limit under Rule 17.`,
  };
}

/**
 * Evaluates IRDAI Master Circular 2024 Section 6 (Moratorium Rule)
 */
function evaluateMoratoriumRule(policyDurationMonths = 0, denialGrounds = '') {
  const duration = Number(policyDurationMonths) || 0;
  const isPreExistingRelated = /pre[- ]?existing|ped|non[- ]?disclosure|clause\s*4\.[12]|hypertension|diabetes|prior|moratorium/i.test(denialGrounds);

  if (duration >= MORATORIUM_MONTHS_THRESHOLD && isPreExistingRelated) {
    return {
      breached: true,
      code: 'IRDAI_MORATORIUM_BREACH',
      statute: 'IRDAI Master Circular on Protection of Policyholders\' Interests, 2024 (Section 6)',
      title: 'Statutory 60-Month Moratorium Protection Breach',
      explanation: `Policy has been continuously active for ${duration} months (>60 months). Under IRDAI statutory regulations, insurers are strictly barred from repudiating claims based on pre-existing diseases after 60 continuous months of coverage.`,
      severity: 'CRITICAL',
    };
  }

  return {
    breached: false,
    code: 'NO_MORATORIUM_BREACH',
    statute: 'IRDAI Master Circular 2024',
    title: 'Standard Repudiation Examination',
    explanation: duration < MORATORIUM_MONTHS_THRESHOLD
      ? `Policy duration (${duration} months) is under the 60-month mandatory moratorium threshold.`
      : 'Repudiation grounds do not appear directly related to pre-existing disease exclusions.',
    severity: 'INFO',
  };
}

/**
 * Computes deterministic Win-Probability Score & Breakdown
 */
function calculateWinProbability({
  policyDurationMonths = 60,
  denialGrounds = '',
  claimAmount = 0,
  rejectionDate = new Date(),
  maxSimilarityScore = 0.85,
  hasDirectPrecedent = true,
}) {
  let score = 0;
  const factors = [];

  const moratorium = evaluateMoratoriumRule(policyDurationMonths, denialGrounds);
  if (moratorium.breached) {
    score += 40;
    factors.push({
      title: 'IRDAI 60-Month Moratorium Rule Violation',
      points: 40,
      positive: true,
      description: 'Policy exceeds 5 continuous years; non-disclosure repudiations are statutorily barred.',
    });
  } else {
    score += 15;
    factors.push({
      title: 'General Regulatory Standing',
      points: 15,
      positive: true,
      description: 'Standard regulatory appeal window under IRDAI guidelines.',
    });
  }

  // Precedent vector match strength
  if (hasDirectPrecedent && maxSimilarityScore >= 0.72) {
    const precedentPoints = Math.min(35, Math.round(maxSimilarityScore * 38));
    score += precedentPoints;
    factors.push({
      title: 'Supreme Court & High Court Precedent Alignment',
      points: precedentPoints,
      positive: true,
      description: `Matched verified judicial rulings with ${(maxSimilarityScore * 100).toFixed(1)}% semantic similarity.`,
    });
  } else {
    score += 10;
    factors.push({
      title: 'Statutory Textual Merits',
      points: 10,
      positive: true,
      description: 'Evaluating under standard consumer protection doctrines.',
    });
  }

  // Limitation timeliness
  const deadlines = evaluateDeadlines(rejectionDate);
  if (deadlines.isTimeBarred) {
    score = Math.max(10, score - 50);
    factors.push({
      title: 'Statutory Limitation Barred (Over 365 Days)',
      points: -50,
      positive: false,
      description: 'Repudiation order is older than 1 year; Ombudsman maintainability is severely limited.',
    });
  } else if (deadlines.daysUntilStatutoryBarred > 180) {
    score += 13;
    factors.push({
      title: 'Timely Appeal within Limitation Period',
      points: 13,
      positive: true,
      description: `${deadlines.daysUntilStatutoryBarred} days remaining before statutory cutoff (Rule 14(3)).`,
    });
  } else {
    score += 5;
    factors.push({
      title: 'Approaching Limitation Deadline',
      points: 5,
      positive: true,
      description: `${deadlines.daysUntilStatutoryBarred} days remaining. Swift escalation is required.`,
    });
  }

  // Pecuniary jurisdiction
  const pecuniary = evaluatePecuniaryLimit(claimAmount);
  if (pecuniary.withinOmbudsmanLimit) {
    score += 12;
    factors.push({
      title: 'Full Ombudsman Pecuniary Jurisdiction',
      points: 12,
      positive: true,
      description: `Claim amount is within the ₹30,00,000 threshold for rapid 30-day statutory binding resolution.`,
    });
  } else {
    score -= 10;
    factors.push({
      title: 'Exceeds Ombudsman Pecuniary Cap',
      points: -10,
      positive: false,
      description: `Claim exceeds ₹30L; requires State Consumer Commission filing instead of single-tier Ombudsman.`,
    });
  }

  // Normalize final score
  const finalScore = Math.min(96, Math.max(18, score));

  let verdict = 'Moderate Overturn Probability';
  if (finalScore >= 80) verdict = 'High Probability of Overturn';
  else if (finalScore < 50) verdict = 'Low Overturn Likelihood (Procedural Hurdles)';

  return {
    score: finalScore,
    verdict,
    moratorium,
    deadlines,
    pecuniary,
    factors,
  };
}

module.exports = {
  OMBUDSMAN_MAX_COMPENSATION_INR,
  STATUTORY_LIMITATION_DAYS,
  MORATORIUM_MONTHS_THRESHOLD,
  evaluateDeadlines,
  evaluateMaintainability,
  evaluatePecuniaryLimit,
  evaluateMoratoriumRule,
  calculateWinProbability,
};

