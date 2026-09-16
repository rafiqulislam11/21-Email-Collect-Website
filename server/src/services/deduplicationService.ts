import { Lead } from '../types';

export class DeduplicationService {
  /**
   * Normalizes a business name for deduplication matching:
   * lowercases, removes common business legal suffixes (LLC, Inc, Ltd, Corp, Agency, Co),
   * strips punctuation and extra whitespaces.
   */
  public static normalizeBusinessName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\b(llc|inc|ltd|corp|corporation|gmbh|sa|pvt|pty|co|company|group)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Normalizes a website URL to clean domain name:
   * strips protocol (http/https), www subdomain, trailing slashes, paths, and queries.
   */
  public static normalizeDomain(url: string): string {
    if (!url) return '';
    let domain = url.toLowerCase().trim();
    domain = domain.replace(/^https?:\/\//, '');
    domain = domain.replace(/^www\./, '');
    domain = domain.split('/')[0];
    domain = domain.split('?')[0];
    domain = domain.split(':')[0];
    return domain.trim();
  }

  /**
   * Normalizes an email address to lowercase and trimmed string.
   */
  public static normalizeEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase().trim();
  }

  /**
   * Generates a deduplication signature key for a lead.
   * If domain exists, key is domain.
   * If email exists and domain is generic, key combines email + normalized name.
   * Fallback is normalized name + country + city.
   */
  public static generateSignature(lead: Partial<Lead>): string {
    const domain = this.normalizeDomain(lead.website || '');
    const email = this.normalizeEmail(lead.publicEmail || '');
    const normName = this.normalizeBusinessName(lead.businessName || '');
    const country = (lead.country || '').toLowerCase().trim();
    const city = (lead.city || '').toLowerCase().trim();

    // If there's a custom domain, that's the strongest unique signature
    if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'facebook.com', 'instagram.com'].includes(domain)) {
      return `dom:${domain}`;
    }

    // If there's an email, combine email and normalized name
    if (email) {
      return `email:${email}__name:${normName}`;
    }

    // Otherwise use name + location
    return `loc:${country}_${city}__name:${normName}`;
  }

  /**
   * Processes an array of leads, marks duplicates and links them to their canonical lead.
   */
  public static processDeduplication(leads: Lead[]): {
    uniqueLeads: Lead[];
    duplicateCount: number;
    allProcessedLeads: Lead[];
  } {
    const signatureMap = new Map<string, Lead>();
    let duplicateCount = 0;

    const allProcessedLeads = leads.map(lead => {
      const sig = this.generateSignature(lead);
      const existing = signatureMap.get(sig);

      if (existing) {
        duplicateCount++;
        return {
          ...lead,
          isDuplicate: true,
          canonicalLeadId: existing.id,
        };
      } else {
        signatureMap.set(sig, lead);
        return {
          ...lead,
          isDuplicate: false,
        };
      }
    });

    const uniqueLeads = allProcessedLeads.filter(l => !l.isDuplicate);

    return {
      uniqueLeads,
      duplicateCount,
      allProcessedLeads,
    };
  }
}
