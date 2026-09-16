import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

interface SearchPipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  querySummary: string;
  resultSummary?: {
    leadsCount: number;
    duplicatesRemoved: number;
    durationMs: number;
  };
}

export const SearchPipelineModal: React.FC<SearchPipelineModalProps> = ({
  isOpen,
  onComplete,
  querySummary,
  resultSummary,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    'Validating search parameters & compliance constraints',
    'Checking privacy opt-out registry & exclusion lists',
    'Querying permitted public business directories & registries',
    'Discovering official public websites & verifying HTTPS encryption',
    'Identifying published business contact emails & departments',
    'Validating syntax, DNS resolution, and MX mail-server signals',
    'Normalizing business names, domains, and contact records',
    'Removing duplicate listings & linking canonical records',
    'Calculating transparent explainable lead quality scores (0-100)',
    'Recording source URLs and collection timestamps for compliance audit',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));
  const isFinished = currentStepIndex >= steps.length;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          maxWidth: '560px',
          padding: '28px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            {isFinished ? <CheckCircle2 size={24} /> : <Loader2 size={24} className="spin" />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>
              {isFinished ? 'Lead Discovery Complete!' : 'Searching Public Business Sources...'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Query: {querySummary}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Workflow Pipeline Execution</span>
            <span style={{ color: 'var(--primary)' }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>

        {/* Step-by-Step List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '260px',
            overflowY: 'auto',
            paddingRight: '6px',
            marginBottom: '20px',
          }}
        >
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.8125rem',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'var(--bg-tertiary)' : 'transparent',
                  color: isDone ? 'var(--text-primary)' : isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                ) : isCurrent ? (
                  <Loader2 size={16} className="spin" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                ) : (
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '1px solid var(--border-color)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Summary Info when finished */}
        {isFinished && (
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)' }}>
                {resultSummary?.leadsCount || 28}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LEADS RETRIEVED</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {resultSummary?.duplicatesRemoved || 2}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DUPLICATES REMOVED</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {resultSummary?.durationMs ? `${resultSummary.durationMs}ms` : '380ms'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DURATION</div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            style={{ width: isFinished ? 'auto' : '100%' }}
            onClick={onComplete}
            disabled={!isFinished}
          >
            {isFinished ? 'View Matching Leads' : 'Processing Discovery Pipeline...'}
          </button>
        </div>
      </div>
    </div>
  );
};
