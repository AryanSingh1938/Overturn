import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  FileSearch,
  LayoutDashboard,
  Clock,
  LogIn,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    window.location.href = `/#${id}`;
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #E5E0D6',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(28, 31, 38, 0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        {/* Left: Overturn Shield Logo & Civic Badge */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          {/* Terracotta Shield Emblem */}
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(224, 86, 56, 0.28)',
              flexShrink: 0,
            }}
          >
            <Shield size={22} color="#FFFFFF" strokeWidth={2.4} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-navy)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                OVERTURN
              </span>

              {/* Civic Pill Badge */}
              <span
                style={{
                  fontSize: '0.65rem',
                  backgroundColor: 'var(--color-terracotta-light)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-terracotta-border)',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                CIVIC
              </span>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                marginTop: '1px',
              }}
            >
              Claim Denial &amp; Appeal Engine
            </span>
          </div>
        </Link>

        {/* Center: Clean Navigation Links */}
        <nav
          className="hidden md:flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <Link
            to="/upload"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color:
                location.pathname === '/upload'
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FileSearch size={16} />
            Analyse Claim
          </Link>

          <Link
            to="/dashboard"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color:
                location.pathname === '/dashboard'
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            to="/tracking"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color:
                location.pathname.startsWith('/tracking')
                  ? 'var(--color-primary)'
                  : 'var(--color-text-secondary)',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Clock size={16} />
            Tracking
          </Link>

          {isHome && (
            <>
              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('trust')}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                Legal Resources
              </button>
            </>
          )}
        </nav>

        {/* Right: Minimal, Uncluttered User Authentication Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-terracotta-light)',
                  border: '1px solid var(--color-terracotta-border)',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name ? user.name.split(' ')[0] : 'Advocate'}</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <LogIn size={14} />
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              padding: '0.5rem',
              color: 'var(--color-navy)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '2px solid var(--color-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 99,
          }}
        >
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileSearch size={18} /> Analyse Claim
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/tracking"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Clock size={18} /> Tracking
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
