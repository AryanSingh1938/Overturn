import apiClient from './api';
import {
  AnalysisResponse,
  PrecedentSearchResponse,
  AppealResponse,
  DispatchPayload,
  DispatchResponse,
  CaseStatusResponse,
  GroDirectoryResponse,
  HealthResponse,
  ExtractedFacts,
  Precedent,
  OmbudsmanComplaintPayload,
  OmbudsmanComplaintResponse,
  OmbudsmanDirectoryResponse,
  MyClaimsResponse,
} from '../types';

export const claimApi = {
  /**
   * Post repudiation document for OCR & regulatory auditing
   * Accepts FormData (with 'rejectionFile' field) or raw JSON facts
   */
  async analyzeRejection(payload: FormData | Partial<ExtractedFacts>): Promise<AnalysisResponse> {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.post<AnalysisResponse>(
      '/analyze-rejection',
      payload,
      isFormData
        ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        : undefined
    );
    return response.data;
  },

  /**
   * Search authentic Supreme Court & High Court precedents via 768-dim vector embeddings
   */
  async searchPrecedents(
    queryText: string,
    limit: number = 3,
    minThreshold?: number
  ): Promise<PrecedentSearchResponse> {
    const response = await apiClient.post<PrecedentSearchResponse>('/search-precedents', {
      queryText,
      limit,
      minThreshold,
    });
    return response.data;
  },

  /**
   * Synthesize citation-grounded formal appeal notice under Rule 14(3)
   */
  async generateAppeal(
    extractedFacts: ExtractedFacts,
    precedents: Precedent[],
    customNotes: string = ''
  ): Promise<AppealResponse> {
    const response = await apiClient.post<AppealResponse>('/generate-appeal', {
      extractedFacts,
      precedents,
      customNotes,
    });
    return response.data;
  },

  /**
   * Dispatch legal appeal to Insurer GRO with Human-in-the-Loop review confirmation
   */
  async dispatchGro(payload: DispatchPayload): Promise<DispatchResponse> {
    const response = await apiClient.post<DispatchResponse>('/dispatch-gro', payload);
    return response.data;
  },

  /**
   * Retrieve case timeline status and statutory countdown
   */
  async getCaseStatus(claimId: string): Promise<CaseStatusResponse> {
    const response = await apiClient.get<CaseStatusResponse>(`/case-status/${encodeURIComponent(claimId)}`);
    return response.data;
  },

  /**
   * Fetch verified list of Insurer Grievance Redressal Officers
   */
  async getGroDirectory(): Promise<GroDirectoryResponse> {
    const response = await apiClient.get<GroDirectoryResponse>('/gro-directory');
    return response.data;
  },

  /**
  /**
   * Generate statutory Form VI Complaint to Insurance Ombudsman under Rule 14(1)
   */
  async generateOmbudsmanComplaint(payload: OmbudsmanComplaintPayload): Promise<OmbudsmanComplaintResponse> {
    const response = await apiClient.post<OmbudsmanComplaintResponse>('/generate-ombudsman-complaint', payload);
    return response.data;
  },

  /**
   * Fetch verified list of all 18 Insurance Ombudsman Regional Benches
   */
  async getOmbudsmanDirectory(): Promise<OmbudsmanDirectoryResponse> {
    const response = await apiClient.get<OmbudsmanDirectoryResponse>('/ombudsman-directory');
    return response.data;
  },

  /**
   * Retrieve user claims from backend
   */
  async getMyClaims(params?: { email?: string; userId?: string }): Promise<MyClaimsResponse> {
    const response = await apiClient.get<MyClaimsResponse>('/my-claims', { params });
    return response.data;
  },

  /**
   * Fetch authentic benchmark sample cases directly from root data on the server
   */
  async getSampleCases(): Promise<{ success: boolean; cases: any[] }> {
    const response = await apiClient.get('/sample-cases');
    return response.data;
  },

  /**
   * Fetch specific benchmark sample analysis and case status by ID
   */
  async getSampleCase(id: string): Promise<{ success: boolean; analysis: AnalysisResponse; caseStatus: any }> {
    const response = await apiClient.get(`/sample-cases/${encodeURIComponent(id)}`);
    return response.data;
  },

  /**
   * Live backend health check and runtime status
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },
};

export default claimApi;

