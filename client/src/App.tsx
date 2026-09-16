import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ComplianceBanner } from './components/layout/ComplianceBanner';
import { LeadDetailsModal } from './components/leads/LeadDetailsModal';
import { DashboardPage } from './pages/DashboardPage';
import { FindLeadsPage } from './pages/FindLeadsPage';
import { LeadsPage } from './pages/LeadsPage';
import { SearchHistoryPage } from './pages/SearchHistoryPage';
import { EmailValidationPage } from './pages/EmailValidationPage';
import { LeadScoringPage } from './pages/LeadScoringPage';
import { ExportPage } from './pages/ExportPage';
import { ApiAutomationPage } from './pages/ApiAutomationPage';
import { CompliancePage } from './pages/CompliancePage';
import { SettingsPage } from './pages/SettingsPage';
import { Lead, LeadFilterState } from './types';
import { ApiService } from './services/api';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [pageParams, setPageParams] = useState<any>({});

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
    if (params) {
      setPageParams(params);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    const updated = await ApiService.updateLead(id, updates);
    setSelectedLead(updated);
  };

  const handleRerunHistory = (filters: Partial<LeadFilterState>) => {
    handleNavigate('find-leads', { filter: filters });
  };

  return (
    <div className="app-container">
      {/* Left Sidebar (Desktop + Mobile Slide-In Drawer) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => handleNavigate(p)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Public Business Data Compliance Banner */}
        <ComplianceBanner />

        {/* Top Header with Mobile Hamburger Menu button */}
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onNavigate={(p) => handleNavigate(p)}
          globalSearchQuery={globalSearchQuery}
          onGlobalSearchChange={setGlobalSearchQuery}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Active Page View */}
        <main style={{ flex: 1 }}>
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onSelectLead={(l) => setSelectedLead(l)}
            />
          )}

          {currentPage === 'find-leads' && (
            <FindLeadsPage
              initialFilter={pageParams?.filter}
              onSelectLead={(l) => setSelectedLead(l)}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'leads' && (
            <LeadsPage
              onSelectLead={(l) => setSelectedLead(l)}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'history' && (
            <SearchHistoryPage onRerun={handleRerunHistory} />
          )}

          {currentPage === 'validation' && <EmailValidationPage />}

          {currentPage === 'scoring' && <LeadScoringPage />}

          {currentPage === 'export' && (
            <ExportPage
              currentFilter={pageParams?.filter}
              selectedLeadIds={pageParams?.selectedLeadIds}
            />
          )}

          {currentPage === 'api' && <ApiAutomationPage />}

          {currentPage === 'compliance' && <CompliancePage />}

          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}
    </div>
  );
};
