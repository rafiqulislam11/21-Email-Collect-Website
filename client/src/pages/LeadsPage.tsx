import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Lead } from '../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Eye,
  Bookmark,
  Download,
  Trash2,
  CheckSquare,
  Square,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

interface LeadsPageProps {
  onSelectLead: (lead: Lead) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const LeadsPage: React.FC<LeadsPageProps> = ({ onSelectLead, onNavigate }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Local table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('leadScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadLeads();
  }, [page, limit, nicheFilter, statusFilter, sortBy, sortOrder]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await ApiService.queryLeads({
        filter: {
          keyword: searchQuery || undefined,
          niche: nicheFilter || undefined,
          emailStatus: (statusFilter as any) || undefined,
          duplicateMode: 'hide_duplicates',
        },
        page,
        limit,
        sortBy,
        sortOrder,
      });
      setLeads(res.leads);
      setTotalLeads(res.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  const handleExportSelected = () => {
    onNavigate('export', { selectedLeadIds: selectedIds });
  };

  const handleToggleSaveLead = async (lead: Lead) => {
    try {
      const updated = await ApiService.updateLead(lead.id, { isSaved: !lead.isSaved });
      setLeads(leads.map(l => l.id === lead.id ? updated : l));
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalLeads / limit) || 1;

  return (
    <div className="page-wrapper">
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Leads Repository</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Structured, normalized, and scored public business leads database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {selectedIds.length > 0 && (
            <button className="btn btn-primary" onClick={handleExportSelected}>
              <Download size={16} /> Export Selected ({selectedIds.length})
            </button>
          )}
          <button className="btn btn-outline" onClick={loadLeads}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter controls toolbar */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '34px', height: '38px' }}
              placeholder="Filter by name, domain, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  loadLeads();
                }
              }}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '180px', height: '38px' }}
            value={nicheFilter}
            onChange={(e) => {
              setNicheFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Web Design">Web Design</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="SEO Agency">SEO Agency</option>
            <option value="Software Company">Software Company</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Consulting">Consulting</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px', height: '38px' }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Email Status</option>
            <option value="Valid">Valid</option>
            <option value="Risky">Risky</option>
            <option value="Invalid">Invalid</option>
            <option value="Unknown">Unknown</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px', height: '38px' }}
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('_');
              setSortBy(field);
              setSortOrder(order as any);
            }}
          >
            <option value="leadScore_desc">Score: High to Low</option>
            <option value="leadScore_asc">Score: Low to High</option>
            <option value="businessName_asc">Name: A to Z</option>
            <option value="firstDiscovered_desc">Newest First</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing {leads.length} of {totalLeads.toLocaleString()} leads
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
            <span>Per page:</span>
            <select
              className="form-select"
              style={{ width: '70px', height: '30px', padding: '2px 6px', fontSize: '0.78rem' }}
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div className="spin" style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading lead records...</p>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No leads found matching current criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Business Name</th>
                  <th>Niche / Category</th>
                  <th>Location</th>
                  <th>Website</th>
                  <th>Public Email</th>
                  <th>Email Status</th>
                  <th>Lead Score</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const isChecked = selectedIds.includes(lead.id);

                  return (
                    <tr key={lead.id} style={{ background: isChecked ? 'rgba(99, 102, 241, 0.05)' : undefined }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(lead.id)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleToggleSaveLead(lead)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: lead.isSaved ? '#f59e0b' : 'var(--text-muted)' }}
                            title={lead.isSaved ? 'Unsave' : 'Save'}
                          >
                            <Bookmark size={14} fill={lead.isSaved ? '#f59e0b' : 'none'} />
                          </button>
                          <div>
                            <strong style={{ color: 'var(--text-primary)' }}>{lead.businessName}</strong>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.businessType}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">{lead.niche}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {lead.city}, {lead.country}
                      </td>
                      <td>
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            Domain <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No site</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {lead.publicEmail || <span style={{ color: 'var(--text-muted)' }}>None</span>}
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
                        <a
                          href={lead.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          title={lead.sourceUrl}
                        >
                          Source <ExternalLink size={10} />
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onSelectLead(lead)}
                          title="View Lead Details Dossier"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
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
  );
};
