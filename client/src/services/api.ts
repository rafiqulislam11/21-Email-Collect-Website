import { ApiKeyRecord, DashboardStats, EmailValidationDetail, FilterCountResult, FilterPreset, Lead, LeadFilterState, SearchHistoryItem } from '../types';

const API_BASE = '/api';

export class ApiService {
  public static async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch dashboard stats');
    return json.data;
  }

  public static async getFilterCounts(filter: LeadFilterState): Promise<FilterCountResult> {
    const res = await fetch(`${API_BASE}/filter-count`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch filter counts');
    return json.data;
  }

  public static async queryLeads(params: {
    filter?: LeadFilterState;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ leads: Lead[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const res = await fetch(`${API_BASE}/leads/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to query leads');
    return json.data;
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
    const res = await fetch(`${API_BASE}/search/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter, complianceAccepted }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Search failed');
    return json.data;
  }

  public static async getLeadById(id: string): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Lead not found');
    return json.data;
  }

  public static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update lead');
    return json.data;
  }

  public static async deleteLead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete lead');
  }

  public static async validateEmail(email: string): Promise<EmailValidationDetail> {
    const res = await fetch(`${API_BASE}/validate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to validate email');
    return json.data;
  }

  public static async validateBulkEmails(emails: string[]): Promise<EmailValidationDetail[]> {
    const res = await fetch(`${API_BASE}/validate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to bulk validate emails');
    return json.data;
  }

  public static async getPresets(): Promise<FilterPreset[]> {
    const res = await fetch(`${API_BASE}/presets`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch presets');
    return json.data;
  }

  public static async createPreset(preset: {
    name: string;
    description?: string;
    filterState: LeadFilterState;
    isFavorite?: boolean;
  }): Promise<FilterPreset> {
    const res = await fetch(`${API_BASE}/presets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preset),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create preset');
    return json.data;
  }

  public static async deletePreset(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/presets/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete preset');
  }

  public static async getSearchHistory(): Promise<SearchHistoryItem[]> {
    const res = await fetch(`${API_BASE}/history`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch search history');
    return json.data;
  }

  public static async exportLeads(params: {
    format: 'csv' | 'xlsx';
    filter?: LeadFilterState;
    selectedLeadIds?: string[];
    selectedFields?: string[];
  }): Promise<Blob> {
    const res = await fetch(`${API_BASE}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Export failed');
    }
    return await res.blob();
  }

  public static async getApiKeys(): Promise<ApiKeyRecord[]> {
    const res = await fetch(`${API_BASE}/api-keys`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch api keys');
    return json.data;
  }

  public static async createApiKey(name: string): Promise<{ apiKey: string; record: ApiKeyRecord }> {
    const res = await fetch(`${API_BASE}/api-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create api key');
    return json.data;
  }

  public static async revokeApiKey(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api-keys/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to revoke api key');
  }

  public static async getComplianceAudit(): Promise<{ auditLogs: any[]; optOutList: any[] }> {
    const res = await fetch(`${API_BASE}/compliance/audit`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch compliance logs');
    return json.data;
  }

  public static async submitOptOut(data: { type: string; value: string; reason: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/compliance/opt-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to submit opt out');
    return json.data;
  }

  public static async getSystemHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/system/health`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch system health');
    return json.data;
  }
}
