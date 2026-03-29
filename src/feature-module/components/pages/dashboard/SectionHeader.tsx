import React from 'react';

interface SectionHeaderProps {
  icon: string;
  iconColor: string;
  title: string;
  collapsed?: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  iconColor,
  title,
  collapsed,
  onToggle,
}) => (
  <div className="d-flex justify-content-start align-items-start mb-3 mt-2" style={{ height: 'auto', flexGrow: 0 }}>
    <div className="d-flex justify-content-start align-items-stretch" style={{ height: 'auto', flexGrow: 0 }}>
      <i className={`ti ${icon} ${iconColor} me-2 fs-20`} />
      <h5 className="fw-bold mb-0 fs-16">{title}</h5>
    </div>
    <button
      className="btn btn-sm btn-outline-white d-inline-flex align-items-start justify-content-end gap-1"
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title} section`}
      style={{ minHeight: 36, marginLeft: 'auto' }}
    >
      <i className={`ti ti-chevron-${collapsed ? 'down' : 'up'} fs-14`} />
      <span className="fs-12">{collapsed ? 'Expand' : 'Collapse'}</span>
    </button>
  </div>
);

export default SectionHeader;
