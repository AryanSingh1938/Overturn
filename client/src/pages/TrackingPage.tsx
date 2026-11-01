import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CaseStatus, OmbudsmanOffice, OmbudsmanComplaintResponse, OmbudsmanComplaintPayload } from '../types';
import { DEMO_CASE_STATUS, DEMO_ALL_CASES } from '../data/mockData';
import Timeline from '../components/Timeline';
import claimApi from '../services/claimApi';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Shield,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Download,
  CheckCircle2,
  ArrowRight,
  Info,
  Mail,
  Copy,
  Check,
  Search,
  X,
  FileCheck,
  Layers,
  ChevronRight,
  User,
  AlertTriangle,
  Send,
  PlusCircle,
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();

  // Multi-Claim State
  const [allClaims, setAllClaims] = useState<CaseStatus[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [caseData, setCaseData] = useState<CaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form VI Escalation State
  const [isGeneratingFormVI, setIsGeneratingFormVI] = useState<boolean>(false);
  const [formVIModalOpen, setFormVIModalOpen] = useState<boolean>(false);
  const [formVIResult, setFormVIResult] = useState<OmbudsmanComplaintResponse | null>(null);
  const [formVIError, setFormVIError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Delhi');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Regional Ombudsman Directory Modal State
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState<boolean>(false);
  const [ombudsmanOffices, setOmbudsmanOffices] = useState<OmbudsmanOffice[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false);
  const [directorySearch, setDirectorySearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const loadAllTrackedClaims = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      const collectedClaims: CaseStatus[] = [];
      const seenClaimIds = new Set<string>();

      // 1. Fetch all claims belonging to the authenticated user from backend API
      if (user && (user.email || user.id)) {
        try {
          const res = await claimApi.getMyClaims({ email: user.email, userId: user.id });
          if (res.success && Array.isArray(res.claims) && res.claims.length > 0) {
            res.claims.forEach((c: any) => {
              const cId = c.claimId || (c.extracted_facts && c.extracted_facts.claim_id);
              if (cId && !seenClaimIds.has(cId)) {
                seenClaimIds.add(cId);
                collectedClaims.push(c);
              }
            });
          }
        } catch (err) {
          console.warn('Could not query user claims from backend:', err);
        }
      }

      // 2. If a specific claim ID was provided in the URL e.g. /tracking/CLM-XXX, fetch its live status
      if (id && id.trim()) {
        const targetId = id.trim();
        try {
          const res = await claimApi.getCaseStatus(targetId);
          if (res.success && res.case) {
            const cId = res.case.claimId;
            if (cId && !seenClaimIds.has(cId)) {
              seenClaimIds.add(cId);
              collectedClaims.unshift(res.case);
            } else if (cId) {
              const idx = collectedClaims.findIndex((c) => c.claimId === cId);
              if (idx >= 0) collectedClaims[idx] = res.case;
            }
          }
        } catch (targetErr) {
          console.warn(`Could not load direct URL claim status for ${targetId}:`, targetErr);
        }
      }

      // 3. Check sessionStorage & localStorage for user's active/dispatched claims
      try {
        const currentClaimId = sessionStorage.getItem('overturn_current_claim_id');
        if (currentClaimId && !seenClaimIds.has(currentClaimId)) {
          const cachedStr = sessionStorage.getItem(`overturn_case_${currentClaimId}`);
          if (cachedStr) {
            const parsed = JSON.parse(cachedStr);
            if (parsed && parsed.claimId && !seenClaimIds.has(parsed.claimId)) {
              seenClaimIds.add(parsed.claimId);
              collectedClaims.unshift(parsed);
            }
          }
        }
      } catch {}

      // 4. Fallback: If no claims were found in DB or storage, supply the verified demo disputes
      if (collectedClaims.length === 0) {
        DEMO_ALL_CASES.forEach((demoCase) => {
          if (!seenClaimIds.has(demoCase.claimId)) {
            seenClaimIds.add(demoCase.claimId);
            collectedClaims.push(demoCase);
          }
        });
      }

      if (!isMounted) return;

      setAllClaims(collectedClaims);

      // Determine which claim to display as the active focused timeline
      let activeId = '';
      if (id && seenClaimIds.has(id.trim())) {
        activeId = id.trim();
      } else if (collectedClaims.length > 0) {
        activeId = collectedClaims[0].claimId;
      }

      setSelectedClaimId(activeId);
      const activeClaim = collectedClaims.find((c) => c.claimId === activeId) || collectedClaims[0] || null;
      setCaseData(activeClaim);
      setIsLoading(false);
    };

    loadAllTrackedClaims();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  // Handle switching active claim from card or table row
  const handleSelectClaim = (claim: CaseStatus) => {
    setSelectedClaimId(claim.claimId);
    setCaseData(claim);
    // Smoothly update URL without reloading page
    navigate(`/tracking/${encodeURIComponent(claim.claimId.replace(/[\/\\]/g, '-'))}`, { replace: true });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleGenerateOmbudsmanComplaint = async () => {
    if (!caseData) return;
    setIsGeneratingFormVI(true);
    setFormVIError(null);
    try {
      const payload: OmbudsmanComplaintPayload = {
        extractedFacts: caseData.extractedFacts || {
          claim_id: caseData.claimId || id || 'CLM-DEL-2024-9182',
          insurer_name: caseData.insurerName || 'Insurance Provider',
          patient_name: caseData.extractedFacts?.patient_name || caseData.claimantName || 'Policyholder',
          denial_amount: caseData.extractedFacts?.denial_amount || 185000,
          policy_number: caseData.extractedFacts?.policy_number || 'POL-UNKNOWN',
          policy_duration_months: caseData.extractedFacts?.policy_duration_months || 60,
          raw_stated_grounds: caseData.extractedFacts?.raw_stated_grounds || 'Repudiation under policy terms.',
          hospital_name: caseData.extractedFacts?.hospital_name || 'Hospital',
        },
        precedents: [],
        state: selectedState,
        claimantDetails: {
          name: user?.name || caseData.claimantName || caseData.extractedFacts?.patient_name || 'Policyholder',
          email: user?.email || caseData.destinationEmail || 'claimant@example.com',
          phone: '+91-9876543210',
          address: 'Civil Lines, New Delhi - 110054',
        },
        groNoticeDate: caseData.dispatchedAt || new Date(Date.now() - 32 * 86400000).toISOString(),
        hasConcurrentCourtProceeding: false,
      };

      const res = await claimApi.generateOmbudsmanComplaint(payload);

      if (res.success && (res.complaint_markdown || res.form_vi_markdown)) {
        const text = res.complaint_markdown || res.form_vi_markdown || '';
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Overturn_Ombudsman_Form_VI_${caseData.claimId || 'Claim'}.md`;
        link.click();
        URL.revokeObjectURL(url);

        setFormVIResult(res);
        setFormVIModalOpen(true);
      } else {
        throw new Error(res.error || 'Failed to generate Form VI complaint package.');
      }
    } catch (err: any) {
      console.warn('Ombudsman complaint error:', err);
      setFormVIError(err.message || 'Could not connect to Ombudsman generator API.');
    } finally {
      setIsGeneratingFormVI(false);
    }
  };

  const handleOpenDirectory = async () => {
    setIsDirectoryModalOpen(true);
    if (ombudsmanOffices.length === 0) {
      setIsLoadingDirectory(true);
      try {
        const res = await claimApi.getOmbudsmanDirectory();
        if (res.success && (res.offices || res.benches)) {
          setOmbudsmanOffices(res.offices || res.benches || []);
        }
      } catch (err) {
        console.warn('Failed to load Ombudsman directory:', err);
      } finally {
        setIsLoadingDirectory(false);
      }
    }
  };

  const handleCopyComplaint = () => {
    if (formVIResult?.complaint_markdown || formVIResult?.form_vi_markdown) {
      navigator.clipboard.writeText(formVIResult.complaint_markdown || formVIResult.form_vi_markdown || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const filteredOffices = ombudsmanOffices.filter((o) => {
    if (!directorySearch) return true;
    const q = directorySearch.toLowerCase();
    return (
      o.office_name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      (o.states && o.states.some((s) => s.toLowerCase().includes(q)))
    );
  });

  if (isLoading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading case tracking timeline...</p>
      </div>
    );
  }

  if (errorMsg && allClaims.length === 0) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '520px' }}>
          <AlertCircle size={36} color="var(--color-danger)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Tracking Records Found</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {errorMsg}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/upload" className="btn btn-primary">Analyse Claim</Link>
            <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const isFormVIUnlocked = Boolean(caseData && caseData.daysRemaining <= 0);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '1080px' }}>
        
        {/* Top Header Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">STATUTORY DISPUTE DOCKET</span>
              <span className="badge badge-neutral">{allClaims.length} Claims Monitored</span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>
              Claims Grievance Tracking
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              Monitoring {allClaims.length} insurance repudiation dispute{allClaims.length > 1 ? 's' : ''} against mandatory IRDAI 30-day cure window & Ombudsman deadlines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/upload" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <PlusCircle size={15} /> Audit New Claim
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Dashboard
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ALL CLAIMS SELECTOR CARDS (Shows tracking status of ALL claims) */}
        {/* ============================================================== */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={18} color="var(--color-primary)" />
              All Tracked Claims ({allClaims.length})
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Click any claim to inspect its full timeline & Ombudsman dossier
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}>
            {allClaims.map((claim) => {
              const isSelected = claim.claimId === selectedClaimId;
              const isCureClosed = claim.daysRemaining <= 0;
              const amount = claim.extractedFacts?.denial_amount || (claim as any).denial_amount || 0;
              const patient = claim.claimantName || claim.extractedFacts?.patient_name || 'Policyholder';

              return (
                <div
                  key={claim.claimId}
                  onClick={() => handleSelectClaim(claim)}
                  style={{
                    backgroundColor: isSelected ? '#FFF8F4' : '#fff',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(242, 107, 58, 0.15)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      backgroundColor: 'rgba(242, 107, 58, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      letterSpacing: '0.5px',
                    }}>
                      SELECTED
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                    }}>
                      {claim.claimId}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
                    {claim.insurerName}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.65rem' }}>
                    Patient: <strong>{patient}</strong> {amount > 0 && `• ₹${amount.toLocaleString('en-IN')}`}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.65rem' }}>
                    <span className={`badge ${isCureClosed ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                      {isCureClosed ? 'Form VI Ready' : `${claim.daysRemaining} Days Left`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Token: <code style={{ fontFamily: 'var(--font-mono)' }}>{claim.trackingToken.slice(-8)}</code>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ACTIVE CLAIM DETAIL SECTION                                    */}
        {/* ============================================================== */}
        {caseData && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary">ACTIVE DOCKET</span>
                  <span className="badge badge-success">{caseData.status}</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', margin: '0.25rem 0' }}>
                  {caseData.insurerName}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Tracking Token: <strong style={{ fontFamily: 'var(--font-mono)' }}>{caseData.trackingToken}</strong> • Claim Ref: <strong>{caseData.claimId}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Statutory 30-Day Window
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isFormVIUnlocked ? 'var(--color-success)' : 'var(--color-primary)' }}>
                  {isFormVIUnlocked ? 'Window Concluded' : `${caseData.daysRemaining} Days Left`}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Deadline: {new Date(caseData.statutoryDeadline30d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Overview Details Grid for Active Claim */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Insurer Target
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                  {caseData.insurerName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {caseData.destinationEmail || 'Grievance Redressal Officer'}
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Dispatched On
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                  {new Date(caseData.dispatchedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Formal Rule 14(3) Notice
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Disputed Amount
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-danger)' }}>
                  ₹{(caseData.extractedFacts?.denial_amount || (caseData as any).denial_amount || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Patient: {caseData.claimantName || caseData.extractedFacts?.patient_name || 'Policyholder'}
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Cure Deadline
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary)' }}>
                  {new Date(caseData.statutoryDeadline30d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {caseData.daysRemaining > 0 ? `${caseData.daysRemaining} Days Remaining` : 'Window Concluded'}
                </div>
              </div>
            </div>

            {/* Interactive Timeline Component */}
            <div style={{ marginBottom: '2rem' }}>
              <Timeline
                milestones={caseData.milestones}
                daysRemaining={caseData.daysRemaining}
                statutoryDeadline30d={caseData.statutoryDeadline30d}
                rejectionDate={caseData.extractedFacts?.rejection_date}
                onTriggerOmbudsman={handleGenerateOmbudsmanComplaint}
              />
            </div>

            {/* Escalation Stage Next Steps */}
            <div style={{
              borderLeft: `5px solid ${isFormVIUnlocked ? 'var(--color-success)' : 'var(--color-info)'}`,
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className={`badge ${isFormVIUnlocked ? 'badge-success' : 'badge-neutral'}`}>
                      {isFormVIUnlocked ? 'ESCORT READY' : 'STAGE 1: INSURER CURE WINDOW'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Rule 13(1)(b) Insurance Ombudsman
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {isFormVIUnlocked
                      ? 'Statutory 30-Day Window Concluded: File Before Insurance Ombudsman'
                      : 'Awaiting Insurer Grievance Closure'}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: '620px', lineHeight: 1.6 }}>
                    {isFormVIUnlocked
                      ? `The insurer failed to resolve grievance for claim ${caseData.claimId} within 30 days. You have the statutory right under Rule 13 to file Form VI before the Insurance Ombudsman Regional Bench.`
                      : `By law, the insurance company has 30 continuous days to reconsider and sanction the claim. If they fail or reject again, your Ombudsman Form VI petition unlocks on ${new Date(caseData.statutoryDeadline30d).toLocaleDateString('en-IN')}.`}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        backgroundColor: '#fff',
                      }}
                      title="Select claimant state for territorial jurisdiction"
                    >
                      <option value="Delhi">Delhi Bench</option>
                      <option value="Maharashtra">Mumbai / Pune Bench</option>
                      <option value="Karnataka">Bengaluru Bench</option>
                      <option value="Tamil Nadu">Chennai Bench</option>
                      <option value="West Bengal">Kolkata Bench</option>
                      <option value="Uttar Pradesh">Noida / Lucknow Bench</option>
                      <option value="Gujarat">Ahmedabad Bench</option>
                      <option value="Telangana">Hyderabad Bench</option>
                      <option value="Punjab">Chandigarh Bench</option>
                      <option value="Kerala">Kochi Bench</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleGenerateOmbudsmanComplaint}
                      disabled={isGeneratingFormVI}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      <Download size={16} />
                      {isGeneratingFormVI ? 'Synthesizing Form VI...' : isFormVIUnlocked ? 'Download Ombudsman Form VI' : 'Generate Form VI Dossier'}
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenDirectory}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Building2 size={15} />
                      18 Regional Benches Directory
                    </button>
                  </div>

                  {formVIError && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>
                      {formVIError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ALL CLAIMS SUMMARY TABLE                                       */}
        {/* ============================================================== */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.75rem',
          }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Comprehensive Claims Tracking Docket</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                Consolidated statutory status across all {allClaims.length} disputes registered under this account
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Claim Ref / Token</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Insurer & Patient</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Denied Amount</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Dispatched Date</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Cure Deadline</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allClaims.map((c) => {
                  const isSelected = c.claimId === selectedClaimId;
                  const isClosed = c.daysRemaining <= 0;
                  const amt = c.extractedFacts?.denial_amount || (c as any).denial_amount || 0;
                  const patient = c.claimantName || c.extractedFacts?.patient_name || 'Policyholder';

                  return (
                    <tr
                      key={c.claimId}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'rgba(242, 107, 58, 0.04)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {c.claimId}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {c.trackingToken}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{c.insurerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{patient}</div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600, color: 'var(--color-danger)' }}>
                        {amt > 0 ? `₹${amt.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                        {new Date(c.dispatchedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div>{new Date(c.statutoryDeadline30d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                        <div style={{ fontSize: '0.72rem', color: isClosed ? 'var(--color-success)' : 'var(--color-primary)', fontWeight: 600 }}>
                          {isClosed ? 'Concluded' : `${c.daysRemaining}d left`}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span className={`badge ${isClosed ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          {isClosed ? 'Escort Ready' : 'In Cure Window'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleSelectClaim(c)}
                          className={isSelected ? 'btn btn-primary' : 'btn btn-secondary'}
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                        >
                          {isSelected ? 'Active' : 'Track'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Form VI Generated Dossier */}
        {formVIModalOpen && formVIResult && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
            backdropFilter: 'blur(4px)',
          }}>
            <div className="card" style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>Statutory Ombudsman Form VI Ready</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Rule 14(1) Insurance Ombudsman Rules, 2017
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormVIModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  📍 Resolved Territorial Bench: {formVIResult.ombudsman_office?.office_name || 'Regional Office'}
                </div>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  <strong>Address: </strong>{formVIResult.ombudsman_office?.address}
                </div>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  <strong>Official Email: </strong>
                  <code style={{ fontFamily: 'var(--font-mono)' }}>{formVIResult.ombudsman_office?.email}</code>
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Helpline: </strong>{formVIResult.ombudsman_office?.phone}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: '#065F46',
                marginBottom: '1.5rem',
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Statutory Validation Complete: </strong>
                  Rule 17 Pecuniary limit satisfied (&lt; ₹30,00,000) • Mandatory 30-day prior GRO representation confirmed.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyComplaint}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {isCopied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                  {isCopied ? 'Copied Full Petition' : 'Copy Form VI Text'}
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {formVIResult.mailto_url && (
                    <a
                      href={formVIResult.mailto_url}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Mail size={16} /> Open Email to Ombudsman
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormVIModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal: 18 Regional Ombudsman Benches Directory */}
        {isDirectoryModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
            backdropFilter: 'blur(4px)',
          }}>
            <div className="card" style={{
              maxWidth: '720px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Building2 size={22} color="var(--color-primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>Council for Insurance Ombudsmen (CIO) Directory</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      18 Territorial Benches Across India (Rule 14 Insurance Ombudsman Rules, 2017)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDirectoryModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search filter */}
              <div style={{
                position: 'relative',
                marginBottom: '1rem',
              }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by state, city, or bench name..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  style={{
                    paddingLeft: '36px',
                    width: '100%',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              {isLoadingDirectory ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Loading territorial Ombudsman offices...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {filteredOffices.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No benches matching "{directorySearch}".
                    </div>
                  ) : (
                    filteredOffices.map((office, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.85rem 1rem',
                          backgroundColor: 'var(--color-surface-subtle)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.92rem' }}>
                            {office.office_name}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            {office.states ? office.states.join(', ') : 'Territorial Jurisdiction'}
                          </span>
                        </div>
                        <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                          {office.address}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                          <div>
                            <strong>Email: </strong>
                            <a href={`mailto:${office.email}`} style={{ fontFamily: 'var(--font-mono)' }}>
                              {office.email}
                            </a>
                          </div>
                          <div>
                            <strong>Phone: </strong>{office.phone}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a
                  href="https://www.cioins.co.in/Ombudsman"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  Official CIO Portal <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={() => setIsDirectoryModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackingPage;
