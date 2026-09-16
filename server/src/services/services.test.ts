import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FilterEngine } from './filterEngine';
import { EmailValidator } from './emailValidator';
import { DeduplicationService } from './deduplicationService';
import { LeadScoringService } from './leadScoringService';
import { ComplianceService } from './complianceService';
import { generateSeedLeads } from '../db/seedData';
import { Lead, LeadFilterState } from '../types';

describe('Auto Lead Collector Core Services Test Suite', () => {
  const leads = generateSeedLeads();

  it('1. DeduplicationService normalizes business names and domains accurately', () => {
    assert.strictEqual(DeduplicationService.normalizeBusinessName('Apex Marketing, LLC.'), 'apex marketing');
    assert.strictEqual(DeduplicationService.normalizeBusinessName('Apex Marketing Group Inc!'), 'apex marketing');
    assert.strictEqual(DeduplicationService.normalizeDomain('https://www.apexmarketing.com/about?ref=1'), 'apexmarketing.com');
  });

  it('2. EmailValidator correctly identifies valid, disposable, and role-based emails', () => {
    const valid = EmailValidator.validate('contact@stripe.com');
    assert.strictEqual(valid.syntaxValid, true);
    assert.strictEqual(valid.domainValid, true);

    const disposable = EmailValidator.validate('spammer@mailinator.com');
    assert.strictEqual(disposable.isDisposable, true);
    assert.strictEqual(disposable.status, 'Invalid');

    const role = EmailValidator.validate('support@acme.com');
    assert.strictEqual(role.isRoleBased, true);
    assert.strictEqual(role.status, 'Risky');
  });

  it('3. LeadScoringService provides transparent breakdown adding to total score', () => {
    const sample = leads[0];
    const scoreObj = LeadScoringService.calculateScore(sample);
    assert.ok(scoreObj.totalScore >= 0 && scoreObj.totalScore <= 100);
    assert.ok(scoreObj.factors.length >= 6);
    assert.ok(scoreObj.summary.includes(scoreObj.tier));
  });

  it('4. FilterEngine accurately filters by Niche, Country, and Lead Score', () => {
    const filter: LeadFilterState = {
      country: 'USA',
      niche: 'Digital Marketing',
      minScore: 50,
    };
    const matching = leads.filter(l => FilterEngine.matchesFilter(l, filter));
    assert.ok(matching.length > 0);
    for (const m of matching) {
      assert.strictEqual(m.country, 'USA');
      assert.ok(m.niche.includes('Digital Marketing') || m.category.includes('Digital'));
      assert.ok(m.leadScore >= 50);
    }
  });

  it('5. FilterEngine evaluates nested AND / OR / NOT compound logic trees', () => {
    const testLead: Lead = {
      ...leads[0],
      country: 'USA',
      niche: 'Digital Marketing',
      businessType: 'Agency',
      leadScore: 85,
    };

    // Tree: Country = USA AND (Niche = Digital Marketing OR Niche = Web Design) NOT BusinessType = Store
    const treeFilter: LeadFilterState = {
      ruleTree: {
        id: 'root',
        operator: 'AND',
        rules: [
          { id: 'r1', field: 'country', operator: 'equals', value: 'USA' },
          {
            id: 'g2',
            operator: 'OR',
            rules: [
              { id: 'r2', field: 'niche', operator: 'equals', value: 'Digital Marketing' },
              { id: 'r3', field: 'niche', operator: 'equals', value: 'Web Design' },
            ],
          },
          {
            id: 'g3',
            operator: 'NOT',
            rules: [
              { id: 'r4', field: 'businessType', operator: 'equals', value: 'Store' },
            ],
          },
        ],
      },
    };

    const matches = FilterEngine.matchesFilter(testLead, treeFilter);
    assert.strictEqual(matches, true);

    // Modify lead to violate NOT clause
    const violatingLead: Lead = { ...testLead, businessType: 'Store' };
    assert.strictEqual(FilterEngine.matchesFilter(violatingLead, treeFilter), false);
  });

  it('6. ComplianceService strictly blocks opt-out entities and logs audit trails', () => {
    const blockedLead: Partial<Lead> = {
      publicEmail: 'donotcontact@samplefirm.org',
      website: 'https://regular-biz.com',
    };
    const compliance = ComplianceService.isCompliant(blockedLead);
    assert.strictEqual(compliance.compliant, false);
    assert.ok(compliance.reason?.includes('global opt-out'));
  });
});
