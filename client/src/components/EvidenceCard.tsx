import React from 'react';
import { WinProbability } from '../types';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, FileCheck2, ShieldCheck } from 'lucide-react';

interface EvidenceCardProps {
  winProbability: WinProbability;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ winProbability }) => {
  const score = winProbability.score || 50;

  // Color scheme based on calibrated win score
  const getScoreTheme = (s: number) => {
    if (s >= 80) return { color: 'var(--color-success)', bg: 'var(--color-success-bg)', border: 'var(--color-success-border)' };
    if (s >= 50) return { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' };
    return { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', border: 'var(--color-danger-border)' };
  };

  const theme = getScoreTheme(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Score Box */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderLeft: `5px solid ${theme.color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            backgroundColor: theme.bg,
            border: `2px solid ${theme.border}`,
            color: theme.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.6rem',
            lineHeight: 1,
          }}>
            <span>{score}%</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>SCORE</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <TrendingUp size={18} color={theme.color} />
              <h3 style={{ fontSize: '1.3rem' }}>{winProbability.verdict}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: '480px' }}>
              Calibrated based on IRDAI 2024 statutory moratorium criteria, Rule 14(3) limitation timelines, and Supreme Court precedent vector alignment.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="badge" style={{ backgroundColor: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}>
            {score >= 80 ? 'STRONG LEGAL FOUNDATION' : 'REQUIRES PROCEDURAL CARE'}
          </span>
        </div>
      </div>

      {/* Breakdown Factors List */}
      <div className="card">
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--color-primary)" />
          Statutory Merits & Evidence Scoring Factors
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {winProbability.factors?.map((factor, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                borderLeft: `3px solid ${factor.positive ? 'var(--color-success)' : 'var(--color-danger)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                {factor.positive ? (
                  <CheckCircle2 size={18} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <XCircle size={18} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
                    {factor.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {factor.description}
                  </div>
                </div>
              </div>

              <div style={{
                fontWeight: 800,
                fontSize: '0.9rem',
                color: factor.positive ? 'var(--color-success)' : 'var(--color-danger)',
                flexShrink: 0,
              }}>
                {factor.points > 0 ? `+${factor.points}` : factor.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Annexures Checklist */}
      <div className="card" style={{ backgroundColor: '#F8FAFC' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <FileCheck2 size={17} color="var(--color-info)" />
          Recommended Evidentiary Annexures Checklist
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.6rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)' }}>✓</span>
            <span>Policy Schedule showing continuous inception date</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)' }}>✓</span>
            <span>Hospital Discharge Summary & Operation Notes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)' }}>✓</span>
            <span>Treating Doctor's Certificate on Emergency Necessity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)' }}>✓</span>
            <span>Formal Repudiation / Denial Letter from TPA / Insurer</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EvidenceCard;

