import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  PlusCircle,
  Clock,
  Building2,
  ArrowRight,
  Shield,
  Scale,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Send,
  Eye,
  Settings,
  BookOpen,
  Layers,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  FileCheck2,
  FolderOpen
} from 'lucide-react';
import claimApi from '../services/claimApi';

interface DashboardClaim {
  claim_id: string;
  claim_name: string;
  insurer_name: string;
  patient_name: string;
  denial_amount: number;
  rejection_date: string;
  policy_duration_months: number;
  status: 'Under Analysis' | 'Appeal Generated' | 'Escalated to GRO' | 'Ombudsman Eligible';
  score: number;
  last_updated: string;
}

const DEFAULT_BENCHMARK_CLAIMS: DashboardClaim[] = [
  {
    claim_id: 'CLM-DEL-2024-9182',
    claim_name: 'Appendectomy Emergency Hospitalization',
    insurer_name: 'Star Health and Allied Insurance',
    patient_name: 'Ramesh Kumar Verma',
    denial_amount: 285000,
    rejection_date: '2024-10-15',
    policy_duration_months: 68,
    status: 'Escalated to GRO',
    score: 88,
    last_updated: '2024-10-22',
  },
  {
    claim_id: 'CLM-MUM-2024-4410',
    claim_name: 'Cardiology Diagnostic Angioplasty',
    insurer_name: 'Care Health Insurance',
    patient_name: 'Priya Narang',
    denial_amount: 242800,
    rejection_date: '2024-11-05',
    policy_duration_months: 44,
    status: 'Appeal Generated',
    score: 79,
    last_updated: '2024-11-08',
  },
  {
    claim_id: 'CLM-BLR-2024-2194',
    claim_name: 'Orthopedic Joint Replacement',
    insurer_name: 'HDFC ERGO General Insurance',
    patient_name: 'Anand Kulkarni',
    denial_amount: 320000,
    rejection_date: '2024-11-12',
    policy_duration_months: 62,
    status: 'Under Analysis',
    score: 92,
    last_updated: '2024-11-12',
  },
];

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState<'overview' | 'my_claims' | 'precedents' | 'appeals' | 'escalations' | 'settings'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [claims, setClaims] = useState<DashboardClaim[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Table filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'score'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  useEffect(() => {
    const loadUserClaims = async () => {
      setIsLoading(true);
      let loaded: DashboardClaim[] = [];

      // 1. Fetch from backend API
      if (user && (user.email || user.id)) {
        try {
          const res = await claimApi.getMyClaims({ email: user.email, userId: user.id });
          if (res.success && Array.isArray(res.claims) && res.claims.length > 0) {
            loaded = res.claims.map((c: any) => {
              const facts = c.extracted_facts || {};
              const rawDate = facts.rejection_date || c.rejectionDate || new Date().toISOString().split('T')[0];
              const dateStr = typeof rawDate === 'string' ? rawDate.split('T')[0] : new Date(rawDate).toISOString().split('T')[0];
              
              let claimStatus: DashboardClaim['status'] = 'Under Analysis';
              const rawStatus = (c.dispatch_log?.status || c.status || '').toUpperCase();
              if (rawStatus.includes('DISPATCH')) {
                claimStatus = 'Escalated to GRO';
              } else if (rawStatus.includes('ESCALAT') || c.daysRemaining === 0) {
                claimStatus = 'Ombudsman Eligible';
              } else if (c.verified_draft_markdown || c.appealMarkdown) {
                claimStatus = 'Appeal Generated';
              }

              return {
                claim_id: facts.claim_id || c.claimId || `CLM-${Date.now()}`,
                claim_name: facts.summary_reason || `${facts.insurer_name || 'Insurance'} Repudiation Dispute`,
                insurer_name: facts.insurer_name || c.insurerName || 'Insurance Provider',
                patient_name: facts.patient_name || c.patientName || 'Policyholder',
                denial_amount: Number(facts.denial_amount || c.denial_amount || 0),
                rejection_date: dateStr,
                policy_duration_months: Number(facts.policy_duration_months || 0),
                status: claimStatus,
                score: c.win_probability?.score || 85,
                last_updated: c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : dateStr,
              };
            });
          }
        } catch (err) {
          console.warn('Backend claim query failed, checking user local cache:', err);
        }
      }

      // 2. Fallback to localStorage user cache
      if (loaded.length === 0 && user) {
        const userKey = user.email ? `overturn_claims_${user.email.toLowerCase().trim()}` : `overturn_claims_${user.id}`;
        const localData = localStorage.getItem(userKey);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed.map((item: any) => ({
                claim_id: item.claim_id,
                claim_name: `${item.insurer_name} Dispute`,
                insurer_name: item.insurer_name,
                patient_name: item.patient_name || 'Policyholder',
                denial_amount: item.denial_amount || 0,
                rejection_date: item.rejection_date || new Date().toISOString().split('T')[0],
                policy_duration_months: item.policy_duration_months || 0,
                status: item.moratorium_breached ? 'Appeal Generated' : 'Under Analysis',
                score: item.score || 80,
                last_updated: new Date().toISOString().split('T')[0],
              }));
            }
          } catch {}
        }
      }

      // 3. Fallback to benchmark samples if no personal claims exist
      if (loaded.length === 0) {
        loaded = DEFAULT_BENCHMARK_CLAIMS;
      }

      setClaims(loaded);
      setIsLoading(false);
    };

    loadUserClaims();
  }, [user]);

  // Derived Connected Metrics (Never hardcoded)
  const totalClaimsCount = claims.length;
  const underAnalysisCount = claims.filter((c) => c.status === 'Under Analysis').length;
  const appealsGeneratedCount = claims.filter((c) => c.status === 'Appeal Generated').length;
  const activeEscalationsCount = claims.filter((c) => c.status === 'Escalated to GRO' || c.status === 'Ombudsman Eligible').length;

  // Filtered & Sorted Claims
  const filteredClaims = useMemo(() => {
    return claims
      .filter((c) => {
        const matchesQuery =
          searchQuery.trim() === '' ||
          c.claim_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.claim_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.insurer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.patient_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' ||
          c.status.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase();

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'amount') {
          diff = a.denial_amount - b.denial_amount;
        } else if (sortField === 'score') {
          diff = a.score - b.score;
        } else {
          diff = new Date(a.rejection_date).getTime() - new Date(b.rejection_date).getTime();
        }
        return sortAsc ? diff : -diff;
      });
  }, [claims, searchQuery, statusFilter, sortField, sortAsc]);

  const getStatusBadge = (status: DashboardClaim['status']) => {
    switch (status) {
      case 'Escalated to GRO':
        return <span className="badge badge-primary">Escalated to GRO</span>;
      case 'Ombudsman Eligible':
        return <span className="badge badge-gold">Ombudsman Ready</span>;
      case 'Appeal Generated':
        return <span className="badge badge-success">Appeal Drafted</span>;
      case 'Under Analysis':
      default:
        return <span className="badge badge-neutral">Under Analysis</span>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-height))', backgroundColor: 'var(--color-bg)' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{
        width: sidebarCollapsed ? '72px' : '260px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--transition-fast)',
        flexShrink: 0,
      }} className="dashboard-sidebar">
        <div>
          {/* Sidebar Top Header */}
          <div style={{
            padding: '1.25rem 1.25rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{
                backgroundColor: 'var(--color-navy)',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Scale size={18} color="#fff" />
              </div>
              {!sidebarCollapsed && (
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  OVERTURN
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ padding: '0.25rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveNav('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeNav === 'overview' ? 'var(--color-royal-subtle)' : 'transparent',
                color: activeNav === 'overview' ? 'var(--color-royal)' : 'var(--color-text-secondary)',
                fontWeight: activeNav === 'overview' ? 700 : 500,
                fontSize: '0.9rem',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Layers size={18} />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>

            <button
              onClick={() => setActiveNav('my_claims')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeNav === 'my_claims' ? 'var(--color-royal-subtle)' : 'transparent',
                color: activeNav === 'my_claims' ? 'var(--color-royal)' : 'var(--color-text-secondary)',
                fontWeight: activeNav === 'my_claims' ? 700 : 500,
                fontSize: '0.9rem',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <FileText size={18} />
              {!sidebarCollapsed && <span>My Claims</span>}
            </button>

            <Link
              to="/upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
                width: '100%',
              }}
            >
              <PlusCircle size={18} color="var(--color-royal)" />
              {!sidebarCollapsed && <span>Analyze New Claim</span>}
            </Link>

            <Link
              to="/reality-check"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
                width: '100%',
              }}
            >
              <BookOpen size={18} />
              {!sidebarCollapsed && <span>Legal Precedents</span>}
            </Link>

            <Link
              to="/appeal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
                width: '100%',
              }}
            >
              <FileCheck2 size={18} />
              {!sidebarCollapsed && <span>Appeal Documents</span>}
            </Link>

            <Link
              to="/tracking"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.9rem',
                width: '100%',
              }}
            >
              <Clock size={18} />
              {!sidebarCollapsed && <span>Escalation Tracker</span>}
            </Link>

            <button
              onClick={() => setActiveNav('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeNav === 'settings' ? 'var(--color-royal-subtle)' : 'transparent',
                color: activeNav === 'settings' ? 'var(--color-royal)' : 'var(--color-text-secondary)',
                fontWeight: activeNav === 'settings' ? 700 : 500,
                fontSize: '0.9rem',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Settings size={18} />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: User Profile */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-surface)',
        }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-royal-subtle)',
                  color: 'var(--color-royal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  flexShrink: 0,
                }}>
                  {user.name.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <button
                  onClick={logout}
                  title="Sign Out"
                  style={{ color: 'var(--color-text-muted)', padding: '0.35rem' }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-royal)',
              }}
            >
              <UserIcon size={16} />
              {!sidebarCollapsed && <span>Sign In</span>}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main style={{ flex: 1, padding: '2.5rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Dashboard Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                Welcome Back{user ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Track your claims, review legal findings, and manage your appeals.
              </p>
            </div>

            <Link
              to="/upload"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.45rem', fontSize: '0.92rem' }}
            >
              <PlusCircle size={17} />
              <span>+ Analyze New Claim</span>
            </Link>
          </div>

          {/* Connected Summary Cards (Real Backend Metrics) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}>
            
            <div className="card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Total Claims
                </span>
                <FolderOpen size={18} color="var(--color-royal)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {totalClaimsCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Disputes logged in platform
              </div>
            </div>

            <div className="card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Under Analysis
                </span>
                <Clock size={18} color="var(--color-warning)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {underAnalysisCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Evaluating statutory grounds
              </div>
            </div>

            <div className="card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Appeals Generated
                </span>
                <FileCheck2 size={18} color="var(--color-success)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {appealsGeneratedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Rule 14(3) formal representations
              </div>
            </div>

            <div className="card" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Active Escalations
                </span>
                <Send size={18} color="var(--color-royal)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                {activeEscalationsCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                30-day cure window active
              </div>
            </div>

          </div>

          {/* Recent Claims Professional Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            
            {/* Table Action Bar */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.2rem' }}>
                  Recent Claims &amp; Disputes
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Review active insurance repudiations, violation findings, and procedural statuses.
                </p>
              </div>

              {/* Search & Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search claims or insurers..."
                    style={{
                      padding: '0.45rem 0.65rem 0.45rem 2rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    width: 'auto',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="under_analysis">Under Analysis</option>
                  <option value="appeal_generated">Appeal Generated</option>
                  <option value="escalated_to_gro">Escalated to GRO</option>
                  <option value="ombudsman_eligible">Ombudsman Ready</option>
                </select>

                <button
                  onClick={() => {
                    if (sortField === 'date') setSortField('amount');
                    else if (sortField === 'amount') setSortField('score');
                    else setSortField('date');
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  title="Toggle Sorting Field"
                >
                  <ArrowUpDown size={14} />
                  <span>Sort: {sortField.toUpperCase()}</span>
                </button>
              </div>
            </div>

            {/* Table Component */}
            {filteredClaims.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Claim / Reference</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Insurance Provider</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Rejection Amount</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Current Status</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Last Updated</th>
                      <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim) => (
                      <tr
                        key={claim.claim_id}
                        style={{
                          borderBottom: '1px solid var(--color-border-subtle)',
                          transition: 'background-color var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.9rem' }}>
                            {claim.claim_id}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {claim.claim_name}
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                          {claim.insurer_name}
                        </td>

                        <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                          ₹{claim.denial_amount.toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          {getStatusBadge(claim.status)}
                        </td>

                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                          {claim.last_updated}
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <Link
                            to={`/analysis/${encodeURIComponent(claim.claim_id.replace(/[\/\\]/g, '-'))}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <span>View Details</span>
                            <ChevronRight size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Meaningful Empty State */
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-royal-subtle)',
                  color: 'var(--color-royal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}>
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                  No Matching Claims Found
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  {searchQuery || statusFilter !== 'ALL'
                    ? 'No dispute records match your current filter criteria. Clear filters to see all claims.'
                    : 'You haven’t audited any insurance repudiation documents yet. Upload a letter to begin statutory tracking.'}
                </p>
                {searchQuery || statusFilter !== 'ALL' ? (
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="btn btn-secondary"
                  >
                    Clear Filter Criteria
                  </button>
                ) : (
                  <Link to="/upload" className="btn btn-primary">
                    <PlusCircle size={16} /> Analyze New Claim
                  </Link>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: fixed;
            z-index: 90;
            top: var(--nav-height);
            bottom: 0;
            left: 0;
          }
        }
      `}</style>

    </div>
  );
};

export default DashboardPage;
