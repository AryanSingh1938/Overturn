import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per server multer limit

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onSubmit, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateAndSetFile = (file: File) => {
    setErrorMsg(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload an official repudiation letter in PDF, PNG, JPG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`File size exceeds 10MB limit. (Your file: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview URL for images and PDFs
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Upload Dropzone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isDragging ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            boxShadow: isDragging ? 'var(--shadow-md)' : 'none',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}>
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Upload Insurer Repudiation Letter
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
            Drag and drop your claim denial notice or click to browse. Our engine audits the rejection grounds against statutory 2024 IRDAI master circulars.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-neutral">PDF Supported</span>
            <span className="badge badge-neutral">JPG / PNG / WEBP</span>
            <span className="badge badge-neutral">Max 10 MB</span>
          </div>
        </div>
      ) : (
        /* Selected File Card & Preview */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedFile.type === 'application/pdf' ? '#FEE2E2' : '#DBEAFE',
                color: selectedFile.type === 'application/pdf' ? '#DC2626' : '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {selectedFile.type === 'application/pdf' ? <FileText size={26} /> : <ImageIcon size={26} />}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)', wordBreak: 'break-all' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                </div>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', color: 'var(--color-danger)' }}
              title="Remove File"
            >
              <X size={16} />
              Remove
            </button>
          </div>

          {/* Image Preview if available */}
          {previewUrl && (
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              maxHeight: '260px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#f8fafc',
              textAlign: 'center',
            }}>
              <img
                src={previewUrl}
                alt="Document preview"
                style={{ maxHeight: '260px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          )}

          {selectedFile.type === 'application/pdf' && (
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-secondary)',
            }}>
              <CheckCircle size={16} color="var(--color-success)" />
              PDF Ready for In-Memory Multi-Page OCR & Statutory Extraction
            </div>
          )}
        </div>
      )}

      {/* Validation Error Message */}
      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Policyholder Consent Checkbox */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
      }}>
        <input
          type="checkbox"
          id="consentCheckbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
        />
        <label htmlFor="consentCheckbox" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
          I confirm that this document is an authentic claim repudiation letter issued by a licensed insurer in India. I understand that Overturn is a civic assistance platform and that I retain full discretion over any formal grievance escalation.
        </label>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading || (!selectedFile && !errorMsg) || !consentChecked}
        className="btn btn-primary"
        style={{
          padding: '1rem 2rem',
          fontSize: '1.05rem',
          width: '100%',
        }}
      >
        {isLoading ? (
          <>
            <span className="spinner" style={{
              width: '18px',
              height: '18px',
              border: '2px solid #ffffff',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              display: 'inline-block',
            }} />
            Auditing Repudiation Clauses with AI Engine...
          </>
        ) : (
          <>
            <Eye size={20} />
            Analyse My Claim
          </>
        )}
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;

