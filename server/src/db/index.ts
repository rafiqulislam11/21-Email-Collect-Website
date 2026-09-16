import { ApiKeyRecord, DashboardStats, FilterPreset, Lead, LeadFilterState, SearchHistoryItem } from '../types';
import { generateSeedLeads } from './seedData';
import { FilterEngine } from '../services/filterEngine';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseRepository {
  private static leads: Lead[] = [];
  private static searchHistory: SearchHistoryItem[] = [];
  private static presets: FilterPreset[] = [];
  private static apiKeys: ApiKeyRecord[] = [];
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    // Seed leads
    this.leads = generateSeedLeads();

    // Seed initial presets
    this.presets = [
      {
        id: 'preset-1',
        name: 'US Digital Marketing Agencies',
        description: 'High quality verified agencies in USA with custom domain emails.',
        isFavorite: true,
        filterState: {
          country: 'USA',
          niche: 'Digital Marketing',
          hasWebsite: true,
          hasEmail: true,
          validEmailsOnly: true,
          minScore: 75,
          duplicateMode: 'hide_duplicates',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'preset-2',
        name: 'UK & Europe Web Design Studios',
        description: 'Creative design studios across London, Manchester, and Berlin.',
        isFavorite: true,
        filterState: {
          countryGroup: 'Europe',
          niche: 'Web Design',
          hasWebsite: true,
          minScore: 70,
          duplicateMode: 'hide_duplicates',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'preset-3',
        name: 'Asia Pacific Software & SaaS',
        description: 'Software enterprises across Singapore, Bangladesh, and India.',
        isFavorite: false,
        filterState: {
          countryGroup: 'Asia Pacific',
          niche: 'Software Company',
          hasWebsite: true,
          validEmailsOnly: true,
          minScore: 70,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'preset-4',
        name: 'Verified Complete Leads Only',
        description: 'Leads with verified website, public business email, and phone number.',
        isFavorite: true,
        filterState: {
          dataCompleteness: 'Complete Lead',
          hasWebsite: true,
          validEmailsOnly: true,
          minScore: 80,
          duplicateMode: 'hide_duplicates',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Seed search history
    this.searchHistory = [
      {
        id: 'sh-1',
        querySummary: 'Digital Marketing in USA (Valid Emails, Score 75+)',
        filters: { country: 'USA', niche: 'Digital Marketing', validEmailsOnly: true, minScore: 75 },
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        resultCount: 28,
        durationMs: 420,
        status: 'Completed',
      },
      {
        id: 'sh-2',
        querySummary: 'Web Design in London & Manchester',
        filters: { country: 'UK', niche: 'Web Design', hasWebsite: true },
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        resultCount: 19,
        durationMs: 380,
        status: 'Completed',
      },
      {
        id: 'sh-3',
        querySummary: 'Software Company in Bangladesh (Dhaka)',
        filters: { country: 'Bangladesh', niche: 'Software Company', city: 'Dhaka' },
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        resultCount: 14,
        durationMs: 310,
        status: 'Completed',
      },
    ];

    // Seed default API keys
    this.apiKeys = [
      {
        id: 'key-1',
        name: 'Production CRM Integration',
        keyPrefix: 'alc_live_9f82...',
        keyHash: 'hash_secret_live_crm_prod',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        lastUsedAt: new Date(Date.now() - 300000).toISOString(),
        requestsCount: 1420,
        isActive: true,
      },
      {
        id: 'key-2',
        name: 'Zapier / Webhook Automation',
        keyPrefix: 'alc_live_3c41...',
        keyHash: 'hash_secret_live_zapier',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        lastUsedAt: new Date(Date.now() - 1800000).toISOString(),
        requestsCount: 385,
        isActive: true,
      },
    ];

    this.initialized = true;
    console.log(`Database initialized with ${this.leads.length} leads.`);
  }

  // Leads Queries
  public static getAllLeads(): Lead[] {
    return this.leads;
  }

  public static getLeadById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  public static updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.leads[idx] = {
      ...this.leads[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.leads[idx];
  }

  public static saveLead(id: string, isSaved: boolean): Lead | null {
    return this.updateLead(id, { isSaved });
  }

  public static deleteLead(id: string): boolean {
    const initLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length < initLen;
  }

  public static addLeads(newLeads: Lead[]): void {
    this.leads.unshift(...newLeads);
  }

  // Presets
  public static getPresets(): FilterPreset[] {
    return this.presets;
  }

  public static createPreset(preset: Omit<FilterPreset, 'id' | 'createdAt' | 'updatedAt'>): FilterPreset {
    const newPreset: FilterPreset = {
      id: uuidv4(),
      ...preset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.presets.unshift(newPreset);
    return newPreset;
  }

  public static updatePreset(id: string, updates: Partial<FilterPreset>): FilterPreset | null {
    const idx = this.presets.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.presets[idx] = {
      ...this.presets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.presets[idx];
  }

  public static deletePreset(id: string): boolean {
    const len = this.presets.length;
    this.presets = this.presets.filter(p => p.id !== id);
    return this.presets.length < len;
  }

  // Search History
  public static getSearchHistory(): SearchHistoryItem[] {
    return this.searchHistory;
  }

  public static addSearchHistory(item: Omit<SearchHistoryItem, 'id' | 'timestamp'>): SearchHistoryItem {
    const record: SearchHistoryItem = {
      id: uuidv4(),
      ...item,
      timestamp: new Date().toISOString(),
    };
    this.searchHistory.unshift(record);
    if (this.searchHistory.length > 100) this.searchHistory.pop();
    return record;
  }

  // API Keys
  public static getApiKeys(): ApiKeyRecord[] {
    return this.apiKeys;
  }

  public static createApiKey(name: string): { apiKey: string; record: ApiKeyRecord } {
    const rawSecret = `alc_live_${uuidv4().replace(/-/g, '')}`;
    const record: ApiKeyRecord = {
      id: uuidv4(),
      name,
      keyPrefix: `${rawSecret.slice(0, 12)}...`,
      keyHash: `hashed_${rawSecret}`,
      createdAt: new Date().toISOString(),
      requestsCount: 0,
      isActive: true,
    };
    this.apiKeys.unshift(record);
    return { apiKey: rawSecret, record };
  }

  public static revokeApiKey(id: string): boolean {
    const key = this.apiKeys.find(k => k.id === id);
    if (key) {
      key.isActive = false;
      return true;
    }
    return false;
  }

  // Dashboard Aggregations
  public static getDashboardStats(): DashboardStats {
    const totalLeads = this.leads.length;
    const validEmails = this.leads.filter(l => l.emailStatus === 'Valid').length;
    const websitesFound = this.leads.filter(l => l.hasWebsite).length;
    const highQualityLeads = this.leads.filter(l => l.scoreTier === 'High Quality').length;
    const searchesToday = 14;
    const apiUsageToday = 248;

    // Leads by Country
    const countryMap = new Map<string, number>();
    for (const lead of this.leads) {
      countryMap.set(lead.country, (countryMap.get(lead.country) || 0) + 1);
    }
    const leadsByCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Leads by Niche
    const nicheMap = new Map<string, number>();
    for (const lead of this.leads) {
      nicheMap.set(lead.niche, (nicheMap.get(lead.niche) || 0) + 1);
    }
    const leadsByNiche = Array.from(nicheMap.entries())
      .map(([niche, count]) => ({ niche, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Email Status Distribution
    const validCount = this.leads.filter(l => l.emailStatus === 'Valid').length;
    const riskyCount = this.leads.filter(l => l.emailStatus === 'Risky').length;
    const invalidCount = this.leads.filter(l => l.emailStatus === 'Invalid').length;
    const unknownCount = this.leads.filter(l => l.emailStatus === 'Unknown').length;

    const emailStatusDistribution = [
      { status: 'Valid' as const, count: validCount, percentage: Math.round((validCount / totalLeads) * 100) },
      { status: 'Risky' as const, count: riskyCount, percentage: Math.round((riskyCount / totalLeads) * 100) },
      { status: 'Invalid' as const, count: invalidCount, percentage: Math.round((invalidCount / totalLeads) * 100) },
      { status: 'Unknown' as const, count: unknownCount, percentage: Math.round((unknownCount / totalLeads) * 100) },
    ];

    // Lead Quality Distribution
    const highCount = this.leads.filter(l => l.scoreTier === 'High Quality').length;
    const medCount = this.leads.filter(l => l.scoreTier === 'Medium Quality').length;
    const lowCount = this.leads.filter(l => l.scoreTier === 'Low Quality').length;

    const qualityDistribution = [
      { tier: 'High Quality' as const, count: highCount, percentage: Math.round((highCount / totalLeads) * 100) },
      { tier: 'Medium Quality' as const, count: medCount, percentage: Math.round((medCount / totalLeads) * 100) },
      { tier: 'Low Quality' as const, count: lowCount, percentage: Math.round((lowCount / totalLeads) * 100) },
    ];

    // Trend over last 7 days
    const leadsOverTime = [
      { date: 'Sep 10', count: 42 },
      { date: 'Sep 11', count: 68 },
      { date: 'Sep 12', count: 54 },
      { date: 'Sep 13', count: 91 },
      { date: 'Sep 14', count: 77 },
      { date: 'Sep 15', count: 112 },
      { date: 'Sep 16', count: 85 },
    ];

    return {
      totalLeads,
      validEmails,
      websitesFound,
      highQualityLeads,
      searchesToday,
      apiUsageToday,
      recentSearches: this.searchHistory.slice(0, 5),
      recentLeads: this.leads.slice(0, 8),
      charts: {
        leadsOverTime,
        leadsByCountry,
        leadsByNiche,
        emailStatusDistribution,
        qualityDistribution,
      },
    };
  }
}

// Auto-initialize on import
DatabaseRepository.initialize();
