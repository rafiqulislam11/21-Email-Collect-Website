import React, { useState } from 'react';
import { LeadFilterState } from '../../types';
import { Save, X, Star } from 'lucide-react';

interface SavePresetModalProps {
  filter: LeadFilterState;
  onSave: (preset: { name: string; description?: string; filterState: LeadFilterState; isFavorite?: boolean }) => Promise<void>;
  onClose: () => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  filter,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        filterState: filter,
        isFavorite,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Save Current Filter Preset</h3>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Preset Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. US Digital Marketing High Quality"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Summary of criteria included in this search filter..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} style={{ color: '#f59e0b' }} fill={isFavorite ? '#f59e0b' : 'none'} /> Add to Quick Favorites
            </span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
              {saving ? 'Saving...' : 'Save Preset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
