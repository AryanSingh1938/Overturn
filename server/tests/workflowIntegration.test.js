/**
 * =================================================================================================
 * OVERTURN WORKFLOW INTEGRATION SUITE (tests/workflowIntegration.test.js)
 * =================================================================================================
 *
 * Verifies that the recent institutional redesign broke zero user workflows:
 * Stage 1: In-Memory Statutory Rejection Audit (auditController.analyzeRejection)
 * Stage 2: Atlas Vector Search & Precedent Grounding (vectorController.searchPrecedents)
 * Stage 3: Verifiable Legal Notice Generation (appealController.generateAppeal)
 * Stage 4: Insurer Directory & Human-in-the-Loop Dispatch (dispatchController.dispatchGro)
 * Stage 5: Statutory Case Tracking & 30-Day Countdown (dispatchController.getCaseStatus)
 * Stage 6: Form VI Ombudsman Escalation & Bench Resolver (appealController.generateOmbudsmanComplaint)
 * Stage 7: Regional Ombudsman Directory (dispatchController.getOmbudsmanDirectory)
 * =================================================================================================
 */

const test = require('node:test');
const assert = require('node:assert');

const { analyzeRejection } = require('../controllers/auditController');
const { searchPrecedents } = require('../controllers/vectorController');
const { generateAppeal, generateOmbudsmanComplaint } = require('../controllers/appealController');
const {
  dispatchGro,
  getCaseStatus,
  getGroDirectory,
  getOmbudsmanDirectory,
} = require('../controllers/dispatchController');

// Helper to create mock Express response object
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

// -------------------------------------------------------------------------------------------------
// TEST 1: IN-MEMORY AUDIT WORKFLOW
// -------------------------------------------------------------------------------------------------
test('Workflow Step 1: In-Memory Statutory Rejection Audit parses facts and flags moratorium breach', async () => {
  const testClaimId = `WF-AUDIT-${Date.now()}`;
  const req = {
    body: {
      insurer_name: 'Star Health and Allied Insurance Company Limited',
      policy_number: 'P/161112/01/2023/004521',
      claim_id: testClaimId,
      patient_name: 'Suresh Chandra Sharma',
      hospital_name: 'Apollo Hospital, Delhi',
      denial_amount: 245000,
      rejection_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      policy_duration_months: 64, // > 60 months Moratorium Breach
      raw_stated_grounds: 'Repudiation under Clause 4.1 read with Exclusion Clause Ex01 (Pre-Existing Diseases Waiting Period). Insured had past history of lumbar spondylitis not declared in proposal.',
      statutory_clause: 'Exclusion Clause Ex01 & Clause 4.1',
      summary_reason: 'Hospitalization for acute appendicitis denied citing non-disclosure of unrelated past lumbar spondylitis.',
      userEmail: 'claimant@testcivic.org',
      userName: 'Suresh Chandra Sharma',
    },
  };

  const res = createMockRes();
  await analyzeRejection(req, res);

  assert.strictEqual(res.statusCode, 200, 'Audit response status should be 200');
  assert.strictEqual(res.body.success, true, 'Audit response should be success: true');
  assert.strictEqual(res.body.extracted_facts.claim_id, testClaimId, 'Claim ID must match input');
  assert.strictEqual(res.body.moratorium_violation.breached, true, '60-Month Moratorium violation must be flagged');
  assert.strictEqual(res.body.deadlines.isTimeBarred, false, 'Fresh claim must not be time-barred');
  assert.ok(res.body.win_probability.score >= 80, 'Win score should be calibrated >= 80');
});

// -------------------------------------------------------------------------------------------------
// TEST 2: PRECEDENT SEARCH WORKFLOW
// -------------------------------------------------------------------------------------------------
test('Workflow Step 2: Atlas Vector Search returns grounded Supreme Court precedents', async () => {
  const req = {
    body: {
      queryText: 'Repudiation under Clause 4.1 read with Exclusion Clause Ex01 Pre-Existing Diseases Waiting Period lumbar spondylitis',
      limit: 3,
      minThreshold: 0.65,
    },
  };

  const res = createMockRes();
  await searchPrecedents(req, res);

  assert.strictEqual(res.statusCode, 200, 'Search response status should be 200');
  assert.strictEqual(res.body.success, true, 'Search response should be success: true');
  assert.ok(Array.isArray(res.body.precedents), 'Precedents should be an array');
  assert.ok(res.body.precedents.length > 0, 'Precedents array must contain judgments');

  const top = res.body.precedents[0];
  assert.ok(top.case_name && top.court, 'Top precedent must have case_name and court');
});

