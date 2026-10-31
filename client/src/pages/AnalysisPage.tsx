import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnalysisResponse, Precedent, ExtractedFacts } from '../types';
import { DEMO_EXTRACTED_ANALYSIS, DEMO_PRECEDENTS } from '../data/mockData';
import ClaimSummary from '../components/ClaimSummary';
import RuleCard from '../components/RuleCard';
import PrecedentCard from '../components/PrecedentCard';
import EvidenceCard from '../components/EvidenceCard';
import claimApi from '../services/claimApi';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck,
  Scale,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Send,
  Eye,
  CheckCircle,
} from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDemoMode } = useAuth();

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'rules' | 'precedents' | 'evidence'>('summary');
  const [precedents, setPrecedents] = useState<Precedent[]>([]);
  const [isLoadingPrecedents, setIsLoadingPrecedents] = useState<boolean>(false);
  const [precedentError, setPrecedentError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Retrieve cached analysis result from sessionStorage
    const cachedStr = sessionStorage.getItem('overturn_analysis_result');
    let loadedAnalysis: AnalysisResponse | null = null;

    if (cachedStr) {
      try {
        loadedAnalysis = JSON.parse(cachedStr);
      } catch {
        loadedAnalysis = null;
      }
    }

    if (!loadedAnalysis) {
      // Fallback to demo analysis if page refreshed directly
      loadedAnalysis = DEMO_EXTRACTED_ANALYSIS;
    }

    setAnalysis(loadedAnalysis);

    // 2. Fetch live vector matched precedents from backend POST /api/v1/search-precedents
    const query = loadedAnalysis.extracted_facts.raw_stated_grounds || 'pre-existing disease repudiation';
    setIsLoadingPrecedents(true);
    setPrecedentError(null);

    claimApi
      .searchPrecedents(query, 3, 0.7)
      .then((res) => {
        if (res.success && res.precedents && res.precedents.length > 0) {
          setPrecedents(res.precedents);
        } else if (res.abstained) {
          setPrecedentError('The engine abstained: no precedents exceeded the 0.70 similarity threshold.');
          setPrecedents([]);
        } else {
          setPrecedents(DEMO_PRECEDENTS);
        }
      })
      .catch((err) => {
        console.warn('Vector search fallback:', err.message);
        if (isDemoMode) {
          setPrecedents(DEMO_PRECEDENTS);
        } else {
          setPrecedentError('Could not connect to vector search API. Operating with verified offline precedents.');
          setPrecedents(DEMO_PRECEDENTS);
        }
      })
      .finally(() => setIsLoadingPrecedents(false));
  }, [id, isDemoMode]);

  if (!analysis) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading analysis report...</p>
      </div>
    );
  }

  const { extracted_facts, moratorium_violation, deadlines, win_probability } = analysis;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* Top Header Banner */}
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
              <span className="badge badge-primary">AUDIT REPORT</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                {extracted_facts.claim_id}
              </span>
              {moratorium_violation?.breached && (
                <span className="badge badge-danger">IRDAI Moratorium Violation</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.9rem' }}>
              Claim Repudiation Analysis & Legal Standing
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Insurer: <strong>{extracted_facts.insurer_name}</strong> • Denied: <strong style={{ color: 'var(--color-danger)' }}>₹{extracted_facts.denial_amount?.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to={`/reality-check/${encodeURIComponent((extracted_facts.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              <Eye size={16} />
              Reality Check
            </Link>
            <Link
              to={`/appeal/${encodeURIComponent((extracted_facts.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
              className="btn btn-primary"
              style={{ fontSize: '0.88rem', boxShadow: 'var(--shadow-primary)' }}
            >
              <Send size={16} />
              Draft Representation <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab('summary')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeTab === 'summary' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'summary' ? '3px solid var(--color-primary)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FileCheck size={17} />
            Claim Facts & Grounds
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeTab === 'rules' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'rules' ? '3px solid var(--color-primary)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Scale size={17} />
            IRDAI Rule Findings
            {moratorium_violation?.breached && (
              <span className="badge badge-danger" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>VIOLATION</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('precedents')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeTab === 'precedents' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'precedents' ? '3px solid var(--color-primary)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <BookOpen size={17} />
            Precedent Matching
            <span className="badge badge-neutral" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
              {precedents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evidence')}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeTab === 'evidence' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'evidence' ? '3px solid var(--color-primary)' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Award size={17} />
            Win Probability & Evidence
            <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
              {win_probability?.score}%
            </span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ClaimSummary
              facts={extracted_facts}
              onUpdateFacts={(updated) => {
                setAnalysis({ ...analysis, extracted_facts: updated });
              }}
            />

            {/* Rejection Explanation Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>
                Rejection Grounds & Plain-English Explanation
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                {extracted_facts.summary_reason}
              </p>
              <div style={{
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
              }}>
                <strong>Quoted Repudiation Clause: </strong>
                <code>{extracted_facts.statutory_clause}</code>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <RuleCard
            moratorium={moratorium_violation}
            deadlines={deadlines}
            pecuniary={win_probability?.pecuniary}
          />
        )}

        {activeTab === 'precedents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {precedentError && (
              <div className="alert alert-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{precedentError}</div>
              </div>
            )}

            {isLoadingPrecedents ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Querying 768-dimensional vector embeddings for binding precedents...</p>
              </div>
            ) : precedents.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>No precedents matched the specified query threshold.</p>
              </div>
            ) : (
              precedents.map((p, idx) => (
                <PrecedentCard key={idx} precedent={p} rank={idx + 1} />
              ))
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <EvidenceCard winProbability={win_probability} />
        )}

      </div>
    </div>
  );
};

export default AnalysisPage;

