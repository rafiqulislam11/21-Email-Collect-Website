import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Database, Shield, User, CheckCircle, ExternalLink, HelpCircle, Menu } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (query: string) => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onNavigate,
  globalSearchQuery,
  onGlobalSearchChange,
  onToggleMobileSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Compliance Audit Passed', time: '12m ago', desc: 'All recent searches verified against opt-out registry.' },
    { id: 2, title: 'Lead Discovery Ready', time: '45m ago', desc: '28 new verified digital marketing leads discovered.' },
    { id: 3, title: 'Export Generated', time: '2h ago', desc: 'public_leads_2026-09-16.xlsx successfully compiled.' },
  ];

  return (
    <header
      className="header-container"
      style={{
        height: '68px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left controls: Mobile Menu Button + Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '500px' }}>
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="btn btn-outline btn-sm"
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: 'var(--radius-md)', display: 'none' }}
          id="mobileMenuToggleBtn"
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={18} />
        </button>

        <div className="header-search-bar" style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', borderRadius: 'var(--radius-full)' }}
            placeholder="Quick search leads, niches, companies, or cities..."
            value={globalSearchQuery}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNavigate('leads');
            }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Usage Gauge Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-tertiary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
          }}
          title="Daily Search API Quota"
        >
          <Database size={14} style={{ color: 'var(--primary)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Daily Quota:</span>
              <span style={{ color: 'var(--text-primary)' }}>14 / 1,000</span>
            </div>
            <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '1.4%', height: '100%', background: 'var(--primary)' }} />
            </div>
          </div>
        </div>

        {/* Demo Mode Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--primary)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 2s infinite' }} />
          <span>Demo Data Mode</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="btn btn-outline btn-sm"
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="btn btn-outline btn-sm"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                background: 'var(--primary)',
                borderRadius: '50%',
              }}
            />
          </button>

          {showNotifications && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                padding: '16px',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Activity & Notifications</span>
                <span className="badge badge-info">3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span>{n.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.75rem' }}>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px 4px 6px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              AL
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Agency Team</span>
          </button>

          {showProfileMenu && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '230px',
                padding: '12px',
                zIndex: 100,
                boxShadow: 'var(--shadow-lg)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Rafiqul Islam</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>admin@autoleadcollector.com</p>
                <span className="badge badge-purple" style={{ marginTop: '6px' }}>Enterprise Plan</span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '4px' }}
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
              >
                Settings & API
              </button>
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => {
                  onNavigate('compliance');
                  setShowProfileMenu(false);
                }}
              >
                Compliance Center
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
