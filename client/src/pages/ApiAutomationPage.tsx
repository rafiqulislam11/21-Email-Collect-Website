import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { ApiKeyRecord } from '../types';
import { Terminal, Key, Plus, Trash2, Copy, Check, ExternalLink, ShieldCheck, Code, Play } from 'lucide-react';

export const ApiAutomationPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET /api/leads');

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const keys = await ApiService.getApiKeys();
      setApiKeys(keys);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setLoading(true);
    try {
      const res = await ApiService.createApiKey(newKeyName.trim());
      setCreatedSecret(res.apiKey);
      setNewKeyName('');
      await loadKeys();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await ApiService.revokeApiKey(id);
      await loadKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/leads',
      desc: 'Retrieve paginated public leads with multi-dimension filtering and transparent scoring breakdown.',
      sampleRequest: `curl -X GET "http://localhost:5000/api/leads" \\\n  -H "X-API-Key: alc_live_9f82..." \\\n  -H "Content-Type: application/json"`,
      sampleResponse: `{\n  "success": true,\n  "data": {\n    "leads": [\n      {\n        "id": "uuid-1",\n        "businessName": "Apex Digital Studio",\n        "niche": "Digital Marketing",\n        "leadScore": 87,\n        "publicEmail": "contact@apexdigital.com",\n        "emailStatus": "Valid"\n      }\n    ]\n  }\n}`,
    },
    {
      method: 'POST',
      path: '/api/search/execute',
      desc: 'Trigger automated lead discovery pipeline for niche and location with compliance verification.',
      sampleRequest: `curl -X POST "http://localhost:5000/api/search/execute" \\\n  -H "X-API-Key: alc_live_9f82..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"filter": {"niche": "Web Design", "country": "USA"}, "complianceAccepted": true}'`,
      sampleResponse: `{\n  "success": true,\n  "data": {\n    "leads": [...],\n    "duplicatesRemoved": 2,\n    "durationMs": 380\n  }\n}`,
    },
    {
      method: 'POST',
      path: '/api/validate-email',
      desc: 'Validate email syntax, domain MX resolution, and disposable/role-based signals without inbox intrusion.',
      sampleRequest: `curl -X POST "http://localhost:5000/api/validate-email" \\\n  -H "X-API-Key: alc_live_9f82..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"email": "contact@stripe.com"}'`,
      sampleResponse: `{\n  "success": true,\n  "data": {\n    "email": "contact@stripe.com",\n    "status": "Valid",\n    "mxFound": true,\n    "isDisposable": false,\n    "score": 90\n  }\n}`,
    },
    {
      method: 'POST',
      path: '/api/export',
      desc: 'Generate CSV or XLSX download buffers for filtered or selected public leads.',
      sampleRequest: `curl -X POST "http://localhost:5000/api/export" \\\n  -H "X-API-Key: alc_live_9f82..." \\\n  -H "Content-Type: application/json" \\\n  -d '{"format": "xlsx", "filter": {"country": "UK"}}'`,
      sampleResponse: `[Binary File Stream: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet]`,
    },
  ];

  const currentEndpointDef = endpoints.find(e => `${e.method} ${e.path}` === activeEndpoint) || endpoints[0];

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>API Automation & Developer Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Integrate Auto Lead Collector into your CRM, Zapier, Make, and backend pipelines via REST API.
          </p>
        </div>
      </div>

      {/* API Key Management */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} style={{ color: 'var(--primary)' }} /> API Secret Key Management
        </h3>

        {/* Generate Form */}
        <form onSubmit={handleCreateKey} style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '500px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Key identifier name (e.g. CRM Sync Production)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !newKeyName.trim()}>
            <Plus size={16} /> Generate Key
          </button>
        </form>

        {/* Newly created secret alert */}
        {createdSecret && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.85rem' }}>
                ✓ New API Key Generated (Copy now, this secret will not be displayed again):
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px', color: 'var(--text-primary)' }}>
                {createdSecret}
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(createdSecret);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
            >
              {copiedKey ? <Check size={14} /> : <Copy size={14} />} {copiedKey ? 'Copied' : 'Copy Key'}
            </button>
          </div>
        )}

        {/* Keys Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Prefix</th>
                <th>Created</th>
                <th>Requests Count</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td><strong>{key.name}</strong></td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{key.keyPrefix}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(key.createdAt).toLocaleDateString()}</td>
                  <td><span className="badge badge-info">{key.requestsCount.toLocaleString()} calls</span></td>
                  <td>
                    <span className={`badge ${key.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {key.isActive ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td>
                    {key.isActive && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRevokeKey(key.id)}
                        title="Revoke API Key"
                      >
                        <Trash2 size={12} /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive REST API Documentation */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} style={{ color: 'var(--primary)' }} /> REST Endpoints & Documentation
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Endpoint List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {endpoints.map((ep) => {
              const key = `${ep.method} ${ep.path}`;
              const isSelected = activeEndpoint === key;

              return (
                <div
                  key={key}
                  onClick={() => setActiveEndpoint(key)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={`badge ${ep.method === 'GET' ? 'badge-info' : 'badge-success'}`}
                      style={{ fontSize: '0.72rem', fontWeight: 800 }}
                    >
                      {ep.method}
                    </span>
                    <strong style={{ fontSize: '0.85rem' }}>{ep.path}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Endpoint Details & Code Snippet */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className={`badge ${currentEndpointDef.method === 'GET' ? 'badge-info' : 'badge-success'}`}>
                {currentEndpointDef.method}
              </span>
              <strong style={{ fontSize: '1rem' }}>{currentEndpointDef.path}</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {currentEndpointDef.desc}
            </p>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                CURL REQUEST SNIPPET:
              </div>
              <pre
                style={{
                  background: 'var(--bg-primary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  color: '#6366f1',
                  border: '1px solid var(--border-color)',
                }}
              >
                {currentEndpointDef.sampleRequest}
              </pre>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                RESPONSE PAYLOAD:
              </div>
              <pre
                style={{
                  background: 'var(--bg-primary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  color: '#10b981',
                  border: '1px solid var(--border-color)',
                }}
              >
                {currentEndpointDef.sampleResponse}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
