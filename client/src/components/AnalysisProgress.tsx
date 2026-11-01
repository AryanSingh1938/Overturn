import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  FileText,
  Search,
  Scale,
  ShieldCheck,
  BrainCircuit,
  Loader2,
  LucideIcon,
} from 'lucide-react';

interface AnalysisProgressProps {
  isLoading: boolean;
  onComplete?: () => void;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  detail: string;
}

const STAGES: Step[] = [
  {
    id: 1,
    title: 'Document Uploaded & Verified',
    subtitle: 'SHA-256 hash verified, in-memory volatile buffer initialized',
    icon: FileText,
    detail: 'Secure zero-retention memory stream allocated without disk writes (DPDPA 2023 compliant).',
  },
  {
    id: 2,
    title: 'Extracting Clauses & Repudiation Grounds',
    subtitle: 'OCR vision parsing denial letter metadata and quoted policy clauses',
    icon: Search,
    detail: 'Extracting insurer identity, policy number, repudiation date, denial quantum, and cited exclusion clauses.',
  },
  {
    id: 3,
    title: 'Identifying Regulatory Violations',
    subtitle: 'Benchmarking against IRDAI 2024 Master Directions & 60-Month Moratorium',
    icon: ShieldCheck,
    detail: 'Checking continuous coverage tenure against statutory estoppel thresholds under IRDAI Health Regulations.',
  },
  {
    id: 4,
    title: 'Searching Judicial Precedents',
    subtitle: 'Querying 768-dimensional embeddings of Supreme Court & NCDRC rulings',
    icon: Scale,
    detail: 'Running cosine similarity search across authoritative case law on Pre-Existing Conditions and Contra Proferentem.',
  },
  {
    id: 5,
    title: 'Preparing Case Assessment & Appeal Strategy',
    subtitle: 'Calibrating evidentiary merits, counterarguments, and GRO appeal draft',
    icon: BrainCircuit,
    detail: 'Synthesizing statutory weights, identifying evidentiary gaps, and assembling formal representation dossier.',
  },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(1);
      return;
    }

    // Progress smoothly through the stages during the real API call
    const timer1 = setTimeout(() => setCurrentStep(2), 700);
    const timer2 = setTimeout(() => setCurrentStep(3), 1600);
    const timer3 = setTimeout(() => setCurrentStep(4), 2600);
    const timer4 = setTimeout(() => setCurrentStep(5), 3700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
        backgroundColor: '#FFFFFF',
        marginTop: '1.5rem',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '4px 12px',
            backgroundColor: 'var(--color-royal-subtle)',
            color: 'var(--color-royal)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          <Loader2 size={14} className="spin-slow" />
          AUTONOMOUS STATUTORY AUDIT IN PROGRESS
        </div>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
          Auditing Repudiation Document
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
          Please hold while Overturn extracts clauses, tests IRDAI compliance, and matches binding Supreme Court precedents.
        </p>
      </div>

      {/* Structured Multi-Stage Stepper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {STAGES.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isPending = currentStep < step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive
                  ? 'var(--color-royal-subtle)'
                  : isDone
                  ? '#FAFBFD'
                  : 'transparent',
                border: `1px solid ${
                  isActive
                    ? 'var(--color-royal)'
                    : isDone
                    ? 'var(--color-border-subtle)'
                    : 'transparent'
                }`,
                transition: 'all 0.25s ease',
              }}
            >
              {/* Step Status Icon */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isDone
                    ? 'var(--color-success-bg)'
                    : isActive
                    ? 'var(--color-royal)'
                    : 'var(--color-surface-subtle)',
                  color: isDone
                    ? 'var(--color-success)'
                    : isActive
                    ? '#FFFFFF'
                    : 'var(--color-text-muted)',
                  border: `1px solid ${
                    isDone
                      ? 'var(--color-success-border)'
                      : isActive
                      ? 'var(--color-royal)'
                      : 'var(--color-border)'
                  }`,
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={18} />
                ) : isActive ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <Icon size={16} />
                )}
              </div>

              {/* Step Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: isActive
                        ? 'var(--color-navy)'
                        : isDone
                        ? 'var(--color-text-main)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    Step {step.id}: {step.title}
                  </h4>
                  <span
                    className={`badge ${
                      isDone
                        ? 'badge-success'
                        : isActive
                        ? 'badge-primary'
                        : 'badge-neutral'
                    }`}
                    style={{ fontSize: '0.68rem' }}
                  >
                    {isDone ? 'COMPLETED' : isActive ? 'PROCESSING' : 'QUEUED'}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: isActive ? 'var(--color-text-main)' : 'var(--color-text-secondary)',
                    marginTop: '0.2rem',
                    lineHeight: 1.45,
                  }}
                >
                  {isActive ? step.detail : step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        .spin-slow {
          animation: spin 2.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalysisProgress;
