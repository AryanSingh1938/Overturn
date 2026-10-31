/**
 * Core Type Definitions for Project Overturn Frontend
 * Direct reflection of server schemas, routes, and responses.
 */

export interface ExtractedFacts {
  insurer_name: string;
  policy_number: string;
  claim_id: string;
  patient_name: string;
  hospital_name: string;
  denial_amount: number;
  rejection_date: string;
  policy_duration_months: number;
  raw_stated_grounds: string;
  statutory_clause: string;
  summary_reason: string;
  confidence_score?: number;
  document_type?: string;
}

export interface MoratoriumViolation {
  breached: boolean;
  code: string;
  statute: string;
  title: string;
  explanation: string;
  severity: 'CRITICAL' | 'INFO';
}

export interface Deadlines {
  rejectionDate: string;
  statutoryLimitationDate: string;
  daysUntilStatutoryBarred: number;
  isTimeBarred: boolean;
  insurerGroDeadline30d: string;
  daysRemainingGro: number;
  isValid: boolean;
}

export interface PecuniaryLimit {
  withinOmbudsmanLimit: boolean;
  cap: number;
  claimAmount: number;
  recommendation: string;
  note: string;
}

export interface WinProbabilityFactor {
  title: string;
  points: number;
  positive: boolean;
  description: string;
}

export interface WinProbability {
  score: number;
  verdict: string;
  factors: WinProbabilityFactor[];
  moratorium?: MoratoriumViolation;
  deadlines?: Deadlines;
  pecuniary?: PecuniaryLimit;
}

export interface AnalysisResponse {
  success: boolean;
  usedAiVision?: boolean;
  extracted_facts: ExtractedFacts;
  moratorium_violation: MoratoriumViolation;
  deadlines: Deadlines;
  win_probability: WinProbability;
  telemetry?: {
    timestamp: string;
    ocr_latency_ms: number;
    memory_storage_purge: string;
  };
  error?: string;
}

export interface Precedent {
  dataset?: string;
  court: string;
  case_id: string;
  case_name: string;
  judgment_date?: string | Date;
  year?: number;
  source_s3_key?: string;
  public_url?: string;
  grounds?: string[];
  chunk_text: string;
  key_holding?: string;
  ratio_decidendi?: string;
  similarity_score?: number;
}

export interface PrecedentSearchResponse {
  success: boolean;
  abstained: boolean;
  usedAtlasVector?: boolean;
  threshold?: number;
  maxScore?: number;
  count?: number;
  message?: string;
  precedents: Precedent[];
  error?: string;
}

export interface CitationVerificationItem {
  case_id: string;
  case_name: string;
  court: string;
  presentInDraft: boolean;
  verifiedInCorpus: boolean;
}

export interface CitationVerification {
  isValid: boolean;
  citedCount: number;
  unverifiedCount: number;
  citations: CitationVerificationItem[];
}

export interface AppealResponse {
  success: boolean;
  appeal_markdown: string;
  verification: CitationVerification;
  telemetry?: {
    generated_at: string;
    precedents_cited_count: number;
    is_grounded: boolean;
  };
  error?: string;
}

export interface Milestone {
  day: number;
  title: string;
  completed: boolean;
  date: string;
}

export interface CaseStatus {
  claimId: string;
  trackingToken: string;
  insurerName: string;
  destinationEmail?: string;
  dispatchedAt: string;
  statutoryDeadline30d: string;
  daysRemaining: number;
  status: string;
  appealMarkdown?: string;
  extractedFacts?: ExtractedFacts;
  milestones: Milestone[];
}

export interface CaseStatusResponse {
  success: boolean;
  source?: 'cache' | 'database' | 'simulated';
  case: CaseStatus;
  error?: string;
}

export interface DispatchPayload {
  claimId: string;
  insurerName: string;
  groEmail?: string;
  appealMarkdown: string;
  extractedFacts: Partial<ExtractedFacts>;
  humanConfirmed: boolean;
}

export interface DispatchResponse {
  success: boolean;
  claimId: string;
  trackingToken: string;
  destinationEmail: string;
  emailSent: boolean;
  messageId: string;
  statutoryDeadline30d: string;
  daysRemaining: number;
  caseData?: CaseStatus;
  error?: string;
}

export interface GroContact {
  insurer_name: string;
  email: string;
  toll_free?: string;
  escalation_portal?: string;
}

export interface GroDirectoryResponse {
  success: boolean;
  count: number;
  contacts: GroContact[];
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  claimsCount?: number;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  ai_runtime: {
    model_id: string;
    embedding_model_id: string;
    api_key_configured: boolean;
  };
  database: {
    connected: boolean;
  };
  statutory_disclaimer: string;
}

