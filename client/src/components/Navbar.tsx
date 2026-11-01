import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, LogIn, LogOut, User as UserIcon, Menu, X, ArrowRight } from 'lucide-react';
import claimApi from '../services/claimApi';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    claimApi
      .getHealth()
      .then((res) => setApiOnline(res.status === 'ONLINE'))
      .catch(() => setApiOnline(false));
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // If not on home page, navigate to home with hash
    window.location.href = `/#${id}`;
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--nav-height)',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Left: Overturn Logo with minimal legal-inspired icon */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'var(--color-navy)',
            color: '#FFFFFF',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Scale size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                OVERTURN
              </span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--color-gold-light)',
                color: 'var(--color-gold-hover)',
                border: '1px solid var(--color-gold-border)',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 'var(--radius-xs)',
                letterSpacing: '0.04em'
              }}>
                LEGALTECH
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Claim Denial &amp; Precedent Engine
            </span>
          </div>
        </Link>

        {/* Center: Institutional Navigation Links (Desktop) */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.75rem',
        }} className="desktop-nav">
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)',
              padding: '0.25rem 0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-royal)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection('features')}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)',
              padding: '0.25rem 0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-royal)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('legal-resources')}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)',
              padding: '0.25rem 0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-royal)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            Legal Resources
          </button>

          <button
            onClick={() => scrollToSection('about')}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)',
              padding: '0.25rem 0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-royal)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            About
          </button>

          <Link
            to="/dashboard"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/dashboard' ? 'var(--color-royal)' : 'var(--color-text-secondary)',
              padding: '0.25rem 0',
            }}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right: Auth & Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* System Status Pill */}
          <div
            title={apiOnline ? 'Statutory Precedent Engine Online' : 'Service Connecting...'}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: apiOnline ? 'var(--color-success)' : 'var(--color-text-muted)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: apiOnline ? 'var(--color-success-bg)' : 'var(--color-surface-subtle)',
              border: `1px solid ${apiOnline ? 'var(--color-success-border)' : 'var(--color-border)'}`,
            }}
            className="desktop-status"
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: apiOnline ? 'var(--color-success)' : '#9ca3af',
              display: 'inline-block'
            }} />
            <span>{apiOnline ? 'System Ready' : 'Connecting'}</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-navy)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <UserIcon size={14} color="var(--color-royal)" />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <LogIn size={15} />
              Sign In
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            to="/upload"
            className="btn btn-primary"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span>Analyze My Rejection</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              padding: '0.4rem',
              color: 'var(--color-navy)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 99
        }}>
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', padding: '0.5rem 0' }}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', padding: '0.5rem 0' }}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('legal-resources')}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', padding: '0.5rem 0' }}
          >
            Legal Resources
          </button>
          <button
            onClick={() => scrollToSection('about')}
            style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-main)', padding: '0.5rem 0' }}
          >
            About
          </button>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-royal)', padding: '0.5rem 0' }}
          >
            Dashboard
          </Link>
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            Analyze My Rejection
          </Link>
        </div>
      )}

      {/* Responsive media query styles */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-status { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 859px) {
          .desktop-nav { display: none !important; }
          .desktop-status { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