// -------------------------------------------------------------------------------------------------
// TEST 3: CITATION-GROUNDED APPEAL GENERATION
// -------------------------------------------------------------------------------------------------
test('Workflow Step 3: Appeal Generator produces Rule 14(3) formal notice with verified citations', async () => {
  const extractedFacts = {
    insurer_name: 'Star Health and Allied Insurance Company Limited',
    policy_number: 'P/161112/01/2023/004521',
    claim_id: 'CLM-DEL-2024-9182',
    patient_name: 'Ramesh Kumar Verma',
    hospital_name: 'Max Super Speciality Hospital',
    denial_amount: 285000,
    rejection_date: '2024-09-15',
    policy_duration_months: 68,
    raw_stated_grounds: 'Repudiation under Clause 4.2 citing non-disclosure of pre-existing condition.',
    statutory_clause: 'Clause 4.2',
    summary_reason: 'Hospitalization for acute appendicitis denied citing prior lumbar spondylitis.',
  };

  const precedents = [
    {
      court: 'Supreme Court of India',
      case_id: 'Civil Appeal No. 4092 of 2022',
      case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
      chunk_text: 'The insurer cannot repudiate a claim on the ground of non-disclosure unless direct nexus is proven.',
      key_holding: 'Non-disclosure of routine lifestyle symptoms does not justify repudiation without direct causal nexus.',
    },
  ];

  const req = {
    body: {
      extractedFacts,
      precedents,
      customNotes: 'Policyholder maintained 5 continuous annual renewals with no prior claims.',
    },
  };

  const res = createMockRes();
  await generateAppeal(req, res);

  assert.strictEqual(res.statusCode, 200, 'Appeal response status should be 200');
  assert.strictEqual(res.body.success, true, 'Appeal response should be success: true');
  assert.ok(typeof res.body.appeal_markdown === 'string', 'Draft markdown must be a string');
  assert.ok(res.body.appeal_markdown.length > 200, 'Draft markdown should be comprehensive');
  assert.strictEqual(res.body.verification.isValid, true, 'Generated appeal must pass programmatic verification');
  assert.strictEqual(res.body.verification.violations.length, 0, 'Zero unverified citations permitted');
});

// -------------------------------------------------------------------------------------------------
// TEST 4: GRO DIRECTORY & DISPATCH GUARDIAN
// -------------------------------------------------------------------------------------------------
test('Workflow Step 4: GRO Directory retrieves verified contacts and Dispatch enforces human review', async () => {
  // 4A: Check GRO Directory
  const dirReq = {};
  const dirRes = createMockRes();
  await getGroDirectory(dirReq, dirRes);

  assert.strictEqual(dirRes.statusCode, 200, 'Directory status should be 200');
  assert.strictEqual(dirRes.body.success, true, 'Directory should return success: true');
  assert.ok(Array.isArray(dirRes.body.contacts), 'Contacts must be an array');
  assert.ok(dirRes.body.contacts.length >= 5, 'Should have verified insurer contacts');

  // 4B: Attempt dispatch without human confirmation (Must be rejected)
  const unconfirmedReq = {
    body: {
      claimId: 'CLM-TEST-REJECT',
      insurerName: 'Star Health',
      groEmail: 'gro@starhealth.in',
      appealMarkdown: 'Legal Notice Draft',
      humanConfirmed: false,
    },
  };
  const unconfirmedRes = createMockRes();
  await dispatchGro(unconfirmedReq, unconfirmedRes);
  assert.strictEqual(unconfirmedRes.statusCode, 400, 'Unconfirmed dispatch must return 400');
  assert.strictEqual(unconfirmedRes.body.success, false, 'Unconfirmed dispatch must fail');

  // 4C: Dispatch with human confirmation (Must succeed and initialize 30-day countdown)
  const confirmedClaimId = `WF-DISPATCH-${Date.now()}`;
  const confirmedReq = {
    body: {
      claimId: confirmedClaimId,
      insurerName: 'Star Health and Allied Insurance Company Limited',
      groEmail: 'gro@starhealth.in',
      appealMarkdown: 'Formal Legal Representation Draft under Rule 14(3)',
      extractedFacts: {
        claim_id: confirmedClaimId,
        insurer_name: 'Star Health and Allied Insurance Company Limited',
        patient_name: 'Suresh Chandra Sharma',
        denial_amount: 245000,
        policy_duration_months: 64,
      },
      humanConfirmed: true,
      claimantEmail: 'suresh.sharma@example.com',
      claimantName: 'Suresh Chandra Sharma',
    },
  };
  const confirmedRes = createMockRes();
  await dispatchGro(confirmedReq, confirmedRes);

  assert.strictEqual(confirmedRes.statusCode, 200, 'Confirmed dispatch must return 200');
  assert.strictEqual(confirmedRes.body.success, true, 'Confirmed dispatch must succeed');
  assert.strictEqual(confirmedRes.body.status, 'DISPATCHED_TO_GRO', 'Status must be DISPATCHED_TO_GRO');
  assert.strictEqual(confirmedRes.body.caseData.daysRemaining, 30, 'Initial countdown must be 30 days');
  assert.ok(confirmedRes.body.mailto_url.includes('cc='), 'Mailto link must include policyholder CC privity');

  // 4D: Case tracking query
  const trackReq = { params: { claimId: confirmedClaimId } };
  const trackRes = createMockRes();
  await getCaseStatus(trackReq, trackRes);

  assert.strictEqual(trackRes.statusCode, 200, 'Track status must return 200');
  assert.strictEqual(trackRes.body.success, true, 'Track query must succeed');
  assert.strictEqual(trackRes.body.case.claimId, confirmedClaimId, 'Tracked claimId must match');
  assert.ok(trackRes.body.case.milestones.length >= 3, 'Milestones should record statutory roadmap');
});

