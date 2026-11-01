import React from 'react';
import { Milestone } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Scale,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface TimelineProps {
  milestones: Milestone[];
  daysRemaining: number;
  statutoryDeadline30d: string;
  rejectionDate?: string;
  onTriggerOmbudsman?: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  milestones,
  daysRemaining,
  statutoryDeadline30d,
  rejectionDate,
  onTriggerOmbudsman,
}) => {
  const isCureWindowClosed = daysRemaining <= 0;

  // Canonical 5-Step Regulatory Process
  const canonicalSteps = [
    {
      stepNumber: 1,
      title: 'Step 1: Rejection Received',
      description: 'Official repudiation letter received from insurer stating rejection grounds.',
      date: rejectionDate || 'Day 0',
      isCompleted: true,
      status: 'COMPLETED',
    },
    {
      stepNumber: 2,
      title: 'Step 2: Appeal Submitted to Grievance Officer',
      description: 'Formal representation invoking IRDAI Master Circular 2024 Section 6 dispatched to GRO.',
      date: 'Dispatched',
      isCompleted: true,
      status: 'COMPLETED',
    },
    {
      stepNumber: 3,
      title: 'Step 3: Statutory Response Window (30 Days)',
      description: 'Statutory cure window under Rule 14(3) of Insurance Ombudsman Rules 2017.',
      date: isCureWindowClosed ? 'Concluded' : `${daysRemaining} days remaining`,
      isCompleted: isCureWindowClosed,
      isActive: !isCureWindowClosed,
      status: isCureWindowClosed ? 'COMPLETED' : 'ACTIVE NOW',
    },
    {
      stepNumber: 4,
      title: 'Step 4: Escalation to Insurance Ombudsman',
      description: 'Automatic Form VI statutory complaint filing triggered upon 30-day insurer non-response.',
      date: isCureWindowClosed ? 'Action Required' : 'Unlocks on Day 31',
      isCompleted: false,
      isActive: isCureWindowClosed,
      status: isCureWindowClosed ? 'JURISDICTION UNLOCKED' : 'PENDING DAY 31',
      canTrigger: isCureWindowClosed,
    },
    {
      stepNumber: 5,
      title: 'Step 5: Final Resolution',
      description: 'Ombudsman summary award under Rule 17 or full negotiated settlement with penal interest.',
      date: 'Final Hearing',
      isCompleted: false,
      isActive: false,
      status: 'PENDING',
    },
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.75rem' }}>
      
      {/* Top Countdown Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: isCureWindowClosed ? 'var(--color-warning-bg)' : 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${isCureWindowClosed ? 'var(--color-warning-border)' : 'var(--color-terracotta-border)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isCureWindowClosed ? '#FFFFFF' : 'var(--color-primary)',
              color: isCureWindowClosed ? 'var(--color-warning)' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {isCureWindowClosed ? <AlertTriangle size={24} /> : <Clock size={24} />}
          </div>

          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: isCureWindowClosed ? 'var(--color-warning)' : 'var(--color-primary)',
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              RULE 14(3) INSURER 30-DAY STATUTORY CURE WINDOW
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              {isCureWindowClosed ? '30-Day Cure Period Expired' : `${daysRemaining} Days Remaining`}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {isCureWindowClosed
                ? 'Insurer has defaulted on statutory cure window. Immediate Insurance Ombudsman Form VI jurisdiction is unlocked.'
                : 'Insurer is legally obligated to respond before the cure deadline.'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Statutory Default Date
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-navy)' }}>
            {new Date(statutoryDeadline30d).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Sequential 5-Step Vertical Milestone Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '2rem', marginTop: '0.5rem' }}>
        
        {/* Continuous Timeline Track Line */}
        <div
          style={{
            position: 'absolute',
            left: '11px',
            top: '16px',
            bottom: '24px',
            width: '2px',
            backgroundColor: 'var(--color-border)',
          }}
        />

        {canonicalSteps.map((step, idx) => {
          const isDone = step.isCompleted;
          const isActive = step.isActive;
          const isLast = idx === canonicalSteps.length - 1;

          return (
            <div
              key={step.stepNumber}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                position: 'relative',
                paddingBottom: isLast ? 0 : '2rem',
              }}
            >
              {/* Dot / Status Node */}
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isDone
                    ? 'var(--color-success)'
                    : isActive
                    ? 'var(--color-primary)'
                    : '#CBD5E1',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #FFFFFF',
                  boxShadow: isActive ? '0 0 0 3px var(--color-terracotta-border)' : 'var(--shadow-xs)',
                  marginTop: '1px',
                  zIndex: 2,
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={14} color="#FFFFFF" />
                ) : (
                  <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{step.stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              <div
                style={{
                  flex: 1,
                  padding: '1rem 1.25rem',
                  backgroundColor: isActive
                    ? 'var(--color-primary-light)'
                    : isDone
                    ? '#FAFBFD'
                    : 'transparent',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${
                    isActive
                      ? 'var(--color-terracotta-border)'
                      : isDone
                      ? 'var(--color-border-subtle)'
                      : 'transparent'
                  }`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: isActive
                        ? 'var(--color-navy)'
                        : isDone
                        ? 'var(--color-navy)'
                        : 'var(--color-text-muted)',
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h4>

                  <span
                    className={`badge ${
                      isDone
                        ? 'badge-success'
                        : isActive
                        ? 'badge-primary'
                        : 'badge-neutral'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {step.status}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.84rem',
                    color: isActive ? 'var(--color-navy)' : 'var(--color-text-secondary)',
                    margin: '0.35rem 0 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  {step.description}
                </p>

                {/* Inline Action for Step 4 when Day 31 reached */}
                {step.stepNumber === 4 && isCureWindowClosed && onTriggerOmbudsman && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={onTriggerOmbudsman}
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.82rem',
                        padding: '0.5rem 1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Scale size={14} /> Generate Ombudsman Form VI Complaint
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Timeline;
