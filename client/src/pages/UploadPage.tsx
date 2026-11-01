import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import AnalysisProgress from '../components/AnalysisProgress';
import claimApi from '../services/claimApi';
import { useAuth } from '../context/AuthContext';
import { DEMO_EXTRACTED_ANALYSIS } from '../data/mockData';
import {
  Shield,
  FileSearch,
  FileCheck,
  AlertCircle,
  Info,
  Scale,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();

  const handleAnalyze = async () => {
    setApiError(null);
    setIsLoading(true);

    try {
      // If a file is selected, ALWAYS send it to the live backend pipeline
      if (!selectedFile) {
        if (isDemoMode) {
          // Explicit Demo Mode fallback when no file was provided
          sessionStorage.setItem(
            'overturn_analysis_result',
            JSON.stringify(DEMO_EXTRACTED_ANALYSIS)
          );
          const claimId = DEMO_EXTRACTED_ANALYSIS.extracted_facts.claim_id;
          const safeId = encodeURIComponent(claimId.replace(/[\/\\]/g, '-'));
          navigate(`/analysis/${safeId}`);
          return;
        }
        throw new Error('Please select an insurance repudiation letter to upload.');
      }

      const formData = new FormData();
      formData.append('rejectionFile', selectedFile);
      if (user) {
        if (user.id) formData.append('userId', user.id);
        if (user.email) formData.append('userEmail', user.email);
        if (user.name) formData.append('userName', user.name);
      }

      // Call actual backend endpoint POST /api/v1/analyze-rejection
      const response = await claimApi.analyzeRejection(formData);

      if (!response.success) {
        throw new Error(response.error || 'Backend repudiation analysis failed.');
      }

      const claimId = response.extracted_facts?.claim_id || `CLM-${Date.now()}`;

      // Cache extracted analysis result in sessionStorage for instant retrieval on AnalysisPage
      sessionStorage.setItem('overturn_analysis_result', JSON.stringify(response));
      sessionStorage.setItem('overturn_current_claim_id', claimId);
      if (user?.email) {
        sessionStorage.setItem('overturn_current_user_email', user.email);
      }

      // Persist to user-scoped recent claims list in localStorage
      const userKey = user?.email
        ? `overturn_claims_${user.email.toLowerCase().trim()}`
        : user?.id
        ? `overturn_claims_${user.id}`
        : 'overturn_claims_guest';

      const existingStr = localStorage.getItem(userKey);
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
        userId: user?.id,
        userEmail: user?.email,
      };
      localStorage.setItem(userKey, JSON.stringify([newEntry, ...existing]));
      localStorage.removeItem('overturn_recent_claims');

      // Navigate directly to Analysis page with URL-safe claim ID
      const safeId = encodeURIComponent(claimId.replace(/[\/\\]/g, '-'));
      navigate(`/analysis/${safeId}`);
    } catch (err: any) {
      console.error('Audit Upload Failed:', err);
      setApiError(
        err.message ||
          'Failed to communicate with repudiation audit engine. Please verify backend service status.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSyntheticSample = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Dynamic claim reference unique per audit
      const syntheticClaimId = `CIR/${new Date().getFullYear()}/${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      const samplePayload = {
        insurer_name: 'Star Health and Allied Insurance Company Limited',
        policy_number: 'P/161112/01/2023/004521',
        claim_id: syntheticClaimId,
        patient_name: user?.name || 'Rajesh Sharma',
        hospital_name: 'Apollo Hospital, Delhi',
        denial_amount: 185000,
        rejection_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        policy_duration_months: 64,
        raw_stated_grounds:
          'Repudiation under Clause 4.1 read with Exclusion Clause Ex01 (Pre-Existing Diseases Waiting Period). Insured had past history of lumbar spondylitis not declared in proposal.',
        statutory_clause: 'Exclusion Clause Ex01 & Clause 4.1',
        summary_reason:
          'Hospitalization for acute appendicitis denied citing non-disclosure of unrelated past lumbar spondylitis.',
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
      };

      const response = await claimApi.analyzeRejection(samplePayload);
      if (response.success) {
        sessionStorage.setItem('overturn_analysis_result', JSON.stringify(response));
        sessionStorage.setItem('overturn_current_claim_id', syntheticClaimId);
        if (user?.email) {
          sessionStorage.setItem('overturn_current_user_email', user.email);
        }

        const claimId = response.extracted_facts.claim_id || syntheticClaimId;

        // Persist to user-scoped storage
        const userKey = user?.email
          ? `overturn_claims_${user.email.toLowerCase().trim()}`
          : user?.id
          ? `overturn_claims_${user.id}`
          : 'overturn_claims_guest';

        const existingStr = localStorage.getItem(userKey);
        const existing = existingStr ? JSON.parse(existingStr) : [];
        const newEntry = {
          claim_id: claimId,
          insurer_name: response.extracted_facts.insurer_name,
          patient_name: response.extracted_facts.patient_name,
          denial_amount: response.extracted_facts.denial_amount,
          rejection_date: response.extracted_facts.rejection_date,
          policy_duration_months: response.extracted_facts.policy_duration_months,
          moratorium_breached: response.moratorium_violation?.breached || false,
          score: response.win_probability?.score || 88,
          isDemo: false,
          userId: user?.id,
          userEmail: user?.email,
        };
        const filtered = Array.isArray(existing)
          ? existing.filter((item: any) => item.claim_id !== claimId)
          : [];
        localStorage.setItem(userKey, JSON.stringify([newEntry, ...filtered]));

        const safeId = encodeURIComponent(
          response.extracted_facts.claim_id.replace(/[\/\\]/g, '-')
        );
        navigate(`/analysis/${safeId}`);
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      sessionStorage.setItem(
        'overturn_analysis_result',
        JSON.stringify(DEMO_EXTRACTED_ANALYSIS)
      );

      const claimId = DEMO_EXTRACTED_ANALYSIS.extracted_facts.claim_id;
      const safeId = encodeURIComponent(claimId.replace(/[\/\\]/g, '-'));
      navigate(`/analysis/${safeId}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '820px', paddingTop: '3rem', paddingBottom: '4rem' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '4px 12px',
              backgroundColor: 'var(--color-royal-subtle)',
              color: 'var(--color-royal)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '0.85rem',
              border: '1px solid var(--color-royal-light)',
            }}
          >
            <Scale size={14} /> AUTONOMOUS STATUTORY AUDIT ENGINE
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'var(--color-navy)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Analyze Insurance Claim Rejection
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            Upload your repudiation letter for multimodal clause extraction, IRDAI statutory violation benchmarking, and Supreme Court precedent matching.
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>DEMO MODE ACTIVE:</strong> Uploading or running sample audits will use local simulated verification data without writing to live databases.
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

        {/* Multi-Stage Loading Progress (Shown during analysis) */}
        {isLoading ? (
          <AnalysisProgress isLoading={isLoading} />
        ) : (
          <>
            {/* File Upload Component */}
            <FileUpload
              onFileSelect={setSelectedFile}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />

            {/* Verification Sample Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: '2.25rem 0 1.5rem 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
              <span
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                Or test with verified sample repudiation
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
            </div>

            {/* Synthetic Sample Button */}
            <button
              type="button"
              onClick={handleUseSyntheticSample}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: '1px dashed var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <FileCheck size={16} color="var(--color-royal)" />
              <span>Load Verified Star Health Repudiation Sample (Appendectomy • Moratorium Breach)</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default UploadPage;
