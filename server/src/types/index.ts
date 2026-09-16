// Auto Lead Collector - Core TypeScript Definitions

export type EmailValidationStatus = 'Valid' | 'Invalid' | 'Risky' | 'Unknown';
export type ScoreTier = 'High Quality' | 'Medium Quality' | 'Low Quality';
export type BusinessType = 'Agency' | 'Freelancer' | 'Company' | 'Store' | 'Organization';
export type CompanySize = 'Solo' | 'Freelancer' | '1-10' | '11-50' | '51-200' | '201-500' | '500+' | 'Unknown';
export type BusinessModel = 'B2B' | 'B2C' | 'Both';
export type BusinessStage = 'Startup' | 'Established';
export type LocationType = 'Local' | 'Online' | 'Hybrid';
export type WebsitePlatform = 'WordPress' | 'Shopify' | 'Wix' | 'Squarespace' | 'Webflow' | 'Custom Website' | 'Other';
export type EmailType = 'Business Domain' | 'Public Business Gmail' | 'Public Business Outlook' | 'Public Business Yahoo' | 'Other Public Business Email';
export type EmailDepartment = 'General' | 'Info' | 'Contact' | 'Sales' | 'Marketing' | 'Support' | 'HR' | 'Careers' | 'Finance' | 'Accounts' | 'Management' | 'Partnership' | 'Booking' | 'Other';
export type BusinessStatus = 'Active' | 'Inactive' | 'Unknown';
export type SourceType = 'Business Website' | 'Public Business Directory' | 'Permitted Search Provider' | 'Public Business Profile' | 'Other Authorized Source';
export type DataCompleteness = 'Complete Lead' | 'Partial Lead' | 'Website + Email' | 'Website Only' | 'Email Only' | 'Phone Available' | 'Address Available';

export interface ScoreItem {
  name: string;
  points: number;
  maxPoints: number;
  passed: boolean;
  explanation: string;
}

export interface ScoreBreakdown {
  totalScore: number;
  maxScore: number;
  tier: ScoreTier;
  factors: ScoreItem[];
  summary: string;
}

export interface SocialProfiles {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  niche: string;
  industry: string;
  category: string;
  subcategory: string;
  businessType: BusinessType;
  serviceType: string;
  productType: string;
  companySize: CompanySize;
  businessModel: BusinessModel;
  businessStage: BusinessStage;
  locationType: LocationType;
  country: string;
  state: string;
  city: string;
  district: string;
  area: string;
  zipCode: string;
  address: string;
  serviceArea: string;
  website: string;
  hasWebsite: boolean;
  httpsAvailable: boolean;
  customDomain: boolean;
  websitePlatform: WebsitePlatform;
  websiteStatus: 'Active' | 'Inactive' | 'Unknown';
  websiteLanguage: string;
  publicEmail: string;
  hasEmail: boolean;
  emailType: EmailType;
  emailDepartment: EmailDepartment;
  emailStatus: EmailValidationStatus;
  isDisposableEmail: boolean;
  isRoleBasedEmail: boolean;
  domainValid: boolean;
  mxAvailable: boolean;
  phone: string;
  hasPhone: boolean;
  hasContactForm: boolean;
  businessStatus: BusinessStatus;
  socialProfiles: SocialProfiles;
  hasSocialProfile: boolean;
  leadScore: number;
  scoreTier: ScoreTier;
  scoreBreakdown: ScoreBreakdown;
  sourceUrl: string;
  sourceType: SourceType;
  firstDiscovered: string;
  lastChecked: string;
  isDuplicate: boolean;
  canonicalLeadId?: string;
  dataCompleteness: DataCompleteness;
  tags: string[];
  notes: string;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

// 28 Dimension Filter State
export interface LeadFilterState {
  // 1. Business / Niche
  niche?: string;
  industry?: string;
  category?: string;
  subcategory?: string;
  businessType?: BusinessType | '';
  serviceType?: string;
  productType?: string;
  businessModel?: BusinessModel | '';
  businessStage?: BusinessStage | '';
  locationType?: LocationType | '';

  // 2. Location
  state?: string;
  city?: string;
  district?: string;
  area?: string;
  zipCode?: string;
  radiusKm?: number;

