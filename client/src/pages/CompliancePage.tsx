import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { ComplianceLog, OptOutRecord } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle, Lock, FileText, Ban, Send, History } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<ComplianceLog[]>([]);
  const [optOutList, setOptOutList] = useState<OptOutRecord[]>([]);
  const [optType, setOptType] = useState<'email' | 'domain' | 'business_name'>('email');
  const [optValue, setOptValue] = useState('');
  const [optReason, setOptReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      const data = await ApiService.getComplianceAudit();
      setAuditLogs(data.auditLogs);
      setOptOutList(data.optOutList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optValue.trim()) return;
    setLoading(true);
    try {
      await ApiService.submitOptOut({
        type: optType,
        value: optValue.trim(),
        reason: optReason.trim() || 'Direct portal request',
      });
      setSubmitted(true);
      setOptValue('');
      setOptReason('');
      await loadAudit();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const complianceRules = [
    'Collect only publicly displayed business contact information from legitimate online sources.',
    'Respect website Terms of Service and technical access restrictions.',
    'Respect applicable robots.txt and request rate-limiting requirements.',
    'Use reasonable request rates and controlled concurrency.',
    'Strictly avoid collecting private, leaked, hacked, login-protected, or non-public personal information.',
    'Do not bypass CAPTCHAs, paywalls, anti-bot mechanisms, or technical authentication controls.',
    'Do not collect sensitive personal attributes or discriminatory data.',
    'Do not access private inboxes or internal email server mailboxes.',
    'Email validation relies strictly on technical DNS/MX and syntax signals without intrusive probing.',
    'Store Source URL and collection timestamp for every record for complete audit traceability.',
    'Provide duplicate detection, data normalization, and canonical linking.',
    'Provide an active opt-out / removal mechanism for any entity exercising privacy rights.',
    'Users are responsible for complying with applicable privacy (GDPR/CCPA) and anti-spam (CAN-SPAM/CASL) laws.',
    'The application must never be marketed or configured as a mass spam-generation system.',
  ];

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Public Business Data Compliance Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Enforcing strict data protection, privacy charters, and public-only data collection standards.
          </p>
        </div>
      </div>

      {/* Main Charter Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(99, 102, 241, 0.06))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>🛡 Public Business Data Compliance</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 700 }}>
              “Only publicly available business contact information may be collected.”
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {complianceRules.map((rule, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.8125rem',
                background: 'var(--bg-tertiary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--text-primary)' }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Opt-Out & Removal Portal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ban size={18} style={{ color: 'var(--danger)' }} /> Privacy Opt-Out & Lead Removal Request
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Any business or representative may request permanent exclusion from all searches and exports.
          </p>

          {submitted && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--success)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.8125rem', color: 'var(--success)' }}>
              ✓ Opt-out request registered. The specified identifier has been permanently added to the exclusion registry.
            </div>
          )}

          <form onSubmit={handleOptOutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Exclusion Type</label>
              <select
                className="form-select"
                value={optType}
                onChange={(e) => setOptType(e.target.value as any)}
              >
                <option value="email">Public Business Email</option>
                <option value="domain">Domain / Website URL</option>
                <option value="business_name">Business Legal Name</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Value to Exclude *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder={optType === 'email' ? 'contact@company.com' : optType === 'domain' ? 'company.com' : 'Company Name'}
                value={optValue}
                onChange={(e) => setOptValue(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Legal Reference (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. GDPR Article 17 / Direct exclusion request"
                value={optReason}
                onChange={(e) => setOptReason(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-danger" disabled={loading || !optValue.trim()}>
              <Send size={15} /> {loading ? 'Processing Removal...' : 'Register Exclusion'}
            </button>
          </form>
        </div>

        {/* Global Opt-Out Registry List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>Active Exclusion Registry ({optOutList.length})</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Entities currently excluded from all lead discovery pipelines.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {optOutList.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Type: {item.type} • {item.reason}
                  </div>
                </div>
                <span className="badge badge-danger">Blocked</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Audit Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} style={{ color: 'var(--primary)' }} /> Live Compliance Audit Logs
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Operator</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.action}</strong></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.user}</td>
                  <td style={{ fontSize: '0.8rem' }}>{log.details}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td>
                    <span className="badge badge-success">{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
