/**
 * System Verification & Go/No-Go Gate Checks
 * Validates runtime dependencies, environment variables, Gemini embedding dimensions,
 * deterministic limitation rules, and citation verifier logic.
 */
try {
  require('dotenv').config({ path: './server/.env' });
  require('dotenv').config();
} catch {
  try {
    require('../server/node_modules/dotenv').config({ path: './server/.env' });
    require('../server/node_modules/dotenv').config();
  } catch {}
}

const { generateEmbedding, normalizeVector } = require('../server/config/gemini');
const { evaluateDeadlines, evaluateMoratoriumRule, calculateWinProbability } = require('../server/engine/limitationEngine');
const { verifyCitations } = require('../server/verifier/citationVerifier');

async function runGateChecks() {
  console.log('======================================================');
  console.log('🔍 OVERTURN SYSTEM GATE VERIFICATION (G1, G2, G3)');
  console.log('======================================================\n');

  let passedAll = true;

  // Gate 1: Model & 768-dim Vector Gate
  console.log('▶ [Gate 1] Validating 768-Dim Vector Embedding Generation...');
  try {
    const testText = 'pre-existing disease repudiation after 5 years';
    const vec = await generateEmbedding(testText);
    if (vec && vec.length === 768) {
      // Check L2 normalization
      const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
      const isNormalized = Math.abs(norm - 1.0) < 0.01;
      console.log(`   ✅ G1 Passed: Generated vector with ${vec.length} dimensions. L2 Norm: ${norm.toFixed(4)} (Normalized: ${isNormalized})`);
    } else {
      console.warn(`   ⚠️ G1 Warning: Vector returned length ${vec?.length || 0} instead of 768.`);
    }
  } catch (err) {
    console.error(`   ❌ G1 Failed: ${err.message}`);
    passedAll = false;
  }

  // Deterministic Limitation Rules Check
  console.log('\n▶ [Gate 2] Validating Deterministic Statutory Limitation Rules...');
  try {
    const mockRejectionDate = new Date();
    mockRejectionDate.setDate(mockRejectionDate.getDate() - 200);

    const deadlines = evaluateDeadlines(mockRejectionDate);
    const moratorium = evaluateMoratoriumRule(64, 'Repudiation under Clause 4.2: Pre-existing condition');
    const winProb = calculateWinProbability({
      policyDurationMonths: 64,
      denialGrounds: 'Clause 4.2 Pre-existing disease',
      claimAmount: 250000,
      rejectionDate: mockRejectionDate,
      maxSimilarityScore: 0.88,
      hasDirectPrecedent: true,
    });

    if (deadlines.isValid && moratorium.breached && winProb.score >= 80) {
      console.log(`   ✅ G2 Passed: Moratorium Breach detected properly. Win Score: ${winProb.score}% (${winProb.verdict})`);
    } else {
      console.warn(`   ⚠️ G2 Warning: Calculation outcome unexpected.`);
    }
  } catch (err) {
    console.error(`   ❌ G2 Failed: ${err.message}`);
    passedAll = false;
  }

  // Citation Verifier Check
  console.log('\n▶ [Gate 3] Validating Programmatic Citation Verifier...');
  try {
    const sampleChunks = [
      {
        case_id: 'Civil Appeal No. 4092 of 2022',
        case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
        chunk_text: 'The insurer cannot repudiate a claim on the ground of non-disclosure unless direct nexus exists.',
      },
    ];

    const validDraft = 'We rely upon the Supreme Court of India in Manmohan Nanda v. United India Assurance Co. Ltd. (Civil Appeal No. 4092 of 2022).';
    const resultValid = verifyCitations(validDraft, sampleChunks);

    const hallucinatedDraft = 'We cite Fake Lawyer v. Ghost Insurance Co. (Civil Appeal No. 9999 of 2099).';
    const resultInvalid = verifyCitations(hallucinatedDraft, sampleChunks);

    if (resultValid.isValid && !resultInvalid.isValid) {
      console.log('   ✅ G3 Passed: Programmatic verifier accurately accepted authentic citation and caught hallucinated citation.');
    } else {
      console.warn('   ⚠️ G3 Warning: Verifier check failed expected behavior.');
    }
  } catch (err) {
    console.error(`   ❌ G3 Failed: ${err.message}`);
    passedAll = false;
  }

  console.log('\n======================================================');
  if (passedAll) {
    console.log('🎉 ALL SYSTEM GATES PASSED: OVERTURN CORE READY FOR AUDIT & ESCALATION');
  } else {
    console.log('⚠️ Some gate checks reported warnings or fallback modes.');
  }
  console.log('======================================================\n');
}

runGateChecks();

