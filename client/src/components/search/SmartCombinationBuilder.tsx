import React from 'react';
import { FilterRule, FilterRuleGroup, LogicalOperator } from '../../types';
import { Plus, Trash2, GitBranch, Shield, Sparkles } from 'lucide-react';

interface SmartCombinationBuilderProps {
  ruleTree: FilterRuleGroup;
  onChange: (newTree: FilterRuleGroup) => void;
  onApply: () => void;
  onReset: () => void;
}

const AVAILABLE_FIELDS = [
  { label: 'Business Niche', value: 'niche', type: 'string' },
  { label: 'Business Category', value: 'category', type: 'string' },
  { label: 'Country', value: 'country', type: 'string' },
  { label: 'State / Region', value: 'state', type: 'string' },
  { label: 'City', value: 'city', type: 'string' },
  { label: 'Website Available', value: 'hasWebsite', type: 'boolean' },
  { label: 'Website Platform', value: 'websitePlatform', type: 'string' },
  { label: 'Email Available', value: 'hasEmail', type: 'boolean' },
  { label: 'Email Type', value: 'emailType', type: 'string' },
  { label: 'Email Status', value: 'emailStatus', type: 'string' },
  { label: 'Lead Score', value: 'leadScore', type: 'number' },
  { label: 'Business Type', value: 'businessType', type: 'string' },
  { label: 'Company Size', value: 'companySize', type: 'string' },
  { label: 'Is Duplicate', value: 'isDuplicate', type: 'boolean' },
  { label: 'Website Language', value: 'websiteLanguage', type: 'string' },
];

export const SmartCombinationBuilder: React.FC<SmartCombinationBuilderProps> = ({
  ruleTree,
  onChange,
  onApply,
  onReset,
}) => {
  const updateGroup = (
    current: FilterRuleGroup,
    targetGroupId: string,
    updater: (group: FilterRuleGroup) => FilterRuleGroup
  ): FilterRuleGroup => {
    if (current.id === targetGroupId) {
      return updater(current);
    }
    return {
      ...current,
      rules: current.rules.map((item) => {
        if ('rules' in item) {
          return updateGroup(item, targetGroupId, updater);
        }
        return item;
      }),
    };
  };

  const handleAddRule = (groupId: string) => {
    const newRule: FilterRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      field: 'niche',
      operator: 'equals',
      value: 'Digital Marketing',
    };

    onChange(
      updateGroup(ruleTree, groupId, (group) => ({
        ...group,
        rules: [...group.rules, newRule],
      }))
    );
  };

  const handleAddGroup = (groupId: string) => {
    const newSubGroup: FilterRuleGroup = {
      id: `group-${Date.now()}`,
      operator: 'OR',
      rules: [
        {
          id: `rule-${Date.now()}-1`,
          field: 'niche',
          operator: 'equals',
          value: 'SEO Agency',
        },
        {
          id: `rule-${Date.now()}-2`,
          field: 'niche',
          operator: 'equals',
          value: 'Web Design',
        },
      ],
    };

    onChange(
      updateGroup(ruleTree, groupId, (group) => ({
        ...group,
        rules: [...group.rules, newSubGroup],
      }))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    const filterOut = (group: FilterRuleGroup): FilterRuleGroup => ({
      ...group,
      rules: group.rules
        .filter((r) => r.id !== itemId)
        .map((r) => ('rules' in r ? filterOut(r) : r)),
    });
    onChange(filterOut(ruleTree));
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<FilterRule>) => {
    const updateRuleInGroup = (group: FilterRuleGroup): FilterRuleGroup => ({
      ...group,
      rules: group.rules.map((r) => {
        if ('rules' in r) {
          return updateRuleInGroup(r);
        }
        if (r.id === ruleId) {
          return { ...r, ...updates };
        }
        return r;
      }),
    });
    onChange(updateRuleInGroup(ruleTree));
  };

  const handleOperatorChange = (groupId: string, operator: LogicalOperator) => {
    onChange(
      updateGroup(ruleTree, groupId, (group) => ({
        ...group,
        operator,
      }))
    );
  };

  const renderGroup = (group: FilterRuleGroup, depth = 0) => {
    return (
      <div
        key={group.id}
        style={{
          marginLeft: depth > 0 ? '20px' : '0',
          marginTop: '12px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: depth % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderLeft: `4px solid ${
            group.operator === 'AND' ? '#6366f1' : group.operator === 'OR' ? '#10b981' : '#ef4444'
          }`,
        }}
      >
        {/* Group Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              MATCH CONDITION:
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['AND', 'OR', 'NOT'] as LogicalOperator[]).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => handleOperatorChange(group.id, op)}
                  className={`btn btn-sm ${
                    group.operator === op
                      ? op === 'AND'
                        ? 'btn-primary'
                        : op === 'OR'
                        ? 'badge-success'
                        : 'badge-danger'
                      : 'btn-outline'
                  }`}
                  style={{ padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  {op}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({group.operator === 'AND' ? 'All must match' : group.operator === 'OR' ? 'At least one matches' : 'None must match'})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleAddRule(group.id)}
            >
              <Plus size={14} /> Add Rule
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleAddGroup(group.id)}
            >
              <GitBranch size={14} /> Add Nested Group
            </button>
            {depth > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveItem(group.id)}
                title="Remove this group"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Rules & Sub-groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {group.rules.map((item, index) => {
            if ('rules' in item) {
              return renderGroup(item, depth + 1);
            }

            const rule = item as FilterRule;
            const fieldDef = AVAILABLE_FIELDS.find((f) => f.value === rule.field) || AVAILABLE_FIELDS[0];

            return (
              <div
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-card)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                }}
              >
                {index > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: group.operator === 'AND' ? '#6366f1' : group.operator === 'OR' ? '#10b981' : '#ef4444',
                      minWidth: '40px',
                    }}
                  >
                    {group.operator}
                  </span>
                )}
                {index === 0 && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', minWidth: '40px' }}>WHERE</span>}

                {/* Field selector */}
                <select
                  className="form-select"
                  style={{ width: '180px', height: '36px', fontSize: '0.8125rem' }}
                  value={rule.field}
                  onChange={(e) => handleUpdateRule(rule.id, { field: e.target.value })}
                >
                  {AVAILABLE_FIELDS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* Operator selector */}
                <select
                  className="form-select"
                  style={{ width: '150px', height: '36px', fontSize: '0.8125rem' }}
                  value={rule.operator}
                  onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                >
                  <option value="equals">equals (=)</option>
                  <option value="not_equals">not equals (!=)</option>
                  <option value="contains">contains</option>
                  <option value="greater_than_or_equal">&gt;= (At least)</option>
                  <option value="less_than_or_equal">&lt;= (At most)</option>
                  <option value="is_true">is true</option>
                  <option value="is_false">is false</option>
                </select>

                {/* Value input */}
                {rule.operator !== 'is_true' && rule.operator !== 'is_false' && (
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: '220px', height: '36px', fontSize: '0.8125rem' }}
                    value={rule.value ?? ''}
                    onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                    placeholder="Enter value..."
                  />
                )}

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 10px', color: 'var(--danger)', marginLeft: 'auto' }}
                  onClick={() => handleRemoveItem(rule.id)}
                  title="Delete rule"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Visual Smart Combination Builder</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Build complex, multi-layered queries using compound <strong>AND / OR / NOT</strong> logic with nested grouping.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onReset}>
            Reset Logic
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onApply}>
            Evaluate & Apply Combinations
          </button>
        </div>
      </div>

      {/* Render Tree */}
      {renderGroup(ruleTree)}
    </div>
  );
};
