import React from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
  label?: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence, label = 'Confidence' }) => {
  const colorClass = confidence >= 80 ? 'ci-success' : confidence >= 60 ? 'ci-warning' : 'ci-danger';

  return (
    <div className="ai-confidence" aria-label={`${label}: ${confidence}%`} aria-describedby={`ci-desc-${confidence}`}>
      <div className="ci-row">
        <span className="ci-label">{label}</span>
        <span className={`ci-value ${colorClass}`}>{confidence}%</span>
      </div>
      <div className="ci-bar-track">
        <div className={`ci-bar-fill ${colorClass}`} style={{ width: `${Math.min(confidence, 100)}%` }} />
      </div>
      <span id={`ci-desc-${confidence}`} className="visually-hidden">
        {confidence >= 80 ? 'High confidence' : confidence >= 60 ? 'Moderate confidence' : 'Low confidence'}
      </span>
    </div>
  );
};

export default ConfidenceIndicator;
