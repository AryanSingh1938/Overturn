import { AnalysisResponse, Precedent, CaseStatus, GroContact } from '../types';

/**
 * Fictional sample datasets for explicit Demo Mode ONLY.
 * Never silently substituted when in Real Backend Mode.
 */

export const DEMO_EXTRACTED_ANALYSIS: AnalysisResponse = {
  success: true,
  usedAiVision: false,
  extracted_facts: {
    insurer_name: 'Star Health & Allied Insurance Co. Ltd.',
    policy_number: 'STAR-COMP-2018-847291',
    claim_id: 'CLM-DEL-2024-9182',
    patient_name: 'Ramesh Kumar Verma',
    hospital_name: 'Max Super Speciality Hospital, New Delhi',
    denial_amount: 285000,
    rejection_date: '2024-10-15',
    policy_duration_months: 68,
    raw_stated_grounds: 'Repudiation under Clause 4.2: Permanent Exclusion of Pre-Existing Disease. Insured failed to disclose antecedent history of mild hypertension during proposal inception.',
    statutory_clause: 'Clause 4.2 (Pre-Existing Disease Non-Disclosure)',
    summary_reason: 'Hospitalization reimbursement denied citing non-disclosure of antecedent hypertension, despite 5+ years of continuous policy coverage.',
    confidence_score: 0.96,
    document_type: 'Health Insurance Repudiation Letter',
  },
  moratorium_violation: {
    breached: true,
    code: 'IRDAI_MORATORIUM_BREACH',
    statute: 'IRDAI Master Circular on Protection of Policyholders\' Interests, 2024 (Section 6)',
    title: 'Statutory 60-Month Moratorium Protection Breach',
    explanation: 'Policy has been continuously active for 68 months (>60 months). Under IRDAI statutory regulations, insurers are strictly barred from repudiating claims based on pre-existing diseases after 60 continuous months of coverage.',
    severity: 'CRITICAL',
  },
  deadlines: {
    rejectionDate: '2024-10-15T00:00:00.000Z',
    statutoryLimitationDate: '2025-10-15T00:00:00.000Z',
    daysUntilStatutoryBarred: 349,
    isTimeBarred: false,
    insurerGroDeadline30d: '2024-11-14T00:00:00.000Z',
    daysRemainingGro: 14,
    isValid: true,
  },
  win_probability: {
    score: 88,
    verdict: 'High Probability of Overturn',
    factors: [
      {
        title: 'IRDAI 60-Month Moratorium Rule Violation',
        points: 40,
        positive: true,
        description: 'Policy exceeds 5 continuous years (68 months); non-disclosure repudiations are statutorily barred.',
      },
      {
        title: 'Supreme Court & High Court Precedent Alignment',
        points: 33,
        positive: true,
        description: 'Matched Manmohan Nanda v. United India Assurance (88% semantic similarity).',
      },
      {
        title: 'Timely Appeal within Limitation Period',
        points: 13,
        positive: true,
        description: '349 days remaining before statutory 1-year cutoff (Rule 14(3)).',
      },
      {
        title: 'Full Ombudsman Pecuniary Jurisdiction',
        points: 12,
        positive: true,
        description: 'Claim of ₹2,85,000 is well within the ₹30,00,000 Insurance Ombudsman statutory cap.',
      },
    ],
    pecuniary: {
      withinOmbudsmanLimit: true,
      cap: 3000000,
      claimAmount: 285000,
      recommendation: 'Insurance Ombudsman Bench',
      note: 'Claim of ₹2,85,000 is within the ₹30,00,000 statutory limit under Rule 17.',
    },
  },
  telemetry: {
    timestamp: new Date().toISOString(),
    ocr_latency_ms: 120,
    memory_storage_purge: 'demo_buffer_purged',
  },
};

