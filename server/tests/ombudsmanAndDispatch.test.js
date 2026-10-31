const test = require('node:test');
const assert = require('node:assert');
const {
  generateDeterministicAppeal,
  resolveOmbudsmanOffice,
} = require('../controllers/appealController');
const { verifyCitations } = require('../verifier/citationVerifier');

test('Guardrail: generateDeterministicAppeal output is 100% citation-grounded', () => {
  const mockPrecedents = [
    {
      court: 'Supreme Court of India',
      case_id: 'Civil Appeal No. 4092 of 2022',
      case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
      chunk_text: 'The insurer cannot repudiate a claim on the ground of non-disclosure unless direct nexus is proven.',
    },
    {
      court: 'Supreme Court of India',
      case_id: 'Civil Appeal No. 8245 of 2015',
      case_name: 'Sulbha Prakash Motegaonkar v. Life Insurance Corporation of India',
      chunk_text: 'A failure to disclose a disease that has no connection with the cause of hospitalization cannot justify repudiation.',
    },
  ];

  const draft = generateDeterministicAppeal({
    insurerName: 'Star Health & Allied Insurance Co. Ltd.',
    policyNumber: 'STAR-COMP-2018-847291',
    claimId: 'CLM-DEL-2024-9182',
    patientName: 'Ramesh Kumar Verma',
    hospitalName: 'Max Super Speciality Hospital',
    denialAmount: 'INR 2,85,000',
    rawGrounds: 'Clause 4.2 Pre-existing non-disclosure',
    policyMonths: 68,
    precedents: mockPrecedents,
  });

  const verification = verifyCitations(draft, mockPrecedents);
  assert.strictEqual(verification.isValid, true, 'Draft should have zero citation violations');
  assert.strictEqual(verification.violations.length, 0);
  assert.ok(verification.verifiedCount >= 2, 'Should verify at least 2 authentic citations');
});

test('Anti-Hallucination: Verifier catches fake / hallucinated citations', () => {
  const mockPrecedents = [
    {
      court: 'Supreme Court of India',
      case_id: 'Civil Appeal No. 4092 of 2022',
      case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
      chunk_text: 'The insurer cannot repudiate without nexus.',
    },
  ];

  const fakeDraft = `
We cite the Supreme Court in Fake Lawyer v. Ghost Insurance Co. (Civil Appeal No. 9999 of 2099) 
and also John Doe v. Imaginary Health Ltd. (Civil Appeal No. 1234 of 2025).
`;

  const verification = verifyCitations(fakeDraft, mockPrecedents);
  assert.strictEqual(verification.isValid, false, 'Verifier must flag hallucinated citations');
  assert.ok(verification.violations.length >= 2, 'Must catch both fake citations');
});

test('Territorial Ombudsman Resolver: Maps states accurately to official benches', () => {
  const delhi = resolveOmbudsmanOffice('Delhi');
  assert.strictEqual(delhi.office_id, 'OIO_DELHI');
  assert.ok(delhi.email.includes('delhi'));

  const maharashtra = resolveOmbudsmanOffice('Maharashtra');
  assert.strictEqual(maharashtra.office_id, 'OIO_MUMBAI');

  const karnataka = resolveOmbudsmanOffice('Karnataka');
  assert.strictEqual(karnataka.office_id, 'OIO_BENGALURU');

  const tamilNadu = resolveOmbudsmanOffice('Tamil Nadu');
  assert.strictEqual(tamilNadu.office_id, 'OIO_CHENNAI');

  const gujarat = resolveOmbudsmanOffice('Gujarat');
  assert.strictEqual(gujarat.office_id, 'OIO_AHMEDABAD');
});

test('User Case Multi-Tenancy: Retrieves cases for a specific user email', async () => {
  const { getUserCases, dispatchGro } = require('../controllers/dispatchController');

  // Dispatch a case with claimantEmail
  const mockReq = {
    body: {
      claimId: 'CLM-USER-TEST-1',
      insurerName: 'Care Health Insurance Ltd.',
      groEmail: 'gro@careinsurance.com',
      appealMarkdown: 'Legal representation for user',
      extractedFacts: { patient_name: 'Aditi Rao', policy_number: 'CARE-1234' },
      humanConfirmed: true,
      claimantEmail: 'aditi.rao@example.com',
      claimantName: 'Aditi Rao',
    },
  };
  let dispatchedResponse = null;
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        dispatchedResponse = data;
        return data;
      },
    }),
  };

  await dispatchGro(mockReq, mockRes);
  assert.strictEqual(dispatchedResponse.success, true);
  assert.strictEqual(dispatchedResponse.claimantEmail, 'aditi.rao@example.com');
  assert.ok(dispatchedResponse.mailtoUrl.includes('aditi.rao%40example.com'));

  // Now query user cases by email
  const queryReq = { query: { email: 'aditi.rao@example.com' } };
  let userClaimsResponse = null;
  const queryRes = {
    status: (code) => ({
      json: (data) => {
        userClaimsResponse = data;
        return data;
      },
    }),
  };

  await getUserCases(queryReq, queryRes);
  assert.strictEqual(userClaimsResponse.success, true);
  assert.ok(userClaimsResponse.count >= 1);
  assert.strictEqual(userClaimsResponse.claims[0].claimantEmail, 'aditi.rao@example.com');
});
