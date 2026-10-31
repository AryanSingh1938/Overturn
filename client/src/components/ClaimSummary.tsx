import React, { useState } from 'react';
import { ExtractedFacts } from '../types';
import { Building2, FileCheck, Hash, User, Calendar, IndianRupee, Clock, Edit3, Save, Info } from 'lucide-react';

interface ClaimSummaryProps {
  facts: ExtractedFacts;
  onUpdateFacts?: (updated: ExtractedFacts) => void;
}

export const ClaimSummary: React.FC<ClaimSummaryProps> = ({ facts, onUpdateFacts }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableFacts, setEditableFacts] = useState<ExtractedFacts>({ ...facts });
  const [hasLocalEdits, setHasLocalEdits] = useState<boolean>(false);

  const handleFieldChange = (field: keyof ExtractedFacts, value: string | number) => {
    setEditableFacts((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasLocalEdits(true);
  };

  const handleSaveLocal = () => {
    setIsEditing(false);
    if (onUpdateFacts) {
      onUpdateFacts(editableFacts);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header with edit toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.85rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={22} color="var(--color-primary)" />
            Extracted Claim Facts & Metadata
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Facts extracted via OCR vision audit. Review and adjust if necessary for grievance representation.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSaveLocal();
            else setIsEditing(true);
          }}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
        >
          {isEditing ? (
            <>
              <Save size={15} color="var(--color-success)" />
              Save Edits
            </>
          ) : (
            <>
              <Edit3 size={15} />
              Edit Facts
            </>
          )}
        </button>
      </div>

      {/* Local edit indicator notice */}
      {hasLocalEdits && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.78rem',
          padding: '0.5rem 0.75rem',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-sm)',
          color: '#92400E',
        }}>
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Notice: Modified fields are held in frontend state for appeal drafting. Backend record remains original.</span>
        </div>
      )}

      {/* Grid of facts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        
        {/* Insurer Name */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Building2 size={13} />
            Insurance Company
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableFacts.insurer_name}
              onChange={(e) => handleFieldChange('insurer_name', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text-main)' }}>
              {editableFacts.insurer_name}
            </div>
          )}
        </div>

        {/* Claim ID */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Hash size={13} />
            Claim Reference ID
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableFacts.claim_id}
              onChange={(e) => handleFieldChange('claim_id', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 700, fontSize: '0.98rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
              {editableFacts.claim_id}
            </div>
          )}
        </div>

        {/* Policy Number */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Hash size={13} />
            Policy Number
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableFacts.policy_number}
              onChange={(e) => handleFieldChange('policy_number', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>
              {editableFacts.policy_number}
            </div>
          )}
        </div>

        {/* Denied Amount */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <IndianRupee size={13} />
            Repudiated Amount
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editableFacts.denial_amount}
              onChange={(e) => handleFieldChange('denial_amount', Number(e.target.value))}
            />
          ) : (
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-danger)' }}>
              ₹{editableFacts.denial_amount?.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Patient Name */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <User size={13} />
            Insured Patient
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableFacts.patient_name}
              onChange={(e) => handleFieldChange('patient_name', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {editableFacts.patient_name}
            </div>
          )}
        </div>

        {/* Continuous Duration */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Clock size={13} />
            Continuous Policy Age
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editableFacts.policy_duration_months}
              onChange={(e) => handleFieldChange('policy_duration_months', Number(e.target.value))}
            />
          ) : (
            <div style={{ fontWeight: 700, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>{editableFacts.policy_duration_months} Months</span>
              {editableFacts.policy_duration_months >= 60 ? (
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Moratorium Active</span>
              ) : (
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>&lt; 5 Years</span>
              )}
            </div>
          )}
        </div>

        {/* Rejection Date */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Calendar size={13} />
            Repudiation Notice Date
          </div>
          {isEditing ? (
            <input
              type="date"
              value={editableFacts.rejection_date}
              onChange={(e) => handleFieldChange('rejection_date', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {editableFacts.rejection_date}
            </div>
          )}
        </div>

        {/* Hospital Name */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Building2 size={13} />
            Treating Hospital
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editableFacts.hospital_name}
              onChange={(e) => handleFieldChange('hospital_name', e.target.value)}
            />
          ) : (
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
              {editableFacts.hospital_name}
            </div>
          )}
        </div>

      </div>

      {/* Raw Stated Grounds Box */}
      <div style={{
        backgroundColor: '#FFF7ED',
        border: '1px solid #FFEDD5',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
      }}>
        <div style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Exact Stated Repudiation Grounds Quoted in Letter
        </div>
        {isEditing ? (
          <textarea
            rows={3}
            value={editableFacts.raw_stated_grounds}
            onChange={(e) => handleFieldChange('raw_stated_grounds', e.target.value)}
          />
        ) : (
          <blockquote style={{ fontSize: '0.92rem', color: '#7C2D12', fontStyle: 'italic', lineHeight: 1.55 }}>
            "{editableFacts.raw_stated_grounds}"
          </blockquote>
        )}
      </div>

    </div>
  );
};

export default ClaimSummary;

