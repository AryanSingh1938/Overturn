import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Clock } from 'lucide-react';

export const ProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<string>('Auditing Repudiation Document...');

  useEffect(() => {
    // The backend performs synchronous OCR & regulatory evaluation during upload.
    // This page acts as a visual transition or redirect handler.
    const timer = setTimeout(() => {
      navigate(`/analysis/${id || 'CLM-DEL-2024-9182'}`, { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [id, navigate]);

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
        }}>
          <span className="spinner" style={{
            width: '28px',
            height: '28px',
            border: '3px solid var(--color-primary-light)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }} />
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
          Running Statutory Audit
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Claim Ref: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{id}</span>
        </p>

        <div style={{
          padding: '0.85rem',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--color-text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}>
          <Clock size={16} color="var(--color-primary)" />
          {stage}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default ProcessingPage;

