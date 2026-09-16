import { FilterRule, FilterRuleGroup, Lead, LeadFilterState } from '../types';

export interface FilterCountResult {
  totalLeads: number;
  matchingLeads: number;
  matchingWebsites: number;
  matchingEmails: number;
  matchingValidEmails: number;
  matchingHighQuality: number;
  duplicatesRemoved: number;
}

export class FilterEngine {
  /**
   * Evaluates whether a lead matches the full 28-dimension LeadFilterState
   */
  public static matchesFilter(lead: Lead, filter: LeadFilterState): boolean {
    // 1. Business / Niche / Category
    if (filter.niche && filter.niche !== 'All' && filter.niche !== 'all') {
      if (!lead.niche.toLowerCase().includes(filter.niche.toLowerCase()) &&
          !lead.category.toLowerCase().includes(filter.niche.toLowerCase())) {
        return false;
      }
    }
    if (filter.industry && !lead.industry.toLowerCase().includes(filter.industry.toLowerCase())) {
      return false;
    }
    if (filter.category && !lead.category.toLowerCase().includes(filter.category.toLowerCase())) {
      return false;
    }
    if (filter.subcategory && !lead.subcategory.toLowerCase().includes(filter.subcategory.toLowerCase())) {
      return false;
    }
    if (filter.businessType && lead.businessType !== filter.businessType) {
      return false;
    }
    if (filter.businessModel && lead.businessModel !== filter.businessModel) {
      return false;
    }
    if (filter.businessStage && lead.businessStage !== filter.businessStage) {
      return false;
    }
    if (filter.locationType && lead.locationType !== filter.locationType) {
      return false;
    }

    // 2. Location
    if (filter.state && !lead.state.toLowerCase().includes(filter.state.toLowerCase())) {
      return false;
    }
    if (filter.city && !lead.city.toLowerCase().includes(filter.city.toLowerCase())) {
      return false;
    }
    if (filter.district && !lead.district.toLowerCase().includes(filter.district.toLowerCase())) {
      return false;
    }
    if (filter.area && !lead.area.toLowerCase().includes(filter.area.toLowerCase())) {
      return false;
    }
    if (filter.zipCode && !lead.zipCode.toLowerCase().includes(filter.zipCode.toLowerCase())) {
      return false;
    }

    // 3. Country & Country Groups
    if (filter.country && filter.country !== 'All' && filter.country !== 'all') {
      if (lead.country.toLowerCase() !== filter.country.toLowerCase()) {
        return false;
      }
    }
    if (filter.countries && filter.countries.length > 0) {
      const match = filter.countries.some(c => c.toLowerCase() === lead.country.toLowerCase());
      if (!match) return false;
    }
    if (filter.countryGroup && filter.countryGroup !== 'All') {
      const groupCountries = this.getCountriesInGroup(filter.countryGroup);
      if (groupCountries.length > 0 && !groupCountries.includes(lead.country.toLowerCase())) {
        return false;
      }
    }

    // 4. Website
    if (filter.hasWebsite !== undefined && filter.hasWebsite !== null) {
      if (lead.hasWebsite !== filter.hasWebsite) return false;
    }
    if (filter.httpsAvailable !== undefined && filter.httpsAvailable !== null) {
      if (lead.httpsAvailable !== filter.httpsAvailable) return false;
    }
    if (filter.customDomain !== undefined && filter.customDomain !== null) {
      if (lead.customDomain !== filter.customDomain) return false;
    }
    if (filter.websitePlatform && lead.websitePlatform !== filter.websitePlatform) {
      return false;
    }
    if (filter.websiteStatus && lead.websiteStatus.toLowerCase() !== filter.websiteStatus.toLowerCase()) {
      return false;
    }

    // 5. Email
    if (filter.hasEmail !== undefined && filter.hasEmail !== null) {
      if (lead.hasEmail !== filter.hasEmail) return false;
    }
    if (filter.emailType && lead.emailType !== filter.emailType) {
      return false;
    }
    if (filter.emailDepartment && lead.emailDepartment !== filter.emailDepartment) {
      return false;
    }

    // 6. Email Validation
    if (filter.emailStatus && lead.emailStatus !== filter.emailStatus) {
      return false;
    }
    if (filter.validEmailsOnly) {
      if (lead.emailStatus !== 'Valid') return false;
    }
    if (filter.disposableAllowed === false && lead.isDisposableEmail) {
      return false;
    }
    if (filter.roleBasedAllowed === false && lead.isRoleBasedEmail) {
      return false;
    }
    if (filter.mxAvailable !== undefined && filter.mxAvailable !== null) {
      if (lead.mxAvailable !== filter.mxAvailable) return false;
    }

    // 7. Lead Score
    if (filter.minScore !== undefined && filter.minScore > 0) {
      if (lead.leadScore < filter.minScore) return false;
    }
    if (filter.scoreTier && lead.scoreTier !== filter.scoreTier) {
      return false;
    }

    // 8. Business Size
    if (filter.companySize && lead.companySize !== filter.companySize) {
      return false;
    }

    // 9. Business Status
    if (filter.businessStatus && lead.businessStatus !== filter.businessStatus) {
      return false;
    }

    // 10. Contact Info
    if (filter.hasPhone !== undefined && filter.hasPhone !== null) {
      if (lead.hasPhone !== filter.hasPhone) return false;
    }
    if (filter.hasContactForm !== undefined && filter.hasContactForm !== null) {
      if (lead.hasContactForm !== filter.hasContactForm) return false;
    }
    if (filter.hasAddress !== undefined && filter.hasAddress !== null) {
      const hasAddr = Boolean(lead.address && lead.address.trim().length > 0);
      if (hasAddr !== filter.hasAddress) return false;
    }

    // 11. Social Media
    if (filter.hasSocialProfile !== undefined && filter.hasSocialProfile !== null) {
      if (lead.hasSocialProfile !== filter.hasSocialProfile) return false;
    }
    if (filter.socialPlatform) {
      const p = filter.socialPlatform;
      if (!lead.socialProfiles || !lead.socialProfiles[p]) {
        return false;
      }
    }

    // 12. Source
    if (filter.sourceType && lead.sourceType !== filter.sourceType) {
      return false;
    }

    // 13. Language
    if (filter.websiteLanguage && !lead.websiteLanguage.toLowerCase().includes(filter.websiteLanguage.toLowerCase())) {
      return false;
    }

    // 14. Domain
    if (filter.domainExtension) {
      const ext = filter.domainExtension.toLowerCase().replace(/^\./, '');
      const domain = (lead.website || '').toLowerCase();
      if (!domain.endsWith('.' + ext) && !domain.includes('.' + ext + '/')) {
        return false;
      }
    }
    if (filter.domainContains) {
      if (!(lead.website || '').toLowerCase().includes(filter.domainContains.toLowerCase())) {
        return false;
      }
    }
    if (filter.domainNotContains) {
      if ((lead.website || '').toLowerCase().includes(filter.domainNotContains.toLowerCase())) {
        return false;
      }
    }

    // 15. Date
    if (filter.dateRange && filter.dateRange !== 'all') {
      const leadDate = new Date(lead.firstDiscovered).getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (filter.dateRange === 'today' && now - leadDate > oneDay) return false;
      if (filter.dateRange === '7days' && now - leadDate > 7 * oneDay) return false;
      if (filter.dateRange === '30days' && now - leadDate > 30 * oneDay) return false;
      if (filter.dateRange === '90days' && now - leadDate > 90 * oneDay) return false;
      if (filter.dateRange === 'custom') {
        if (filter.startDate && leadDate < new Date(filter.startDate).getTime()) return false;
        if (filter.endDate && leadDate > new Date(filter.endDate).getTime() + oneDay) return false;
      }
    }

    // 16. Duplicate
    if (filter.duplicateMode === 'hide_duplicates' || !filter.duplicateMode) {
      if (lead.isDuplicate) return false;
    } else if (filter.duplicateMode === 'only_duplicates') {
      if (!lead.isDuplicate) return false;
    }

    // 17. Data Completeness
    if (filter.dataCompleteness && lead.dataCompleteness !== filter.dataCompleteness) {
      return false;
    }

    // 18. Search Query & Keywords
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase().trim();
      const searchBlob = `${lead.businessName} ${lead.niche} ${lead.category} ${lead.city} ${lead.country} ${lead.website} ${lead.publicEmail}`.toLowerCase();
      if (!searchBlob.includes(kw)) return false;
    }
    if (filter.exactPhrase) {
      const ep = filter.exactPhrase.toLowerCase();
      const fullText = `${lead.businessName} ${lead.niche} ${lead.category} ${lead.notes}`.toLowerCase();
      if (!fullText.includes(ep)) return false;
    }
    if (filter.includeKeywords && filter.includeKeywords.length > 0) {
      const searchBlob = `${lead.businessName} ${lead.niche} ${lead.category}`.toLowerCase();
      const hasAll = filter.includeKeywords.every(k => searchBlob.includes(k.toLowerCase().trim()));
      if (!hasAll) return false;
    }
    if (filter.excludeKeywords && filter.excludeKeywords.length > 0) {
      const searchBlob = `${lead.businessName} ${lead.niche} ${lead.category}`.toLowerCase();
      const hasAnyExcluded = filter.excludeKeywords.some(k => searchBlob.includes(k.toLowerCase().trim()));
      if (hasAnyExcluded) return false;
    }