export const DEMO_PRECEDENTS: Precedent[] = [
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 4092 of 2022',
    case_name: 'Manmohan Nanda v. United India Assurance Co. Ltd.',
    judgment_date: '2021-12-06',
    year: 2021,
    source_s3_key: 's3://indian-supreme-court-judgments/2021/civil_appeal_4092_2022.pdf',
    public_url: 'https://main.sci.gov.in/supremecourt/2021/4092/4092_2021_31_1501_32349_Judgement_06-Dec-2021.pdf',
    grounds: ['pre_existing_disease', 'repudiation', 'hyperlipidemia', 'disclosure'],
    chunk_text: 'The insurer cannot repudiate a claim on the ground of non-disclosure of a condition unless the insurer demonstrates that the non-disclosed condition had a direct nexus to the illness for which hospitalization or treatment occurred. Furthermore, ordinary lifestyle disorders cannot be conflated with fraudulent suppression.',
    key_holding: 'Non-disclosure of routine lifestyle symptoms does not justify repudiation unless direct causal nexus to the acute condition is affirmatively proven by the insurer.',
    similarity_score: 0.88,
  },
  {
    dataset: 'supreme_court',
    court: 'Supreme Court of India',
    case_id: 'Civil Appeal No. 8245 of 2015',
    case_name: 'Sulbha Prakash Motegaonkar v. Life Insurance Corporation of India',
    judgment_date: '2015-10-05',
    year: 2015,
    source_s3_key: 's3://indian-supreme-court-judgments/2015/civil_appeal_8245_2015.pdf',
    public_url: 'https://main.sci.gov.in/supremecourt/2015/8245/8245_2015_Judgement_05-Oct-2015.pdf',
    grounds: ['pre_existing_disease', 'moratorium', 'non_disclosure', 'nexus'],
    chunk_text: 'A failure to disclose a disease that has no connection with the cause of hospitalization cannot justify repudiation of the policy. Repudiation on purely hyper-technical omissions when continuous coverage has subsisted is legally unsustainable.',
    key_holding: 'Repudiation requires a direct, medically established nexus between the undisclosed condition and the cause of hospitalization.',
    similarity_score: 0.82,
  },
  {
    dataset: 'high_court',
    court: 'Delhi High Court',
    case_id: 'Writ Petition (C) No. 5444 of 2018',
    case_name: 'Jai Kishan v. National Insurance Co. Ltd.',
    judgment_date: '2019-02-14',
    year: 2019,
    source_s3_key: 's3://indian-high-court-judgments/delhi/2019/wp_5444_2018.pdf',
    public_url: 'https://delhihighcourt.nic.in/court/dhcqrydisp_o.asp?pn=5444&yr=2018',
    grounds: ['moratorium', 'pre_existing_disease', 'irdai_circular', 'continuous_coverage'],
    chunk_text: 'Where a policyholder has continuously paid premiums without interruption for more than four years, the insurer is estopped from setting up a defense of pre-existing condition unless clear fraud is demonstrated. The regulatory circulars of IRDAI bind the insurer strictly.',
    key_holding: 'Statutory moratorium directives strictly bind insurance carriers; continuous policy renewals estop retrospective pre-existing disease repudiation.',
    similarity_score: 0.79,
  },
];

export const DEMO_CASE_STATUS: CaseStatus = {
  claimId: 'CLM-DEL-2024-9182',
  trackingToken: 'OT-2024-819241',
  insurerName: 'Star Health & Allied Insurance Co. Ltd.',
  destinationEmail: 'gro@starhealth.in',
  dispatchedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  statutoryDeadline30d: new Date(Date.now() + 25 * 86400000).toISOString(),
  daysRemaining: 25,
  status: 'DISPATCHED',
  extractedFacts: DEMO_EXTRACTED_ANALYSIS.extracted_facts,
  milestones: [
    { day: 0, title: 'Formal Representation Dispatched', completed: true, date: new Date(Date.now() - 5 * 86400000).toISOString() },
    { day: 15, title: 'Insurer Grievance Intermediary Follow-up', completed: false, date: new Date(Date.now() + 10 * 86400000).toISOString() },
    { day: 30, title: 'Statutory 30-Day Cure Window Closes', completed: false, date: new Date(Date.now() + 25 * 86400000).toISOString() },
    { day: 31, title: 'Pre-filled Ombudsman Form VI Package Unlocks', completed: false, date: new Date(Date.now() + 26 * 86400000).toISOString() },
  ],
};

