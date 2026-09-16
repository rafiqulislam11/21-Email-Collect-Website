import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ComplianceConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ComplianceConfirmationModal: React.FC<ComplianceConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '28px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>🛡 Public Business Data Compliance Charter</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Mandatory legal confirmation prior to initiating public lead discovery.
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            “Only publicly available business contact information may be collected.”
          </div>

          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
            <li>✓ Collect only publicly displayed business contact information from legitimate online directories and business websites.</li>
            <li>✓ Respect website Terms of Service and technical access restrictions.</li>
            <li>✓ Respect robots.txt directives, request rates, and concurrency boundaries.</li>
            <li>✓ <strong>Strict Prohibition:</strong> Do NOT collect private, leaked, hacked, login-protected, or sensitive personal information.</li>
            <li>✓ <strong>Strict Prohibition:</strong> Do NOT attempt to bypass CAPTCHAs, paywalls, anti-bot mechanisms, or technical controls.</li>
            <li>✓ <strong>Zero Inbox Access:</strong> Never access private inboxes or email contents. Validation is conducted purely via non-intrusive DNS/MX signals.</li>
            <li>✓ Immutable source URLs and collection timestamps are permanently retained for audit traceability.</li>
            <li>✓ Respect the global opt-out / removal mechanism for any entity exercising privacy rights under GDPR, CCPA, or local laws.</li>
            <li>✓ Users must comply with applicable marketing, CAN-SPAM, CASL, GDPR, and anti-spam legislation.</li>
            <li>✓ This platform must never be marketed, operated, or configured as a mass spam-generation mechanism.</li>
          </ul>
        </div>

        {/* Mandatory Checkbox */}
        <div
          style={{
            background: accepted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${accepted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.25)'}`,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            transition: 'var(--transition)',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id="complianceConfirmationCheck"
              style={{ marginTop: '3px' }}
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              I understand and confirm that I may only use this system for lawful collection and use of publicly available business information.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            id="proceedSearchBtn"
            disabled={!accepted}
            onClick={() => {
              if (accepted) onConfirm();
            }}
          >
            <ShieldCheck size={16} /> Accept Charter & Initiate Search
          </button>
        </div>
      </div>
    </div>
  );
};
