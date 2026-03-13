import React, { useState } from 'react';

/* ────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────── */

interface Evidence { label: string; value: string; flag: 'abnormal' | 'normal'; }
interface Alert {
  id: number; severity: 'urgent' | 'warning' | 'informational'; type: 'ai' | 'rule';
  title: string; patient: string; confidence: number; time: string; unit: string;
  evidence: Evidence[]; actions: string[];
}

const ALERTS: Alert[] = [
  { id:1, severity:'urgent', type:'ai', title:'Sepsis Risk — Early Warning', patient:'Eleanor Vance · P-10234 · ICU 4-201', confidence:94, time:'3 min ago', unit:'ICU',
    evidence:[{label:'Temperature',value:'39.2°C',flag:'abnormal'},{label:'Heart Rate',value:'118 bpm',flag:'abnormal'},{label:'WBC Count',value:'18.2k',flag:'abnormal'},{label:'Lactate',value:'3.8 mmol/L',flag:'abnormal'},{label:'MAP',value:'62 mmHg',flag:'abnormal'},{label:'Resp Rate',value:'28/min',flag:'abnormal'}],
    actions:['Order blood cultures and lactate level stat','Initiate 30 mL/kg crystalloid bolus','Start broad-spectrum antibiotics within 1 hour','Notify attending physician Dr. Williams'] },
  { id:2, severity:'urgent', type:'ai', title:'Respiratory Deterioration Predicted', patient:'Clara Nguyen · P-10301 · ICU 4-205', confidence:91, time:'8 min ago', unit:'ICU',
    evidence:[{label:'SpO2 Trend',value:'94% → 89%',flag:'abnormal'},{label:'FiO2 Required',value:'60% → 80%',flag:'abnormal'},{label:'P/F Ratio',value:'142',flag:'abnormal'},{label:'Resp Rate',value:'32/min',flag:'abnormal'},{label:'Peak Pressure',value:'34 cmH₂O',flag:'abnormal'},{label:'Tidal Volume',value:'380 mL',flag:'abnormal'}],
    actions:['Increase PEEP to 12 cmH₂O and reassess','Obtain ABG in 30 minutes','Consider prone positioning protocol','Alert respiratory therapy for vent adjustment'] },
  { id:3, severity:'urgent', type:'ai', title:'Cardiac Arrest Risk — Elevated', patient:'James Hargrove · P-10156 · CCU 3-112', confidence:87, time:'14 min ago', unit:'CCU',
    evidence:[{label:'Troponin Trend',value:'0.8 → 2.1 ng/mL',flag:'abnormal'},{label:'BNP',value:'1,840 pg/mL',flag:'abnormal'},{label:'EF (Echo)',value:'22%',flag:'abnormal'},{label:'Heart Rate',value:'48 bpm',flag:'abnormal'},{label:'K+ Level',value:'5.8 mEq/L',flag:'abnormal'},{label:'BP',value:'88/52 mmHg',flag:'abnormal'}],
    actions:['Continuous telemetry with code team on standby','Correct potassium — calcium gluconate + insulin/dextrose','Consider dobutamine drip for inotropic support','Urgent cardiology consult for cath lab evaluation'] },
  { id:4, severity:'urgent', type:'rule', title:'Critical Lab — Potassium > 6.0', patient:'Marcus Webb · P-10189 · ICU 4-203', confidence:99, time:'22 min ago', unit:'ICU',
    evidence:[{label:'K+ Level',value:'6.2 mEq/L',flag:'abnormal'},{label:'ECG Changes',value:'Peaked T-waves',flag:'abnormal'},{label:'Creatinine',value:'3.4 mg/dL',flag:'abnormal'}],
    actions:['Administer calcium gluconate 1g IV over 5 min','Insulin 10u + D50 50mL IV','Obtain stat ECG and repeat K+ in 2 hours'] },
  { id:5, severity:'warning', type:'ai', title:'Fall Risk — Score Increasing', patient:'William Dyer · P-10367 · CCU 3-110', confidence:82, time:'28 min ago', unit:'CCU',
    evidence:[{label:'Morse Score',value:'55 → 72',flag:'abnormal'},{label:'Gait',value:'Unsteady',flag:'abnormal'},{label:'Mental Status',value:'Intermittent confusion',flag:'abnormal'},{label:'Medications',value:'2 sedating agents',flag:'abnormal'},{label:'Age',value:'77 years',flag:'normal'},{label:'IV Access',value:'Yes',flag:'normal'}],
    actions:['Activate fall precautions bundle','Ensure bed alarm is active','Place non-slip socks and yellow wristband','Review sedating medication timing'] },
  { id:6, severity:'warning', type:'ai', title:'Pressure Injury Risk — Stage 1 Detected', patient:'Eleanor Vance · P-10234 · ICU 4-201', confidence:78, time:'35 min ago', unit:'ICU',
    evidence:[{label:'Braden Score',value:'12 (High Risk)',flag:'abnormal'},{label:'Sacral Area',value:'Non-blanchable erythema',flag:'abnormal'},{label:'Mobility',value:'Bedbound',flag:'abnormal'},{label:'Moisture',value:'Occasionally moist',flag:'abnormal'},{label:'Nutrition',value:'NPO 48hrs',flag:'abnormal'},{label:'Albumin',value:'2.8 g/dL',flag:'abnormal'}],
    actions:['Initiate q2h repositioning protocol','Apply barrier cream to sacral area','Consult wound care nurse','Place pressure-redistribution mattress'] },
  { id:7, severity:'warning', type:'ai', title:'Glycemic Instability — Repeated Hypoglycemia', patient:'Amira Osei · P-10278 · ICU 4-207', confidence:85, time:'42 min ago', unit:'ICU',
    evidence:[{label:'Last BG',value:'58 mg/dL',flag:'abnormal'},{label:'Pattern',value:'3 episodes < 70 in 12h',flag:'abnormal'},{label:'Insulin Drip',value:'4 units/hr',flag:'normal'},{label:'Nutrition',value:'TPN running',flag:'normal'}],
    actions:['Reduce insulin drip by 50%','Administer D50 25mL IV push now','Recheck BG in 15 minutes','Adjust TPN dextrose concentration'] },
  { id:8, severity:'warning', type:'rule', title:'Medication Due — Vancomycin Trough Overdue', patient:'Diana Reeves · P-10098 · Med-Surg 2-314', confidence:99, time:'1h ago', unit:'Med-Surg',
    evidence:[{label:'Last Trough',value:'Drawn 36h ago',flag:'abnormal'},{label:'Target Range',value:'15–20 mcg/mL',flag:'normal'},{label:'Dose Due',value:'In 2 hours',flag:'normal'}],
    actions:['Draw vancomycin trough level now','Hold next dose pending results if trough > 20','Notify pharmacy for dose adjustment'] },
  { id:9, severity:'warning', type:'ai', title:'DVT Risk — Prophylaxis Gap', patient:'Thomas Park · P-10145 · Tele 3-405', confidence:76, time:'1.5h ago', unit:'Tele',
    evidence:[{label:'Padua Score',value:'5 (High Risk)',flag:'abnormal'},{label:'Last Enoxaparin',value:'Held 24h — bleeding risk',flag:'abnormal'},{label:'SCDs',value:'Not documented',flag:'abnormal'},{label:'Mobility',value:'Limited',flag:'abnormal'}],
    actions:['Verify SCD application and document','Reassess bleeding risk for anticoagulation','Consult pharmacy for alternative prophylaxis','Ensure early mobilization PT order active'] },
  { id:10, severity:'warning', type:'ai', title:'Pain Management — Escalating Pattern', patient:'Fatima Al-Rashid · P-10211 · Med-Surg 2-320', confidence:79, time:'1.8h ago', unit:'Med-Surg',
    evidence:[{label:'Pain Score Trend',value:'4 → 6 → 8',flag:'abnormal'},{label:'PRN Usage',value:'q4h max reached',flag:'abnormal'},{label:'Current Regimen',value:'Morphine 4mg IV q4h PRN',flag:'normal'}],
    actions:['Reassess pain using standardized scale','Consider PCA or scheduled dosing','Consult pain management team','Evaluate for non-pharmacologic adjuncts'] },
  { id:11, severity:'warning', type:'rule', title:'Intake/Output Imbalance — Negative 1.2L', patient:'Robert Liu · P-10342 · CCU 3-108', confidence:99, time:'2h ago', unit:'CCU',
    evidence:[{label:'24h I/O',value:'-1,200 mL',flag:'abnormal'},{label:'Urine Output',value:'18 mL/hr avg',flag:'abnormal'},{label:'Fluid Bolus',value:'None ordered',flag:'normal'}],
    actions:['Assess volume status at bedside','Consider 500mL NS bolus if tolerated','Recheck urine output in 2 hours'] },
  { id:12, severity:'warning', type:'ai', title:'Delirium Risk — CAM Screening Due', patient:'James Hargrove · P-10156 · CCU 3-112', confidence:73, time:'2.2h ago', unit:'CCU',
    evidence:[{label:'Age',value:'81 years',flag:'normal'},{label:'ICU Days',value:'4',flag:'abnormal'},{label:'Sleep Disruption',value:'Documented',flag:'abnormal'},{label:'Benzodiazepine',value:'Lorazepam PRN',flag:'abnormal'}],
    actions:['Perform CAM-ICU assessment now','Review sedation protocol — minimize benzos','Implement sleep hygiene bundle','Ensure orientation aids at bedside'] },
  { id:13, severity:'informational', type:'ai', title:'Discharge Readiness — Criteria Met', patient:'Leo Chang · P-10288 · Med-Surg 2-325', confidence:88, time:'2.5h ago', unit:'Med-Surg',
    evidence:[{label:'Vitals',value:'Stable 48h',flag:'normal'},{label:'PO Intake',value:'Tolerating well',flag:'normal'},{label:'Ambulation',value:'Independent',flag:'normal'},{label:'Labs',value:'WBC normalizing',flag:'normal'}],
    actions:['Initiate discharge planning checklist','Order discharge medications from pharmacy','Schedule follow-up appointment within 7 days','Arrange home health if needed'] },
  { id:14, severity:'informational', type:'ai', title:'Trending Improvement — Downgrading Acuity', patient:'Grace Kim · P-10401 · Med-Surg 2-308', confidence:84, time:'3h ago', unit:'Med-Surg',
    evidence:[{label:'Pain Score',value:'7 → 3',flag:'normal'},{label:'Diet',value:'Advancing to regular',flag:'normal'},{label:'Ambulation',value:'Walking hallway',flag:'normal'},{label:'Incision',value:'Clean, dry, intact',flag:'normal'}],
    actions:['Transition pain management to oral only','Consider telemetry discontinuation','Update care plan to reflect recovery trajectory'] },
  { id:15, severity:'informational', type:'ai', title:'Lab Trend — Hemoglobin Stabilized', patient:'Fatima Al-Rashid · P-10211 · Med-Surg 2-320', confidence:81, time:'3.5h ago', unit:'Med-Surg',
    evidence:[{label:'Hgb Trend',value:'7.2 → 8.1 → 8.4',flag:'normal'},{label:'Transfusion',value:'2u PRBC given',flag:'normal'},{label:'Active Bleeding',value:'None',flag:'normal'}],
    actions:['Continue monitoring CBC q12h','Hold further transfusion unless Hgb < 7','Resume oral iron supplementation'] },
  { id:16, severity:'informational', type:'rule', title:'Isolation Precautions — Review Due', patient:'Henry Costa · P-10055 · Tele 3-412', confidence:99, time:'4h ago', unit:'Tele',
    evidence:[{label:'Isolation Type',value:'Contact',flag:'normal'},{label:'Duration',value:'72 hours',flag:'normal'},{label:'Culture Status',value:'Pending',flag:'normal'}],
    actions:['Review culture results when available','Discontinue isolation if cultures negative','Ensure PPE compliance documented'] },
  { id:17, severity:'informational', type:'ai', title:'Nutrition Assessment — Caloric Deficit', patient:'Priya Sharma · P-10122 · Ortho 5-202', confidence:72, time:'5h ago', unit:'Ortho',
    evidence:[{label:'Caloric Intake',value:'~800 kcal/day',flag:'abnormal'},{label:'Goal',value:'1,800 kcal/day',flag:'normal'},{label:'Appetite',value:'Poor — nausea',flag:'abnormal'},{label:'Albumin',value:'3.1 g/dL',flag:'normal'}],
    actions:['Consult dietitian for assessment','Consider oral nutritional supplements','Evaluate anti-emetic regimen','Monitor prealbumin in 3 days'] },
  { id:18, severity:'informational', type:'ai', title:'Activity Milestone — PT Goals Exceeded', patient:'Sarah Bennett · P-10199 · Ortho 5-210', confidence:90, time:'6h ago', unit:'Ortho',
    evidence:[{label:'Walking Distance',value:'150ft (goal: 100ft)',flag:'normal'},{label:'Pain w/ Activity',value:'2/10',flag:'normal'},{label:'ROM',value:'0-90° flexion',flag:'normal'}],
    actions:['Advance PT to next milestone protocol','Evaluate for discharge within 24–48 hours','Ensure home exercise program printed'] },
];

