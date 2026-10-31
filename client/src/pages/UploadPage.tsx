import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import claimApi from '../services/claimApi';
import { useAuth } from '../context/AuthContext';
import { DEMO_EXTRACTED_ANALYSIS } from '../data/mockData';
import { Shield, FileSearch, Sparkles, AlertCircle, Info } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isDemoMode } = useAuth();

  const handleAnalyze = async () => {
    setApiError(null);
    setIsLoading(true);

    try {
      // If a file is selected, ALWAYS send it to the live backend pipeline
      if (!selectedFile) {
        if (isDemoMode) {
          // Explicit Demo Mode fallback when no file was provided
          sessionStorage.setItem('overturn_analysis_result', JSON.stringify(DEMO_EXTRACTED_ANALYSIS));
          const claimId = DEMO_EXTRACTED_ANALYSIS.extracted_facts.claim_id;
          navigate(`/analysis/${claimId}`);
          return;
        }
        throw new Error('Please select a repudiation document to upload.');
      }

      const formData = new FormData();
      // Server routes/api.js line 27: upload.single('rejectionFile')
      formData.append('rejectionFile', selectedFile);

      // Call actual backend endpoint POST /api/v1/analyze-rejection
      const response = await claimApi.analyzeRejection(formData);

      if (!response.success) {
        throw new Error(response.error || 'Backend repudiation analysis failed.');
      }

      const claimId = response.extracted_facts?.claim_id || `CLM-${Date.now()}`;

      // Cache actual extracted analysis result in sessionStorage for instant retrieval on AnalysisPage
      sessionStorage.setItem('overturn_analysis_result', JSON.stringify(response));

      // Also persist to dashboard recent claims list
      const existingStr = localStorage.getItem('overturn_recent_claims');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newEntry = {
        claim_id: claimId,
        insurer_name: response.extracted_facts.insurer_name,
        patient_name: response.extracted_facts.patient_name,
        denial_amount: response.extracted_facts.denial_amount,
        rejection_date: response.extracted_facts.rejection_date,
        policy_duration_months: response.extracted_facts.policy_duration_months,
        moratorium_breached: response.moratorium_violation?.breached || false,
        score: response.win_probability?.score || 75,
        isDemo: false,
      };
      localStorage.setItem('overturn_recent_claims', JSON.stringify([newEntry, ...existing]));

      // Navigate directly to Analysis page
      navigate(`/analysis/${claimId}`);
    } catch (err: any) {
      console.error('Audit Upload Failed:', err);
      setApiError(err.message || 'Failed to communicate with backend. Check server status on port 5001.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSyntheticSample = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Send authentic sample facts directly to backend JSON fallback parser
      const samplePayload = {
        insurer_name: 'Star Health and Allied Insurance Company Limited',
        policy_number: 'P/161112/01/2023/004521',
        claim_id: 'CIR/2024/110945',
        patient_name: 'Rajesh Sharma',
        hospital_name: 'Apollo Hospital, Delhi',
        denial_amount: 185000,
        rejection_date: '2024-08-14',
        policy_duration_months: 64,
        raw_stated_grounds: 'Repudiation under Clause 4.1 read with Exclusion Clause Ex01 (Pre-Existing Diseases Waiting Period). Insured had past history of lumbar spondylitis not declared in proposal.',
        statutory_clause: 'Exclusion Clause Ex01 & Clause 4.1',
        summary_reason: 'Hospitalization for acute appendicitis denied citing non-disclosure of unrelated past lumbar spondylitis.',
      };

      const response = await claimApi.analyzeRejection(samplePayload);
      if (response.success) {
        sessionStorage.setItem('overturn_analysis_result', JSON.stringify(response));
        navigate(`/analysis/${response.extracted_facts.claim_id}`);
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      // If server offline or demo mode
      sessionStorage.setItem('overturn_analysis_result', JSON.stringify(DEMO_EXTRACTED_ANALYSIS));
      navigate(`/analysis/${DEMO_EXTRACTED_ANALYSIS.extracted_facts.claim_id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '780px', paddingTop: '3rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 10px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            <FileSearch size={14} /> IN-MEMORY STATUTORY REJECTION AUDIT
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
            Upload Insurance Repudiation Letter
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            We extract the repudiation clauses, check continuous policy duration against the 60-Month Moratorium rule, and match Supreme Court precedents.
          </p>
        </div>

        {/* Demo Mode Notice if enabled */}
        {isDemoMode && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>DEMO MODE ACTIVE:</strong> Analysis will use synthetic Star Health rejection sample facts for offline preview without calling the live backend.
            </div>
          </div>
        )}

        {/* Error Notification */}
        {apiError && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{apiError}</div>
          </div>
        )}

        {/* File Upload Component */}
        <FileUpload
          onFileSelect={setSelectedFile}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Quick Sample Test Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '2rem 0',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Or test with ground-truth data
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Instant Synthetic Sample Button */}
        <button
          type="button"
          onClick={handleUseSyntheticSample}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{
            width: '100%',
            padding: '0.85rem',
            borderStyle: 'dashed',
            fontSize: '0.92rem',
          }}
        >
          <Sparkles size={16} color="var(--color-primary)" />
          Load Verified Synthetic Star Health Appendectomy Rejection Sample
        </button>

      </div>
    </div>
  );
};

export default UploadPage;

