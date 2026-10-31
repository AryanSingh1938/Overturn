import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileSearch,
  Scale,
  Award,
  Send,
  Clock,
  ArrowRight,
  CheckCircle,
  FileText,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4.5rem 0',
        background: 'linear-gradient(180deg, rgba(242, 107, 58, 0.06) 0%, rgba(255, 249, 245, 0) 100%)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
          }}>
            <Shield size={16} />
            POWERED BY IRDAI 2024 MASTER CIRCULARS & SUPREME COURT PRECEDENTS
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--color-text-main)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
          }}>
            A rejection shouldn't be the <span style={{ color: 'var(--color-primary)' }}>end of your claim</span>.
          </h1>

          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
          }}>
            Insurers routinely repudiate valid health insurance claims citing boilerplate exclusion clauses. Overturn weaponizes authentic Indian jurisprudence, statutory moratorium protections, and programmatic citation verifiers to overturn illegal claim denials.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/upload"
              className="btn btn-primary"
              style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', boxShadow: 'var(--shadow-primary)' }}
            >
              Analyse My Claim <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="btn btn-secondary"
              style={{ padding: '1rem 1.8rem', fontSize: '1.05rem' }}
            >
              View Sample Claims
            </Link>
          </div>

          {/* Quick Assurance Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--color-success)" />
              Zero Dummy Data Architecture
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--color-success)" />
              Rule 14(3) Ombudsman Compliance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={16} color="var(--color-success)" />
              768-Dim Vector Embedding Match
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>HOW OVERTURN WORKS</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
              From Unfair Denial to Verified Appeal in 4 Steps
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              No lawyers, no boilerplate promises. Just pure regulatory code, binding precedent vectors, and procedural rigor.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.75rem' }}>
            
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Upload Repudiation Letter</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Drag and drop your claim repudiation PDF or photo. Our in-memory OCR extracts policy inception date, repudiated clause code, denial amount, and stated grounds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Regulatory Moratorium Audit</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Under Section 6 of IRDAI Master Circular 2024, policies active for &gt;60 continuous months cannot be rejected for pre-existing diseases. We automatically detect statutory breaches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Precedent Vector Search</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Using 768-dim normalized embeddings, we match your repudiation grounds against landmark rulings (*Manmohan Nanda*, *Sulbha Motegaonkar*) establishing the causal nexus rule.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Statutory 30-Day Notice</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Generate a formal representation citing exact precedents and regulatory clauses. Dispatch to the insurer's GRO under Rule 14(3) with full human review confirmation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge badge-neutral" style={{ marginBottom: '0.75rem' }}>CORE CAPABILITIES</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
              Built to Beat Insurance Desk Rejections
            </h2>
          </div>

          <div className="grid-3">
            
            {/* Feature 1 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <FileSearch size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>AI Document Analysis</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Instant in-memory extraction of policy numbers, repudiated clauses, and hospital billing figures without persistent disk storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Scale size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>IRDAI Rule Checker</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Deterministic evaluation against 60-Month Moratorium protections, 3-hour cashless discharge directives, and mandatory Claims Review Committee mandates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <BookOpen size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Precedent Matching</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Atlas Vector Search on authentic Supreme Court & High Court rulings with cosine similarity scoring and verifiable Indian Kanoon links.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#F3E8FF',
                color: '#9333EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Award size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Evidence Assessment</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Transparent win-probability calibration based on limitation timeliness, pecuniary limits (under ₹30L cap), and medical nexus strength.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Send size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Grievance Generator</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Automated synthesis of formal Rule 14(3) pre-Ombudsman notices with programmatic citation verification to guarantee zero LLM hallucinations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card card-interactive">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#E0E7FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Clock size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Grievance Tracking</h4>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                Live 30-day statutory countdown tracking. When the insurer cure window closes, Ombudsman Form VI filing packages unlock automatically.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--color-primary-light)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--color-primary-hover)' }}>
            Got a claim repudiation letter?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', marginBottom: '2rem' }}>
            Check in 60 seconds whether your insurer committed an illegal statutory breach under IRDAI regulations. Free, privacy-first, and grounded in authentic law.
          </p>
          <Link
            to="/upload"
            className="btn btn-primary"
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', boxShadow: 'var(--shadow-primary)' }}
          >
            Analyse My Rejection Letter <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

