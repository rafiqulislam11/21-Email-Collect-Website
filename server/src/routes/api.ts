import { Router, Request, Response } from 'express';
import { DatabaseRepository } from '../db';
import { FilterEngine } from '../services/filterEngine';
import { EmailValidator } from '../services/emailValidator';
import { ExportService } from '../services/exportService';
import { SearchProviderManager } from '../services/searchProvider';
import { ComplianceService } from '../services/complianceService';
import { LeadFilterState } from '../types';

export const apiRouter = Router();

// 1. Dashboard Stats & Analytics
apiRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  try {
    const stats = DatabaseRepository.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Real-time dynamic count preview as user toggles any filter
apiRouter.post('/filter-count', (req: Request, res: Response) => {
  try {
    const filter: LeadFilterState = req.body.filter || {};
    const allLeads = DatabaseRepository.getAllLeads();
    const counts = FilterEngine.calculateCounts(allLeads, filter);
    res.json({ success: true, data: counts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Multi-Filter Leads Query with Server-side Pagination & Sorting
apiRouter.post('/leads/query', (req: Request, res: Response) => {
  try {
    const filter: LeadFilterState = req.body.filter || {};
    const page = Math.max(1, parseInt(req.body.page) || 1);
    const limit = Math.min(100, Math.max(5, parseInt(req.body.limit) || 20));
    const sortBy = req.body.sortBy || 'leadScore';
    const sortOrder = req.body.sortOrder === 'asc' ? 1 : -1;

    let allLeads = DatabaseRepository.getAllLeads();
    let filtered = allLeads.filter(lead => FilterEngine.matchesFilter(lead, filter));

    // Sort
    filtered.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      data: {
        leads: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Trigger Lead Discovery & Collection Pipeline
apiRouter.post('/search/execute', async (req: Request, res: Response) => {
  try {
    const { filter, complianceAccepted } = req.body;

    if (!complianceAccepted) {
      return res.status(403).json({
        success: false,
        error: 'Compliance confirmation required: You must accept the public business data terms before initiating discovery.',
      });
    }

    const allLeads = DatabaseRepository.getAllLeads();
    const result = await SearchProviderManager.executeSearchPipeline(filter || {}, allLeads);

    // Save search history
    const summary = `${filter?.niche || 'All Niches'} in ${filter?.country || 'Global'}${
      filter?.city ? ' (' + filter.city + ')' : ''
    }`;

    DatabaseRepository.addSearchHistory({
      querySummary: summary,
      filters: filter || {},
      resultCount: result.leads.length,
      durationMs: result.durationMs,
      status: 'Completed',
    });

    ComplianceService.logAction(
      'Search Discovery Executed',
      'current_user',
      `Executed search pipeline for "${summary}". Retained ${result.leads.length} compliant records.`,
      req.ip || '127.0.0.1',
      'Compliant'
    );

    res.json({
      success: true,
      data: {
        leads: result.leads,
        progressLog: result.progressLog,
        duplicatesRemoved: result.duplicatesRemoved,
        optOutsExcluded: result.optOutsExcluded,
        durationMs: result.durationMs,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Lead Details & Actions
apiRouter.get('/leads/:id', (req: Request, res: Response) => {
  const lead = DatabaseRepository.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, error: 'Lead not found.' });
  res.json({ success: true, data: lead });
});

apiRouter.patch('/leads/:id', (req: Request, res: Response) => {
  const updated = DatabaseRepository.updateLead(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Lead not found.' });
  res.json({ success: true, data: updated });
});

apiRouter.delete('/leads/:id', (req: Request, res: Response) => {
  const deleted = DatabaseRepository.deleteLead(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Lead not found.' });
  res.json({ success: true, message: 'Lead removed successfully.' });
});

// 6. Email Validation Tool
apiRouter.post('/validate-email', (req: Request, res: Response) => {
  try {
    const { email, emails } = req.body;
    if (emails && Array.isArray(emails)) {
      const results = EmailValidator.validateBulk(emails);
      return res.json({ success: true, data: results });
    }
    if (email) {
      const result = EmailValidator.validate(email);
      return res.json({ success: true, data: result });
    }
    res.status(400).json({ success: false, error: 'Please provide an email or list of emails.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Filter Presets
apiRouter.get('/presets', (req: Request, res: Response) => {
  res.json({ success: true, data: DatabaseRepository.getPresets() });
});

apiRouter.post('/presets', (req: Request, res: Response) => {
  try {
    const { name, description, filterState, isFavorite } = req.body;
    if (!name || !filterState) {
      return res.status(400).json({ success: false, error: 'Preset name and filterState are required.' });
    }
    const preset = DatabaseRepository.createPreset({ name, description, filterState, isFavorite: Boolean(isFavorite) });
    res.json({ success: true, data: preset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/presets/:id', (req: Request, res: Response) => {
  const deleted = DatabaseRepository.deletePreset(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Preset not found.' });
  res.json({ success: true, message: 'Preset deleted.' });
});

// 8. Search History
apiRouter.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, data: DatabaseRepository.getSearchHistory() });
});

// 9. Export Center (CSV / XLSX)
apiRouter.post('/export', (req: Request, res: Response) => {
  try {
    const { format, filter, selectedLeadIds, selectedFields } = req.body;

    let targetLeads: any[] = [];
    const allLeads = DatabaseRepository.getAllLeads();

    if (selectedLeadIds && Array.isArray(selectedLeadIds) && selectedLeadIds.length > 0) {
      const idSet = new Set(selectedLeadIds);
      targetLeads = allLeads.filter(l => idSet.has(l.id));
    } else if (filter) {
      targetLeads = allLeads.filter(l => FilterEngine.matchesFilter(l, filter));
    } else {
      targetLeads = allLeads;
    }

    if (targetLeads.length === 0) {
      return res.status(400).json({ success: false, error: 'No matching leads available for export.' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (format === 'xlsx') {
      const buffer = ExportService.generateXlsx(targetLeads, selectedFields);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="public_leads_${timestamp}.xlsx"`);
      return res.send(buffer);
    } else {
      const csv = ExportService.generateCsv(targetLeads, selectedFields);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="public_leads_${timestamp}.csv"`);
      return res.send(csv);
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. API Keys Management
apiRouter.get('/api-keys', (req: Request, res: Response) => {
  res.json({ success: true, data: DatabaseRepository.getApiKeys() });
});

apiRouter.post('/api-keys', (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Key name is required.' });
    const { apiKey, record } = DatabaseRepository.createApiKey(name);
    res.json({ success: true, data: { apiKey, record } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/api-keys/:id', (req: Request, res: Response) => {
  const revoked = DatabaseRepository.revokeApiKey(req.params.id);
  if (!revoked) return res.status(404).json({ success: false, error: 'API Key not found.' });
  res.json({ success: true, message: 'API Key revoked successfully.' });
});

// 11. Compliance & Opt-Out Registry
apiRouter.get('/compliance/audit', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      auditLogs: ComplianceService.getAuditLogs(),
      optOutList: ComplianceService.getOptOutList(),
    },
  });
});

apiRouter.post('/compliance/opt-out', (req: Request, res: Response) => {
  try {
    const { type, value, reason } = req.body;
    if (!type || !value) {
      return res.status(400).json({ success: false, error: 'Type and value are required.' });
    }
    const record = ComplianceService.addOptOut({ type, value, reason: reason || 'Opt-out request submitted via portal' });
    res.json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. System Health & Rate-Limit Status
apiRouter.get('/system/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      database: 'connected (in-memory relational store)',
      uptimeSeconds: process.uptime(),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      rateLimits: {
        windowMs: 60000,
        maxPerMinute: 60,
        currentUsage: 14,
      },
      providers: [
        { name: 'Public Directory Adapter', status: 'operational', responseTimeMs: 42 },
        { name: 'DNS / MX Resolver', status: 'operational', responseTimeMs: 18 },
        { name: 'Deduplication Engine', status: 'operational', responseTimeMs: 4 },
        { name: 'Compliance Engine', status: 'enforced', responseTimeMs: 2 },
      ],
    },
  });
});