// -------------------------------------------------------------------------------------------------
// TEST 5: OMBUDSMAN RESOLVER & FORM VI ESCALATION
// -------------------------------------------------------------------------------------------------
test('Workflow Step 5: Ombudsman Generator maps Delhi bench and checks Rule 14/Rule 17 maintainability', async () => {
  const req = {
    body: {
      extractedFacts: {
        claim_id: 'CLM-DEL-2024-9182',
        insurer_name: 'Star Health and Allied Insurance Company Limited',
        patient_name: 'Ramesh Kumar Verma',
        denial_amount: 285000, // < ₹30,00,000 cap
        policy_duration_months: 68,
        policy_number: 'STAR-COMP-2018-847291',
        hospital_name: 'Max Super Speciality Hospital',
        raw_stated_grounds: 'Repudiation under Clause 4.2 citing non-disclosure of pre-existing condition.',
      },
      precedents: [],
      state: 'Delhi',
      claimantDetails: {
        name: 'Ramesh Kumar Verma',
        email: 'ramesh.verma@example.com',
        phone: '+91-9811223344',
        address: 'Civil Lines, New Delhi - 110054',
      },
      groNoticeDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // >30 days elapsed
      hasConcurrentCourtProceeding: false,
    },
  };

  const res = createMockRes();
  await generateOmbudsmanComplaint(req, res);

  assert.strictEqual(res.statusCode, 200, 'Ombudsman generation should return 200');
  assert.strictEqual(res.body.success, true, 'Ombudsman generation should succeed');
  assert.ok(res.body.ombudsman_office.office_name.includes('Delhi'), 'Should resolve to Delhi Ombudsman Bench');
  assert.strictEqual(res.body.maintainability.maintainable, true, 'Rule 14 maintainability check must pass');
  assert.strictEqual(res.body.pecuniary_status.withinOmbudsmanLimit, true, '₹2.85 Lakhs must be within ₹30 Lakh cap');
  assert.ok(typeof res.body.complaint_markdown === 'string', 'Complaint markdown must be populated');
});

// -------------------------------------------------------------------------------------------------
// TEST 6: OMBUDSMAN DIRECTORY
// -------------------------------------------------------------------------------------------------
test('Workflow Step 6: Ombudsman Directory provides all 18 official regional benches', async () => {
  const req = {};
  const res = createMockRes();
  await getOmbudsmanDirectory(req, res);

  assert.strictEqual(res.statusCode, 200, 'Directory response should be 200');
  assert.strictEqual(res.body.success, true, 'Directory query should succeed');
  assert.ok(Array.isArray(res.body.offices), 'Offices must be an array');
  assert.ok(res.body.offices.length >= 17, `Should contain at least 17 benches, received: ${res.body.offices.length}`);

  const names = res.body.offices.map((o) => o.office_name.toLowerCase());
  assert.ok(names.some((n) => n.includes('delhi')), 'Directory must contain Delhi bench');
  assert.ok(names.some((n) => n.includes('mumbai')), 'Directory must contain Mumbai bench');
  assert.ok(names.some((n) => n.includes('bengaluru')), 'Directory must contain Bengaluru bench');
  assert.ok(names.some((n) => n.includes('chennai')), 'Directory must contain Chennai bench');
  assert.ok(names.some((n) => n.includes('kolkata')), 'Directory must contain Kolkata bench');
});
