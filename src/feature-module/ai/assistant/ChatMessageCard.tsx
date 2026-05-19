import React from 'react';
import type { ChatCard } from '../../../../core/ai/types';
import ConfidenceIndicator from './ConfidenceIndicator';

interface ChatMessageCardProps {
  card: ChatCard;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--clinical-critical)',
  major: 'var(--clinical-critical)',
  high: 'var(--clinical-urgent)',
  moderate: 'var(--clinical-caution)',
  minor: 'var(--clinical-stable)',
  low: 'var(--clinical-stable)',
};

const RISK_ICONS: Record<string, string> = {
  critical: 'ti-alert-octagon',
  high: 'ti-alert-triangle',
  moderate: 'ti-info-circle',
  low: 'ti-circle-check',
};

const ChatMessageCard: React.FC<ChatMessageCardProps> = ({ card }) => {
  switch (card.type) {
    case 'drug-interaction':
      return <DrugInteractionCard data={card.data} />;
    case 'triage':
      return <TriageCard data={card.data} />;
    case 'alert':
      return <AlertCard data={card.data} />;
    case 'slot':
      return <SlotCard data={card.data} />;
    case 'bed-status':
      return <BedStatusCard data={card.data} />;
    case 'compliance':
      return <ComplianceCard data={card.data} />;
    case 'patient-summary':
      return <SummaryCard data={card.data} />;
    case 'confirmation':
      return <ConfirmationCard data={card.data} />;
    default:
      return null;
  }
};

/* ── Drug Interaction Card ── */
const DrugInteractionCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const severity = (data.severity as string) || 'minor';
  const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.minor;

  return (
    <div className="chat-card chat-card-drug" style={{ borderLeftColor: color }}>
      <div className="cc-header">
        <i className="ti ti-pill" style={{ color }} />
        <span className="cc-title">Drug Interaction</span>
        <span className={`cc-severity-badge sev-${severity}`}>{severity}</span>
      </div>
      <div className="cc-drugs">
        <span className="cc-drug-name">{data.drug1 as string}</span>
        <i className="ti ti-arrows-exchange" />
        <span className="cc-drug-name">{data.drug2 as string}</span>
      </div>
      <p className="cc-desc">{data.description as string}</p>
      <div className="cc-rec">
        <i className="ti ti-bulb" />
        <span>{data.recommendation as string}</span>
      </div>
      {typeof data.confidence === 'number' && (
        <ConfidenceIndicator confidence={data.confidence as number} label="Analysis Confidence" />
      )}
    </div>
  );
};

/* ── Triage Card ── */
const TriageCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const priority = data.priority as number;
  const labels = ['', 'Resuscitation', 'Emergency', 'Urgent', 'Semi-Urgent', 'Non-Urgent'];
  const colors = ['', 'var(--clinical-critical)', 'var(--clinical-urgent)', 'var(--clinical-caution)', 'var(--primary)', 'var(--clinical-stable)'];

  return (
    <div className="chat-card chat-card-triage" style={{ borderLeftColor: colors[priority] || '#6b7280' }}>
      <div className="cc-header">
        <i className="ti ti-stethoscope" style={{ color: colors[priority] }} />
        <span className="cc-title">Triage Assessment</span>
      </div>
      <div className="cc-priority-row">
        <span className="cc-priority-badge" style={{ background: colors[priority] }}>
          P{priority}
        </span>
        <span className="cc-priority-label">{labels[priority] || 'Unknown'}</span>
      </div>
      {Array.isArray(data.factors) && (
        <ul className="cc-factors">
          {(data.factors as string[]).map((f, i) => (
            <li key={i}><i className="ti ti-point-filled" /> {f}</li>
          ))}
        </ul>
      )}
      {typeof data.confidence === 'number' && (
        <ConfidenceIndicator confidence={data.confidence as number} />
      )}
    </div>
  );
};

/* ── Alert Card ── */
const AlertCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const risk = (data.riskLevel as string) || 'low';
  const icon = RISK_ICONS[risk] || 'ti-info-circle';
  const color = SEVERITY_COLORS[risk] || SEVERITY_COLORS.low;

  return (
    <div className="chat-card chat-card-alert" style={{ borderLeftColor: color }}>
      <div className="cc-header">
        <i className={`ti ${icon}`} style={{ color }} />
        <span className="cc-title">{data.predictedEvent as string}</span>
      </div>
      <div className="cc-alert-meta">
        <span><i className="ti ti-user" /> {data.patientName as string}</span>
        <span><i className="ti ti-clock" /> {data.timeframe as string}</span>
        <span className={`cc-severity-badge sev-${risk}`}>{risk}</span>
      </div>
      {typeof data.confidence === 'number' && (
        <ConfidenceIndicator confidence={data.confidence as number} label="Prediction Confidence" />
      )}
    </div>
  );
};

