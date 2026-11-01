import React from 'react';
import { Shield, ExternalLink, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 0 2rem 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                OVERTURN
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '340px', marginBottom: '1rem' }}>
              A rejection shouldn't be the end of your claim. Overturn arms policyholders with verified Supreme Court precedents, IRDAI master circular citations, and automated pre-Ombudsman grievance representations.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Built for Indian Health Insurance Policyholders
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Platform & Governance
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/upload">Analyse Rejection Letter</Link></li>
              <li><Link to="/dashboard">Claim Dashboard</Link></li>
              <li><Link to="/tracking/CLM-DEL-2024-9182">Grievance Tracking</Link></li>
              <li><Link to="/privacy">Privacy Policy (DPDPA)</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Statutory Bodies */}
          <div>
            <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Escalation Tiers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <a href="https://bimabharosa.irdai.gov.in/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Bima Bharosa Portal <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.cioins.co.in/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Insurance Ombudsman <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://edaakhil.nic.in/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  e-Daakhil Consumer Court <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://irdai.gov.in/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  IRDAI Official Gazette <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Statutory Disclaimer Box */}
          <div style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            fontSize: '0.78rem',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)', fontWeight: 700, marginBottom: '0.4rem' }}>
              <Scale size={15} color="var(--color-primary)" />
              Mandatory Statutory Notice &amp; Disclaimer:
            </div>
            Overturn is an automated procedural assistance platform, not a licensed legal practitioner or law firm, and does not provide formal legal advice. All regulatory citations and judicial references originate from authentic public records (IRDAI Gazettes, Indian Kanoon, Supreme Court of India open data). Policyholders retain full autonomy over grievance submission.
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            © {new Date().getFullYear()} Project Overturn. Free open-source civic technology for fair insurance practices.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Rule 14(3) Ombudsman Procedural Compliance</span>
            <span>Zero Dummy Data Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

