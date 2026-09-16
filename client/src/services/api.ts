import { ApiKeyRecord, DashboardStats, EmailValidationDetail, FilterCountResult, FilterPreset, Lead, LeadFilterState, SearchHistoryItem } from '../types';
import { INITIAL_MOCK_LEADS, MOCK_API_KEYS, MOCK_DASHBOARD_STATS, MOCK_HISTORY } from './mockData';

const API_BASE = '/api';

// In-memory state for client-side live demo on GitHub Pages
let clientLeads: Lead[] = [...INITIAL_MOCK_LEADS];
let clientPresets: FilterPreset[] = [
  {
    id: 'preset-01',
    name: 'High Score Tech Leads (US/UK)',
    description: 'B2B Software and Agencies with Valid Email and Score > 80',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    isFavorite: true,
    filterState: {
      countries: ['USA', 'UK'],
      businessType: 'Company',
      emailStatus: 'Valid',
      scoreTier: 'High Quality',
      minScore: 80,
      hasWebsite: true,
      hasEmail: true,
    },
  },
  {
    id: 'preset-02',
    name: 'Verified Creative Agencies',
    description: 'Design & Marketing studios with active custom domain websites',
    createdAt: '2026-03-14T15:00:00Z',
    updatedAt: '2026-03-14T15:00:00Z',
    isFavorite: false,
    filterState: {
      niche: 'Digital Marketing',
      businessType: 'Agency',
      httpsAvailable: true,
      customDomain: true,
    },
  },
];

let clientApiKeys: ApiKeyRecord[] = [...MOCK_API_KEYS];
let clientHistory: SearchHistoryItem[] = [...MOCK_HISTORY];

