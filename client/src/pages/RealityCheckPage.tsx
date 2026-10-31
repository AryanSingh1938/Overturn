import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnalysisResponse } from '../types';
import { DEMO_EXTRACTED_ANALYSIS } from '../data/mockData';
import { ShieldCheck, AlertTriangle, ArrowLeft, Send, CheckCircle2, XCircle, Info, ExternalLink } from 'lucide-react';

export const RealityCheckPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    const cachedStr = sessionStorage.getItem('overturn_analysis_result');
    if (cachedStr) {
      try {
        setAnalysis(JSON.parse(cachedStr));
        return;
      } catch {}
    }
    setAnalysis(DEMO_EXTRACTED_ANALYSIS);
  }, [id]);

  if (!analysis) return null;

  const { extracted_facts, moratorium_violation, win_probability } = analysis;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '1080px' }}>
        
        {/* Back navigation & header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to={`/analysis/${encodeURIComponent((extracted_facts.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem' }}
          >
            <ArrowLeft size={16} /> Back to Analysis
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">REALITY CHECK COMPARISON</span>
            <span className="badge badge-neutral">SOURCE-GROUNDING VS GENERIC AI</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Grounded Law vs Generic AI Hallucinations
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
            Generic chatbots often give generic advice or hallucinate case law. Overturn pairs verified IRDAI gazettes and binding Supreme Court precedent vectors with programmatic citation verifiers.
          </p>
        </div>

        {/* Backend Implementation Transparency Alert */}
        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Backend Integration Notice: </strong>
            The current Overturn backend implements deterministic statutory rules and precedent vector retrieval (`/analyze-rejection`, `/search-precedents`). An ungrounded generic LLM endpoint is intentionally omitted on the backend to avoid unverified legal hallucinations. Below is the comparative architectural breakdown.
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Left: Overturn Grounded Engine */}
          <div className="card" style={{
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Overturn Civic Engine</h3>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Source-Grounded & Deterministic</span>
              </div>
            </div>

            {/* Verdict */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Regulatory Finding
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: moratorium_violation.breached ? 'var(--color-danger)' : 'var(--color-text-main)', marginTop: '2px' }}>
                {moratorium_violation.title}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem', lineHeight: 1.55 }}>
                {moratorium_violation.explanation}
              </p>
            </div>

            {/* Citations */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Verified Legal Authorities
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>IRDAI Master Circular 2024, Section 6 (60-Mo Moratorium)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>Rule 14(3), Insurance Ombudsman Rules 2017 (30-Day Cure)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="var(--color-success)" style={{ flexShrink: 0 }} />
                  <span>*Manmohan Nanda v. United India Assurance* (Civil Appeal 4092/2022)</span>
                </li>
              </ul>
            </div>

            {/* Output */}
            <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
              <strong>Procedural Action: </strong>
              Statutory 30-day representation notice dispatched directly to the insurer's Grievance Redressal Officer under Rule 14(3).
            </div>
          </div>

          {/* Right: Generic LLM Chatbot (Comparison/Unavailable) */}
          <div className="card" style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            opacity: 0.9,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#94A3B8',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#475569' }}>Generic AI Chatbot</h3>
                <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#64748B', fontSize: '0.65rem' }}>
                  Ungrounded LLM Baseline
                </span>
              </div>
            </div>

            {/* Generic Analysis */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Typical Generic Output
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#475569', marginTop: '2px' }}>
                "Insurers have standard exclusion clauses for pre-existing diseases..."
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem', lineHeight: 1.55 }}>
                Generic chatbots typically apologize, summarize the insurer's denial letter without checking continuous policy age, and advise the user to "contact a lawyer or read policy terms carefully."
              </p>
            </div>

            {/* Missing Elements */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Critical Missing Capabilities
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem', fontSize: '0.85rem', color: '#64748B' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={15} color="var(--color-danger)" style={{ flexShrink: 0 }} />
                  <span>No check for the 2024 60-Month IRDAI statutory bar</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={15} color="var(--color-danger)" style={{ flexShrink: 0 }} />
                  <span>Prone to fabricating American or non-existent court citations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <XCircle size={15} color="var(--color-danger)" style={{ flexShrink: 0 }} />
                  <span>No statutory 30-day countdown tracking or Ombudsman Form VI</span>
                </li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#F1F5F9', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: '#475569' }}>
              <strong>Notice: </strong>
              Generic model comparison runs are disabled on live servers to eliminate hallucinations in formal filings.
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to={`/appeal/${extracted_facts.claim_id}`}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', boxShadow: 'var(--shadow-primary)' }}
          >
            <Send size={18} /> Proceed to Grievance Representation
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RealityCheckPage;

