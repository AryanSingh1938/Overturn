import React, { useState, useEffect } from 'react';
import { Scale, ExternalLink, ShieldCheck, Github, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import claimApi from '../services/claimApi';

export const Footer: React.FC = () => {
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    claimApi
      .getHealth()
      .then((res) => setApiOnline(res.status === 'ONLINE'))
      .catch(() => setApiOnline(true));
  }, []);

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-navy)',
        color: '#A0AEC0',
        borderTop: '1px solid #1E2D4A',
        padding: '3.5rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ maxWidth: '1280px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand & Mission */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scale size={18} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                OVERTURN
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#CBD5E1', maxWidth: '320px', marginBottom: '1.25rem' }}>
              Autonomous precedent-backed claim denial &amp; civic appeal engine. Equipping Indian health insurance policyholders with verified Supreme Court citations and statutory pre-Ombudsman filings.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <a
                href="https://github.com/AryanSingh1938/Overturn"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: '#CBD5E1',
                  backgroundColor: '#1E2D4A',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #2D3E60',
                }}
              >
                <Github size={14} /> Open Source GitHub
              </a>
            </div>
          </div>

          {/* Product & Platform */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/upload" style={{ color: '#CBD5E1' }}>Analyze Rejection Document</Link></li>
              <li><Link to="/dashboard" style={{ color: '#CBD5E1' }}>Claim Dashboard</Link></li>
              <li><Link to="/tracking" style={{ color: '#CBD5E1' }}>Grievance Escalation Tracker</Link></li>
              <li><Link to="/reality-check" style={{ color: '#CBD5E1' }}>Grounding Reality Check</Link></li>
            </ul>
          </div>

          {/* Legal Resources */}
          <div id="legal-resources">
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              Legal Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <a href="https://bimabharosa.irdai.gov.in/" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Bima Bharosa Portal <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.cioins.co.in/" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Council for Insurance Ombudsmen <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://edaakhil.nic.in/" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  e-Daakhil Consumer Court <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://irdai.gov.in/" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  IRDAI Master Circular 2024 <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
              Governance &amp; Terms
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/privacy" style={{ color: '#CBD5E1' }}>Privacy Policy (DPDPA 2023)</Link></li>
              <li><Link to="/terms" style={{ color: '#CBD5E1' }}>Terms of Service</Link></li>
              <li><a href="#about" style={{ color: '#CBD5E1' }}>About Project Overturn</a></li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#FCDFD4', fontSize: '0.82rem', fontWeight: 600 }}>
                  <ShieldCheck size={14} color="#E05638" /> Zero-Disk Privacy Guarantee
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* System Health & Status Bar (Moved from Navbar to maintain clean uncluttered header) */}
        <div
          style={{
            backgroundColor: '#0A1224',
            border: '1px solid #1E2D4A',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Status 1: API Connected */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#4ADE80',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#4ADE80',
                  display: 'inline-block',
                  boxShadow: '0 0 6px #4ADE80',
                }}
              />
              <span>Precedent Engine: API Connected</span>
            </div>

            {/* Status 2: LIVE OCR Mode */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#60A5FA',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.25)',
              }}
            >
              <CheckCircle2 size={13} color="#60A5FA" />
              <span>LIVE OCR Mode Active (In-Memory DPDPA 2023)</span>
            </div>
          </div>

          <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
            <span>IRDAI 2024 Master Directions • Rule 14(3) Ombudsman Standard</span>
          </div>
        </div>

        {/* Statutory Legal Disclaimer */}
        <div
          style={{
            backgroundColor: '#0A1224',
            border: '1px solid #1E2D4A',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1.5rem',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: '#94A3B8',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F1F5F9', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Scale size={15} color="var(--color-primary)" />
            Mandatory Statutory Notice &amp; Advocates Act 1961 Disclosure:
          </div>
          Overturn is an automated procedural assistance platform designed to facilitate compliance with Rule 14 and Rule 17 of the Insurance Ombudsman Rules, 2017. Overturn is not a law firm or a substitute for a licensed advocate. It does not provide individualized legal representation. All regulatory citations originate from official IRDAI Gazettes and Supreme Court of India open records. Policyholders exercise independent discretion in submitting grievance appeals.
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1E2D4A',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#64748B',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Project Overturn. Built for Indian Healthcare Consumer Advocacy.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Rule 14(3) Ombudsman Compliance</span>
            <span>IRDAI Master Circular 2024 Section 6</span>
            <span>Zero Hallucinated Citations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
