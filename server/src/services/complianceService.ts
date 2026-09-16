import { ComplianceLog, OptOutRecord, Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ComplianceService {
  // In-memory opt-out registry
  private static optOutList: OptOutRecord[] = [
    {
      id: 'opt-1',
      type: 'domain',
      value: 'private-consultancy-optout.com',
      reason: 'Requested removal under GDPR Article 17',
      requestedAt: '2026-08-10T10:00:00Z',
      status: 'Blocked',
    },
    {
      id: 'opt-2',
      type: 'email',
      value: 'donotcontact@samplefirm.org',
      reason: 'Direct opt-out request via compliance webform',
      requestedAt: '2026-08-15T14:30:00Z',
      status: 'Blocked',
    },
  ];

  // In-memory compliance audit trail
  private static auditLogs: ComplianceLog[] = [
    {
      id: 'aud-1',
      action: 'Automated Search Compliance Check',
      user: 'admin@company.com',
      details: 'Verified compliance confirmation active for search query "Digital Marketing USA". Checked 0 blocked opt-outs.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ipAddress: '192.168.1.42',
      status: 'Compliant',
    },
    {
      id: 'aud-2',
      action: 'Opt-Out Verification',
      user: 'system_filter',
      details: 'Scanned 120 potential leads against global exclusion list. Excluded 0 matched records.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ipAddress: '127.0.0.1',
      status: 'Compliant',
    },
  ];

  /**
   * Evaluates whether a lead violates any public data or opt-out rules.
   * Returns true if allowed, false if blocked.
   */
  public static isCompliant(lead: Partial<Lead>): { compliant: boolean; reason?: string } {
    const email = (lead.publicEmail || '').toLowerCase().trim();
    const domain = (lead.website || '').toLowerCase().trim();
    const businessName = (lead.businessName || '').toLowerCase().trim();

    // Check opt-out registry
    for (const opt of this.optOutList) {
      if (opt.type === 'email' && email && email === opt.value.toLowerCase()) {
        return { compliant: false, reason: `Email "${email}" is in the global opt-out registry (${opt.reason}).` };
      }
      if (opt.type === 'domain' && domain && domain.includes(opt.value.toLowerCase())) {
        return { compliant: false, reason: `Domain "${opt.value}" has requested removal from discovery index.` };
      }
      if (opt.type === 'business_name' && businessName && businessName === opt.value.toLowerCase()) {
        return { compliant: false, reason: `Business "${businessName}" has exercised privacy opt-out.` };
      }
    }

    // Safety checks against prohibited data types
    const prohibitedKeywords = ['leaked', 'hack', 'password', 'ssn', 'creditcard', 'personal-inbox'];
    if (prohibitedKeywords.some(k => (lead.sourceUrl || '').toLowerCase().includes(k))) {
      return { compliant: false, reason: 'Source URL flagged as containing non-public or unauthorized material.' };
    }

    return { compliant: true };
  }

  /**
   * Adds an entity to the opt-out registry
   */
  public static addOptOut(record: Omit<OptOutRecord, 'id' | 'requestedAt' | 'status'>): OptOutRecord {
    const newRecord: OptOutRecord = {
      id: uuidv4(),
      ...record,
      requestedAt: new Date().toISOString(),
      status: 'Blocked',
    };
    this.optOutList.unshift(newRecord);

    this.logAction(
      'Privacy Opt-Out Registered',
      'webform_visitor',
      `Registered removal request for ${record.type}: "${record.value}". Reason: ${record.reason || 'None provided'}.`,
      '127.0.0.1',
      'Compliant'
    );

    return newRecord;
  }

  public static getOptOutList(): OptOutRecord[] {
    return this.optOutList;
  }

  public static getAuditLogs(): ComplianceLog[] {
    return this.auditLogs;
  }

  public static logAction(
    action: string,
    user: string,
    details: string,
    ipAddress = '127.0.0.1',
    status: 'Compliant' | 'Flagged' | 'Blocked' = 'Compliant'
  ): ComplianceLog {
    const log: ComplianceLog = {
      id: uuidv4(),
      action,
      user,
      details,
      ipAddress,
      status,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 500 logs in memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }
}
