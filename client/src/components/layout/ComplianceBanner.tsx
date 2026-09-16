import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export const ComplianceBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="compliance-banner" role="region" aria-label="Compliance Notice">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: '#10b981' }}>
          <ShieldCheck size={18} />
        </span>
        <strong style={{ color: '#6366f1', letterSpacing: '0.02em' }}>🛡 PUBLIC BUSINESS DATA ONLY:</strong>
        <span style={{ opacity: 0.9 }}>
          This platform only processes publicly published business contact information. Private inboxes, leaked data, and paywalls are strictly forbidden. Source URLs & timestamps are recorded for audit compliance.
        </span>
        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
          Strict Opt-Out Enforced
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
          }}
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