/* ── Slot Card ── */
const SlotCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const dt = new Date(data.datetime as string);
  const date = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-card chat-card-slot">
      <div className="cc-slot-row">
        <div className="cc-slot-dt">
          <span className="cc-slot-date">{date}</span>
          <span className="cc-slot-time">{time}</span>
        </div>
        <span className="cc-slot-score">
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={`ti ti-star-filled ${i < (data.score as number) ? 'active' : ''}`} />
          ))}
        </span>
      </div>
      <div className="cc-slot-doc">
        <i className="ti ti-stethoscope" /> {data.providerName as string}
      </div>
    </div>
  );
};

/* ── Bed Status Card ── */
const BedStatusCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const depts = (data.departments as { name: string; available: number; total: number }[]) || [];
  const available = data.available as number;
  const total = data.totalBeds as number;
  const pct = total ? Math.round((available / total) * 100) : 0;

  return (
    <div className="chat-card chat-card-bed">
      <div className="cc-header">
        <i className="ti ti-bed" />
        <span className="cc-title">Bed Availability</span>
        <span className={`cc-severity-badge sev-${pct < 15 ? 'critical' : pct < 30 ? 'moderate' : 'minor'}`}>
          {available}/{total} available
        </span>
      </div>
      <div className="cc-bed-grid">
        {depts.map((d, i) => (
          <div key={i} className="cc-bed-dept">
            <span className="cc-bed-name">{d.name}</span>
            <div className="cc-bed-bar-track">
              <div
                className={`cc-bed-bar-fill ${d.available <= 2 ? 'critical' : ''}`}
                style={{ width: `${d.total ? ((d.total - d.available) / d.total) * 100 : 0}%` }}
              />
            </div>
            <span className="cc-bed-count">{d.available}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Compliance Card ── */
const ComplianceCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const score = data.overallScore as number;
  const cats = (data.categories as { name: string; score: number; status: string }[]) || [];
  const statusIcon: Record<string, string> = { pass: 'ti-circle-check', warning: 'ti-alert-triangle', fail: 'ti-circle-x' };
  const statusColor: Record<string, string> = { pass: 'var(--clinical-stable)', warning: 'var(--clinical-caution)', fail: 'var(--clinical-critical)' };

  return (
    <div className="chat-card chat-card-compliance">
      <div className="cc-header">
        <i className="ti ti-shield-check" />
        <span className="cc-title">Compliance Status</span>
        <span className={`cc-severity-badge sev-${score >= 85 ? 'minor' : score >= 70 ? 'moderate' : 'critical'}`}>
          {score}%
        </span>
      </div>
      <div className="cc-compliance-list">
        {cats.map((c, i) => (
          <div key={i} className="cc-compliance-row">
            <i className={`ti ${statusIcon[c.status] || 'ti-minus'}`} style={{ color: statusColor[c.status] }} />
            <span className="cc-comp-name">{c.name}</span>
            <span className="cc-comp-score">{c.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Summary Card (notifications/email overview) ── */
const SummaryCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  const items = (data.items as { label: string; value: number; color: string }[]) || [];

  return (
    <div className="chat-card chat-card-summary">
      <div className="cc-header">
        <i className="ti ti-chart-bar" />
        <span className="cc-title">{data.title as string}</span>
      </div>
      <div className="cc-summary-grid">
        {items.map((item, i) => (
          <div key={i} className="cc-summary-item">
            <span className={`cc-summary-val text-${item.color}`}>{item.value}</span>
            <span className="cc-summary-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Confirmation Card ── */
const ConfirmationCard: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <div className="chat-card chat-card-confirm">
    <div className="cc-confirm-icon">
      <i className="ti ti-circle-check" />
    </div>
    <div className="cc-confirm-body">
      <span className="cc-confirm-title">{(data.title as string) || 'Action Confirmed'}</span>
      <span className="cc-confirm-desc">{(data.description as string) || ''}</span>
    </div>
  </div>
);

export default ChatMessageCard;
