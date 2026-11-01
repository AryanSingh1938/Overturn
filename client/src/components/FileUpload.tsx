import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB server limit

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onSubmit,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [consentChecked, setConsentChecked] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateAndSetFile = (file: File) => {
    setErrorMsg(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg(
        'Unsupported file format. Please upload an official repudiation letter in PDF, JPG, PNG, or WEBP format.'
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(
        `File size exceeds 10MB limit. (Your file: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB)`
      );
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

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

  const handleTriggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload Dropzone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerBrowse}
          style={{
            border: `2px dashed ${
              isDragging ? 'var(--color-royal)' : 'var(--color-border)'
            }`,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isDragging
              ? 'var(--color-royal-subtle)'
              : 'var(--color-surface)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            boxShadow: isDragging ? 'var(--shadow-md)' : 'var(--shadow-xs)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-royal-subtle)',
              color: 'var(--color-royal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '1px solid var(--color-royal-light)',
            }}
          >
            <UploadCloud size={30} />
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              color: 'var(--color-navy)',
              fontWeight: 700,
              marginBottom: '0.4rem',
            }}
          >
            Upload Repudiation or Denial Notice
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.25rem',
              maxWidth: '460px',
              margin: '0 auto 1.25rem auto',
              lineHeight: 1.5,
            }}
          >
            Drag & drop your official claim denial document or{' '}
            <span
              style={{
                color: 'var(--color-royal)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              browse files
            </span>{' '}
            from your computer.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="badge badge-neutral">PDF Documents</span>
            <span className="badge badge-neutral">JPG / PNG / WebP</span>
            <span className="badge badge-neutral">Max 10 MB</span>
            <span className="badge badge-neutral">In-Memory OCR</span>
          </div>
        </div>
      ) : (
        /* Selected File Card & Preview */
        <div
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor:
                    selectedFile.type === 'application/pdf'
                      ? 'var(--color-danger-bg)'
                      : 'var(--color-royal-subtle)',
                  color:
                    selectedFile.type === 'application/pdf'
                      ? 'var(--color-danger)'
                      : 'var(--color-royal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${
                    selectedFile.type === 'application/pdf'
                      ? 'var(--color-danger-border)'
                      : 'var(--color-royal-light)'
                  }`,
                }}
              >
                {selectedFile.type === 'application/pdf' ? (
                  <FileText size={26} />
                ) : (
                  <ImageIcon size={26} />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--color-navy)',
                    wordBreak: 'break-all',
                  }}
                >
                  {selectedFile.name}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '2px',
                  }}
                >
                  {formatFileSize(selectedFile.size)} •{' '}
                  {selectedFile.type || 'Document'} • Ready for analysis
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleTriggerBrowse}
                disabled={isLoading}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              >
                <RefreshCw size={14} /> Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isLoading}
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  color: 'var(--color-danger)',
                }}
              >
                <X size={14} /> Remove
              </button>
            </div>
          </div>

          {/* Visual Image Preview */}
          {previewUrl && (
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxHeight: '260px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                textAlign: 'center',
                padding: '0.5rem',
              }}
            >
              <img
                src={previewUrl}
                alt="Document preview"
                style={{
                  maxHeight: '240px',
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            </div>
          )}

          {/* PDF Format Confirmation Banner */}
          {selectedFile.type === 'application/pdf' && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              <CheckCircle size={16} color="var(--color-success)" />
              <span>
                <strong>Multi-Page PDF Detected:</strong> In-memory OCR will extract
                structured clauses, dates, policy identifiers, and repudiation terms.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Validation Error Message */}
      {errorMsg && (
        <div className="alert alert-danger" style={{ margin: 0 }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Privacy & Provenance Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '0.85rem 1.1rem',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}
      >
        <Lock
          size={16}
          color="var(--color-royal)"
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <div>
          <strong style={{ color: 'var(--color-navy)' }}>
            Zero-Disk Ephemeral Privacy (DPDPA 2023):
          </strong>{' '}
          Documents are processed in volatile RAM buffers. No medical records, identity
          proofs, or policy documents are retained on disk or used for public AI training.
        </div>
      </div>

      {/* Policyholder Consent Checkbox */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '0.85rem 1.1rem',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <input
          type="checkbox"
          id="consentCheckbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          style={{
            width: '18px',
            height: '18px',
            marginTop: '2px',
            cursor: 'pointer',
            accentColor: 'var(--color-royal)',
          }}
        />
        <label
          htmlFor="consentCheckbox"
          style={{
            fontSize: '0.84rem',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            lineHeight: 1.45,
          }}
        >
          I confirm that this document is an authentic claim repudiation notice issued by a
          licensed insurer in India, and I authorize Overturn to perform statutory clause
          extraction and precedent matching.
        </label>
      </div>

      {/* Primary CTA: Analyze Document */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || (!selectedFile && !errorMsg) || !consentChecked}
        className="btn btn-primary"
        style={{
          padding: '0.95rem 1.75rem',
          fontSize: '1.02rem',
          fontWeight: 700,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
        }}
      >
        <ShieldCheck size={20} />
        {isLoading ? 'Analyzing Repudiation Document...' : 'Analyze Document'}
        {!isLoading && <ArrowRight size={18} />}
      </button>
    </div>
  );
};

export default FileUpload;
