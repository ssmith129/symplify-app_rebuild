/* eslint-disable */
// src/feature-module/components/ai/EmailPriorityBadge.tsx
// Email Priority Badge for Symplify Platform AI-Enhanced Communication

import React from 'react';
import { EmailPriority, EmailAnalysis } from '../../../core/ai/emailTypes';

interface PriorityConfig {
  color: string;
  bgColor: string;
  icon: string;
  label: string;
}

const PRIORITY_CONFIG: Record<EmailPriority, PriorityConfig> = {
  critical: { color: 'var(--clinical-critical)', bgColor: 'var(--clinical-critical-bg)', icon: 'ti-alert-octagon', label: 'Critical' },
  high: { color: 'var(--clinical-urgent)', bgColor: 'var(--clinical-urgent-bg)', icon: 'ti-alert-triangle', label: 'High' },
  medium: { color: 'var(--clinical-caution)', bgColor: 'var(--clinical-caution-bg)', icon: 'ti-clock', label: 'Medium' },
  low: { color: 'var(--clinical-stable)', bgColor: 'var(--clinical-stable-bg)', icon: 'ti-check-circle', label: 'Low' }
};

interface EmailPriorityBadgeProps {
  analysis: EmailAnalysis;
  showDetails?: boolean;
  showLabel?: boolean;
}

export const EmailPriorityBadge: React.FC<EmailPriorityBadgeProps> = ({ 
  analysis, 
  showDetails = false,
  showLabel = true
}) => {
  const config = PRIORITY_CONFIG[analysis.priority];

  return (
    <div 
      className={`email-priority-badge ${analysis.priority}`}
      title={`${config.label} Priority - ${analysis.confidence}% confidence\nResponse Time: ${analysis.estimatedResponseTime}${analysis.urgencyIndicators.length > 0 ? `\nIndicators: ${analysis.urgencyIndicators.join(', ')}` : ''}`}
      style={{ 
        backgroundColor: config.bgColor, 
        color: config.color,
      }}
    >
      <i className={`ti ${config.icon}`} style={{ fontSize: '12px' }} />
      {showLabel && <span className="ms-1">{config.label}</span>}
      {showDetails && (
        <span className="ms-1 opacity-75">({analysis.confidence}%)</span>
      )}
    </div>
  );
};

export default EmailPriorityBadge;
