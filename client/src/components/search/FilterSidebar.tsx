import React, { useState } from 'react';
import { FilterCountResult, LeadFilterState, ScoreTier } from '../../types';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Search,
  Sliders,
  Globe,
  Mail,
  CheckCircle2,
  Shield,
  MapPin,
  Briefcase,
  Users,
  Layers,
  Calendar,
  Share2,
  Copy,
  Hash,
  Sparkles,
} from 'lucide-react';

interface FilterSidebarProps {
  filter: LeadFilterState;
  onChange: (newFilter: LeadFilterState) => void;
  counts: FilterCountResult | null;
  onApply: () => void;
  onReset: () => void;
  onSavePreset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  onChange,
  counts,
  onApply,
  onReset,
  onSavePreset,
}) => {
  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    niche: true,
    location: true,
    website: true,
    email: true,
    validation: true,
    score: true,
    size: false,
    contact: false,
    domain: false,
    duplicates: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: keyof LeadFilterState, value: any) => {
    onChange({ ...filter, [field]: value });
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '360px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        position: 'sticky',
        top: '84px',
      }}
    >
      {/* Sidebar Header & Dynamic Counter */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem' }}>Multi-Filter Engine</h3>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>28 Dimensions</span>
        </div>

        {/* Live Filter Counter Banner */}
        {counts && (
          <div
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>MATCHING LEADS</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {counts.matchingLeads.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {counts.totalLeads.toLocaleString()}</span>
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <div>✓ Websites: <strong>{counts.matchingWebsites}</strong></div>
              <div>✓ Emails: <strong>{counts.matchingEmails}</strong></div>
              <div>✓ Valid MX: <strong>{counts.matchingValidEmails}</strong></div>
              <div>★ High Quality: <strong>{counts.matchingHighQuality}</strong></div>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApply}>
            <Search size={15} /> Find Leads
          </button>
          <button className="btn btn-outline btn-sm" onClick={onSavePreset} title="Save Filter Preset">
            <Save size={14} />
          </button>
          <button className="btn btn-outline btn-sm" onClick={onReset} title="Reset All Filters">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Accordion Sections */}

      {/* 1. Niche & Business Category */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('niche')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={15} style={{ color: 'var(--primary)' }} /> Business & Niche
          </span>
          {openSections.niche ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.niche && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Niche / Industry</label>
              <select
                className="form-select"
                value={filter.niche || ''}
                onChange={(e) => updateField('niche', e.target.value)}
              >
                <option value="">All Niches & Categories</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Design">Web Design</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="SEO Agency">SEO Agency</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Hotel">Hotel</option>
                <option value="Travel Agency">Travel Agency</option>
                <option value="Software Company">Software Company</option>
                <option value="SaaS">SaaS</option>
                <option value="Consulting">Consulting</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Construction">Construction</option>
                <option value="Photography">Photography</option>
                <option value="Law Firm">Law Firm</option>
                <option value="Accounting">Accounting</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Business Type</label>
              <select
                className="form-select"
                value={filter.businessType || ''}
                onChange={(e) => updateField('businessType', e.target.value)}
              >
                <option value="">Any Business Type</option>
                <option value="Agency">Agency</option>
                <option value="Company">Company</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Store">Store</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">Business Model</label>
                <select
                  className="form-select"
                  value={filter.businessModel || ''}
                  onChange={(e) => updateField('businessModel', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Business Stage</label>
                <select
                  className="form-select"
                  value={filter.businessStage || ''}
                  onChange={(e) => updateField('businessStage', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Startup">Startup</option>
                  <option value="Established">Established</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Location & Country */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('location')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} style={{ color: 'var(--primary)' }} /> Country & Location
          </span>
          {openSections.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.location && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Country</label>
              <select
                className="form-select"
                value={filter.country || ''}
                onChange={(e) => updateField('country', e.target.value)}
              >
                <option value="">All Countries</option>
                <option value="USA">USA</option>
                <option value="UK">UK (United Kingdom)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Country Group</label>
              <select
                className="form-select"
                value={filter.countryGroup || ''}
                onChange={(e) => updateField('countryGroup', e.target.value)}
              >
                <option value="">Global / Any Region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="MENA">Middle East & North Africa (MENA)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. New York"
                  value={filter.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State / Region</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. California"
                  value={filter.state || ''}
                  onChange={(e) => updateField('state', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Website & Tech Stack */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('website')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={15} style={{ color: 'var(--primary)' }} /> Website & Technology
          </span>
          {openSections.website ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.website && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filter.hasWebsite === true}
                onChange={(e) => updateField('hasWebsite', e.target.checked ? true : null)}
              />
              <span>Website Available Only</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filter.httpsAvailable === true}
                onChange={(e) => updateField('httpsAvailable', e.target.checked ? true : null)}
              />
              <span>HTTPS / SSL Encrypted</span>
            </label>

            <div className="form-group">
              <label className="form-label">CMS / Platform</label>
              <select
                className="form-select"
                value={filter.websitePlatform || ''}
                onChange={(e) => updateField('websitePlatform', e.target.value)}
              >
                <option value="">Any Platform</option>
                <option value="WordPress">WordPress</option>
                <option value="Shopify">Shopify</option>
                <option value="Wix">Wix</option>
                <option value="Squarespace">Squarespace</option>
                <option value="Webflow">Webflow</option>
                <option value="Custom Website">Custom Website</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 4. Public Email & Technical Signals */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('email')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={15} style={{ color: 'var(--primary)' }} /> Public Business Email
          </span>
          {openSections.email ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.email && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filter.hasEmail === true}
                onChange={(e) => updateField('hasEmail', e.target.checked ? true : null)}
              />
              <span>Public Email Found Only</span>
            </label>

            <div className="form-group">
              <label className="form-label">Email Type</label>
              <select
                className="form-select"
                value={filter.emailType || ''}
                onChange={(e) => updateField('emailType', e.target.value)}
              >
                <option value="">All Permitted Email Types</option>
                <option value="Business Domain">Business Domain (@company.com)</option>
                <option value="Public Business Gmail">Public Business Gmail</option>
                <option value="Public Business Outlook">Public Business Outlook</option>
                <option value="Public Business Yahoo">Public Business Yahoo</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={filter.emailDepartment || ''}
                onChange={(e) => updateField('emailDepartment', e.target.value)}
              >
                <option value="">Any Department</option>
                <option value="General">General</option>
                <option value="Info">Info</option>
                <option value="Contact">Contact</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Support">Support</option>
                <option value="Management">Management</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 5. Email Validation Filter */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('validation')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Email Validation & Signals
          </span>
          {openSections.validation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.validation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filter.validEmailsOnly === true}
                onChange={(e) => updateField('validEmailsOnly', e.target.checked)}
              />
              <span>Valid Emails Only (Pass MX & DNS)</span>
            </label>

            <div className="form-group">
              <label className="form-label">Validation Status</label>
              <select
                className="form-select"
                value={filter.emailStatus || ''}
                onChange={(e) => updateField('emailStatus', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Valid">Valid</option>
                <option value="Risky">Risky (Role-Based)</option>
                <option value="Invalid">Invalid</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filter.disposableAllowed === false}
                onChange={(e) => updateField('disposableAllowed', e.target.checked ? false : true)}
              />
              <span>Block Disposable / Temp Domains</span>
            </label>
          </div>
        )}
      </div>

      {/* 6. Lead Score Slider */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('score')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={15} style={{ color: 'var(--primary)' }} /> Lead Quality Score
          </span>
          {openSections.score ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.score && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <div className="slider-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Minimum Score:</span>
                <strong style={{ color: 'var(--primary)' }}>{filter.minScore || 0} / 100</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="slider-input"
                value={filter.minScore || 0}
                onChange={(e) => updateField('minScore', parseInt(e.target.value))}
              />
            </div>

            {/* Quick score pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0, 50, 70, 80, 90].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => updateField('minScore', score)}
                  className={`btn btn-sm ${filter.minScore === score ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '4px 0', fontSize: '0.72rem' }}
                >
                  {score === 0 ? 'All' : `${score}+`}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Quality Tier</label>
              <select
                className="form-select"
                value={filter.scoreTier || ''}
                onChange={(e) => updateField('scoreTier', e.target.value as ScoreTier)}
              >
                <option value="">All Tiers</option>
                <option value="High Quality">High Quality (75+)</option>
                <option value="Medium Quality">Medium Quality (45-74)</option>
                <option value="Low Quality">Low Quality (&lt;45)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 7. Business Size & Status */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div
          onClick={() => toggleSection('size')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={15} style={{ color: 'var(--primary)' }} /> Company Size & Status
          </span>
          {openSections.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.size && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <div className="form-group">
              <label className="form-label">Employee Count</label>
              <select
                className="form-select"
                value={filter.companySize || ''}
                onChange={(e) => updateField('companySize', e.target.value)}
              >
                <option value="">Any Size</option>
                <option value="Solo">Solo</option>
                <option value="Freelancer">Freelancer</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="500+">500+ enterprise</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Operating Status</label>
              <select
                className="form-select"
                value={filter.businessStatus || ''}
                onChange={(e) => updateField('businessStatus', e.target.value)}
              >
                <option value="">Any Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 8. Deduplication Controls */}
      <div>
        <div
          onClick={() => toggleSection('duplicates')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={15} style={{ color: 'var(--primary)' }} /> Duplicate Handling
          </span>
          {openSections.duplicates ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.duplicates && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <div className="form-group">
              <select
                className="form-select"
                value={filter.duplicateMode || 'hide_duplicates'}
                onChange={(e) => updateField('duplicateMode', e.target.value)}
              >
                <option value="hide_duplicates">Hide Duplicates (Keep Canonical)</option>
                <option value="show_all">Show All (Include Duplicates)</option>
                <option value="only_duplicates">Only Duplicates</option>
              </select>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Normalized matching across domain, company name, and email address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
