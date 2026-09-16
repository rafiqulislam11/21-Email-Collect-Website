import React from 'react';
import { LeadFilterState } from '../../types';
import { Sparkles, X } from 'lucide-react';

interface QuickFiltersProps {
  currentFilter: LeadFilterState;
  onApplyQuick: (partial: Partial<LeadFilterState>) => void;
  onClearAll: () => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  currentFilter,
  onApplyQuick,
  onClearAll,
}) => {
  const quickOptions = [
    { label: 'All Leads', action: () => onClearAll() },
    { label: 'High Quality (75+)', active: currentFilter.minScore === 75, action: () => onApplyQuick({ minScore: 75 }) },
    { label: 'Valid Emails Only', active: currentFilter.validEmailsOnly === true, action: () => onApplyQuick({ validEmailsOnly: true, hasEmail: true }) },
    { label: 'Business Domain', active: currentFilter.emailType === 'Business Domain', action: () => onApplyQuick({ emailType: 'Business Domain' }) },
    { label: 'Public Gmail', active: currentFilter.emailType === 'Public Business Gmail', action: () => onApplyQuick({ emailType: 'Public Business Gmail' }) },
    { label: 'Website Available', active: currentFilter.hasWebsite === true, action: () => onApplyQuick({ hasWebsite: true }) },
    { label: 'USA', active: currentFilter.country === 'USA', action: () => onApplyQuick({ country: 'USA' }) },
    { label: 'UK', active: currentFilter.country === 'UK', action: () => onApplyQuick({ country: 'UK' }) },
    { label: 'Canada', active: currentFilter.country === 'Canada', action: () => onApplyQuick({ country: 'Canada' }) },
    { label: 'Bangladesh', active: currentFilter.country === 'Bangladesh', action: () => onApplyQuick({ country: 'Bangladesh' }) },
    { label: 'New Leads (7d)', active: currentFilter.dateRange === '7days', action: () => onApplyQuick({ dateRange: '7days' }) },
    { label: 'No Duplicates', active: currentFilter.duplicateMode === 'hide_duplicates', action: () => onApplyQuick({ duplicateMode: 'hide_duplicates' }) },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        <Sparkles size={14} style={{ color: 'var(--primary)' }} /> Quick Filters:
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
        {quickOptions.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={opt.action}
            className={`btn btn-sm ${opt.active ? 'btn-primary' : 'btn-outline'}`}
            style={{
              padding: '4px 12px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClearAll}
          className="btn btn-sm btn-outline"
          style={{
            padding: '4px 10px',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
          }}
          title="Clear all active filters"
        >
          <X size={12} /> Clear All
        </button>
      </div>
    </div>
  );
};
