import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Shield,
  Eye,
  ExternalLink,
} from 'lucide-react';
import claimApi from '../services/claimApi';
import { GroContact } from '../types';

interface StoredClaimItem {
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

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [claimsList, setClaimsList] = useState<StoredClaimItem[]>([]);
  const [groDirectory, setGroDirectory] = useState<GroContact[]>([]);
  const [isLoadingGros, setIsLoadingGros] = useState<boolean>(true);

  useEffect(() => {
    const fetchClaims = async () => {
      let activeClaims: StoredClaimItem[] = [];

      // 1. If user is logged in, try fetching their real claims from backend API
      if (user && (user.email || user.id)) {
        try {
          const res = await claimApi.getMyClaims({ email: user.email, userId: user.id });
          if (res.success && Array.isArray(res.claims)) {
            activeClaims = res.claims.map((c: any) => {
              const rawDate = c.extracted_facts?.rejection_date || c.rejectionDate;
              let formattedDate = new Date().toISOString().split('T')[0];
              if (rawDate) {
                formattedDate = typeof rawDate === 'string' ? rawDate.split('T')[0] : new Date(rawDate).toISOString().split('T')[0];
              }

              return {
                claim_id: c.extracted_facts?.claim_id || c.claimId || 'CLM-DEL-2024-9182',
                insurer_name: c.extracted_facts?.insurer_name || c.insurerName || 'Insurance Provider',
                patient_name: c.extracted_facts?.patient_name || c.patientName || 'Policyholder',
                denial_amount: c.extracted_facts?.denial_amount || c.claimAmount || 0,
                rejection_date: formattedDate,
                policy_duration_months: c.extracted_facts?.policy_duration_months || 0,
                moratorium_breached: Boolean(c.moratorium_violation?.breached),
                score: c.win_probability?.score || 75,
              };
            });
          }
        } catch (err) {
          console.warn('Could not retrieve backend claims:', err);
        }
      }

      // 2. Fallback to user-scoped localStorage if backend had no records
      if (activeClaims.length === 0 && user) {
        const userKey = user.email
          ? `overturn_claims_${user.email.toLowerCase().trim()}`
          : `overturn_claims_${user.id}`;
        const stored = localStorage.getItem(userKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              activeClaims = parsed.filter((c: any) => !c.isDemo);
            }
          } catch {
            activeClaims = [];
          }
        }
      }

      // Purge legacy shared key to prevent cross-account contamination
      localStorage.removeItem('overturn_recent_claims');

      setClaimsList(activeClaims);
    };

    fetchClaims();

    // Fetch live GRO Directory from backend
    claimApi
      .getGroDirectory()
      .then((res) => {
        if (res.success && res.contacts) {
          setGroDirectory(res.contacts);
        }
      })
      .catch((err) => {
        console.warn('Could not load GRO directory:', err.message);
      })
      .finally(() => setIsLoadingGros(false));
  }, [user]);

  const totalAudited = claimsList.length;
  const moratoriumViolations = claimsList.filter((c) => c.moratorium_breached).length;
  const highProbability = claimsList.filter((c) => c.score >= 80).length;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* Header Greeting & Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-primary">CIVIC DASHBOARD</span>
              <span className="badge badge-neutral">CASE MANAGEMENT</span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>
              Welcome back, {user ? user.name : 'Policyholder'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Manage your claim repudiation audits, IRDAI statutory violation assessments, and GRO representation notices.
            </p>
          </div>

          <Link
            to="/upload"
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', boxShadow: 'var(--shadow-primary)' }}
          >
            <UploadCloud size={20} />
            Upload New Claim
          </Link>
        </div>

        {/* Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              Claims Audited
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {totalAudited}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              OCR Vision & Clause Check
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              Moratorium Breaches
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)' }}>
              {moratoriumViolations}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              IRDAI 2024 Section 6 Violations
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              High Overturn Probability
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>
              {highProbability}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              &gt;80% Empirical Win Score
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--color-info)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-info)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              Active Statutory Windows
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-info)' }}>
              {totalAudited}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Under Rule 14(3) 30-Day Cure
            </div>
          </div>

        </div>

        {/* Main Content: Recent Claims & GRO Directory */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Recent Claims */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--color-primary)" />
                Audited Claim Records
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Showing {claimsList.length} cases
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claimsList.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}>
                    <FileText size={26} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Claims Audited Yet</h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                    Upload an official health insurance repudiation letter to check IRDAI 60-Month Moratorium compliance, match Supreme Court precedents, and draft an enforceable appeal.
                  </p>
                  <Link
                    to="/upload"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
                  >
                    <UploadCloud size={17} /> Audit New Repudiation
                  </Link>
                </div>
              ) : (
                claimsList.map((claim, idx) => (
                  <div key={idx} className="card card-interactive" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                            {claim.claim_id}
                          </span>
                          {claim.moratorium_breached && (
                            <span className="badge badge-danger">IRDAI Moratorium Breach</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                          {claim.insurer_name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Patient: {claim.patient_name} • Policy Duration: {claim.policy_duration_months} Months • Rejected: {claim.rejection_date}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-danger)' }}>
                          ₹{claim.denial_amount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: claim.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                          {claim.score}% Win Score
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-border-subtle)',
                      paddingTop: '0.75rem',
                      marginTop: '0.5rem',
                    }}>
                      <Link
                        to={`/tracking/${encodeURIComponent((claim.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
                        style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                      >
                        <Clock size={14} />
                        Track 30-Day Window
                      </Link>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/appeal/${encodeURIComponent((claim.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          Draft Representation
                        </Link>
                        <Link
                          to={`/analysis/${encodeURIComponent((claim.claim_id || 'case').replace(/[\/\\]/g, '-'))}`}
                          className="btn btn-subtle"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          Audit Details <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Verified GRO Directory */}
          <div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="var(--color-primary)" />
                Insurer GRO Directory
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                Authentic Grievance Redressal Officers from IRDAI Bima Bharosa.
              </p>

              {isLoadingGros ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Loading official contacts...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '480px', overflowY: 'auto' }}>
                  {groDirectory.map((contact, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: 'var(--color-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                        {contact.insurer_name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: '0.78rem' }}>
                        {contact.email}
                      </div>
                      {contact.toll_free && (
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                          Toll-Free: {contact.toll_free}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
