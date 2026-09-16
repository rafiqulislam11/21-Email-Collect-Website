import React from 'react';
import {
  LayoutDashboard,
  Filter,
  Users,
  History,
  CheckCircle2,
  Award,
  Download,
  Terminal,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-leads', label: 'Find Leads', icon: Filter, badge: 'Easy + 28', badgeColor: 'badge-purple' },
    { id: 'leads', label: 'Leads Table', icon: Users },
    { id: 'history', label: 'Search History', icon: History },
    { id: 'validation', label: 'Email Validation', icon: CheckCircle2 },
    { id: 'scoring', label: 'Lead Scoring', icon: Award },
    { id: 'export', label: 'Export Center', icon: Download },
    { id: 'api', label: 'API Automation', icon: Terminal },
    { id: 'compliance', label: 'Compliance & Rules', icon: ShieldCheck, badge: 'Required', badgeColor: 'badge-success' },
    { id: 'settings', label: 'Settings & Admin', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`mobile-sidebar-drawer ${mobileOpen ? 'open' : ''}`}
        style={{
          width: collapsed ? '76px' : '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '68px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Layers size={20} />
            </div>
            {(!collapsed || mobileOpen) && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.975rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Auto Lead <span style={{ color: 'var(--primary)' }}>Collector</span>
                </div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  PUBLIC BUSINESS SAAS
                </div>
              </div>
            )}
          </div>

          {/* Close button on mobile / Collapse button on desktop */}
          {mobileOpen ? (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Close Menu"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: collapsed ? 'none' : 'block',
              }}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle Sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'var(--transition)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon size={19} style={{ flexShrink: 0, color: isActive ? '#fff' : 'inherit' }} />
                {(!collapsed || mobileOpen) && (
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
                {(!collapsed || mobileOpen) && item.badge && (
                  <span className={`badge ${item.badgeColor || 'badge-gray'}`} style={{ fontSize: '0.675rem', padding: '1px 7px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Status */}
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)',
          }}
        >
          {(!collapsed || mobileOpen) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Public Data Compliant</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Lawful public business directory extraction.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={onToggleCollapse}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title="Expand Sidebar"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
