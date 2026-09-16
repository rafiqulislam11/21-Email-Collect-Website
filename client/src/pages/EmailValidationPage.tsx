import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { EmailValidationDetail } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Mail,
  ShieldCheck,
  Server,
  Terminal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const EmailValidationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [singleInput, setSingleInput] = useState('contact@stripe.com');
  const [singleResult, setSingleResult] = useState<EmailValidationDetail | null>(null);
  const [loadingSingle, setLoadingSingle] = useState(false);

  // Bulk
  const [bulkInput, setBulkInput] = useState(
    'sales@google.com\nhello@stripe.com\nsupport@shopify.com\ntrash@mailinator.com\ninvalid-domain@nonexistentxyz123.com'
  );
  const [bulkResults, setBulkResults] = useState<EmailValidationDetail[]>([]);
  const [loadingBulk, setLoadingBulk] = useState(false);

  const handleValidateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleInput.trim()) return;
    setLoadingSingle(true);
    try {
      const res = await ApiService.validateEmail(singleInput.trim());
      setSingleResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSingle(false);
    }
  };

  const handleValidateBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (emails.length === 0) return;

    setLoadingBulk(true);
    try {
      const res = await ApiService.validateBulkEmails(emails);
      setBulkResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBulk(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Email Technical Validation Tool</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Non-intrusive syntax, DNS, Mail Exchange (MX), disposable, and role-based signals inspection.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'single' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('single')}
        >
          Single Email Diagnostics
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'bulk' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Validation (Paste List)
        </button>
      </div>

      {activeTab === 'single' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} /> Inspect Public Business Email
            </h3>
            <form onSubmit={handleValidateSingle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. contact@business.com"
                  value={singleInput}
                  onChange={(e) => setSingleInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loadingSingle || !singleInput.trim()}>
                {loadingSingle ? 'Analyzing Signals...' : 'Run Technical Diagnostics'}
              </button>
            </form>

            <div style={{ marginTop: '24px', background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Notice:</strong> This inspection uses RFC 5322 syntax validation, DNS/MX mail server query signals, and disposable domain databases. It does NOT send probe emails or attempt unauthorized inbox access.
            </div>
          </div>

          {/* Results Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Diagnostics Breakdown</h3>
            {singleResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TARGET ADDRESS</div>
                    <strong style={{ fontSize: '1rem', fontFamily: 'monospace' }}>{singleResult.email}</strong>
                  </div>
                  <span
                    className={`badge ${
                      singleResult.status === 'Valid'
                        ? 'badge-success'
                        : singleResult.status === 'Risky'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                    style={{ fontSize: '0.85rem', padding: '4px 12px' }}
                  >
                    {singleResult.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Syntax Valid:</div>
                    <strong style={{ color: singleResult.syntaxValid ? 'var(--success)' : 'var(--danger)' }}>
                      {singleResult.syntaxValid ? '✓ RFC 5322 Passed' : '✗ Syntax Malformed'}
                    </strong>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>MX Records:</div>
                    <strong style={{ color: singleResult.mxFound ? 'var(--success)' : 'var(--danger)' }}>
                      {singleResult.mxFound ? '✓ Mail Server Active' : '✗ No MX Found'}
                    </strong>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Disposable Domain:</div>
                    <strong style={{ color: singleResult.isDisposable ? 'var(--danger)' : 'var(--success)' }}>
                      {singleResult.isDisposable ? '✗ Temporary / Throwaway' : '✓ Permanent Domain'}
                    </strong>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Role-Based Address:</div>
                    <strong style={{ color: singleResult.isRoleBased ? 'var(--warning)' : 'var(--text-primary)' }}>
                      {singleResult.isRoleBased ? `⚠ Role (${singleResult.roleName}@)` : 'Individual / Clean'}
                    </strong>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.825rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>EXPLANATION & SIGNALS:</div>
                  <p>{singleResult.reason}</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                Enter an email and click Run Technical Diagnostics to view signals.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Bulk Validation */
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleValidateBulk} style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Paste emails (one per line, up to 50)</label>
              <textarea
                className="form-textarea"
                rows={5}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="contact@business.com&#10;sales@company.org"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={loadingBulk}>
              {loadingBulk ? 'Processing Batch Diagnostics...' : 'Validate Batch Emails'}
            </button>
          </form>

          {bulkResults.length > 0 && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Status</th>
                    <th>MX Mail Server</th>
                    <th>Role Based</th>
                    <th>Disposable</th>
                    <th>Provider</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResults.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace' }}>{r.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            r.status === 'Valid'
                              ? 'badge-success'
                              : r.status === 'Risky'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>{r.mxFound ? '✓ Resolved' : '✗ Unreachable'}</td>
                      <td>{r.isRoleBased ? `⚠ ${r.roleName}@` : 'No'}</td>
                      <td>{r.isDisposable ? '✗ Yes' : '✓ No'}</td>
                      <td style={{ fontSize: '0.8rem' }}>{r.provider}</td>
                      <td>
                        <strong>{r.score}/100</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
