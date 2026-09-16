import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { DashboardStats, Lead } from '../types';
import { TrendLineChart, HorizontalBarChart, DonutChart } from '../components/common/Charts';
import {
  Users,
  MailCheck,
  Globe,
  Award,
  Search,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Eye,
  Sliders,
  Zap,
  Download,
  Mail,
  Sparkles,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectLead: (lead: Lead) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectLead }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading Auto Lead Collector Analytics...</p>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Leads Stored', value: stats.totalLeads.toLocaleString(), icon: Users, color: '#6366f1', delta: '+12.4% this week' },
    { label: 'Valid Business Emails', value: stats.validEmails.toLocaleString(), icon: MailCheck, color: '#10b981', delta: '75% deliverability' },
    { label: 'Websites Discovered', value: stats.websitesFound.toLocaleString(), icon: Globe, color: '#3b82f6', delta: '81% active SSL' },
    { label: 'High-Quality Leads (75+)', value: stats.highQualityLeads.toLocaleString(), icon: Award, color: '#f59e0b', delta: 'Score >= 75/100' },
    { label: 'Searches Today', value: stats.searchesToday.toString(), icon: Search, color: '#8b5cf6', delta: '14 / 1,000 daily' },
    { label: 'API Usage Today', value: stats.apiUsageToday.toString(), icon: Terminal, color: '#ec4899', delta: 'Requests recorded' },
  ];

  const validationChartData = stats.charts.emailStatusDistribution.map(item => ({
    label: item.status,
    count: item.count,
    percentage: item.percentage,
    color: item.status === 'Valid' ? '#10b981' : item.status === 'Risky' ? '#f59e0b' : item.status === 'Invalid' ? '#ef4444' : '#6b7280',
  }));

  return (
    <div className="page-wrapper">
      {/* Friendly Welcome & Quick-Start Hero Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              <h1 style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>Welcome back! What leads do you want to find?</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
              Quickly discover, filter, and download verified public business contacts with transparent quality scores.
            </p>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('find-leads')}
            style={{ fontWeight: 700 }}
          >
            <Zap size={18} /> Start Easy Lead Search
          </button>
        </div>

        {/* 4 Quick Start Action Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '20px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px',
          }}
        >
          <div
            onClick={() => onNavigate('find-leads', { filter: { niche: 'Digital Marketing', country: 'USA', minScore: 70 } })}
            style={{
              background: 'var(--bg-card)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'var(--transition)',
            }}
            className="quick-template-chip"
          >
            <span style={{ fontSize: '1.3rem' }}>🇺🇸</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>US Digital Agencies</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>1-Click Search (Score 70+)</div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('find-leads', { filter: { niche: 'Web Design', country: 'UK', minScore: 70 } })}
            style={{
              background: 'var(--bg-card)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'var(--transition)',
            }}
            className="quick-template-chip"
          >
            <span style={{ fontSize: '1.3rem' }}>🇬🇧</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>UK Web Designers</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Studios in London</div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('validation')}
            style={{
              background: 'var(--bg-card)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'var(--transition)',
            }}
            className="quick-template-chip"
          >
            <Mail size={22} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Validate Email List</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Check DNS & MX Signals</div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('export')}
            style={{
              background: 'var(--bg-card)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'var(--transition)',
            }}
            className="quick-template-chip"
          >
            <Download size={22} style={{ color: '#3b82f6' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Download Excel / CSV</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Export verified leads</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {kpi.label}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: `${kpi.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: kpi.color,
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {kpi.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Trend Over Time */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Leads Collected Over Time</h3>
            <span className="badge badge-purple">Last 7 Days</span>
          </div>
          <TrendLineChart data={stats.charts.leadsOverTime} />
        </div>

        {/* Email Validation Status Donut */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Email Technical Validation Signals</h3>
            <span className="badge badge-success">DNS & MX Verified</span>
          </div>
          <DonutChart data={validationChartData} />
        </div>

        {/* Leads by Country */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Top Discovered Countries</h3>
            <span className="badge badge-info">Global Coverage</span>
          </div>
          <HorizontalBarChart
            data={stats.charts.leadsByCountry.map(c => ({ label: c.country, count: c.count }))}
            accentColor="#3b82f6"
          />
        </div>

        {/* Leads by Niche */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Leads by Business Niche</h3>
            <span className="badge badge-purple">Category Distribution</span>
          </div>
          <HorizontalBarChart
            data={stats.charts.leadsByNiche.map(n => ({ label: n.niche, count: n.count }))}
            accentColor="#8b5cf6"
          />
        </div>
      </div>

      {/* Two Column Tables: Recent Searches & Recent Leads */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: '20px' }}>
        {/* Recent Searches */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Recent Searches</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('history')}>
              View All History
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Query Summary</th>
                  <th>Results</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSearches.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ fontSize: '0.8125rem' }}>{s.querySummary}</strong>
                    </td>
                    <td>
                      <span className="badge badge-info">{s.resultCount} leads</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.durationMs}ms</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onNavigate('find-leads', { filter: s.filters })}
                        title="Re-run search"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Recent Discovered Leads</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('leads')}>
              Open Leads Table
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Location</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lead.businessName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.niche}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {lead.city}, {lead.country}
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
                      >
                        {lead.leadScore}/100
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onSelectLead(lead)}
                        title="View Lead Dossier"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
