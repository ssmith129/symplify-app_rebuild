import React, { useState } from 'react';

/* ────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────── */

interface InsightMetric {
  label: string; value: string; pct: number; color: string; trend: number[];
}

interface Insight {
  id: number; category: string; tag: string; headline: string;
  description: string; metric: InsightMetric; confidence: number;
  time: string; status: 'populated' | 'loading' | 'error' | 'no-data';
}

const HERO = [
  { label: 'Avg LOS', value: '4.2d', change: '-0.3d vs last week', dir: 'positive' as const, icon: 'ti-clock', cls: 'primary' },
  { label: 'Bed Occupancy', value: '87%', change: '+3% from yesterday', dir: 'negative' as const, icon: 'ti-bed', cls: 'danger' },
  { label: 'Readmission Rate', value: '6.8%', change: '-1.2% this month', dir: 'positive' as const, icon: 'ti-repeat', cls: 'success' },
  { label: 'Staffing Score', value: '82/100', change: 'No change', dir: 'neutral' as const, icon: 'ti-users', cls: 'warning' },
  { label: 'Patient Satisfaction', value: '4.6/5', change: '+0.2 vs Q3', dir: 'positive' as const, icon: 'ti-star', cls: 'info' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Insights', count: 12 },
  { id: 'operations', label: 'Operations', count: 4, icon: 'ti-settings-2' },
  { id: 'staffing', label: 'Staffing', count: 3, icon: 'ti-users-group' },
  { id: 'patient-flow', label: 'Patient Flow', count: 3, icon: 'ti-arrows-transfer-down' },
  { id: 'quality', label: 'Quality Metrics', count: 2, icon: 'ti-award' },
];

const INSIGHTS: Insight[] = [
  { id:1, category:'operations', tag:'Operations', headline:'ED Wait Times Exceeding 4-Hour Target', description:'Average emergency department wait time has increased 22% over the past 72 hours, driven by higher acuity admissions and downstream bed availability constraints.',
    metric:{label:'Avg Wait Time',value:'4h 38m',pct:77,color:'var(--bs-danger)',trend:[55,58,62,68,72,77]}, confidence:4, time:'12 min ago', status:'populated' },
  { id:2, category:'staffing', tag:'Staffing', headline:'Night Shift RN Shortage — ICU at 67% Coverage', description:'Three upcoming night shifts in the ICU have only 4 of 6 required RN positions filled. Agency nurse requests have been auto-submitted.',
    metric:{label:'Coverage Rate',value:'67%',pct:67,color:'var(--bs-warning)',trend:[85,82,78,72,68,67]}, confidence:5, time:'28 min ago', status:'populated' },
  { id:3, category:'patient-flow', tag:'Patient Flow', headline:'Surgical Discharge Bottleneck — 8 Patients Pending', description:'Eight post-surgical patients have met discharge criteria but are awaiting pharmacy reconciliation or transportation. Average delay: 6.2 hours.',
    metric:{label:'Pending Discharges',value:'8',pct:40,color:'var(--bs-info)',trend:[3,4,5,6,7,8]}, confidence:5, time:'45 min ago', status:'populated' },
  { id:4, category:'quality', tag:'Quality Metrics', headline:'Hand Hygiene Compliance Below Benchmark', description:'ICU and Med-Surg units showing 76% compliance rate against a 90% target. Sensor data indicates peak non-compliance during shift transitions.',
    metric:{label:'Compliance Rate',value:'76%',pct:76,color:'var(--bs-warning)',trend:[88,85,82,79,77,76]}, confidence:3, time:'1.2h ago', status:'populated' },
  { id:5, category:'operations', tag:'Operations', headline:'OR Utilization Gap — Block Time Underused', description:'Operating rooms 3 and 5 have 38% unutilized block time this week. Redistribution could accommodate 4 additional elective cases.',
    metric:{label:'Utilization',value:'62%',pct:62,color:'var(--bs-primary)',trend:[58,55,60,63,61,62]}, confidence:4, time:'1.5h ago', status:'populated' },
  { id:6, category:'staffing', tag:'Staffing', headline:'Overtime Hours Trending Up — Med-Surg', description:'Med-Surg nursing overtime has increased 34% month-over-month. Top contributors: census spikes on Tuesday and Thursday admissions.',
    metric:{label:'OT Hours This Week',value:'142h',pct:85,color:'var(--bs-danger)',trend:[95,102,118,126,135,142]}, confidence:4, time:'2h ago', status:'populated' },
  { id:7, category:'patient-flow', tag:'Patient Flow', headline:'Admission-to-Bed Time Improved by 18%', description:'Average time from admission order to bed assignment has decreased from 52 minutes to 43 minutes following the new bed management protocol deployment.',
    metric:{label:'Avg Bed Assignment',value:'43 min',pct:43,color:'var(--bs-success)',trend:[52,50,48,46,44,43]}, confidence:5, time:'2.5h ago', status:'populated' },
  { id:8, category:'operations', tag:'Operations', headline:'Lab Turnaround — STAT Orders Exceeding SLA', description:'12% of STAT lab orders in the past 24 hours exceeded the 60-minute turnaround SLA. Primary delays traced to specimen transport bottleneck.',
    metric:{label:'SLA Breach Rate',value:'12%',pct:12,color:'var(--bs-warning)',trend:[5,6,8,9,10,12]}, confidence:3, time:'3h ago', status:'populated' },
  { id:9, category:'quality', tag:'Quality Metrics', headline:'CLABSI Rate Trending Below National Benchmark', description:'Central line-associated bloodstream infection rate has maintained zero events for 47 consecutive days, outperforming the national benchmark by 62%.',
    metric:{label:'Days Without Event',value:'47',pct:94,color:'var(--bs-success)',trend:[35,38,41,43,45,47]}, confidence:5, time:'4h ago', status:'populated' },
  { id:10, category:'patient-flow', tag:'Patient Flow', headline:'Telemetry Bed Availability Forecast', description:'AI models predict 3 telemetry beds will become available in the next 6 hours based on current discharge trajectories and anticipated step-downs.',
    metric:{label:'Predicted Availability',value:'3 beds',pct:30,color:'var(--bs-primary)',trend:[1,1,2,2,3,3]}, confidence:3, time:'5h ago', status:'populated' },
  { id:11, category:'staffing', tag:'Staffing', headline:'CNA Certification Expirations — 4 Staff This Month', description:'Four certified nursing assistants have BLS certifications expiring within 30 days. Auto-reminder emails have been queued for HR review.',
    metric:{label:'Expiring Certs',value:'4',pct:20,color:'var(--bs-warning)',trend:[1,1,2,3,3,4]}, confidence:5, time:'6h ago', status:'populated' },
  { id:12, category:'operations', tag:'Operations', headline:'Medication Dispensing Errors — Trending Down', description:'Automated dispensing cabinet errors have decreased 28% since the barcode verification workflow update deployed last Tuesday.',
    metric:{label:'Error Rate',value:'0.8%',pct:8,color:'var(--bs-success)',trend:[15,12,10,8,9,8]}, confidence:4, time:'8h ago', status:'populated' },
];

const TAG_CLASSES: Record<string, string> = {
  operations: 'si-tag-operations',
  staffing: 'si-tag-staffing',
  'patient-flow': 'si-tag-patient-flow',
  quality: 'si-tag-quality',
};

/* ────────────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────────────── */

const SmartInsights: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState('all');

  const filtered = currentCategory === 'all'
    ? INSIGHTS
    : INSIGHTS.filter(i => i.category === currentCategory);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">

        {/* Breadcrumb */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Smart Insights</h3>
              <ul className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="#">AI Modules</a></li>
                <li className="breadcrumb-item active">Smart Insights</li>
              </ul>
            </div>
            <div className="col-auto d-flex gap-2 align-items-center">
              <span className="pa-live-indicator"><span className="pa-live-dot" /> Auto-refreshing</span>
              <button className="btn btn-outline-light"><i className="ti ti-layout-grid me-1" />Customize</button>
              <button className="btn btn-outline-light"><i className="ti ti-download me-1" />Export</button>
              <button className="btn btn-primary"><i className="ti ti-refresh me-1" />Refresh</button>
            </div>
          </div>
        </div>

        {/* ── Hero Stats ── */}
        <div className="row mb-4">
          {HERO.map((s, i) => (
            <div className="col" key={i}>
              <div className="card si-hero-stat">
                <div className="card-body p-3 position-relative">
                  <div className={`si-hero-icon bg-${s.cls}-transparent text-${s.cls}`}>
                    <i className={`ti ${s.icon}`} />
                  </div>
                  <p className="text-muted text-uppercase fw-semibold fs-11 mb-1 letter-spacing">{s.label}</p>
                  <h2 className="fw-bold mb-1 fs-22">{s.value}</h2>
                  <span className={`si-hero-change si-hero-${s.dir}`}>
                    <i className={`ti ${s.dir === 'positive' ? 'ti-arrow-down-right' : s.dir === 'negative' ? 'ti-arrow-up-right' : 'ti-minus'}`} style={{ fontSize: 12 }} />
                    {s.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Category Tabs ── */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`btn btn-sm si-cat-tab ${currentCategory === c.id ? 'active' : ''}`}
              onClick={() => setCurrentCategory(c.id)}
            >
              {c.icon && <i className={`ti ${c.icon}`} style={{ fontSize: 14 }} />}
              {c.label}
              <span className="si-tab-count">{c.count}</span>
            </button>
          ))}
        </div>

        {/* ── Insights Grid ── */}
        <div className="row g-3">
          {filtered.map(ins => {
            const max = Math.max(...ins.metric.trend);
            return (
              <div className="col-lg-4 col-md-6" key={ins.id}>
                <div className="card si-insight-card h-100">
                  <div className="card-body p-3 position-relative">
                    <span className="si-ai-badge"><i className="ti ti-robot" style={{ fontSize: 10 }} /> AI</span>
                    <span className={`si-category-tag ${TAG_CLASSES[ins.category] || ''}`}>{ins.tag}</span>
                    <h6 className="fw-bold fs-14 mb-1 mt-2 pe-5">{ins.headline}</h6>
                    <p className="text-muted fs-12 mb-3 si-description">{ins.description}</p>

                    {/* Metric area */}
                    <div className="si-metric-area">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <small className="text-muted fw-semibold">{ins.metric.label}</small>
                        <span className="fw-bold fs-18">{ins.metric.value}</span>
                      </div>
                      <div className="si-bar-track">
                        <div className="si-bar-fill" style={{ width: `${ins.metric.pct}%`, background: ins.metric.color }} />
                      </div>
                      <div className="si-mini-chart">
                        {ins.metric.trend.map((v, i) => (
                          <div key={i} className="si-mini-bar" style={{
                            height: Math.max(4, (v / max) * 36),
                            background: ins.metric.color,
                            opacity: 0.4 + (v / max) * 0.6,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="card-footer py-2 px-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="d-flex align-items-center gap-1 text-muted fs-11 fw-semibold">
                        <span className="si-conf-dots">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className={`si-conf-dot ${n <= ins.confidence ? 'filled' : ''}`} />
                          ))}
                        </span>
                        {ins.confidence * 20}%
                      </span>
                      <span className="text-muted fs-11"><i className="ti ti-clock" style={{ fontSize: 12 }} /> {ins.time}</span>
                    </div>
                    <button className="btn btn-sm si-drill-btn">
                      <i className="ti ti-arrow-right" style={{ fontSize: 13 }} /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* State demo cards — only on "All" tab */}
          {currentCategory === 'all' && (
            <>
              {/* Skeleton / Loading card */}
              <div className="col-lg-4 col-md-6">
                <div className="card si-insight-card h-100">
                  <div className="card-body p-3">
                    <div className="si-skeleton-line" style={{ width: '40%', height: 16, marginBottom: 14 }} />
                    <div className="si-skeleton-line" style={{ width: '80%' }} />
                    <div className="si-skeleton-line" style={{ width: '60%' }} />
                    <div className="si-skeleton-block" />
                  </div>
                  <div className="card-footer py-2 px-3">
                    <small className="text-muted">Loading insight...</small>
                  </div>
                </div>
              </div>

              {/* Error card */}
              <div className="col-lg-4 col-md-6">
                <div className="card si-insight-card si-card-error h-100">
                  <div className="card-body p-3 text-center py-4">
                    <i className="ti ti-alert-circle d-block mb-2 text-danger" style={{ fontSize: 28 }} />
                    <h6 className="fw-bold">Failed to Load Insight</h6>
                    <p className="text-muted fs-12">Unable to retrieve data from the analytics engine. Please try again.</p>
                    <button className="btn btn-sm btn-outline-danger mt-1"><i className="ti ti-refresh me-1" style={{ fontSize: 12 }} />Retry</button>
                  </div>
                </div>
              </div>

              {/* No-data card */}
              <div className="col-lg-4 col-md-6">
                <div className="card si-insight-card h-100">
                  <div className="card-body p-3 text-center py-4">
                    <i className="ti ti-chart-dots d-block mb-2" style={{ fontSize: 28, color: '#ced4da' }} />
                    <h6 className="fw-semibold">No Data Available</h6>
                    <p className="text-muted fs-12">Insufficient data to generate this insight. Check back after the next data refresh cycle.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default SmartInsights;
