import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CaseStatus } from '../types';
import Timeline from '../components/Timeline';
import claimApi from '../services/claimApi';
import {
  AlertCircle,
  ExternalLink,
  Download,
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [caseData, setCaseData] = useState<CaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Resolve effective claim ID: URL param -> sessionStorage recent claim -> sessionStorage analysis
    let effectiveClaimId = id ? id.trim() : '';

    if (!effectiveClaimId) {
      const storedClaimId = sessionStorage.getItem('overturn_current_claim_id');
      if (storedClaimId) {
        effectiveClaimId = storedClaimId.trim();
      } else {
        const storedAnalysis = sessionStorage.getItem('overturn_analysis_result');
        if (storedAnalysis) {
          try {
            const parsed = JSON.parse(storedAnalysis);
            if (parsed.extracted_facts?.claim_id) {
              effectiveClaimId = parsed.extracted_facts.claim_id.trim();
            }
          } catch {}
        }
      }
    }

    if (!effectiveClaimId) {
      setErrorMsg('No active claim ID provided. Please analyze a repudiation letter and dispatch your appeal first.');
      setIsLoading(false);
      return;
    }

    // 2. Check sessionStorage for instant display of recently dispatched case
    const cachedCase = sessionStorage.getItem(`overturn_case_${effectiveClaimId}`);
    let hadCached = false;
    if (cachedCase) {
      try {
        const parsedCase = JSON.parse(cachedCase);
        setCaseData(parsedCase);
        hadCached = true;
      } catch {}
    }

    if (!hadCached) {
      setIsLoading(true);
    }
    setErrorMsg(null);

    // 3. Fetch live case status from the backend
    claimApi
      .getCaseStatus(effectiveClaimId)
      .then((res) => {
        if (res.success && res.case) {
          setCaseData(res.case);
          sessionStorage.setItem(`overturn_case_${effectiveClaimId}`, JSON.stringify(res.case));
          sessionStorage.setItem('overturn_current_claim_id', effectiveClaimId);
        } else {
          if (!hadCached) {
            setErrorMsg(res.error || `No tracking record found for claim ID: ${effectiveClaimId}`);
          }
        }
      })
      .catch((err: any) => {
        const message =
          err.response?.data?.error ||
          err.message ||
          `Failed to load tracking data for claim: ${effectiveClaimId}`;
        if (!hadCached) {
          setErrorMsg(message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading case tracking timeline...</p>
      </div>
    );
  }

  if (errorMsg && !caseData) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '520px' }}>
          <AlertCircle size={36} color="var(--color-danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Tracking Record Found</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {errorMsg}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/upload" className="btn btn-primary">Analyse Claim</Link>
            <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '520px' }}>
          <AlertCircle size={32} color="var(--color-danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Case Record Found</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
            Start an audit to generate your statutory representation and begin tracking.
          </p>
          <Link to="/upload" className="btn btn-primary">Analyse Claim</Link>
        </div>
      </div>
    );
  }

  const isFormVIUnlocked = caseData.daysRemaining <= 0;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '1000px' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">LIVE STATUTORY TRACKING</span>
              <span className="badge badge-success">{caseData.status}</span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>
              Grievance Escalation Timeline
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Tracking Token: <strong style={{ fontFamily: 'var(--font-mono)' }}>{caseData.trackingToken}</strong> • Claim Ref: <strong>{caseData.claimId}</strong>
            </p>
          </div>

          <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Back to Dashboard
          </Link>
        </div>

        {/* Overview Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
              Insurer Target
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
              {caseData.insurerName}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {caseData.destinationEmail || 'Grievance Redressal Officer'}
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
              Dispatched On
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
              {new Date(caseData.dispatchedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Formal Rule 14(3) Notice
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
              Cure Window Deadline
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-primary)' }}>
              {new Date(caseData.statutoryDeadline30d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {caseData.daysRemaining > 0 ? `${caseData.daysRemaining} Days Remaining` : 'Window Concluded'}
            </div>
          </div>
        </div>

        {/* Interactive Timeline Component */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Timeline
            milestones={caseData.milestones}
            daysRemaining={caseData.daysRemaining}
            statutoryDeadline30d={caseData.statutoryDeadline30d}
          />
        </div>

        {/* Escalation Stage Next Steps */}
        <div className="card" style={{
          borderLeft: `5px solid ${isFormVIUnlocked ? 'var(--color-success)' : 'var(--color-info)'}`,
          padding: '1.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className={`badge ${isFormVIUnlocked ? 'badge-success' : 'badge-neutral'}`}>
                  {isFormVIUnlocked ? 'ESCORT READY' : 'STAGE 1: INSURER CURE WINDOW'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Rule 13(1)(b) Insurance Ombudsman
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {isFormVIUnlocked
                  ? 'Statutory 30-Day Window Concluded: File Before Insurance Ombudsman'
                  : 'Awaiting Insurer Grievance Closure'}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '620px', lineHeight: 1.6 }}>
                {isFormVIUnlocked
                  ? 'The insurer failed to resolve your grievance within 30 days. You have the statutory right under Rule 13 to file Form VI before the Insurance Ombudsman Regional Bench.'
                  : `By law, the insurance company has 30 continuous days to reconsider and sanction the claim. If they fail or reject again, your Ombudsman Form VI petition unlocks on ${new Date(caseData.statutoryDeadline30d).toLocaleDateString('en-IN')}.`}
              </p>
            </div>

            <div>
              {isFormVIUnlocked ? (
                <button
                  onClick={() => alert('Downloading Pre-filled Ombudsman Form VI Package with verified case citations...')}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.25rem' }}
                >
                  <Download size={16} /> Download Ombudsman Form VI Package
                </button>
              ) : (
                <a
                  href="https://www.cioins.co.in/Ombudsman"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Regional Ombudsman Directory <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackingPage;
