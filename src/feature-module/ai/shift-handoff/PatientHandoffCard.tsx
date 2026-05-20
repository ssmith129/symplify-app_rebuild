import React from 'react';
import type { PatientHandoff } from '../../../core/redux/shiftHandoffSlice';

interface PriorityConfig {
  color: string;
  bgColor: string;
  label: string;
}

interface PatientHandoffCardProps {
  patient: PatientHandoff;
  onClick: () => void;
  priorityConfig: Record<string, PriorityConfig>;
  expanded?: boolean;
  reviewed?: boolean;
}

/** Map metric names to recognizable short labels and icons */
const METRIC_MAP: Record<string, { abbr: string; icon: string }> = {
  'Heart Rate': { abbr: 'HR', icon: 'ti-heartbeat' },
  'Blood Pressure': { abbr: 'BP', icon: 'ti-droplet' },
  'SpO2': { abbr: 'SpO2', icon: 'ti-lungs' },
  'Temperature': { abbr: 'Temp', icon: 'ti-temperature' },
};

/** Trend direction uses clinically-aware coloring */
const getTrendInfo = (_metric: string, trend: string) => {
  switch (trend) {
    case 'improving':
      return { icon: '↑', color: '#166534', label: 'Improving' };
    case 'declining':
      return { icon: '↓', color: '#991B1B', label: 'Declining' };
    default:
      return { icon: '→', color: '#6B7280', label: 'Stable' };
  }
};

export const PatientHandoffCard: React.FC<PatientHandoffCardProps> = ({
  patient,
  onClick,
  priorityConfig,
  expanded = false,
  reviewed = false
}) => {
  const config = priorityConfig[patient.priorityLevel];

  const criticalEvents = patient.recentEvents.filter(e => e.severity === 'critical');
  const warningEvents = patient.recentEvents.filter(e => e.severity === 'warning');
  const hasAlert = criticalEvents.length > 0 || warningEvents.length > 0;

  return (
    <div 
      className={`patient-handoff-card priority-${patient.priorityLevel} ${reviewed ? 'reviewed' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: config.color }}
      role="button"
      tabIndex={0}
      aria-label={`${patient.patientName}, Room ${patient.room}, ${config.label} priority. ${reviewed ? 'Reviewed.' : ''} Click for details.`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {/* Header — patient name is primary, badge + reviewed indicator */}
      <div className="card-header">
        <div className="patient-info">
          <h4 className="patient-name">
            {patient.patientName}
            {reviewed && (
              <span className="reviewed-badge" title="You have reviewed this patient">
                <i className="ti ti-circle-check" />
              </span>
            )}
          </h4>
          <span className="patient-details">
            Room {patient.room} · {patient.age} y/o
          </span>
        </div>
        <span 
          className="priority-tag"
          style={{ 
            backgroundColor: config.bgColor, 
            color: config.color 
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Primary Diagnosis */}
      <div className="diagnosis-row">
        <i className="ti ti-building-hospital diagnosis-icon"></i>
        <span className="diagnosis-text">{patient.primaryDiagnosis}</span>
      </div>

      {/* Status Note */}
      <div className="sbar-preview">
        <span className="sbar-label">Status Note:</span>
        <span className="sbar-text">
          {patient.sbar.situation.length > 120 
            ? `${patient.sbar.situation.slice(0, 120)}...` 
            : patient.sbar.situation}
        </span>
      </div>

      {/* Vitals with expanded abbreviations and icons */}
      <div className="vitals-trends">
        <div className="trends-label">Vitals Trends:</div>
        <div className="trends-badges">
          {patient.vitalsTrend.slice(0, 3).map((vital, idx) => {
            const mapped = METRIC_MAP[vital.metric] || { abbr: vital.metric.slice(0, 4), icon: 'ti-activity' };
            const trendInfo = getTrendInfo(vital.metric, vital.trend);
            return (
              <span 
                key={idx} 
                className="trend-badge"
                title={`${vital.metric}: ${trendInfo.label}`}
                aria-label={`${vital.metric} ${trendInfo.label}`}
              >
                <i className={`ti ${mapped.icon}`} aria-hidden="true" style={{ fontSize: '0.7rem', marginRight: 2 }} />
                <span>{mapped.abbr}</span>
                <span style={{ color: trendInfo.color, fontWeight: 700, marginLeft: 2 }}>{trendInfo.icon}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Rec 2: Surface top pending tasks inline with action affordance */}
      {patient.pendingTasks.length > 0 && (
        <div className="inline-tasks">
          <div className="inline-tasks-header">
            <i className="ti ti-clipboard-list" />
            <span>Pending Tasks ({patient.pendingTasks.length})</span>
          </div>
          <ul className="inline-tasks-list">
            {patient.pendingTasks.slice(0, 2).map((task, idx) => (
              <li key={idx} className="inline-task-item">
                <i className="ti ti-square" aria-hidden="true" />
                <span>{task}</span>
              </li>
            ))}
            {patient.pendingTasks.length > 2 && (
              <li className="inline-task-more">
                +{patient.pendingTasks.length - 2} more tasks
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Medications count */}
      <div className="quick-stats">
        <div className="stat-item">
          <i className="ti ti-pill stat-icon"></i>
          <span>{patient.medications.length} medication{patient.medications.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Alert area — only show when there are active alerts (Rec: remove "No active alerts" noise from stable cards) */}
      {hasAlert && (
        <div className="alert-area">
          {criticalEvents.length > 0 ? (
            <div className="alert-banner critical">
              <i className="ti ti-alert-octagon alert-icon" aria-hidden="true" />
              <span className="alert-severity-label">IMMEDIATE:</span>
              <span className="alert-text">{criticalEvents[0].event}</span>
            </div>
          ) : (
            <div className="alert-banner warning">
              <i className="ti ti-alert-triangle alert-icon" aria-hidden="true" />
              <span className="alert-severity-label">MONITOR:</span>
              <span className="alert-text">{warningEvents[0].event}</span>
            </div>
          )}
        </div>
      )}

      {/* Expanded View - Recent Events Timeline */}
      {expanded && (
        <div className="expanded-content">
          <h5 className="section-title">Recent Events</h5>
          <div className="events-timeline">
            {patient.recentEvents.slice(0, 4).map((event, idx) => (
              <div 
                key={idx} 
                className={`timeline-item severity-${event.severity}`}
              >
                <span className="event-time">{event.time}</span>
                <span className="event-text">{event.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click indicator — entire card is clickable */}
      <div className="click-indicator">
        <span>View Details <i className="ti ti-arrow-right" /></span>
      </div>
    </div>
  );
};

export default PatientHandoffCard;
