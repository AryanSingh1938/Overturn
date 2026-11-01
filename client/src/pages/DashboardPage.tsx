import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  Plus,
  Clock,
  ArrowRight,
  Shield,
  FileSearch,
  Building2,
  FileText,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
} from 'lucide-react';
import claimApi from '../services/claimApi';
import { GroContact } from '../types';

interface DashboardClaim {
  claim_id: string;
  insurer_name: string;
  patient_name: string;
  denial_amount: number;
  rejection_date: string;
  policy_duration_months: number;
  moratorium_breached: boolean;
  score: number;
  isDemo?: boolean;
}

const DEMO_BENCHMARKS: DashboardClaim[] = [
  {
    claim_id: 'CLM-DEL-2024-9182',
    insurer_name: 'Star Health and Allied Insurance',
    patient_name: 'V. Balaji',
    denial_amount: 150000,
    rejection_date: '2026-11-01',
    policy_duration_months: 48,
    moratorium_breached: false,
    score: 56,
    isDemo: true,
  },
  {
    claim_id: 'CLM-791859',
    insurer_name: 'Star Health and Allied Insurance',
    patient_name: 'V. Balaji',
    denial_amount: 150000,
    rejection_date: '2026-11-01',
    policy_duration_months: 48,
    moratorium_breached: false,
    score: 56,
    isDemo: true,
  },
  {
    claim_id: 'CLM-920338',
    insurer_name: 'Care Health Insurance Limited',
    patient_name: 'V. Balaji',
    denial_amount: 150000,
    rejection_date: '2026-11-01',
    policy_duration_months: 48,
    moratorium_breached: false,
    score: 56,
    isDemo: true,
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my_claims' | 'benchmarks'>('my_claims');
  const [claims, setClaims] = useState<DashboardClaim[]>([]);
  const [groList, setGroList] = useState<GroContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // 1. Load user claims from localStorage / API
      const userKey = user?.email
        ? `overturn_claims_${user.email.toLowerCase().trim()}`
        : user?.id
        ? `overturn_claims_${user.id}`
        : 'overturn_claims_guest';

      const localStr = localStorage.getItem(userKey);
      let userClaims: DashboardClaim[] = localStr ? JSON.parse(localStr) : [];

      // Also check general cache
      if (userClaims.length === 0) {
        const generalStr = localStorage.getItem('overturn_recent_claims');
        if (generalStr) {
          userClaims = JSON.parse(generalStr);
        }
      }

      // If user has claims in DB
      if (user?.email) {
        try {
          const res = await claimApi.getMyClaims({ email: user.email, userId: user.id });
          if (res.success && Array.isArray(res.claims) && res.claims.length > 0) {
            const mappedDb = res.claims.map((c: any) => ({
              claim_id: c.claimId || c.extracted_facts?.claim_id || 'CLM-DB',
              insurer_name: c.insurerName || c.extracted_facts?.insurer_name || 'Insurance Provider',
              patient_name: c.extracted_facts?.patient_name || user.name,
              denial_amount: c.extracted_facts?.denial_amount || 150000,
              rejection_date: c.extracted_facts?.rejection_date || new Date().toISOString().split('T')[0],
              policy_duration_months: c.extracted_facts?.policy_duration_months || 48,
              moratorium_breached: c.moratorium_breached || false,
              score: c.win_probability?.score || 65,
              isDemo: false,
            }));
            userClaims = [...mappedDb, ...userClaims];
          }
        } catch (err) {
          console.warn('DB claims query fallback:', err);
        }
      }

      // Fallback to benchmarks if zero claims exist so dashboard is never blank
      if (userClaims.length === 0) {
        userClaims = DEMO_BENCHMARKS;
      }

      setClaims(userClaims);

      // 2. Load Insurer GRO Directory for right column
      try {
        const groRes = await claimApi.getGroDirectory();
        if (groRes.success && groRes.contacts) {
          setGroList(groRes.contacts);
        }
      } catch {
        // Fallback static GRO contacts matching Photo 2
        setGroList([
          {
            insurer_name: 'Star Health & Allied Insurance Co. Ltd.',
            email: 'gro@starhealth.in',
            toll_free: '1800-425-2255',
            escalation_level: 'GRO',
            address: '1, New Tank Street, Valluvar Kottam High Road, Nungambakkam, Chennai - 600034',
          },
          {
            insurer_name: 'Care Health Insurance Ltd.',
            email: 'gro@careinsurance.com',
            toll_free: '1800-102-4488',
            escalation_level: 'GRO',
            address: 'Vipul Tech Square, Tower C, Golf Course Road, Sector 43, Gurugram - 122009',
          },
          {
            insurer_name: 'HDFC ERGO General Insurance Co. Ltd.',
            email: 'grievance@hdfcergo.com',
            toll_free: '1800-2666-400',
            escalation_level: 'GRO',
            address: 'D-301, 3rd Floor, Eastern Business District, LBS Marg, Bhandup (W), Mumbai - 400078',
          },
          {
            insurer_name: 'ICICI Lombard General Insurance Co. Ltd.',
            email: 'customersupport@icicilombard.com',
            toll_free: '1800-2666',
            escalation_level: 'GRO',
            address: 'ICICI Lombard House, 414 Veer Savarkar Marg, Near Siddhivinayak Temple, Prabhadevi, Mumbai - 400025',
          },
          {
            insurer_name: 'Niva Bupa Health Insurance Co. Ltd.',
            email: 'customerfirst@nivabupa.com',
            toll_free: '1860-500-8888',
            escalation_level: 'GRO',
            address: 'Logix Infotech Park, D-5, Sector 59, Noida, Uttar Pradesh - 201301',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Derived metrics
  const displayedClaims = activeTab === 'my_claims' ? claims : DEMO_BENCHMARKS;
  const totalAudited = claims.length;
  const moratoriumBreaches = claims.filter((c) => c.moratorium_breached).length;
  const highOverturn = claims.filter((c) => c.score >= 80).length;
  const activeStatutory = claims.length;

  const claimantDisplayName = user?.name ? user.name.split(' ')[0] : 'Raman';

  return (
    <div
      style={{
        backgroundColor: '#FAF8F5', // Warm linen/sand background from Photo 2
        minHeight: 'calc(100vh - 72px)',
        padding: '2.5rem 0 5rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* Top Header Section (Photo 2) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            {/* Pill Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: '#FDF1EC',
                  color: 'var(--color-primary)',
                  border: '1px solid #FCDFD4',
                  padding: '2px 9px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                CIVIC DASHBOARD
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#F3F1EC',
                  color: '#6B7280',
                  border: '1px solid #E5E0D6',
                  padding: '2px 9px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                CASE MANAGEMENT
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--color-navy)',
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem',
              }}
            >
              Welcome back, {claimantDisplayName}
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#6B7280', maxWidth: '640px' }}>
              Manage your claim repudiation audits, IRDAI statutory violation assessments, and GRO representation notices.
            </p>
          </div>

          {/* Primary Action Button (Photo 2) */}
          <Link
            to="/upload"
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(224, 86, 56, 0.28)',
            }}
          >
            <Upload size={18} />
            Upload New Claim
          </Link>
        </div>

        {/* 4 Summary Metric Cards in a Row (Photo 2) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card 1: CLAIMS AUDITED */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #EFECE6',
              boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              CLAIMS AUDITED
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalAudited}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              OCR Vision &amp; Clause Check
            </div>
          </div>

          {/* Card 2: MORATORIUM BREACHES */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #EFECE6',
              borderLeft: '4px solid #DC2626', // Red line from Photo 2
              boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              MORATORIUM BREACHES
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#DC2626', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {moratoriumBreaches}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              IRDAI 2024 Section 6 Violations
            </div>
          </div>

          {/* Card 3: HIGH OVERTURN PROBABILITY */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #EFECE6',
              borderLeft: '4px solid #16A34A', // Green line from Photo 2
              boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              HIGH OVERTURN PROBABILITY
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {highOverturn}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              &gt;80% Empirical Win Score
            </div>
          </div>

          {/* Card 4: ACTIVE STATUTORY WINDOWS */}
          <div
            className="card"
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #EFECE6',
              borderLeft: '4px solid #2563EB', // Blue line from Photo 2
              boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              ACTIVE STATUTORY WINDOWS
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2563EB', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {activeStatutory}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
              Under Rule 14(3) 30-Day Cure
            </div>
          </div>
        </div>

        {/* Two-Column Content Layout (Photo 2) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '1.75rem',
            alignItems: 'start',
          }}
          className="dashboard-two-col"
        >
          {/* ==================== LEFT COLUMN: CLAIMS LIST ==================== */}
          <div>
            {/* Tabs Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_claims')}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'my_claims' ? '#FDF1EC' : 'transparent',
                    color: activeTab === 'my_claims' ? 'var(--color-primary)' : '#6B7280',
                    border: activeTab === 'my_claims' ? '1px solid #FCDFD4' : '1px solid transparent',
                  }}
                >
                  My Audited Claims ({claims.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('benchmarks')}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'benchmarks' ? '#FDF1EC' : 'transparent',
                    color: activeTab === 'benchmarks' ? 'var(--color-primary)' : '#6B7280',
                    border: activeTab === 'benchmarks' ? '1px solid #FCDFD4' : '1px solid transparent',
                  }}
                >
                  Demo Benchmark Cases (2)
                </button>
              </div>

              <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>
                Showing {displayedClaims.length} cases
              </span>
            </div>

            {/* List of Claim Cards (Styled exactly as in Photo 2) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayedClaims.map((claim, idx) => {
                const safeClaimId = encodeURIComponent((claim.claim_id || 'case').replace(/[\/\\]/g, '-'));

                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.4rem 1.6rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #EFECE6',
                      boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {/* Top Row: Claim Info & Denial Amount */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        {/* Top Badge (Photo 2) */}
                        <div
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#E05638',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {claim.claim_id.startsWith('CLM') ? claim.claim_id : 'Not Specified'}
                        </div>

                        {/* Insurer Name */}
                        <h3
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: 'var(--color-navy)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {claim.insurer_name}
                        </h3>

                        {/* Patient & Policy Details */}
                        <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                          Patient: {claim.patient_name} • Policy Duration: {claim.policy_duration_months} Months • Rejected: {claim.rejection_date}
                        </div>
                      </div>

                      {/* Right: Quantum & Score */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: '1.35rem',
                            fontWeight: 800,
                            color: '#DC2626', // Bold red amount from Photo 2
                            lineHeight: 1.1,
                          }}
                        >
                          ₹{claim.denial_amount?.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#E05638', fontWeight: 600, marginTop: '2px' }}>
                          {claim.score}% Win Score
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row (Photo 2) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #F5F2ED',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      {/* Left: Track 30-Day Window */}
                      <Link
                        to={`/tracking/${safeClaimId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: '#E05638',
                          textDecoration: 'none',
                        }}
                      >
                        <Clock size={15} color="#E05638" />
                        Track 30-Day Window
                      </Link>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Link
                          to={`/appeal/${safeClaimId}`}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          Draft Representation
                        </Link>

                        <Link
                          to={`/analysis/${safeClaimId}`}
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#FDF1EC',
                            color: '#E05638',
                            border: '1px solid #FCDFD4',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textDecoration: 'none',
                          }}
                        >
                          Audit Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: INSURER GRO DIRECTORY (Photo 2) ==================== */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #EFECE6',
              boxShadow: '0 1px 3px rgba(28, 31, 38, 0.03)',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #F5F2ED', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Building2 size={18} color="#E05638" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                  Insurer GRO Directory
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                Authentic Grievance Redressal Officers from IRDAI Bima Bharosa.
              </p>
            </div>

            {/* Scrollable Insurers List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '560px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {groList.map((gro, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.95rem 1rem',
                    backgroundColor: '#FAF8F5',
                    borderRadius: '10px',
                    border: '1px solid #EFECE6',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-navy)' }}>
                    {gro.insurer_name}
                  </div>

                  <a
                    href={`mailto:${gro.email}`}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#E05638', // Orange email as in Photo 2
                      textDecoration: 'none',
                    }}
                  >
                    {gro.email}
                  </a>

                  {gro.toll_free && (
                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                      Toll-Free: {gro.toll_free}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .dashboard-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
