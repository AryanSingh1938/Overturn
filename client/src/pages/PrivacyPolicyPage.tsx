import React from 'react';
import { Shield, Lock, Trash2, EyeOff, Server, FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
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
            <Shield size={14} />
            Statutory Privacy Notice
          </div>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem' }}>
            Privacy Policy & Data Protection
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
            Effective Date: November 1, 2026 &bull; Compliant with the Digital Personal Data Protection Act, 2023 (DPDPA)
          </p>
        </div>

        {/* Executive Guarantee Card */}
        <div className="card" style={{
          padding: '1.75rem',
          borderLeft: '4px solid var(--color-primary)',
          backgroundColor: 'var(--color-surface)',
          marginBottom: '2.5rem',
        }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', color: 'var(--color-text-main)' }}>
            Our Civic Privacy Commitment
          </h3>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
            Overturn is open-source civic infrastructure designed to assist policyholders facing unfair health insurance repudiations. We do not sell personal data, we do not host advertising pixels, and we treat medical and financial records with strict ephemeral confidentiality.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Section 1 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <EyeOff size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>1. Zero-Disk Ephemeral File Architecture</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              When you upload a claim rejection notice, medical bill, or discharge summary, the document buffer is loaded <strong>solely in volatile system memory (RAM)</strong>. 
            </p>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              <li>Uploaded PDF and image files are <strong>never written to physical server disk storage</strong>.</li>
              <li>Once synchronous extraction of statutory facts (claim reference, insurer name, repudiated clause code, denial amount) is complete, the in-memory document buffer is discarded immediately.</li>
              <li>We do not build public archives or search indexes containing raw medical paperwork.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Server size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>2. Data We Retain and Why</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              To enable your 30-day statutory countdown under Rule 14(3) of the Insurance Ombudsman Rules, 2017 and to generate pre-filled Form VI filings, we persist strictly structured dispute metadata in MongoDB:
            </p>
            <div style={{
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
            }}>
              <div><strong>Insurance Metadata:</strong> Insurer name, policy number, claim reference ID, denial amount, repudiation date, and quoted clause text.</div>
              <div style={{ marginTop: '0.4rem' }}><strong>Policyholder Identity:</strong> Insured name, claimant contact email (used exclusively for sending and receiving insurer GRO replies), and tracking tokens.</div>
              <div style={{ marginTop: '0.4rem' }}><strong>User Account (Optional):</strong> If you choose to register, your email address and a cryptographically salted and hashed password (bcryptjs).</div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Lock size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>3. Policyholder Email Privity & Dispatch</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Overturn guarantees strict legal privity between the policyholder and the insurer:
            </p>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              <li>Whenever an appeal is dispatched to an insurer's Grievance Redressal Officer (GRO), your personal email address is set as both <strong>CC</strong> and <strong>Reply-To</strong>.</li>
              <li>The insurer's legal responses and settlement offers route directly to your personal mailbox. Overturn does not intercept, read, or broker correspondence between you and the insurer.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Trash2 size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>4. Data Retention, Expiry & Right to Erasure</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Under the Digital Personal Data Protection Act, 2023, you hold absolute rights to data erasure:
            </p>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              <li><strong>Automatic Expiry:</strong> Anonymous dispute records carry a 30-day Time-To-Live (TTL) index in our database and are automatically purged.</li>
              <li><strong>User Right to Erasure:</strong> Registered users can request immediate deletion of their account and all associated claim audits at any time.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <FileCheck size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem' }}>5. Third-Party Services & Zero Tracking</h2>
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
              We do not utilize Google Analytics, Meta Pixel, Hotjar, or commercial tracking scripts. Language and embedding inferences run via authenticated enterprise APIs under strict non-training, zero-retention service agreements.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
