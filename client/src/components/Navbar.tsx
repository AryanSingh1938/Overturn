import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, FileText, CheckCircle2, AlertTriangle, LogIn, LogOut, User as UserIcon, Activity } from 'lucide-react';
import claimApi from '../services/claimApi';

export const Navbar: React.FC = () => {
  const { user, logout, isDemoMode, setDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    claimApi
      .getHealth()
      .then((res) => setApiOnline(res.status === 'ONLINE'))
      .catch(() => setApiOnline(false));
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: 'var(--nav-height)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                OVERTURN
              </span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-hover)',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                CIVIC
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1 }}>
              Claim Denial & Appeal Engine
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/upload"
            style={{
              fontWeight: isActive('/upload') ? 700 : 500,
              color: isActive('/upload') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.92rem'
            }}
          >
            <FileText size={17} />
            Analyse Claim
          </Link>

          <Link
            to="/dashboard"
            style={{
              fontWeight: isActive('/dashboard') ? 700 : 500,
              color: isActive('/dashboard') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontSize: '0.92rem'
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/tracking/CLM-DEL-2024-9182"
            style={{
              fontWeight: isActive('/tracking') ? 700 : 500,
              color: isActive('/tracking') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontSize: '0.92rem'
            }}
          >
            Tracking
          </Link>
        </nav>

        {/* Right Controls: Mode Toggle, Status, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Backend Status Dot */}
          <div
            title={apiOnline ? 'Backend Online' : 'Backend Offline - Start with npm run dev:server'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: apiOnline ? 'var(--color-success)' : 'var(--color-text-muted)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: apiOnline ? 'var(--color-success-bg)' : 'var(--color-surface-subtle)',
              border: `1px solid ${apiOnline ? 'var(--color-success-border)' : 'var(--color-border)'}`
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: apiOnline ? 'var(--color-success)' : '#9ca3af',
              display: 'inline-block'
            }} />
            <span style={{ fontWeight: 600 }}>{apiOnline ? 'API Connected' : 'Offline Mode'}</span>
          </div>

          {/* Explicit Demo Mode Switch */}
          <button
            onClick={() => setDemoMode(!isDemoMode)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              backgroundColor: isDemoMode ? '#FEF3C7' : 'var(--color-surface-subtle)',
              color: isDemoMode ? '#B45309' : 'var(--color-text-secondary)',
              border: `1px solid ${isDemoMode ? '#FCD34D' : 'var(--color-border)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            {isDemoMode ? <CheckCircle2 size={13} color="#B45309" /> : <AlertTriangle size={13} />}
            {isDemoMode ? 'DEMO DATA ACTIVE' : 'USE REAL BACKEND'}
          </button>

          {/* User Profile / Auth Action */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserIcon size={16} />
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <LogIn size={15} />
                Sign In
              </Link>
              <Link to="/upload" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Start Audit
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;