const SEVERITY_COLORS = {
  urgent: { border: '#dc2626', bg: '#fef2f2', text: '#dc2626' },
  warning: { border: '#ea580c', bg: '#fff7ed', text: '#ea580c' },
  informational: { border: '#0284c7', bg: '#f0f9ff', text: '#0284c7' },
};

const STAT_DATA = [
  { label: 'Total Active', value: 18, sub: 'Across all units', cls: 'primary' },
  { label: 'Urgent', value: 4, sub: 'Require immediate action', cls: 'danger' },
  { label: 'Warning', value: 8, sub: 'Monitor closely', cls: 'warning' },
  { label: 'Informational', value: 6, sub: 'For awareness', cls: 'info' },
];

/* ────────────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────────────── */

const PredictiveAlerts: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [confThreshold, setConfThreshold] = useState(50);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  let data = ALERTS.filter(a => !dismissed.has(a.id));
  if (severityFilter !== 'all') data = data.filter(a => a.severity === severityFilter);
  if (confThreshold > 50) data = data.filter(a => a.confidence >= confThreshold);
  if (typeFilter) data = data.filter(a => a.type === typeFilter);

  const toggle = (id: number) => {
    setExpandedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const acknowledge = (id: number) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">

        {/* Breadcrumb */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Predictive Clinical Alerts</h3>
              <ul className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="#">AI Modules</a></li>
                <li className="breadcrumb-item active">Predictive Alerts</li>
              </ul>
            </div>
            <div className="col-auto d-flex gap-2 align-items-center">
              <span className="pa-live-indicator"><span className="pa-live-dot" /> Live Monitoring</span>
              <button className="btn btn-outline-light"><i className="ti ti-filter me-1" />Advanced Filters</button>
              <button className="btn btn-outline-light"><i className="ti ti-settings-2 me-1" />Alert Rules</button>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="row mb-4">
          {STAT_DATA.map((s, i) => (
            <div className="col-lg-3 col-sm-6" key={i}>
              <div className={`card pca-stat-card border-start border-4 border-${s.cls}`}>
                <div className="card-body p-3">
                  <p className="text-muted text-uppercase fw-semibold fs-12 mb-1">{s.label}</p>
                  <h2 className="fw-bold mb-1">{s.value}</h2>
                  <small className="text-muted">{s.sub}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts Feed ── */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0"><i className="ti ti-bell-ringing me-1 text-primary" /> Active Alerts</h5>
            <small className="text-muted">Last 24 hours</small>
          </div>

          {/* Toolbar */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-3 border-bottom">
            <div className="d-flex gap-2 flex-wrap">
              {(['all','urgent','warning','informational'] as const).map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${severityFilter === f ? 'btn-primary' : 'btn-outline-light'}`}
                  onClick={() => setSeverityFilter(f)}
                >
                  {f !== 'all' && <span className="pa-filter-dot" style={{ background: SEVERITY_COLORS[f]?.border }} />}
                  {f === 'all' ? `All (${ALERTS.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)}`}
                </button>
              ))}
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 text-muted fs-12 fw-semibold">
                <span>Confidence ≥</span>
                <input type="range" min={50} max={99} value={confThreshold} onChange={e => setConfThreshold(+e.target.value)} style={{ width: 100, accentColor: 'var(--bs-primary)' }} />
                <span style={{ minWidth: 28 }}>{confThreshold}%</span>
              </div>
              <div className="d-flex gap-2">
                <button className={`btn btn-sm ${typeFilter === 'ai' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setTypeFilter(typeFilter === 'ai' ? null : 'ai')}>AI Predicted</button>
                <button className={`btn btn-sm ${typeFilter === 'rule' ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setTypeFilter(typeFilter === 'rule' ? null : 'rule')}>Rule-Based</button>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="p-3 d-flex flex-column gap-3">
            {data.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="ti ti-bell-off d-block mb-2" style={{ fontSize: 48 }} />
                <h6>No Active Alerts</h6>
                <p className="fs-12">All clear — no alerts match your current filter criteria.</p>
              </div>
            ) : data.map(a => {
              const sc = SEVERITY_COLORS[a.severity];
              const isExpanded = expandedIds.has(a.id);
              return (
                <div key={a.id} className="pca-alert-card" style={{ borderLeftColor: sc.border }} onClick={() => toggle(a.id)}>
                  {/* Header */}
                  <div className="d-flex align-items-start justify-content-between p-3 gap-3">
                    <div className="d-flex gap-3 flex-grow-1 min-w-0">
                      <div className="pca-severity-icon" style={{ background: sc.bg, color: sc.text }}>
                        <i className={`ti ${a.severity === 'urgent' ? 'ti-urgent' : a.severity === 'warning' ? 'ti-alert-triangle' : 'ti-info-circle'}`} />
                      </div>
                      <div className="min-w-0">
                        <h6 className="fw-bold mb-1 fs-14">{a.title}</h6>
                        <p className="text-muted fs-12 mb-1">{a.patient}</p>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="pca-severity-tag" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}30` }}>{a.severity}</span>
                          <span className={`pca-type-tag ${a.type === 'ai' ? 'pca-type-ai' : ''}`}>
                            <i className={`ti ${a.type === 'ai' ? 'ti-robot' : 'ti-settings-automation'}`} style={{ fontSize: 11 }} />
                            {a.type === 'ai' ? ' AI Predicted' : ' Rule-Based'}
                          </span>
                          <span className="d-flex align-items-center gap-1 text-muted fs-11 fw-semibold">
                            <div className="pca-conf-bar"><div className="pca-conf-fill" style={{ width: `${a.confidence}%` }} /></div>
                            {a.confidence}%
                          </span>
                          <span className="text-muted fs-11"><i className="ti ti-clock" style={{ fontSize: 12 }} /> {a.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button className="btn btn-sm btn-outline-success btn-icon" title="Acknowledge" onClick={() => acknowledge(a.id)}><i className="ti ti-check" /></button>
                      <button className="btn btn-sm btn-outline-light btn-icon" title="Snooze"><i className="ti ti-clock-pause" /></button>
                      <button className="btn btn-sm btn-outline-danger btn-icon" title="Escalate"><i className="ti ti-arrow-up-circle" /></button>
                    </div>
                  </div>

                  {/* Expandable Body */}
                  {isExpanded && (
                    <div className="border-top p-3" onClick={e => e.stopPropagation()}>
                      <p className="text-uppercase fw-bold fs-11 text-muted mb-2">Triggering Data Points</p>
                      <div className="row g-2 mb-3">
                        {a.evidence.map((ev, j) => (
                          <div className="col-md-4 col-sm-6" key={j}>
                            <div className="pca-evidence-item">
                              <small className="text-muted fw-semibold">{ev.label}</small>
                              <div className="fw-bold">{ev.value}</div>
                              <small className={ev.flag === 'abnormal' ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
                                <i className={`ti ${ev.flag === 'abnormal' ? 'ti-alert-circle' : 'ti-circle-check'}`} style={{ fontSize: 12 }} /> {ev.flag === 'abnormal' ? 'Abnormal' : 'Within Range'}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-uppercase fw-bold fs-11 text-muted mb-2">Recommended Actions</p>
                      {a.actions.map((act, j) => (
                        <div key={j} className="pca-rec-action">
                          <i className="ti ti-arrow-right text-primary" />
                          <span className="flex-grow-1">{act}</span>
                          <button className="btn btn-xs btn-primary" onClick={e => e.stopPropagation()}>Order</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PredictiveAlerts;
