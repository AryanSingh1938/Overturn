import React from 'react';
import { Precedent } from '../types';
import { Scale, BookOpen, ExternalLink, Check, Award } from 'lucide-react';

interface PrecedentCardProps {
  precedent: Precedent;
  rank?: number;
}

export const PrecedentCard: React.FC<PrecedentCardProps> = ({ precedent, rank }) => {
  const scorePercent = precedent.similarity_score ? (precedent.similarity_score * 100).toFixed(1) : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      
      {/* Top Banner: Court, Citation & Similarity */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}>
            {rank ? `#${rank}` : <Scale size={18} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1.08rem', color: 'var(--color-text-main)' }}>
              {precedent.case_name}
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {precedent.court} • {precedent.case_id} {precedent.year ? `(${precedent.year})` : ''}
            </div>
          </div>
        </div>

        {scorePercent && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
              <Award size={12} />
              {scorePercent}% Match
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Vector Cosine Similarity
            </span>
          </div>
        )}
      </div>

      {/* Grounds Tags */}
      {precedent.grounds && precedent.grounds.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {precedent.grounds.map((g, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                textTransform: 'capitalize',
              }}
            >
              {g.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Verbatim Excerpt & Ratio */}
      <div style={{
        backgroundColor: 'var(--color-surface-subtle)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Binding Judicial Ratio & Excerpt
        </div>
        <blockquote style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--color-text-main)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
          "{precedent.chunk_text}"
        </blockquote>
        {precedent.key_holding && (
          <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-hover)', fontWeight: 600 }}>
            <strong>Key Holding: </strong>{precedent.key_holding}
          </div>
        )}
      </div>

      {/* Footer Link to Kanoon / Supreme Court S3 */}
      {precedent.public_url && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href={precedent.public_url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <BookOpen size={14} />
            View Verifiable Order / Kanoon Record
            <ExternalLink size={12} />
          </a>
        </div>
      )}

    </div>
  );
};

export default PrecedentCard;

