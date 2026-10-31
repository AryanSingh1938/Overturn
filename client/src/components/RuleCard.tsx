import React from 'react';
import { MoratoriumViolation, Deadlines, PecuniaryLimit } from '../types';
import { ShieldAlert, CheckCircle, Scale, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

interface RuleCardProps {
  moratorium: MoratoriumViolation;
  deadlines: Deadlines;
  pecuniary?: PecuniaryLimit;
}

export const RuleCard: React.FC<RuleCardProps> = ({ moratorium, deadlines, pecuniary }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. IRDAI 60-Month Moratorium Rule Finding */}
      <div className="card" style={{
        borderLeft: `4px solid ${moratorium.breached ? 'var(--color-danger)' : 'var(--color-success)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: moratorium.breached ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
              color: moratorium.breached ? 'var(--color-danger)' : 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {moratorium.breached ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>{moratorium.title}</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {moratorium.statute}
              </div>
            </div>
          </div>

          <span className={`badge ${moratorium.breached ? 'badge-danger' : 'badge-success'}`}>
            {moratorium.breached ? 'STATUTORY VIOLATION DETECTED' : 'STANDARD EVALUATION'}
          </span>
        </div>

        <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--color-text-main)', marginBottom: '1rem' }}>
          {moratorium.explanation}
        </p>

        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <strong>Legal Effect: </strong>
            {moratorium.breached
              ? 'The insurer is statutorily estopped from denying claim on pre-existing condition grounds.'
              : 'Claim must be contested on causal nexus, treating physician discretion, or procedural defects.'}
          </div>
          <a
            href="https://irdai.gov.in/"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}
          >
            IRDAI Gazette <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 2. Statutory Limitation Window (Rule 14(3) Ombudsman Rules) */}
      <div className="card" style={{
        borderLeft: `4px solid ${deadlines.isTimeBarred ? 'var(--color-danger)' : 'var(--color-info)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: deadlines.isTimeBarred ? 'var(--color-danger-bg)' : 'var(--color-info-bg)',
              color: deadlines.isTimeBarred ? 'var(--color-danger)' : 'var(--color-info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem' }}>Ombudsman Statutory 365-Day Limitation</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Rule 14(3), Insurance Ombudsman Rules 2017
              </div>
            </div>
          </div>

          <span className={`badge ${deadlines.isTimeBarred ? 'badge-danger' : 'badge-neutral'}`}>
            {deadlines.isTimeBarred ? 'TIME-BARRED' : `${deadlines.daysUntilStatutoryBarred} DAYS REMAINING`}
          </span>
        </div>

        <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
          {deadlines.isTimeBarred
            ? 'The repudiation letter is older than 365 days. Direct Ombudsman approach is barred without formal delay condonation.'
            : `A formal complaint before the Insurance Ombudsman must be lodged within 1 year of the insurer's rejection. You currently have ${deadlines.daysUntilStatutoryBarred} days remaining before the statutory cutoff.`}
        </p>

        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          Statutory Cutoff Date: <strong>{new Date(deadlines.statutoryLimitationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
        </div>
      </div>

      {/* 3. Pecuniary Jurisdiction (Rule 17) */}
      {pecuniary && (
        <div className="card" style={{
          borderLeft: `4px solid ${pecuniary.withinOmbudsmanLimit ? 'var(--color-success)' : 'var(--color-warning)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: pecuniary.withinOmbudsmanLimit ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                color: pecuniary.withinOmbudsmanLimit ? 'var(--color-success)' : 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Scale size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Pecuniary Jurisdiction: {pecuniary.recommendation}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Rule 17 Compensation Cap: ₹30,00,000 (30 Lakhs)
                </div>
              </div>
            </div>

            <span className={`badge ${pecuniary.withinOmbudsmanLimit ? 'badge-success' : 'badge-warning'}`}>
              {pecuniary.withinOmbudsmanLimit ? 'WITHIN OMBUDSMAN CAP' : 'EXCEEDS CAP'}
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--color-text-main)' }}>
            {pecuniary.note}
          </p>
        </div>
      )}

    </div>
  );
};

export default RuleCard;

