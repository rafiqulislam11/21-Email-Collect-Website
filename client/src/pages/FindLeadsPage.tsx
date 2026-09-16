import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { FilterCountResult, FilterPreset, FilterRuleGroup, Lead, LeadFilterState } from '../types';
import { FilterSidebar } from '../components/search/FilterSidebar';
import { QuickFilters } from '../components/search/QuickFilters';
import { SmartCombinationBuilder } from '../components/search/SmartCombinationBuilder';
import { SearchPipelineModal } from '../components/search/SearchPipelineModal';
import { ComplianceConfirmationModal } from '../components/common/ComplianceConfirmationModal';
import { SavePresetModal } from '../components/search/SavePresetModal';
import {
  Search,
  Sliders,
  Sparkles,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Eye,
  Download,
  ShieldCheck,
  RotateCcw,
  Star,
  Trash2,
  Copy,
  Check,
  LayoutGrid,
  List,
  MapPin,
  Globe,
  Mail,
  Zap,
} from 'lucide-react';

interface FindLeadsPageProps {
  initialFilter?: LeadFilterState;
  onSelectLead: (lead: Lead) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const FindLeadsPage: React.FC<FindLeadsPageProps> = ({
  initialFilter,
  onSelectLead,
  onNavigate,
}) => {
  // Mode: Easy (Simple Search) vs Advanced (28 Dimensions) vs Combination vs Presets
  const [searchMode, setSearchMode] = useState<'easy' | 'advanced' | 'combination' | 'presets'>('easy');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const [filter, setFilter] = useState<LeadFilterState>(initialFilter || {
    duplicateMode: 'hide_duplicates',
  });
  const [counts, setCounts] = useState<FilterCountResult | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [searchPipelineSummary, setSearchPipelineSummary] = useState<any>(null);

  // Presets
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // Smart Rule Tree
  const [ruleTree, setRuleTree] = useState<FilterRuleGroup>({
    id: 'root',
    operator: 'AND',
    rules: [
      { id: 'r1', field: 'niche', operator: 'equals', value: 'Digital Marketing' },
      { id: 'r2', field: 'country', operator: 'equals', value: 'USA' },
      { id: 'r3', field: 'hasWebsite', operator: 'is_true', value: true },
      { id: 'r4', field: 'leadScore', operator: 'greater_than_or_equal', value: 70 },
    ],
  });

  // Fetch counts when filter changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilterCounts();
    }, 250);
    return () => clearTimeout(timer);
  }, [filter]);

  // Initial load
  useEffect(() => {
    fetchLeads();
    fetchPresets();
  }, [page, limit]);

  const fetchFilterCounts = async () => {
    try {
      const res = await ApiService.getFilterCounts(filter);
      setCounts(res);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async (customFilter?: LeadFilterState) => {
    try {
      setLoading(true);
      const res = await ApiService.queryLeads({
        filter: customFilter || filter,
        page,
        limit,
      });
      setLeads(res.leads);
      setTotalLeads(res.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresets = async () => {
    try {
      const data = await ApiService.getPresets();
      setPresets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyFilter = () => {
    setPage(1);
    fetchLeads();
  };

  const handleResetFilter = () => {
    const empty: LeadFilterState = { duplicateMode: 'hide_duplicates' };
    setFilter(empty);
    setPage(1);
    fetchLeads(empty);
  };

  const handleQuickFilter = (partial: Partial<LeadFilterState>) => {
    const updated = { ...filter, ...partial };
    setFilter(updated);
    setPage(1);
    fetchLeads(updated);
  };

  const handleStartDiscovery = () => {
    setShowComplianceModal(true);
  };

  const handleConfirmCompliance = async () => {
    setShowComplianceModal(false);
    setShowPipelineModal(true);

    try {
      const result = await ApiService.executeSearch(filter, true);
      setSearchPipelineSummary({
        leadsCount: result.leads.length,
        duplicatesRemoved: result.duplicatesRemoved,
        durationMs: result.durationMs,
      });
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompletePipeline = () => {
    setShowPipelineModal(false);
    fetchLeads();
  };

  const handleSavePreset = async (presetData: any) => {
    await ApiService.createPreset(presetData);
    await fetchPresets();
  };

  const handleDeletePreset = async (id: string) => {
    await ApiService.deletePreset(id);
    await fetchPresets();
  };

  const handleLoadPreset = (p: FilterPreset) => {
    setFilter(p.filterState);
    setPage(1);
    fetchLeads(p.filterState);
    setSearchMode('easy');
  };

  const handleApplyRuleTree = () => {
    const updated = { ...filter, ruleTree };
    setFilter(updated);
    setPage(1);
    fetchLeads(updated);
  };

  const handleResetRuleTree = () => {
    const defaultTree: FilterRuleGroup = {
      id: 'root',
      operator: 'AND',
      rules: [
        { id: 'r1', field: 'niche', operator: 'equals', value: 'Digital Marketing' },
        { id: 'r2', field: 'country', operator: 'equals', value: 'USA' },
      ],
    };
    setRuleTree(defaultTree);
    const updated = { ...filter, ruleTree: undefined };
    setFilter(updated);
    fetchLeads(updated);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleQuickExportExcel = async () => {
    try {
      const blob = await ApiService.exportLeads({
        format: 'xlsx',
        filter,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  const easyTemplates = [
    { title: '🇺🇸 US Marketing Agencies', niche: 'Digital Marketing', country: 'USA', minScore: 70 },
    { title: '🇬🇧 UK Web Designers', niche: 'Web Design', country: 'UK', minScore: 70 },
    { title: '🇧🇩 Bangladesh Tech & Software', niche: 'Software Company', country: 'Bangladesh', minScore: 70 },
    { title: '🇦🇪 Dubai & UAE Real Estate', niche: 'Real Estate', country: 'UAE', minScore: 60 },
    { title: '🇨🇦 Canada E-commerce', niche: 'E-commerce', country: 'Canada', minScore: 60 },
  ];

  const totalPages = Math.ceil(totalLeads / limit) || 1;

  return (
    <div className="page-wrapper">
      {/* Header section with Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Find Public Business Leads</h1>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
              ✓ Simple & Fast
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Discover and organize verified business websites, emails, and phone contacts easily.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', gap: '4px' }}>
          <button
            className={`btn btn-sm ${searchMode === 'easy' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
            onClick={() => setSearchMode('easy')}
          >
            <Zap size={14} /> Easy Mode (সহজ স্টাইল)
          </button>
          <button
            className={`btn btn-sm ${searchMode === 'advanced' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
            onClick={() => setSearchMode('advanced')}
          >
            <Sliders size={14} /> Advanced (28 Filters)
          </button>
          <button
            className={`btn btn-sm ${searchMode === 'combination' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
            onClick={() => setSearchMode('combination')}
          >
            <Sparkles size={14} /> AND / OR Logic
          </button>
          <button
            className={`btn btn-sm ${searchMode === 'presets' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
            onClick={() => setSearchMode('presets')}
          >
            <Bookmark size={14} /> Saved ({presets.length})
          </button>
        </div>
      </div>

      {/* EASY MODE: Big, Clean 3-Field Search Box with 1-Click Templates */}
      {searchMode === 'easy' && (
        <div className="easy-search-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Quick & Easy Lead Search</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Choose your niche and country, then click Find Leads.</p>
              </div>
            </div>

            {counts && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Matching: </span>
                <strong style={{ color: 'var(--primary)' }}>{counts.matchingLeads.toLocaleString()} leads</strong>
              </div>
            )}
          </div>

          <div className="easy-search-grid">
            {/* Field 1: Niche */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                1. What business niche are you looking for?
              </label>
              <select
                className="form-select"
                style={{ height: '44px', fontSize: '0.9rem' }}
                value={filter.niche || ''}
                onChange={(e) => setFilter({ ...filter, niche: e.target.value })}
              >
                <option value="">All Business Niches</option>
                <option value="Digital Marketing">Digital Marketing Agencies</option>
                <option value="Web Design">Web Design & UI/UX Studios</option>
                <option value="Graphic Design">Graphic & Branding Agencies</option>
                <option value="SEO Agency">SEO Agencies</option>
                <option value="Software Company">Software & Tech Companies</option>
                <option value="SaaS">SaaS Platforms</option>
                <option value="E-commerce">E-commerce Brands</option>
                <option value="Real Estate">Real Estate Brokerages</option>
                <option value="Restaurant">Restaurants & Cafes</option>
                <option value="Hotel">Hotels & Hospitality</option>
                <option value="Consulting">Consulting & Advisory</option>
                <option value="Healthcare">Healthcare & Clinics</option>
                <option value="Law Firm">Law Firms & Legal</option>
                <option value="Accounting">Accounting & Audit Firms</option>
              </select>
            </div>

            {/* Field 2: Country */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                2. Target Country / Location
              </label>
              <select
                className="form-select"
                style={{ height: '44px', fontSize: '0.9rem' }}
                value={filter.country || ''}
                onChange={(e) => setFilter({ ...filter, country: e.target.value })}
              >
                <option value="">Worldwide (All Countries)</option>
                <option value="USA">USA (United States)</option>
                <option value="UK">UK (United Kingdom)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="UAE">UAE (Dubai & Abu Dhabi)</option>
                <option value="Bangladesh">Bangladesh (Dhaka, Chittagong)</option>
                <option value="India">India (Bangalore, Mumbai)</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            {/* Field 3: Quality */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                3. Lead Quality
              </label>
              <select
                className="form-select"
                style={{ height: '44px', fontSize: '0.9rem' }}
                value={filter.minScore || 0}
                onChange={(e) => setFilter({ ...filter, minScore: parseInt(e.target.value) })}
              >
                <option value={0}>All Leads (Any Score)</option>
                <option value={70}>High Quality (Score 70+)</option>
                <option value={80}>Top Tier (Score 80+)</option>
                <option value={90}>Verified Elite (Score 90+)</option>
              </select>
            </div>

            {/* Big Action Button */}
            <button
              className="btn btn-primary"
              style={{ height: '44px', padding: '0 24px', fontSize: '0.95rem', fontWeight: 700 }}
              onClick={handleApplyFilter}
            >
              <Search size={18} /> Find Leads
            </button>
          </div>

          {/* 1-Click Search Templates */}
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ⚡ 1-Click Popular Searches:
            </span>
            {easyTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-template-chip"
                onClick={() => {
                  const updated: LeadFilterState = {
                    ...filter,
                    niche: t.niche,
                    country: t.country,
                    minScore: t.minScore,
                    duplicateMode: 'hide_duplicates',
                  };
                  setFilter(updated);
                  setPage(1);
                  fetchLeads(updated);
                }}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Filters Pill Bar */}
      <QuickFilters
        currentFilter={filter}
        onApplyQuick={handleQuickFilter}
        onClearAll={handleResetFilter}
      />

      {/* Mode 3: Visual Smart Combination Builder */}
      {searchMode === 'combination' && (
        <SmartCombinationBuilder
          ruleTree={ruleTree}
          onChange={setRuleTree}
          onApply={handleApplyRuleTree}
          onReset={handleResetRuleTree}
        />
      )}

      {/* Mode 4: Saved Presets */}
      {searchMode === 'presets' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Saved Search Presets</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowSavePresetModal(true)}>
              Save Current Search
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {presets.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem' }}>{p.name}</h4>
                    {p.isFavorite && <Star size={15} fill="#f59e0b" color="#f59e0b" />}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {p.description || 'Saved multi-filter search preset.'}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => handleLoadPreset(p)}>
                    Apply Preset
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '4px 8px' }}
                    onClick={() => handleDeletePreset(p.id)}
                    title="Delete preset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Results Layout */}
      <div className="find-leads-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* If Advanced Mode is active, show the full 28-dimension accordion sidebar */}
        {searchMode === 'advanced' && (
          <FilterSidebar
            filter={filter}
            onChange={setFilter}
            counts={counts}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
            onSavePreset={() => setShowSavePresetModal(true)}
          />
        )}

        {/* Search Results Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            {/* Results Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Discovered Business Leads</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
                    ({totalLeads.toLocaleString()} Leads)
                  </span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Verified public business contact information. Click any lead to inspect details.
                </p>
              </div>

              {/* View Switcher & Quick Export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* 1-Click Quick Excel Download */}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleQuickExportExcel}
                  title="Download matching leads as Excel spreadsheet"
                >
                  <Download size={14} /> Download Excel
                </button>

                {/* View Switcher */}
                <div className="view-switcher">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Visual Card Grid View"
                  >
                    <LayoutGrid size={14} /> Card View
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Compact Table View"
                  >
                    <List size={14} /> Table View
                  </button>
                </div>
              </div>
            </div>

            {/* Results Output */}
            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Filtering public business records...</p>
              </div>
            ) : leads.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <AlertTriangle size={36} style={{ color: 'var(--warning)', margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.1rem' }}>No matching leads discovered</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '6px auto 16px' }}>
                  Try choosing a different niche or clicking one of the 1-click popular searches above.
                </p>
                <button className="btn btn-outline btn-sm" onClick={handleResetFilter}>
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Visual Card Grid View */
              <div className="lead-cards-grid">
                {leads.map((lead) => {
                  const initials = lead.businessName
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <div key={lead.id} className="lead-card">
                      <div>
                        {/* Header */}
                        <div className="lead-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div className="lead-avatar">{initials}</div>
                            <div style={{ minWidth: 0 }}>
                              <h4 style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.businessName}>
                                {lead.businessName}
                              </h4>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} />
                                <span>{lead.city}, {lead.country}</span>
                              </div>
                            </div>
                          </div>

                          {/* Score badge */}
                          <span
                            className={`badge ${
                              lead.scoreTier === 'High Quality'
                                ? 'badge-success'
                                : lead.scoreTier === 'Medium Quality'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                            style={{ fontWeight: 800, flexShrink: 0 }}
                            title="Lead Quality Score"
                          >
                            ★ {lead.leadScore}/100
                          </span>
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{lead.niche}</span>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{lead.businessType}</span>
                          {lead.emailStatus === 'Valid' && (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              ✓ MX Valid
                            </span>
                          )}
                        </div>

                        {/* Email row with 1-click Copy */}
                        <div
                          style={{
                            background: 'var(--bg-tertiary)',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                            <Mail size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lead.publicEmail || 'No public email'}
                            </span>
                          </div>

                          {lead.publicEmail && (
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(lead.publicEmail)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '2px 8px', fontSize: '0.7rem', height: '24px' }}
                              title="Copy email to clipboard"
                            >
                              {copiedEmail === lead.publicEmail ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                              {copiedEmail === lead.publicEmail ? 'Copied!' : 'Copy'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.78rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
                          >
                            <Globe size={13} /> Visit Site <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No website</span>
                        )}

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          onClick={() => onSelectLead(lead)}
                        >
                          <Eye size={13} /> View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Table View */
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Business Name</th>
                      <th>Niche / Category</th>
                      <th>Location</th>
                      <th>Website</th>
                      <th>Public Email</th>
                      <th>Status</th>
                      <th>Lead Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lead.businessName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.businessType} • {lead.companySize}</div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{lead.niche}</span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{lead.category}</div>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>
                          <div>{lead.city}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{lead.country}</div>
                        </td>
                        <td>
                          {lead.website ? (
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', textDecoration: 'none' }}
                            >
                              Visit <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No site</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {lead.publicEmail || <span style={{ color: 'var(--text-muted)' }}>None</span>}
                            </span>
                            {lead.publicEmail && (
                              <button
                                onClick={() => handleCopyEmail(lead.publicEmail)}
                                className="btn btn-outline btn-sm"
                                style={{ padding: '2px 5px', fontSize: '0.65rem' }}
                                title="Copy Email"
                              >
                                {copiedEmail === lead.publicEmail ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          {lead.emailStatus === 'Valid' ? (
                            <span className="badge badge-success"><CheckCircle size={10} /> Valid</span>
                          ) : lead.emailStatus === 'Risky' ? (
                            <span className="badge badge-warning"><AlertTriangle size={10} /> Risky</span>
                          ) : lead.emailStatus === 'Invalid' ? (
                            <span className="badge badge-danger"><XCircle size={10} /> Invalid</span>
                          ) : (
                            <span className="badge badge-gray">Unknown</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              lead.scoreTier === 'High Quality'
                                ? 'badge-success'
                                : lead.scoreTier === 'Medium Quality'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                            style={{ fontWeight: 700 }}
                          >
                            {lead.leadScore}/100
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => onSelectLead(lead)}
                            title="View Full Lead Details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages} ({totalLeads.toLocaleString()} total leads)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ComplianceConfirmationModal
        isOpen={showComplianceModal}
        onConfirm={handleConfirmCompliance}
        onCancel={() => setShowComplianceModal(false)}
      />

      <SearchPipelineModal
        isOpen={showPipelineModal}
        onComplete={handleCompletePipeline}
        querySummary={`${filter.niche || 'All Niches'} in ${filter.country || 'Global'}`}
        resultSummary={searchPipelineSummary}
      />

      {showSavePresetModal && (
        <SavePresetModal
          filter={filter}
          onSave={handleSavePreset}
          onClose={() => setShowSavePresetModal(false)}
        />
      )}
    </div>
  );
};
