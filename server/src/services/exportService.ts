import * as XLSX from 'xlsx';
import { Lead } from '../types';

export class ExportService {
  /**
   * Generates a CSV string formatted for Excel/Spreadsheets
   */
  public static generateCsv(leads: Lead[], selectedFields?: string[]): string {
    const data = this.prepareExportData(leads, selectedFields);
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headerRow = headers.map(escapeCsv).join(',');
    const rows = data.map(row => headers.map(h => escapeCsv(row[h])).join(','));

    return [headerRow, ...rows].join('\r\n');
  }

  /**
   * Generates an Excel XLSX buffer
   */
  public static generateXlsx(leads: Lead[], selectedFields?: string[]): Buffer {
    const data = this.prepareExportData(leads, selectedFields);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Verified Public Leads');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  private static prepareExportData(leads: Lead[], selectedFields?: string[]) {
    return leads.map(lead => {
      const fullRecord: Record<string, any> = {
        'Business Name': lead.businessName,
        'Niche': lead.niche,
        'Industry': lead.industry,
        'Category': lead.category,
        'Business Type': lead.businessType,
        'Company Size': lead.companySize,
        'Country': lead.country,
        'State / Region': lead.state,
        'City': lead.city,
        'Address': lead.address,
        'Website': lead.website || 'None',
        'Website Platform': lead.websitePlatform,
        'Public Business Email': lead.publicEmail || 'None',
        'Email Type': lead.emailType || 'None',
        'Email Status': lead.emailStatus,
        'Email MX Valid': lead.mxAvailable ? 'Yes' : 'No',
        'Lead Score': `${lead.leadScore}/100`,
        'Score Tier': lead.scoreTier,
        'Phone': lead.phone || 'None',
        'Social Profiles': Object.entries(lead.socialProfiles || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('; ') || 'None',
        'Source URL': lead.sourceUrl,
        'Source Type': lead.sourceType,
        'Collection Date': lead.firstDiscovered,
        'Last Checked': lead.lastChecked,
      };

      if (!selectedFields || selectedFields.length === 0) {
        return fullRecord;
      }

      const filteredRecord: Record<string, any> = {};
      for (const field of selectedFields) {
        if (field in fullRecord) {
          filteredRecord[field] = fullRecord[field];
        }
      }
      return filteredRecord;
    });
  }
}
