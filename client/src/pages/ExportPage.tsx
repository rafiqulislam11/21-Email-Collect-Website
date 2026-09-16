import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { LeadFilterState } from '../types';
import { Download, FileSpreadsheet, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ExportPageProps {
  currentFilter?: LeadFilterState;
  selectedLeadIds?: string[];
}

export const ExportPage: React.FC<ExportPageProps> = ({ currentFilter, selectedLeadIds }) => {
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');
  const [scope, setScope] = useState<'all' | 'filtered' | 'selected'>(
    selectedLeadIds && selectedLeadIds.length > 0 ? 'selected' : currentFilter ? 'filtered' : 'all'
  );
  const [exporting, setExporting] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);

  const availableFields = [
    'Business Name',
    'Niche',
    'Industry',
    'Category',
    'Business Type',
    'Company Size',
    'Country',
    'State / Region',
    'City',
    'Address',
    'Website',
    'Website Platform',
    'Public Business Email',
    'Email Type',
    'Email Status',
    'Email MX Valid',
    'Lead Score',
    'Score Tier',
    'Phone',
    'Social Profiles',
    'Source URL',
    'Collection Date',
  ];

  const [selectedFields, setSelectedFields] = useState<string[]>(availableFields);

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSelectAllFields = () => {
    if (selectedFields.length === availableFields.length) {
      setSelectedFields(['Business Name', 'Website', 'Public Business Email', 'Lead Score']);
    } else {
      setSelectedFields([...availableFields]);
    }
  };

  const handleStartExport = async () => {
    setExporting(true);
    setDownloadReady(false);
    setProgressStage('Preparing export job & verifying records...');

    try {
      setTimeout(() => setProgressStage('Formatting verified public lead attributes...'), 400);
      setTimeout(() => setProgressStage(`Compiling ${format.toUpperCase()} spreadsheet workbook...`), 800);

      const blob = await ApiService.exportLeads({
        format,
        filter: scope === 'filtered' ? currentFilter : undefined,
        selectedLeadIds: scope === 'selected' ? selectedLeadIds : undefined,
        selectedFields,
      });

      setTimeout(() => {
        setDownloadBlob(blob);
        setDownloadReady(true);
        setProgressStage('Export complete! File ready for download.');
        setExporting(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setProgressStage('Export failed. Please try again.');
      setExporting(false);
    }
  };

  const triggerDownload = () => {
    if (!downloadBlob) return;
    const url = window.URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auto_lead_collector_${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Export Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Export compliant public business leads to formatted CSV and Microsoft Excel (.xlsx) files.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Export Configuration */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Export Settings</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Format Selection */}
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Export Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  onClick={() => setFormat('xlsx')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${format === 'xlsx' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: format === 'xlsx' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <FileSpreadsheet size={24} style={{ color: '#10b981' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Excel Workbook</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>.XLSX spreadsheet format</div>
                  </div>
                </div>

                <div
                  onClick={() => setFormat('csv')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${format === 'csv' ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: format === 'csv' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <FileText size={24} style={{ color: '#3b82f6' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>CSV Document</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Universal tabular format</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Selection */}
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>Records Scope</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'all'}
                    onChange={() => setScope('all')}
                  />
                  <span>All Stored Public Leads in Database</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'filtered'}
                    onChange={() => setScope('filtered')}
                  />
                  <span>Current Filtered Search Results Only</span>
                </label>
                {selectedLeadIds && selectedLeadIds.length > 0 && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'selected'}
                      onChange={() => setScope('selected')}
                    />
                    <span>Selected Leads ({selectedLeadIds.length} records)</span>
                  </label>
                )}
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label">Include Columns ({selectedFields.length} selected)</label>
                <button
                  type="button"
                  onClick={handleSelectAllFields}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                >
                  {selectedFields.length === availableFields.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '6px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  background: 'var(--bg-tertiary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {availableFields.map((field) => (
                  <label
                    key={field}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                    />
                    <span>{field}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartExport}
              disabled={exporting || selectedFields.length === 0}
            >
              <Download size={18} />
              {exporting ? 'Processing Export Job...' : `Generate ${format.toUpperCase()} Export`}
            </button>
          </div>
        </div>

        {/* Progress & Download Status */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {exporting ? (
            <div>
              <Loader2 size={44} className="spin" style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Preparing Export File</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{progressStage}</p>
            </div>
          ) : downloadReady ? (
            <div>
              <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>File Ready for Download</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '340px', margin: '0 auto 20px' }}>
                Your {format.toUpperCase()} file containing verified public business records has been generated and validated.
              </p>
              <button className="btn btn-primary btn-lg" onClick={triggerDownload}>
                <Download size={18} /> Download Now (auto_lead_collector.{format})
              </button>
            </div>
          ) : (
            <div>
              <FileSpreadsheet size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Export Queue Ready</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '340px' }}>
                Select your format and column preferences on the left, then click Generate Export.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
