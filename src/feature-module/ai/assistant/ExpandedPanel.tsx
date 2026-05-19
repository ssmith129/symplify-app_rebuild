import React from 'react';
import type { ExpandedViewConfig } from '../../../../core/ai/types';

interface ExpandedPanelProps {
  config: ExpandedViewConfig;
  onCollapse: () => void;
}

const ExpandedPanel: React.FC<ExpandedPanelProps> = ({ config, onCollapse }) => {
  return (
    <div className="ai-expanded-panel" role="complementary" aria-label={config.title}>
      <div className="ep-header">
        <h6 className="ep-title">
          <i className={`ti ${getExpandedIcon(config.type)}`} />
          {config.title}
        </h6>
        <button
          className="ep-collapse-btn"
          onClick={onCollapse}
          aria-label="Collapse panel"
        >
          <i className="ti ti-arrows-minimize" />
        </button>
      </div>
      <div className="ep-body">
        {renderExpandedContent(config)}
      </div>
    </div>
  );
};

function getExpandedIcon(type: ExpandedViewConfig['type']): string {
  switch (type) {
    case 'drug-interaction': return 'ti-pill';
    case 'shift-handoff': return 'ti-transfer';
    case 'alerts': return 'ti-alert-triangle';
    case 'scheduler': return 'ti-calendar-event';
    case 'calendar': return 'ti-calendar';
    default: return 'ti-layout-sidebar-right';
  }
}

function renderExpandedContent(config: ExpandedViewConfig): React.ReactNode {
  switch (config.type) {
    case 'drug-interaction':
      return <DrugInteractionExpanded />;
    case 'shift-handoff':
      return <ShiftHandoffExpanded />;
    case 'alerts':
      return <AlertsExpanded />;
    case 'scheduler':
      return <SchedulerExpanded />;
    default:
      return <div className="ep-placeholder">Detail view for {config.title}</div>;
  }
}

/* ── Drug Interaction Expanded ── */
const DrugInteractionExpanded: React.FC = () => (
  <div className="ep-content">
    <div className="ep-section">
      <h6 className="ep-section-title">Interaction Details</h6>
      <p className="ep-text">
        The drug interaction checker analyzes pharmacological profiles to identify potential adverse reactions 
        between prescribed medications. Results are based on established pharmacokinetic and pharmacodynamic 
        interaction databases.
      </p>
    </div>
    <div className="ep-section">
      <h6 className="ep-section-title">Recommendations</h6>
      <ul className="ep-list">
        <li><i className="ti ti-point-filled" /> Monitor renal function markers (BUN, creatinine)</li>
        <li><i className="ti ti-point-filled" /> Check serum potassium levels within 48 hours</li>
        <li><i className="ti ti-point-filled" /> Consider dose adjustment based on eGFR values</li>
        <li><i className="ti ti-point-filled" /> Document interaction review in patient chart</li>
      </ul>
    </div>
    <div className="ep-section">
      <h6 className="ep-section-title">References</h6>
      <div className="ep-ref-list">
        <span className="ep-ref-chip">FDA Drug Safety Communication</span>
        <span className="ep-ref-chip">Lexicomp Interaction Database</span>
        <span className="ep-ref-chip">Clinical Pharmacology Guidelines</span>
      </div>
    </div>
  </div>
);

