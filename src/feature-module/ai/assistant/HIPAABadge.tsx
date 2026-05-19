import React from 'react';

const HIPAABadge: React.FC = () => (
  <div className="ai-hipaa-badge" aria-describedby="hipaa-desc">
    <i className="ti ti-lock" />
    <span>HIPAA Protected</span>
    <span id="hipaa-desc" className="visually-hidden">
      This information is protected under HIPAA privacy regulations
    </span>
  </div>
);

export default HIPAABadge;
