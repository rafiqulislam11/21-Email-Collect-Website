import React, { useState } from 'react';
import { Lead } from '../../types';
import {
  X,
  Globe,
  Mail,
  MapPin,
  Building,
  ShieldCheck,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Calendar,
  Tag,
  Save,
  Bookmark,
  Share2,
  Copy,
  Phone,
} from 'lucide-react';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(lead.notes || '');
  const [tags, setTags] = useState<string[]>(lead.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSaved, setIsSaved] = useState(lead.isSaved);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await onUpdate(lead.id, { notes, tags, isSaved });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim().toLowerCase())) {
      setTags([...tags, newTagInput.trim().toLowerCase()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const copyEmail = () => {
    if (lead.publicEmail) {
      navigator.clipboard.writeText(lead.publicEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Valid':
        return <span className="badge badge-success"><CheckCircle size={12} /> Valid</span>;
      case 'Risky':
        return <span className="badge badge-warning"><AlertTriangle size={12} /> Risky (Role-Based)</span>;
      case 'Invalid':
        return <span className="badge badge-danger"><XCircle size={12} /> Invalid</span>;
      default:
        return <span className="badge badge-gray"><HelpCircle size={12} /> Unknown</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: '28px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem' }}>{lead.businessName}</h2>
              <button
                onClick={() => setIsSaved(!isSaved)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isSaved ? '#f59e0b' : 'var(--text-muted)',
                }}
                title={isSaved ? 'Lead Saved' : 'Save Lead'}
              >
                <Bookmark size={20} fill={isSaved ? '#f59e0b' : 'none'} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-purple">{lead.niche}</span>
              <span className="badge badge-info">{lead.category}</span>
              <span className="badge badge-gray">{lead.businessType}</span>
              <span className="badge badge-gray">{lead.companySize}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Lead Score Card */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                TRANSPARENT LEAD QUALITY SCORE
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '2px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  {lead.leadScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
                </span>
                <span className={`badge ${lead.scoreTier === 'High Quality' ? 'badge-success' : lead.scoreTier === 'Medium Quality' ? 'badge-warning' : 'badge-danger'}`}>
                  {lead.scoreTier}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', maxWidth: '380px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lead.scoreBreakdown?.summary || 'Calculated strictly based on verified public digital signals and email diagnostics.'}
              </p>
            </div>
          </div>

          {/* Breakdown factors */}
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Why this lead received this score:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lead.scoreBreakdown?.factors?.map((factor, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    background: 'var(--bg-tertiary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {factor.passed ? (
                      <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                    ) : (
                      <XCircle size={14} style={{ color: 'var(--danger)' }} />
                    )}
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{factor.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>— {factor.explanation}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: factor.passed ? 'var(--success)' : 'var(--text-muted)' }}>
                    +{factor.points}/{factor.maxPoints} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Contact Details */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} /> Public Contact Signals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Public Business Email:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{lead.publicEmail || 'No public email listed'}</strong>
                  {lead.publicEmail && (
                    <button
                      onClick={copyEmail}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      title="Copy email"
                    >
                      {copied ? 'Copied!' : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Validation Status:</span>
                {getStatusBadge(lead.emailStatus)}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Classification:</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {lead.emailType} • {lead.emailDepartment}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MX & DNS Technical Signals:</span>
                <div style={{ fontSize: '0.8rem', color: lead.mxAvailable ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
                  {lead.mxAvailable ? '✓ Active MX Records Resolved' : '✗ Mail Exchange Unreachable'}
                </div>
              </div>
              {lead.phone && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Business Phone:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{lead.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Web & Location */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} style={{ color: 'var(--primary)' }} /> Website & Physical Presence
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Public Website:</div>
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', wordBreak: 'break-all' }}
                  >
                    {lead.website} <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>None discovered</span>
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CMS / Website Platform:</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {lead.websitePlatform} • {lead.websiteLanguage}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Geographic Location:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <MapPin size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span>
                    {lead.address ? `${lead.address}, ` : ''}{lead.city}, {lead.state ? `${lead.state}, ` : ''}{lead.country} {lead.zipCode || ''}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Social Profiles:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {lead.socialProfiles?.linkedin && (
                    <a href={lead.socialProfiles.linkedin} target="_blank" rel="noreferrer" className="badge badge-info" style={{ textDecoration: 'none' }}>
                      LinkedIn
                    </a>
                  )}
                  {lead.socialProfiles?.facebook && (
                    <a href={lead.socialProfiles.facebook} target="_blank" rel="noreferrer" className="badge badge-purple" style={{ textDecoration: 'none' }}>
                      Facebook
                    </a>
                  )}
                  {lead.socialProfiles?.twitter && (
                    <a href={lead.socialProfiles.twitter} target="_blank" rel="noreferrer" className="badge badge-gray" style={{ textDecoration: 'none' }}>
                      X / Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Traceability Bar */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            border: '1px solid var(--border-color)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>
              <strong>Public Source:</strong> {lead.sourceType} ({lead.sourceUrl})
            </span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Discovered: {new Date(lead.firstDiscovered).toLocaleDateString()} • Checked: {new Date(lead.lastChecked).toLocaleDateString()}
          </div>
        </div>

        {/* Tags & Private Notes Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} /> Organization Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
              {tags.map((t) => (
                <span key={t} className="badge badge-purple" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t)}>
                  {t} &times;
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Add tag (Enter)"
                className="form-input"
                style={{ width: '130px', padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Internal Team Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add qualification notes, outreach status, or account owner..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleSaveNotes} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Notes & Tags'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
