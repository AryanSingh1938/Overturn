import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
        }}>
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          The page or claim case you are looking for does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