/* ── Shift Handoff Expanded ── */
const ShiftHandoffExpanded: React.FC = () => {
  const patients = [
    { name: 'Maria Santos', room: '301A', status: 'Stable', priority: 'Medium', notes: 'Post-op day 2, pain managed' },
    { name: 'James Wilson', room: '305B', status: 'Guarded', priority: 'High', notes: 'Monitoring cardiac rhythm' },
    { name: 'Emily Chen', room: '312A', status: 'Stable', priority: 'Low', notes: 'Discharge planned tomorrow' },
  ];

  return (
    <div className="ep-content">
      <div className="ep-section">
        <h6 className="ep-section-title">Patient Summary (SBAR Format)</h6>
        {patients.map((p, i) => (
          <div key={i} className="ep-patient-card">
            <div className="ep-patient-header">
              <span className="ep-patient-name">{p.name}</span>
              <span className="ep-patient-room">Room {p.room}</span>
            </div>
            <div className="ep-patient-meta">
              <span className={`ep-status-badge ${p.priority.toLowerCase()}`}>{p.priority}</span>
              <span className="ep-patient-status">{p.status}</span>
            </div>
            <p className="ep-patient-notes">{p.notes}</p>
          </div>
        ))}
      </div>
      <div className="ep-section">
        <h6 className="ep-section-title">Pending Tasks</h6>
        <ul className="ep-list">
          <li><i className="ti ti-checkbox" /> Medication reconciliation for Room 305B</li>
          <li><i className="ti ti-checkbox" /> Lab results review for Room 301A</li>
          <li><i className="ti ti-checkbox" /> Discharge paperwork for Room 312A</li>
        </ul>
      </div>
    </div>
  );
};

/* ── Alerts Expanded ── */
const AlertsExpanded: React.FC = () => {
  const alerts = [
    { event: 'Sepsis risk elevation', patient: 'Maria Santos', risk: 'critical', time: '2 hours', confidence: 89 },
    { event: 'Cardiac arrhythmia warning', patient: 'James Wilson', risk: 'high', time: '4 hours', confidence: 76 },
    { event: 'Fall risk increase', patient: 'Robert Johnson', risk: 'moderate', time: '6 hours', confidence: 82 },
  ];

  const riskColors: Record<string, string> = { critical: 'var(--clinical-critical)', high: 'var(--clinical-urgent)', moderate: 'var(--clinical-caution)', low: 'var(--clinical-stable)' };

  return (
    <div className="ep-content">
      <div className="ep-section">
        <h6 className="ep-section-title">Active Predictive Alerts</h6>
        {alerts.map((a, i) => (
          <div key={i} className="ep-alert-card" style={{ borderLeftColor: riskColors[a.risk] }}>
            <div className="ep-alert-top">
              <span className="ep-alert-event">{a.event}</span>
              <span className={`cc-severity-badge sev-${a.risk}`}>{a.risk}</span>
            </div>
            <div className="ep-alert-meta">
              <span><i className="ti ti-user" /> {a.patient}</span>
              <span><i className="ti ti-clock" /> {a.time}</span>
              <span><i className="ti ti-chart-line" /> {a.confidence}% confidence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Scheduler Expanded ── */
const SchedulerExpanded: React.FC = () => {
  const slots = [
    { date: 'Mon, Mar 10', time: '9:00 AM', doctor: 'Dr. Alex Morgan', score: 5, showRate: 92 },
    { date: 'Mon, Mar 10', time: '11:30 AM', doctor: 'Dr. Sarah Johnson', score: 4, showRate: 85 },
    { date: 'Tue, Mar 11', time: '9:00 AM', doctor: 'Dr. Emily Carter', score: 4, showRate: 88 },
    { date: 'Tue, Mar 11', time: '2:00 PM', doctor: 'Dr. David Lee', score: 3, showRate: 78 },
  ];

  return (
    <div className="ep-content">
      <div className="ep-section">
        <h6 className="ep-section-title">AI-Optimized Appointment Slots</h6>
        <div className="ep-scheduler-list">
          {slots.map((s, i) => (
            <div key={i} className="ep-sched-card">
              <div className="ep-sched-top">
                <div className="ep-sched-dt">
                  <span className="ep-sched-date">{s.date}</span>
                  <span className="ep-sched-time">{s.time}</span>
                </div>
                <span className={`ep-sched-rate ${s.showRate >= 85 ? 'good' : 'fair'}`}>{s.showRate}%</span>
              </div>
              <div className="ep-sched-doc">
                <i className="ti ti-stethoscope" /> {s.doctor}
              </div>
              <div className="ep-sched-stars">
                {Array.from({ length: 5 }, (_, j) => (
                  <i key={j} className={`ti ti-star-filled ${j < s.score ? 'active' : ''}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpandedPanel;
