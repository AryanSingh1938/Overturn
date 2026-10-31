import React from 'react';
import { Milestone } from '../types';
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface TimelineProps {
  milestones: Milestone[];
  daysRemaining: number;
  statutoryDeadline30d: string;
}

export const Timeline: React.FC<TimelineProps> = ({ milestones, daysRemaining, statutoryDeadline30d }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Countdown Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: 'var(--color-surface-subtle)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Rule 14(3) Insurer 30-Day Cure Window
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {daysRemaining > 0 ? `${daysRemaining} Days Remaining` : 'Cure Window Concluded'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Statutory Deadline Date
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
            {new Date(statutoryDeadline30d).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Sequential Milestone Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '1.5rem' }}>
        
        {/* Continuous timeline line */}
        <div style={{
          position: 'absolute',
          left: '7px',
          top: '12px',
          bottom: '24px',
          width: '2px',
          backgroundColor: 'var(--color-border)',
        }} />

        {milestones.map((m, idx) => {
          const isCurrent = !m.completed && (idx === 0 || milestones[idx - 1].completed);

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                position: 'relative',
                paddingBottom: idx === milestones.length - 1 ? 0 : '1.75rem',
              }}
            >
              {/* Dot Icon */}
              <div style={{
                position: 'absolute',
                left: '-1.5rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: m.completed
                  ? 'var(--color-success)'
                  : isCurrent
                  ? 'var(--color-primary)'
                  : '#CBD5E1',
                border: '3px solid #FFFFFF',
                boxShadow: isCurrent ? '0 0 0 3px var(--color-primary-light)' : 'none',
                marginTop: '3px',
              }} />

              {/* Milestone Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: m.completed ? 'var(--color-text-main)' : isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    Day {m.day}: {m.title}
                  </div>
                  <span className={`badge ${m.completed ? 'badge-success' : isCurrent ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                    {m.completed ? 'COMPLETED' : isCurrent ? 'ACTIVE NOW' : 'PENDING'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default Timeline;

