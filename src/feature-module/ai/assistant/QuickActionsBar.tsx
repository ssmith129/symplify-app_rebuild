import React, { useState } from 'react';
import type { EnhancedQuickAction, QuickActionCategory } from '../../../core/ai/types';

interface QuickActionsBarProps {
  actions: EnhancedQuickAction[];
  pinnedIds: Set<string>;
  onAction: (action: EnhancedQuickAction) => void;
  onTogglePin: (id: string) => void;
}

const CATEGORY_LABELS: Record<QuickActionCategory, { label: string; icon: string }> = {
  clinical: { label: 'Clinical', icon: 'ti-stethoscope' },
  administrative: { label: 'Admin', icon: 'ti-clipboard' },
  navigation: { label: 'Navigate', icon: 'ti-compass' },
};

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ actions, pinnedIds, onAction, onTogglePin }) => {
  const [activeCategory, setActiveCategory] = useState<QuickActionCategory | 'pinned'>('pinned');

  const pinned = actions.filter(a => pinnedIds.has(a.id));
  const categories: QuickActionCategory[] = ['clinical', 'administrative', 'navigation'];

  const visibleActions = activeCategory === 'pinned'
    ? (pinned.length > 0 ? pinned : actions.slice(0, 6))
    : actions.filter(a => a.category === activeCategory);

  return (
    <div className="ai-quick-actions-enhanced" role="toolbar" aria-label="Quick actions">
      {/* Category tabs */}
      <div className="qa-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeCategory === 'pinned'}
          className={`qa-tab ${activeCategory === 'pinned' ? 'active' : ''}`}
          onClick={() => setActiveCategory('pinned')}
        >
          <i className="ti ti-pin" />
          {pinned.length > 0 && <span className="qa-tab-count">{pinned.length}</span>}
        </button>
        {categories.map(cat => {
          const catActions = actions.filter(a => a.category === cat);
          if (catActions.length === 0) return null;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`qa-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <i className={`ti ${CATEGORY_LABELS[cat].icon}`} />
              <span className="qa-tab-label">{CATEGORY_LABELS[cat].label}</span>
            </button>
          );
        })}
      </div>

      {/* Action chips */}
      <div className="qa-chips-scroll">
        {visibleActions.map(action => (
          <div key={action.id} className="qa-chip-wrapper">
            <button
              className="btn btn-sm qa-chip"
              onClick={() => onAction(action)}
              aria-label={action.label}
            >
              <i className={`ti ${action.icon}`} />
              <span>{action.label}</span>
            </button>
            <button
              className={`qa-pin-btn ${pinnedIds.has(action.id) ? 'pinned' : ''}`}
              onClick={() => onTogglePin(action.id)}
              aria-label={pinnedIds.has(action.id) ? `Unpin ${action.label}` : `Pin ${action.label}`}
            >
              <i className={`ti ${pinnedIds.has(action.id) ? 'ti-pin-filled' : 'ti-pin'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsBar;