    // 19 & 20. Smart Combination Builder (Compound Rule Tree with AND / OR / NOT)
    if (filter.ruleTree && filter.ruleTree.rules.length > 0) {
      if (!this.evaluateRuleGroup(lead, filter.ruleTree)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Recursively evaluates a FilterRuleGroup with AND / OR / NOT logic
   */
  public static evaluateRuleGroup(lead: Lead, group: FilterRuleGroup): boolean {
    if (!group.rules || group.rules.length === 0) return true;

    if (group.operator === 'AND') {
      return group.rules.every(r => this.evaluateItem(lead, r));
    } else if (group.operator === 'OR') {
      return group.rules.some(r => this.evaluateItem(lead, r));
    } else if (group.operator === 'NOT') {
      return !group.rules.some(r => this.evaluateItem(lead, r));
    }
    return true;
  }

  private static evaluateItem(lead: Lead, item: FilterRule | FilterRuleGroup): boolean {
    if ('rules' in item) {
      return this.evaluateRuleGroup(lead, item);
    }
    return this.evaluateRule(lead, item);
  }

  private static evaluateRule(lead: Lead, rule: FilterRule): boolean {
    const val = (lead as any)[rule.field];
    const target = rule.value;

    switch (rule.operator) {
      case 'equals':
        return String(val).toLowerCase() === String(target).toLowerCase();
      case 'not_equals':
        return String(val).toLowerCase() !== String(target).toLowerCase();
      case 'contains':
        return String(val || '').toLowerCase().includes(String(target).toLowerCase());
      case 'greater_than_or_equal':
        return Number(val) >= Number(target);
      case 'less_than_or_equal':
        return Number(val) <= Number(target);
      case 'is_true':
        return Boolean(val) === true;
      case 'is_false':
        return Boolean(val) === false;
      case 'in':
        if (Array.isArray(target)) {
          return target.map(t => String(t).toLowerCase()).includes(String(val).toLowerCase());
        }
        return false;
      default:
        return true;
    }
  }

  /**
   * Evaluates and counts matching leads with granular breakdowns
   */
  public static calculateCounts(leads: Lead[], filter: LeadFilterState): FilterCountResult {
    let matchingLeads = 0;
    let matchingWebsites = 0;
    let matchingEmails = 0;
    let matchingValidEmails = 0;
    let matchingHighQuality = 0;
    let duplicatesRemoved = 0;

    for (const lead of leads) {
      if (this.matchesFilter(lead, filter)) {
        matchingLeads++;
        if (lead.hasWebsite) matchingWebsites++;
        if (lead.hasEmail) matchingEmails++;
        if (lead.emailStatus === 'Valid') matchingValidEmails++;
        if (lead.leadScore >= 75) matchingHighQuality++;
      } else if (lead.isDuplicate) {
        duplicatesRemoved++;
      }
    }

    return {
      totalLeads: leads.length,
      matchingLeads,
      matchingWebsites,
      matchingEmails,
      matchingValidEmails,
      matchingHighQuality,
      duplicatesRemoved,
    };
  }

  private static getCountriesInGroup(group: string): string[] {
    switch (group) {
      case 'North America':
        return ['usa', 'united states', 'canada', 'mexico'];
      case 'Europe':
        return ['uk', 'united kingdom', 'germany', 'france', 'spain', 'italy', 'netherlands', 'sweden', 'switzerland', 'poland'];
      case 'Asia Pacific':
        return ['bangladesh', 'india', 'pakistan', 'singapore', 'australia', 'japan', 'malaysia', 'indonesia'];
      case 'MENA':
        return ['uae', 'united arab emirates', 'saudi arabia', 'qatar', 'egypt', 'morocco'];
      default:
        return [];
    }
  }
}
