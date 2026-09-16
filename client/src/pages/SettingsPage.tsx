import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Settings, User, Building, Sliders, Shield, Activity, Server, Save, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'defaults' | 'health'>('defaults');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Settings State
  const [defaultCountry, setDefaultCountry] = useState('USA');
  const [defaultMinScore, setDefaultMinScore] = useState(70);
  const [defaultDuplicateMode, setDefaultDuplicateMode] = useState('hide_duplicates');
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(60);
  const [maxConcurrency, setMaxConcurrency] = useState(5);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    try {
      const data = await ApiService.getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Settings & Admin Console</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Configure organization preferences, default search parameters, and inspect system telemetry.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'defaults' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('defaults')}
        >
          <Sliders size={14} /> Search Defaults & Limits
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={14} /> Profile & Account
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'organization' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('organization')}
        >
          <Building size={14} /> Organization & Plan
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'health' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('health')}
        >
          <Activity size={14} /> System Health & Telemetry
        </button>
      </div>

      {savedNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.85rem' }}>
          <CheckCircle size={16} /> Configuration saved successfully!
        </div>
      )}

      {activeTab === 'defaults' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Default Search Parameters</h3>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Default Target Country</label>
              <select
                className="form-select"
                value={defaultCountry}
                onChange={(e) => setDefaultCountry(e.target.value)}
              >
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="India">India</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Minimum Lead Score: {defaultMinScore}/100</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="slider-input"
                value={defaultMinScore}
                onChange={(e) => setDefaultMinScore(parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Duplicate Policy</label>
              <select
                className="form-select"
                value={defaultDuplicateMode}
                onChange={(e) => setDefaultDuplicateMode(e.target.value)}
              >
                <option value="hide_duplicates">Hide Duplicates (Preserve Canonical Records)</option>
                <option value="show_all">Show All Records (Include Detected Duplicates)</option>
              </select>
            </div>

            <h4 style={{ fontSize: '1rem', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              Rate Limiting & Concurrency Controls
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Requests Per Minute Limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={rateLimitPerMinute}
                  onChange={(e) => setRateLimitPerMinute(parseInt(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Concurrent Discovery Pipelines</label>
                <input
                  type="number"
                  className="form-input"
                  value={maxConcurrency}
                  onChange={(e) => setMaxConcurrency(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>User Account & Credentials</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue="Rafiqul Islam" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue="admin@autoleadcollector.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <input type="text" className="form-input" disabled defaultValue="Super Admin (Full Access)" />
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }} onClick={handleSaveSettings}>
              Update Profile
            </button>
          </div>
        </div>
      )}

      {activeTab === 'organization' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Organization Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input type="text" className="form-input" defaultValue="Global Growth Agency" />
            </div>
            <div className="form-group">
              <label className="form-label">Subscription Tier</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>Enterprise SaaS Plan</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unlimited leads storage</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Team Members</label>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                4 Active seats • 1 Administrator • 3 Marketers
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} style={{ color: 'var(--primary)' }} /> Live System Health & Provider Adapters
          </h3>

          {systemHealth ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SERVICE STATUS</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>Operational</strong>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATABASE ENGINE</div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>PostgreSQL / Relational Store</strong>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SYSTEM UPTIME</div>
                  <strong style={{ fontSize: '1.1rem' }}>{Math.round(systemHealth.uptimeSeconds)}s</strong>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEMORY USAGE</div>
                  <strong style={{ fontSize: '1.1rem' }}>{systemHealth.memoryUsageMb} MB</strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Provider Adapter Subsystems</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {systemHealth.providers?.map((p: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                        <strong>{p.name}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Response: {p.responseTimeMs}ms</span>
                        <span className="badge badge-success">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px 0', color: 'var(--text-muted)' }}>Loading health telemetry...</div>
          )}
        </div>
      )}
    </div>
  );
};
