import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Scale,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileSearch,
  BookOpen,
  Send,
  Building2,
  ExternalLink,
  Shield,
  Layers,
  Database,
  Lock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4.5rem 0',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '3.5rem',
            alignItems: 'center',
          }} className="hero-grid">
            
            {/* Left: Headline & Copy */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                backgroundColor: '#FDF1EC',
                border: '1px solid #FCDFD4',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '1.25rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                <Scale size={14} />
                AI-POWERED CLAIM ADVOCACY PLATFORM
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.3rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                color: 'var(--color-navy)',
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
              }}>
                Your Claim Was Rejected. <br />
                <span style={{ color: 'var(--color-primary)' }}>Your Fight Doesn’t Have To Be.</span>
              </h1>

              <p style={{
                fontSize: '1.08rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                marginBottom: '2rem',
                maxWidth: '560px',
              }}>
                Challenge unfair insurance claim rejections with verified legal precedents, regulatory intelligence, and professionally drafted appeals.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/upload"
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
                >
                  <span>Analyze My Rejection</span>
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 1.6rem', fontSize: '0.96rem' }}
                >
                  <BookOpen size={16} />
                  <span>Understand How It Works</span>
                </a>
              </div>

              {/* Trust Subtext */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--color-text-secondary)',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--color-success)" />
                  <span>IRDAI Master Circular 2024 Grounded</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Scale size={16} color="var(--color-primary)" />
                  <span>Rule 14(3) Ombudsman Standard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={16} color="var(--color-primary)" />
                  <span>Zero-Disk Privacy</span>
                </div>
              </div>
            </div>

            {/* Right: Sophisticated Product-Preview Visualization */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}>
              {/* Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Live Audit Preview • Case CIR-2024-849201
                  </span>
                </div>
                <span className="badge badge-primary">Verified Pipeline</span>
              </div>

              {/* Step 1: Uploaded Document Node */}
              <div style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}>
                <div style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  flexShrink: 0,
                }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      Star Health Repudiation Notice
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 700 }}>
                      INR 2,85,000 Denied
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    Repudiated under Clause 4.2 citing undisclosed pre-existing lumbar spondylitis for acute appendectomy.
                  </p>
                </div>
              </div>

              {/* Step 2: Regulatory Discrepancy Found */}
              <div style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-danger-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1.15rem',
                borderLeft: '4px solid var(--color-danger)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.82rem' }}>
                    <AlertCircle size={15} />
                    Regulatory Violation Detected
                  </div>
                  <span className="badge badge-danger">Critical Breach</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                  IRDAI Master Circular 2024 • Section 6 (60-Month Moratorium)
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Continuous coverage for 68 months strictly bars repudiation on pre-existing grounds.
                </p>
              </div>

              {/* Step 3: Matched Judicial Precedent */}
              <div style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-success-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1.15rem',
                borderLeft: '4px solid var(--color-success)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.82rem' }}>
                    <Scale size={15} />
                    Binding Supreme Court Precedent
                  </div>
                  <span className="badge badge-success">94% Similarity</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Manmohan Nanda v. United India Assurance (CA No. 4092/2022)
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Insurer must establish clinical causal nexus between prior symptoms and emergency hospitalization.
                </p>
              </div>

              {/* Step 4: Case Assessment Indicator */}
              <div style={{
                backgroundColor: 'var(--color-navy)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '0.95rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#FCDFD4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Appeal Assessment Indicator
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    88/100 Calibrated Win Score
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                    Rule 14(3) Statutory Notice Prepared • 30d Window
                  </div>
                </div>
                <Link
                  to="/upload"
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  Try With Your Claim
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Four-Stage Procedural Protocol
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              How Overturn Reverses Unfair Denials
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-secondary)' }}>
              Structured strictly according to Rule 14 and Rule 17 of the Insurance Ombudsman Rules, 2017.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
          }} className="how-it-works-grid">
            
            {/* Step 1 */}
            <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1.25rem',
              }}>
                01
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Upload Rejection Letter
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Multimodal OCR extracts insurer name, policy age, repudiation clause code, and denied figures in volatile memory.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1.25rem',
              }}>
                02
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Analyze Violations
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Tests policy duration against the mandatory 60-Month Moratorium rule and evaluates the 365-day statutory limitation under Rule 14(3).
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1.25rem',
              }}>
                03
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Discover Precedents
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Queries 768-dimensional normalized embeddings to match authentic Supreme Court and High Court judgments governing claim admissibility.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginBottom: '1.25rem',
              }}>
                04
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Generate Your Appeal
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
                Produces formal representation notices with policyholder privity, 30-day tracking, and pre-filled Ombudsman Form VI complaint packages.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Platform Capabilities
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              Engineered for Institutional Legal Credibility
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-secondary)' }}>
              Built specifically for Indian health insurance policyholders, advocates, and hospital grievance desks.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            
            {/* Feature 1 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <FileSearch size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Multimodal Document Analysis
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                High-fidelity OCR parses repudiation communications, billing schedules, and hospital summaries in memory without permanent disk storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Regulatory Violation Detection
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Automates deterministic validation of IRDAI Master Circular 2024 (Section 6) 60-Month Moratorium protections and Ombudsman Rule 14 maintainability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Database size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Judicial Precedent Matching
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                768-dimensional Atlas Vector search anchors claims directly in Supreme Court jurisprudence (*Manmohan Nanda*, *Sulbha Prakash Motegaonkar*).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-gold-light)',
                color: '#8C6623',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Scale size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Evidence-Based Case Assessment
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Replaces speculative percentages with explainable factor breakdowns: statutory estoppel (+40), precedent alignment (+35), and procedural adherence (+15).
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FDF1EC',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Appeal Letter Generation
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Synthesizes formal representations under Rule 14(3) with programmatic citation verification ensuring zero hallucinated case citations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Send size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                Automated Grievance Escalation
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Tracks the insurer&apos;s 30-day cure window with automated countdowns and unlocks pre-formatted Form VI complaints mapped to all 18 Ombudsman benches.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust and Transparency Section */}
      <section id="about" style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }} className="trust-grid">
            
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Trust &amp; Transparency
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginTop: '0.35rem', marginBottom: '1.25rem' }}>
                Data Provenance &amp; Legal Integrity
              </h2>
              <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Overturn operates on a zero-hallucination standard. We do not invent judicial citations or generate fictional recovery guarantees. Every statutory notice references published public records.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--color-navy)', fontSize: '0.92rem' }}>Authentic Regulatory Sources:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Grounding references cite the official Gazette of India, IRDAI Master Circular 2024, and the Insurance Ombudsman Rules, 2017.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--color-navy)', fontSize: '0.92rem' }}>Programmatic Citation Verifier:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Every generated draft is inspected by deterministic code against Supreme Court records. Ungrounded citations are rejected automatically.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--color-navy)', fontSize: '0.92rem' }}>Strict Privacy &amp; Data Minimization:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Uploaded repudiation documents are buffered in ephemeral RAM during OCR and never written to physical disk storage.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={18} color="var(--color-primary)" />
                Statutory Authorities &amp; Standards
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a
                  href="https://irdai.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                  }}
                >
                  <span>IRDAI Official Gazette Circulars</span>
                  <ExternalLink size={14} color="var(--color-primary)" />
                </a>

                <a
                  href="https://www.cioins.co.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                  }}
                >
                  <span>Council for Insurance Ombudsmen (18 Benches)</span>
                  <ExternalLink size={14} color="var(--color-primary)" />
                </a>

                <a
                  href="https://edaakhil.nic.in/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                  }}
                >
                  <span>e-Daakhil Consumer Redressal Commission</span>
                  <ExternalLink size={14} color="var(--color-primary)" />
                </a>

                <Link
                  to="/terms"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.86rem',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                  }}
                >
                  <span>Advocates Act 1961 Procedural Disclosure</span>
                  <ArrowRight size={14} color="var(--color-primary)" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-navy)',
        color: '#FFFFFF',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.3rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 800 }}>
            Don’t Let a Rejection Letter Be the Final Word.
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '2rem' }}>
            Audit your claim repudiation against binding IRDAI circulars and Supreme Court rulings in seconds.
          </p>
          <Link
            to="/upload"
            className="btn btn-primary"
            style={{
              padding: '0.95rem 2.25rem',
              fontSize: '1.05rem',
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <span>Analyze Your Claim</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Responsive Grid Helpers */}
      <style>{`
        @media (max-width: 960px) {
          .hero-grid, .trust-grid {
            grid-template-columns: 1fr !important;
          }
          .how-it-works-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
};

export default LandingPage;