export const DEMO_CARE_CASE_STATUS: CaseStatus = {
  claimId: 'CLM-CHIL-2024-441092',
  trackingToken: 'OT-2024-441092',
  insurerName: 'Care Health Insurance Limited',
  destinationEmail: 'gro@careinsurance.com',
  dispatchedAt: new Date(Date.now() - 32 * 86400000).toISOString(),
  statutoryDeadline30d: new Date(Date.now() - 2 * 86400000).toISOString(),
  daysRemaining: 0,
  status: 'CURE_WINDOW_CONCLUDED',
  extractedFacts: {
    claim_id: 'CLM-CHIL-2024-441092',
    insurer_name: 'Care Health Insurance Limited',
    policy_number: '14092182/00/00',
    patient_name: 'Sunita Verma',
    hospital_name: 'Fortis Hospital, Gurugram',
    denial_amount: 242800,
    rejection_date: '2024-11-05',
    policy_duration_months: 60,
    raw_stated_grounds: 'Expenses related to any admission primarily for diagnostic and evaluation purposes only are excluded. Any hospitalization which is not medically necessary or where the patient could have been managed conservatively in an outpatient / OPD setting is outside coverage scope.',
    statutory_clause: 'Clause 5.14',
    summary_reason: 'Hospitalization deemed medically unnecessary in an inpatient setting.',
    confidence_score: 0.95,
    document_type: 'Health Insurance Repudiation Letter',
  },
  milestones: [
    { day: 0, title: 'Formal Representation Dispatched', completed: true, date: new Date(Date.now() - 32 * 86400000).toISOString() },
    { day: 15, title: 'Insurer Grievance Intermediary Follow-up', completed: true, date: new Date(Date.now() - 17 * 86400000).toISOString() },
    { day: 30, title: 'Statutory 30-Day Cure Window Closes', completed: true, date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { day: 31, title: 'Pre-filled Ombudsman Form VI Package Unlocks', completed: true, date: new Date(Date.now() - 1 * 86400000).toISOString() },
  ],
};

export const DEMO_ALL_CASES: CaseStatus[] = [
  DEMO_CASE_STATUS,
  DEMO_CARE_CASE_STATUS,
];

export const DEMO_GRO_CONTACTS: GroContact[] = [
  { insurer_name: 'Star Health & Allied Insurance Co. Ltd.', email: 'gro@starhealth.in', toll_free: '1800-425-2255', escalation_portal: 'https://www.starhealth.in/grievance-redressal' },
  { insurer_name: 'Care Health Insurance Ltd.', email: 'gro@careinsurance.com', toll_free: '1800-102-4488', escalation_portal: 'https://www.careinsurance.com/customer-support' },
  { insurer_name: 'HDFC ERGO General Insurance Co. Ltd.', email: 'grievance@hdfcergo.com', toll_free: '1800-2666-400', escalation_portal: 'https://www.hdfcergo.com/customer-care' },
  { insurer_name: 'ICICI Lombard General Insurance Co. Ltd.', email: 'customersupport@icicilombard.com', toll_free: '1800-2666', escalation_portal: 'https://www.icicilombard.com/grievance' },
  { insurer_name: 'Niva Bupa Health Insurance Co. Ltd.', email: 'customercare@nivabupa.com', toll_free: '1860-500-8888', escalation_portal: 'https://www.nivabupa.com/customer-service' },
  { insurer_name: 'Bajaj Allianz General Insurance Co. Ltd.', email: 'grievance@bajajallianz.co.in', toll_free: '1800-209-5858', escalation_portal: 'https://www.bajajallianz.com' },
  { insurer_name: 'The New India Assurance Co. Ltd.', email: 'gro.claims@newindia.co.in', toll_free: '1800-209-1415', escalation_portal: 'https://www.newindia.co.in' },
  { insurer_name: 'United India Insurance Co. Ltd.', email: 'customercare@uiic.co.in', toll_free: '1800-425-33333', escalation_portal: 'https://uiic.co.in' },
  { insurer_name: 'Tata AIG General Insurance Co. Ltd.', email: 'customersupport@tataaig.com', toll_free: '1800-266-7780', escalation_portal: 'https://www.tataaig.com' },
  { insurer_name: 'SBI General Insurance Co. Ltd.', email: 'customer.care@sbigeneral.in', toll_free: '1800-102-1111', escalation_portal: 'https://www.sbigeneral.in' },
  { insurer_name: 'Aditya Birla Health Insurance Co. Ltd.', email: 'care.healthinsurance@adityabirlacapital.com', toll_free: '1800-270-7000', escalation_portal: 'https://www.adityabirlacapital.com/healthinsurance' },
  { insurer_name: 'ManipalCigna Health Insurance Co. Ltd.', email: 'customercare@manipalcigna.com', toll_free: '1800-102-4462', escalation_portal: 'https://www.manipalcigna.com' },
  { insurer_name: 'National Insurance Co. Ltd.', email: 'gro@nic.co.in', toll_free: '1800-345-0330', escalation_portal: 'https://nationalinsurance.nic.co.in' },
  { insurer_name: 'The Oriental Insurance Co. Ltd.', email: 'gro@orientalinsurance.co.in', toll_free: '1800-11-8485', escalation_portal: 'https://orientalinsurance.org.in' },
  { insurer_name: 'Reliance General Insurance Co. Ltd.', email: 'services.rgicl@relianceada.com', toll_free: '1800-3009', escalation_portal: 'https://www.reliancegeneral.co.in' },
];

