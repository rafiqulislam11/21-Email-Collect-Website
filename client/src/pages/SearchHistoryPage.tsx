import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { SearchHistoryItem } from '../types';
import { History, RotateCcw, Search, Clock, Calendar, CheckCircle, Database } from 'lucide-react';

interface SearchHistoryPageProps {
  onRerun: (filters: any) => void;
}

export const SearchHistoryPage: React.FC<SearchHistoryPageProps> = ({ onRerun }) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Search History & Audit Logs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Historical record of all public business discovery queries with execution metrics.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className="spin" style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <History size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No previous search sessions recorded yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Search Query</th>
                  <th>Filters Snapshot</th>
                  <th>Date & Time</th>
                  <th>Results</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={14} style={{ color: 'var(--primary)' }} />
                        <strong>{item.querySummary}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {Object.entries(item.filters || {}).slice(0, 3).map(([k, v]) => (
                          <span key={k} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-info">{item.resultCount} leads</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.durationMs}ms
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle size={10} /> {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onRerun(item.filters)}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        <RotateCcw size={12} /> Re-run Search
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