export class ApiService {
  public static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      // Offline fallback for GitHub Pages
      return {
        ...MOCK_DASHBOARD_STATS,
        recentLeads: clientLeads.slice(0, 5),
      };
    }
  }

  public static async getFilterCounts(filter: LeadFilterState): Promise<FilterCountResult> {
    try {
      const res = await fetch(`${API_BASE}/filter-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const matching = this.filterLeadsLocally(clientLeads, filter);
      return {
        totalLeads: clientLeads.length,
        matchingLeads: matching.length,
        matchingWebsites: matching.filter((l) => l.hasWebsite).length,
        matchingEmails: matching.filter((l) => l.hasEmail).length,
        matchingValidEmails: matching.filter((l) => l.emailStatus === 'Valid').length,
        matchingHighQuality: matching.filter((l) => l.scoreTier === 'High Quality').length,
        duplicatesRemoved: Math.round(matching.length * 0.1),
      };
    }
  }

  public static async queryLeads(params: {
    filter?: LeadFilterState;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ leads: Lead[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    try {
      const res = await fetch(`${API_BASE}/leads/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const page = params.page || 1;
      const limit = params.limit || 20;
      let leads = params.filter ? this.filterLeadsLocally(clientLeads, params.filter) : [...clientLeads];

      if (params.sortBy) {
        leads.sort((a, b) => {
          const valA = (a as any)[params.sortBy!] || '';
          const valB = (b as any)[params.sortBy!] || '';
          if (params.sortOrder === 'asc') return valA > valB ? 1 : -1;
          return valA < valB ? 1 : -1;
        });
      }

      const total = leads.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const paginatedLeads = leads.slice((page - 1) * limit, page * limit);

      return {
        leads: paginatedLeads,
        pagination: { total, page, limit, totalPages },
      };
    }
  }

  public static async executeSearch(
    filter: LeadFilterState,
    complianceAccepted: boolean
  ): Promise<{
    leads: Lead[];
    progressLog: string[];
    duplicatesRemoved: number;
    optOutsExcluded: number;
    durationMs: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/search/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter, complianceAccepted }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const filtered = this.filterLeadsLocally(clientLeads, filter);
      const log = [
        'Connecting to verified public business directories...',
        'Screening queries strictly against public commercial domains...',
        'Performing syntax validation & MX DNS lookup...',
        'Running multi-key deduplication and canonical matching...',
        'Auditing compliance ledger (100% compliant with privacy regulations)...',
        `Discovery finished: ${filtered.length} verified public business leads ready.`,
      ];
      return {
        leads: filtered,
        progressLog: log,
        duplicatesRemoved: 3,
        optOutsExcluded: 0,
        durationMs: 720,
      };
    }
  }

  public static async getLeadById(id: string): Promise<Lead> {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const found = clientLeads.find((l) => l.id === id);
      if (!found) throw new Error('Lead not found');
      return found;
    }
  }

  public static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const index = clientLeads.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Lead not found');
      clientLeads[index] = { ...clientLeads[index], ...updates, updatedAt: new Date().toISOString() };
      return clientLeads[index];
    }
  }

  public static async deleteLead(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      clientLeads = clientLeads.filter((l) => l.id !== id);
    }
  }

  public static async validateEmail(email: string): Promise<EmailValidationDetail> {
    try {
      const res = await fetch(`${API_BASE}/validate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const domain = email.split('@')[1] || '';
      const isDisposable = ['mailinator.com', '10minutemail.com', 'tempmail.com'].includes(domain.toLowerCase());
      const isRole = /^(info|contact|sales|support|admin|marketing)@/i.test(email);
      const syntaxValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      return {
        email,
        status: !syntaxValid || isDisposable ? 'Invalid' : isRole ? 'Risky' : 'Valid',
        syntaxValid,
        domainValid: syntaxValid,
        mxFound: syntaxValid && !isDisposable,
        mxRecords: syntaxValid && !isDisposable ? [`mail.${domain}`, `smtp.${domain}`] : [],
        isDisposable,
        isRoleBased: isRole,
        roleName: isRole ? email.split('@')[0] : undefined,
        provider: domain.includes('gmail') ? 'Google Workspace' : domain.includes('outlook') ? 'Microsoft 365' : 'Custom Corporate Mail',
        score: syntaxValid && !isDisposable ? (isRole ? 75 : 95) : 10,
        reason: isDisposable
          ? 'Disposable temporary email address detected'
          : isRole
          ? 'Role-based email detected'
          : 'High deliverability corporate email address',
        checkedAt: new Date().toISOString(),
      };
    }
  }

  public static async validateBulkEmails(emails: string[]): Promise<EmailValidationDetail[]> {
    return Promise.all(emails.map((e) => this.validateEmail(e)));
  }

  public static async getPresets(): Promise<FilterPreset[]> {
    try {
      const res = await fetch(`${API_BASE}/presets`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return clientPresets;
    }
  }

  public static async createPreset(preset: {
    name: string;
    description?: string;
    filterState: LeadFilterState;
    isFavorite?: boolean;
  }): Promise<FilterPreset> {
    try {
      const res = await fetch(`${API_BASE}/presets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const now = new Date().toISOString();
      const newPreset: FilterPreset = {
        id: `preset-${Date.now()}`,
        name: preset.name,
        description: preset.description,
        filterState: preset.filterState,
        isFavorite: !!preset.isFavorite,
        createdAt: now,
        updatedAt: now,
      };
      clientPresets.push(newPreset);
      return newPreset;
    }
  }

  public static async deletePreset(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/presets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      clientPresets = clientPresets.filter((p) => p.id !== id);
    }
  }

  public static async getSearchHistory(): Promise<SearchHistoryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return clientHistory;
    }
  }

  public static async exportLeads(params: {
    format: 'csv' | 'xlsx';
    filter?: LeadFilterState;
    selectedLeadIds?: string[];
    selectedFields?: string[];
  }): Promise<Blob> {
    try {
      const res = await fetch(`${API_BASE}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.blob();
    } catch {
      const leads = clientLeads.filter((l) => !params.selectedLeadIds || params.selectedLeadIds.includes(l.id));
      const headers = ['Business Name', 'Niche', 'Website', 'Public Email', 'Phone', 'Country', 'City', 'Score', 'Status'];
      const rows = leads.map((l) => [
        `"${l.businessName}"`,
        `"${l.niche}"`,
        `"${l.website || ''}"`,
        `"${l.publicEmail || ''}"`,
        `"${l.phone || ''}"`,
        `"${l.country}"`,
        `"${l.city}"`,
        l.leadScore,
        `"${l.businessStatus}"`,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    }
  }

  public static async getApiKeys(): Promise<ApiKeyRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/api-keys`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return clientApiKeys;
    }
  }

  public static async createApiKey(name: string): Promise<{ apiKey: string; record: ApiKeyRecord }> {
    try {
      const res = await fetch(`${API_BASE}/api-keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      const randSecret = Math.random().toString(36).substring(2, 12);
      const fullKey = `alc_live_${randSecret}${Date.now()}`;
      const record: ApiKeyRecord = {
        id: `key-${Date.now()}`,
        name,
        keyPrefix: `alc_live_••••${fullKey.slice(-4)}`,
        keyHash: `hash_${randSecret}`,
        createdAt: new Date().toISOString(),
        requestsCount: 0,
        isActive: true,
      };
      clientApiKeys.push(record);
      return { apiKey: fullKey, record };
    }
  }

  public static async revokeApiKey(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/api-keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      clientApiKeys = clientApiKeys.filter((k) => k.id !== id);
    }
  }

  public static async getComplianceAudit(): Promise<{ auditLogs: any[]; optOutList: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/compliance/audit`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return {
        auditLogs: [
          {
            id: 'log-01',
            timestamp: new Date().toISOString(),
            action: 'Public Business Search Filter Executed',
            user: 'Authenticated User Session',
            details: 'Passed 14-point compliance agreement. Strictly verified public domains.',
            ipAddress: '127.0.0.1',
            status: 'Compliant',
          },
        ],
        optOutList: [
          { id: 'opt-01', type: 'domain', value: 'optout-example.com', reason: 'User requested exclusion', requestedAt: '2026-02-01', status: 'Blocked' },
        ],
      };
    }
  }

  public static async submitOptOut(data: { type: string; value: string; reason: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/compliance/opt-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return { success: true, message: `Successfully registered opt-out for ${data.value}` };
    }
  }

  public static async getSystemHealth(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/system/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    } catch {
      return {
        status: 'online',
        mode: 'Client-Side Interactive Demo',
        database: 'In-Memory Synthetic DB',
        dnsResolver: 'Operational',
        leadEngine: 'Healthy',
      };
    }
  }

  private static filterLeadsLocally(leads: Lead[], filter: LeadFilterState): Lead[] {
    return leads.filter((lead) => {
      if (filter.keyword) {
        const q = filter.keyword.toLowerCase();
        const text = `${lead.businessName} ${lead.niche} ${lead.city} ${lead.country}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      if (filter.niche && lead.niche !== filter.niche) return false;
      if (filter.country && lead.country !== filter.country) return false;
      if (filter.countries && filter.countries.length > 0 && !filter.countries.includes(lead.country)) return false;
      if (filter.businessType && filter.businessType !== lead.businessType) return false;
      if (filter.hasWebsite !== undefined && filter.hasWebsite !== null && lead.hasWebsite !== filter.hasWebsite) return false;
      if (filter.hasEmail !== undefined && filter.hasEmail !== null && lead.hasEmail !== filter.hasEmail) return false;
      if (filter.minScore !== undefined && lead.leadScore < filter.minScore) return false;
      if (filter.scoreTier && filter.scoreTier !== lead.scoreTier) return false;
      if (filter.emailStatus && filter.emailStatus !== lead.emailStatus) return false;
      return true;
    });
  }
}
