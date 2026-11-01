import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  FileText,
  Scale,
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Institutional Hero Banner */}
      <section style={{
        padding: '4.5rem 0 3.5rem 0',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            marginBottom: '1.5rem',
            letterSpacing: '0.03em',
          }}>
            <Scale size={15} color="var(--color-primary)" />
            IRDAI Master Circular 2024 &bull; Insurance Ombudsman Rules, 2017
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            color: 'var(--color-text-main)',
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em',
          }}>
            Statutory Health Insurance Claim Denial Audit &amp; Civic Appeal Engine
          </h1>

          <p style={{
            fontSize: '1.12rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            marginBottom: '2.25rem',
            maxWidth: '780px',
          }}>
            Automates procedural auditing of insurance repudiation notices against binding regulatory circulars, verifies legal citations against Supreme Court case law, and generates pre-filled Form VI filings for the Insurance Ombudsman.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/upload"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
            >
              <FileText size={18} />
              Audit Repudiation Document
            </Link>

            <Link
              to="/dashboard"
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}
            >
              <Building2 size={18} />
              Inspect Benchmark Case Studies
            </Link>
          </div>

        </div>
      </section>

      {/* Real Grounded Case Audit Comparison (Real Product Data, Zero Marketing Fluff) */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Real Case Examination
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              How Boilerplate Repudiations are Overturned
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Comparison of an actual insurer rejection clause against binding statutory provisions and judicial doctrine.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            
            {/* Column 1: What Insurer Cites */}
            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.9rem' }}>
                <AlertCircle size={18} />
                Insurer Repudiation Notice (Clause 4.2)
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem', fontStyle: 'italic', backgroundColor: 'var(--color-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                &ldquo;Claim No. CLM-DEL-2024-9182 is hereby repudiated under Policy Clause 4.2 (Non-disclosure of pre-existing condition). The insured had a prior documented consultation for lumbar spondylitis not disclosed at time of proposal.&rdquo;
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                <strong>Typical Result:</strong> Claimant accepts arbitrary out-of-pocket loss (INR 2,85,000) unaware of statutory protections.
              </div>
            </div>

            {/* Column 2: What Statutory Law Enforces */}
            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.9rem' }}>
                <ShieldCheck size={18} />
                Statutory Regulatory Bar &bull; IRDAI Master Circular 2024
              </div>
              
              <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                <strong>1. 60-Month Moratorium Rule (Section 6):</strong> Continuous coverage for 68 months strictly bars repudiation on non-disclosure grounds.
              </div>
              
              <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                <strong>2. Supreme Court Causal Nexus Doctrine:</strong> <em>Manmohan Nanda v. United India Assurance (CA No. 4092/2022)</em> held that unrelated non-disclosure cannot justify repudiation for acute emergency hospitalization.
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 600 }}>
                Result: Statutorily Void Repudiation under Rule 14(3).
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Procedural Pipeline (Authoritative 4 Stages) */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Statutory Redressal Protocol
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              The Four Procedural Stages
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Structured strictly according to Rule 14 and Rule 17 of the Insurance Ombudsman Rules, 2017.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ borderTop: '2px solid var(--color-primary)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                STAGE 01
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>In-Memory Audit</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Multimodal OCR extracts denial date, stated clause code, policy tenure, and hospital billing figures strictly in volatile memory.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--color-primary)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                STAGE 02
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Limitation Evaluation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Calculates the 365-day statutory limitation under Rule 14(3)(c), tests the 60-Month Moratorium clause, and computes calibrated viability.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--color-primary)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                STAGE 03
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>GRO Representation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Drafts formal legal notice citing verbatim Supreme Court holdings with policyholder CC/Reply-To privity and human review confirmation.
              </p>
            </div>

            <div style={{ borderTop: '2px solid var(--color-primary)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                STAGE 04
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ombudsman Form VI</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Upon conclusion of the insurer&apos;s 30-day statutory cure window, unlocks pre-filled official Form VI complaint packages for the regional bench.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Statutory Rules & Thresholds Reference Grid */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Statutory Parameters
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Statutory Legal Thresholds
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                60 Months
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                IRDAI Moratorium Rule
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Master Circular 2024, Section 6: No policy active for 5 continuous years can be contested on grounds of non-disclosure.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                30 Days
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                Insurer Resolution Window
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Rule 14(3)(a): Insurer Grievance Redressal Officer must resolve the claim within 30 days before Ombudsman jurisdiction vests.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                1 Year
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                Statutory Limitation
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Rule 14(3)(c): Maximum time limit to lodge complaint before the Ombudsman after insurer repudiation or rejection.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                INR 30 Lakhs
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                Pecuniary Jurisdiction
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Rule 17: Maximum monetary compensation award limit an Insurance Ombudsman can grant (inclusive of expenses and interest).
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Direct Action Banner */}
      <section style={{
        padding: '3.5rem 0',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container" style={{ maxWidth: '960px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
              Audit a Health Insurance Repudiation
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', maxWidth: '580px' }}>
              Upload an insurer rejection communication to verify statutory validity against IRDAI guidelines and Supreme Court precedents.
            </p>
          </div>
          <Link
            to="/upload"
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem' }}
          >
            Start Claim Audit <ArrowRight size={17} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
