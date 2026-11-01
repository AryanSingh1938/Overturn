import React from 'react';
import { Scale, BookOpen, AlertTriangle, ShieldCheck, CheckSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="page-wrapper" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: 'var(--color-primary)',
          }}
        >
          <ArrowLeft size={16} /> Return to Home
        </Link>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            <Scale size={14} />
            Statutory Terms of Service
          </div>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>
            Terms & Conditions of Service
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
            Effective Date: November 1, 2026 &bull; Governing Civic Use of the Overturn Appeal Engine
          </p>
        </div>

        {/* Mandatory Legal Notice Box */}
        <div className="card" style={{
          padding: '1.75rem',
          borderLeft: '4px solid var(--color-warning)',
          backgroundColor: '#FFFBEB',
          marginBottom: '2.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: '#92400E', fontWeight: 700 }}>
            <AlertTriangle size={18} />
            Mandatory Legal Status Disclosure
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#78350F' }}>
            Overturn is an autonomous procedural assistance engine and open-source civic technology platform. Overturn is not a law firm, does not practice law under the Advocates Act, 1961, and does not provide formal legal representation or advocate-client privilege.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Section 1 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <BookOpen size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>1. Purpose and Civic Scope</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              The purpose of Overturn is to demystify complex insurance repudiation letters and arm Indian policyholders with verifiable regulatory provisions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              <li>Evaluating denial letters against binding rules published by the Insurance Regulatory and Development Authority of India (IRDAI).</li>
              <li>Retrieving relevant judicial precedents established by the Supreme Court of India and National Consumer Disputes Redressal Commission (NCDRC) in open legal records.</li>
              <li>Formatting procedural grievance notices under <strong>Rule 14(3)</strong> of the Insurance Ombudsman Rules, 2017 and pre-populating standard <strong>Form VI</strong> complaint packages.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <CheckSquare size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>2. Policyholder Autonomy & Verification</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Overturn operates strictly under a <strong>Human-in-the-Loop</strong> paradigm:
            </p>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              <li>The user maintains sole authority and responsibility for inspecting extracted policy numbers, repudiated amounts, and stated medical reasons before dispatching any notice.</li>
              <li>You may edit, redact, or augment any representation draft generated by the system before sending.</li>
              <li>You agree not to upload fraudulent documents, fabricated hospital bills, or misrepresent facts to insurance authorities.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>3. Public Domain Precedents & Citation Integrity</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              All court rulings cited by the engine are drawn from authentic public domain records (Indian Kanoon, cioins.co.in, and the official Gazette of India). Overturn enforces algorithmic citation guardrails to ensure only authentic judgments are referenced. However, rulings should be read in context with your specific policy terms and treating physician certificates.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Scale size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>4. Disclaimer of Outcome Guarantees</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              Calculated win probabilities are empirical estimations based on past Ombudsman awards and statutory rule thresholds (such as the 60-Month Moratorium rule under IRDAI Master Circular 2024, Section 6). Overturn cannot guarantee that an insurer or Insurance Ombudsman Bench will overturn a specific repudiation. Final adjudicatory decisions rest entirely with the statutory authorities.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>5. Open-Source Civic Licensing</h2>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              The software codebase is licensed under the open-source MIT License. Use of the software is provided &quot;as is&quot;, without warranty of any kind, express or implied.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default TermsPage;