  // 3. Country
  country?: string; // specific or 'all'
  countries?: string[]; // multiple countries
  countryGroup?: string; // 'North America', 'Europe', 'Asia Pacific', 'MENA', etc.

  // 4. Website
  hasWebsite?: boolean | null;
  httpsAvailable?: boolean | null;
  customDomain?: boolean | null;
  websitePlatform?: WebsitePlatform | '';
  websiteStatus?: string;

  // 5. Email
  hasEmail?: boolean | null;
  emailType?: EmailType | '';
  emailDepartment?: EmailDepartment | '';

  // 6. Email Validation
  emailStatus?: EmailValidationStatus | '';
  validEmailsOnly?: boolean;
  disposableAllowed?: boolean;
  roleBasedAllowed?: boolean;
  mxAvailable?: boolean | null;

  // 7. Lead Score
  minScore?: number;
  scoreTier?: ScoreTier | '';

  // 8. Business Size
  companySize?: CompanySize | '';

  // 9. Business Status
  businessStatus?: BusinessStatus | '';

  // 10. Contact Info
  hasPhone?: boolean | null;
  hasContactForm?: boolean | null;
  hasAddress?: boolean | null;

  // 11. Social Media
  hasSocialProfile?: boolean | null;
  socialPlatform?: 'facebook' | 'linkedin' | 'instagram' | 'twitter' | 'youtube' | 'tiktok' | '';

  // 12. Source
  sourceType?: SourceType | '';

  // 13. Language
  websiteLanguage?: string;

  // 14. Domain
  domainExtension?: string; // .com, .org, .net, etc.
  domainContains?: string;
  domainNotContains?: string;

  // 15. Date
  dateRange?: 'today' | '7days' | '30days' | '90days' | 'custom' | 'all';
  startDate?: string;
  endDate?: string;

  // 16. Duplicate
  duplicateMode?: 'show_all' | 'hide_duplicates' | 'only_duplicates';

  // 17. Data Completeness
  dataCompleteness?: DataCompleteness | '';

  // 18. Search Query
  keyword?: string;
  exactPhrase?: string;
  includeKeywords?: string[];
  excludeKeywords?: string[];

  // 19 & 20. Smart Combination Builder (AND / OR / NOT Nested Rules)
  ruleTree?: FilterRuleGroup;
}

export type LogicalOperator = 'AND' | 'OR' | 'NOT';

export interface FilterRule {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than_or_equal' | 'less_than_or_equal' | 'is_true' | 'is_false' | 'in';
  value: any;
}

export interface FilterRuleGroup {
  id: string;
  operator: LogicalOperator;
  rules: (FilterRule | FilterRuleGroup)[];
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  filterState: LeadFilterState;
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  querySummary: string;
  filters: Partial<LeadFilterState>;
  timestamp: string;
  resultCount: number;
  durationMs: number;
  status: 'Completed' | 'Failed' | 'Running';
}

export interface EmailValidationDetail {
  email: string;
  status: EmailValidationStatus;
  syntaxValid: boolean;
  domainValid: boolean;
  mxFound: boolean;
  mxRecords: string[];
  isDisposable: boolean;
  isRoleBased: boolean;
  roleName?: string;
  provider: string;
  score: number;
  reason: string;
  checkedAt: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  createdAt: string;
  lastUsedAt?: string;
  requestsCount: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  validEmails: number;
  websitesFound: number;
  highQualityLeads: number;
  searchesToday: number;
  apiUsageToday: number;
  recentSearches: SearchHistoryItem[];
  recentLeads: Lead[];
  charts: {
    leadsOverTime: { date: string; count: number }[];
    leadsByCountry: { country: string; count: number }[];
    leadsByNiche: { niche: string; count: number }[];
    emailStatusDistribution: { status: EmailValidationStatus; count: number; percentage: number }[];
    qualityDistribution: { tier: ScoreTier; count: number; percentage: number }[];
  };
}

export interface ComplianceLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'Compliant' | 'Flagged' | 'Blocked';
}

export interface OptOutRecord {
  id: string;
  type: 'email' | 'domain' | 'business_name';
  value: string;
  reason: string;
  requestedAt: string;
  status: 'Blocked';
}
