// src/core/api/mock/emailMockApi.ts
// Mock API for Symplify Platform AI-Enhanced Email Priority Detection

import { AnalyzedEmail, EmailPriority, EmailCategory, EmailSender, EmailFolder } from '../../ai/emailTypes';

const CRITICAL_KEYWORDS = [
  'stat', 'emergency', 'urgent', 'critical', 'immediate attention',
  'code blue', 'life threatening', 'adverse reaction', 'anaphylaxis',
  'cardiac arrest', 'stroke alert', 'trauma', 'sepsis', 'critical lab'
];

const HIGH_PRIORITY_KEYWORDS = [
  'priority', 'asap', 'important', 'time-sensitive', 'abnormal results',
  'escalation', 'concerning', 'review needed', 'authorization needed',
  'pre-auth', 'denied', 'appeal'
];

const SENDER_TRUST_SCORES: Record<string, number> = {
  lab: 95,
  pharmacy: 90,
  radiology: 90,
  emergency: 100,
  doctor: 85,
  nurse: 80,
  admin: 70,
  external: 50
};

const detectSenderType = (email: string, name: string): string => {
  const combined = `${email} ${name}`.toLowerCase();
  if (combined.includes('lab')) return 'lab';
  if (combined.includes('pharm')) return 'pharmacy';
  if (combined.includes('radiology') || combined.includes('imaging')) return 'radiology';
  if (combined.includes('emergency') || combined.includes('ed')) return 'emergency';
  if (combined.includes('dr.') || combined.includes('md')) return 'doctor';
  if (combined.includes('rn') || combined.includes('nurse')) return 'nurse';
  if (combined.includes('admin') || combined.includes('hr')) return 'admin';
  return 'external';
};

export const analyzeEmail = (
  subject: string, 
  preview: string, 
  sender: EmailSender
): { priority: EmailPriority; category: EmailCategory; confidence: number; indicators: string[] } => {
  const content = `${subject} ${preview}`.toLowerCase();
  const indicators: string[] = [];
  let score = 0;

  // Check critical keywords
  CRITICAL_KEYWORDS.forEach(keyword => {
    if (content.includes(keyword)) {
      indicators.push(keyword);
      score += 100;
    }
  });

  // Check high priority keywords
  HIGH_PRIORITY_KEYWORDS.forEach(keyword => {
    if (content.includes(keyword)) {
      indicators.push(keyword);
      score += 40;
    }
  });

  // Apply sender trust modifier
  const senderType = detectSenderType(sender.email, sender.name);
  const trustModifier = (SENDER_TRUST_SCORES[senderType] || 50) / 100;
  score = score * trustModifier;

  // Determine priority
  let priority: EmailPriority;
  let confidence: number;

  if (score >= 70) {
    priority = 'critical';
    confidence = Math.min(98, 80 + score / 10);
  } else if (score >= 30) {
    priority = 'high';
    confidence = Math.min(95, 70 + score / 5);
  } else if (score >= 10) {
    priority = 'medium';
    confidence = Math.min(90, 60 + score);
  } else {
    priority = 'low';
    confidence = 75;
  }

  // Determine category
  let category: EmailCategory = 'administrative';
  if (content.includes('lab') || content.includes('result')) category = 'lab-results';
  else if (content.includes('referral')) category = 'referral';
  else if (content.includes('insurance') || content.includes('auth')) category = 'insurance';
  else if (content.includes('appointment')) category = 'appointment';
  else if (content.includes('newsletter') || content.includes('update')) category = 'newsletter';
  else if (indicators.length > 0) category = 'clinical-urgent';

  return { priority, category, confidence: Math.round(confidence), indicators };
};

export const getMockEmails = (): AnalyzedEmail[] => {
  const emails = [
    {
      id: 'email-001',
      subject: 'STAT: Critical Lab Results - Potassium 7.2',
      preview: 'Immediate attention required. Patient James Wilson has critically elevated potassium...',
      body: `Dr. Nguyen,

Immediate attention required. Patient James Wilson (MRN: 4471829) has critically elevated potassium levels that require urgent intervention.

CRITICAL LAB VALUES:
• Potassium (K+): 7.2 mEq/L (Reference: 3.5–5.0 mEq/L) — CRITICAL HIGH
• Sodium (Na+): 131 mEq/L (Reference: 136–145 mEq/L) — Low
• BUN: 58 mg/dL (Reference: 7–20 mg/dL) — High
• Creatinine: 4.1 mg/dL (Reference: 0.7–1.3 mg/dL) — High
• GFR: 14 mL/min (Reference: >60 mL/min) — Critical

Specimen collected: Today at 14:22 | Resulted: Today at 14:47
Specimen type: Venous blood draw (non-hemolyzed, verified)

Clinical context: Patient is a 68-year-old male admitted for acute kidney injury secondary to dehydration. Currently on Lisinopril 20mg daily — recommend holding ACE inhibitor given hyperkalemia.

Recommended actions:
1. Obtain STAT 12-lead ECG to evaluate for cardiac effects
2. Administer calcium gluconate 1g IV over 10 minutes for cardiac membrane stabilization
3. Insulin 10 units IV + D50 50mL IV for potassium redistribution
4. Consider Kayexalate 30g PO or sodium bicarbonate if acidotic
5. Recheck BMP in 2 hours post-treatment
6. Nephrology consult if not already involved

This result has been called to the covering nurse (RN Sarah Kim, 4-West) at 14:52. Please confirm receipt and document treatment plan.

— Clinical Laboratory, Automated Critical Value Notification
  Lab Director: Dr. Patricia Owens, MD, PhD`,
      sender: { email: 'lab@hospital.org', name: 'Clinical Laboratory', isInternal: true, trustScore: 95 },
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
      starred: true,
      hasAttachments: true,
      attachments: [
        { name: 'Lab_Report_Wilson_J_4471829.pdf', size: '312 KB', icon: 'ti-file-text' },
        { name: 'BMP_Trend_Chart.pdf', size: '145 KB', icon: 'ti-chart-line' }
      ]
    },
    {
      id: 'email-002',
      subject: 'URGENT: Pre-Authorization Denied - Patient needs surgery',
      preview: 'Insurance has denied pre-authorization for scheduled cardiac procedure. Appeal deadline...',
      body: `Dear Care Team,

Insurance has denied pre-authorization for the scheduled cardiac procedure for the following patient. An appeal must be filed before the deadline to avoid surgical delay.

DENIAL DETAILS:
Patient: Margaret Reynolds (MRN: 5528103)
Insurance: BlueCross BlueShield PPO — Group #HMG-44921
Procedure: Percutaneous Coronary Intervention (PCI) with drug-eluting stent placement
CPT Codes: 92928, 92921
Scheduled Date: April 3, 2025
Denial Reason: "Medical necessity not established — conservative therapy not exhausted"
Denial Reference: DEN-2025-0322-78441

APPEAL DEADLINE: March 29, 2025 (5 business days from denial)

Required documentation for appeal:
1. Updated cardiology notes documenting failed medical management
2. Recent cardiac catheterization report showing >70% stenosis
3. Stress test results with evidence of ischemia
4. Letter of medical necessity from attending cardiologist
5. Medication history showing trial of maximum medical therapy

Dr. Patel's office has been notified. Please coordinate with the cardiology team to compile supporting documentation as soon as possible. The patient has been informed of the delay and is understandably concerned.

If you have questions about the appeal process, contact the Insurance Appeals team at ext. 4420.

Best regards,
Jennifer Torres
Insurance Authorization Coordinator
Pre-Certification & Appeals Department`,
      sender: { email: 'insurance@hospital.org', name: 'Insurance Coordinator', isInternal: true, trustScore: 80 },
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
      starred: false,
      hasAttachments: true,
      attachments: [
        { name: 'Denial_Letter_Reynolds_M.pdf', size: '189 KB', icon: 'ti-file-text' },
        { name: 'Appeal_Form_Template.docx', size: '67 KB', icon: 'ti-file-description' }
      ]
    },
    {
      id: 'email-003',
      subject: 'New Referral: Cardiology Consultation',
      preview: 'New patient referral from Dr. Martinez for cardiac evaluation...',
      body: `Good afternoon,

A new patient referral has been submitted and is awaiting scheduling for a cardiology consultation.

REFERRAL INFORMATION:
Referring Physician: Dr. Elena Martinez, Internal Medicine
Patient: David Kowalski (DOB: 09/14/1957)
MRN: 6623847
Insurance: Aetna HMO — verified active, referral authorization obtained (Auth #: REF-90251)

REASON FOR REFERRAL:
Patient presents with new-onset exertional dyspnea over the past 3 weeks, associated with bilateral lower extremity edema. Resting ECG showed non-specific ST-T wave changes in leads V4–V6. BNP elevated at 485 pg/mL.

RELEVANT HISTORY:
• Hypertension — 12 years, currently on Amlodipine 10mg + Losartan 100mg
• Type 2 Diabetes — A1C 7.8%, on Metformin 1000mg BID
• Hyperlipidemia — on Atorvastatin 40mg
• BMI: 32.4
• Former smoker (quit 2019, 20 pack-year history)
• Family history: Father — MI at age 61

REQUESTED SERVICES:
• Cardiology evaluation
• Echocardiogram
• Consideration for stress testing

URGENCY: Semi-urgent — Dr. Martinez requests appointment within 7–10 days.

Please contact the patient at (555) 341-8827 to schedule. Patient is available mornings Mon–Wed.

Thank you,
Lisa Park, CMA
Referral Coordination Office`,
      sender: { email: 'referrals@clinic.org', name: 'Referral Coordinator', isInternal: true, trustScore: 75 },
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: false,
      starred: false,
      hasAttachments: false
    },
    {
      id: 'email-004',
      subject: 'Weekly Staff Newsletter',
      preview: 'This week in hospital news: New parking policy, cafeteria menu updates...',
      body: `Hello Team,

Here is your weekly roundup from Hospital Communications:

PARKING UPDATE:
Effective April 1, the south parking garage (Lot C) will be closed for resurfacing. Staff should use the north garage (Lot A) or the temporary overflow lot on Elm Street. Shuttle service will run every 10 minutes from 6:00 AM – 8:00 PM.

CAFETERIA NEWS:
• New grab-and-go salad bar available starting Monday in the main cafeteria
• Extended hours on Fridays — the café will now close at 9:00 PM instead of 7:00 PM
• Employee appreciation: Free coffee and pastries this Thursday, 7–9 AM in the atrium

RECOGNITION:
Congratulations to the 3-West nursing team for achieving zero hospital-acquired infections for Q1 2025! Outstanding work.

UPCOMING EVENTS:
• March 28 — Blood drive in Conference Room B (sign up on the intranet)
• April 2 — New employee orientation
• April 5 — Hospital 5K Fun Run — register at the front desk

REMINDERS:
• Badge access cards will be reissued next month. Watch for scheduling emails from Security.
• Flu season protocols remain in effect through April 15.

Have a great week!
— Hospital Communications Team`,
      sender: { email: 'newsletter@hospital.org', name: 'Communications', isInternal: true, trustScore: 60 },
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: true,
      starred: false,
      hasAttachments: false
    },
    {
      id: 'email-005',
      subject: 'Abnormal Radiology Results - Chest CT',
      preview: 'Findings on chest CT for patient Maria Santos show a 1.8cm pulmonary nodule requiring follow-up...',
      body: `Dr. Nguyen,

Preliminary radiology findings require your review for the following patient:

IMAGING REPORT:
Patient: Maria Santos (MRN: 7734512)
Study: CT Chest with Contrast
Date Performed: Today
Ordering Physician: Dr. Nguyen
Radiologist: Dr. Alan Whitfield

FINDINGS:
1. PULMONARY NODULE: Solitary 1.8 cm spiculated nodule identified in the right upper lobe (segment 2). No prior imaging available for comparison. Given morphology and size, this is suspicious and warrants further evaluation per Fleischner Society guidelines.

2. LYMPHADENOPATHY: Mildly enlarged right hilar lymph node measuring 1.3 cm (short axis). No mediastinal lymphadenopathy.

3. LUNGS: No consolidation, effusion, or pneumothorax. Mild dependent atelectasis bilaterally.

4. INCIDENTAL: 4mm hepatic cyst in segment VI — benign, no follow-up needed.

IMPRESSION:
Suspicious right upper lobe pulmonary nodule. Recommend PET/CT for metabolic characterization and pulmonology referral for possible tissue sampling. Clinical correlation with risk factors advised.

Fleischner Category: High risk — recommend PET/CT within 4 weeks or tissue sampling.

This report has been finalized. Please acknowledge in the EHR.

— Department of Radiology`,
      sender: { email: 'radiology@hospital.org', name: 'Radiology Department', isInternal: true, trustScore: 90 },
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      read: false,
      starred: false,
      hasAttachments: true,
      attachments: [
        { name: 'CT_Chest_Santos_M.pdf', size: '2.4 MB', icon: 'ti-file-text' },
        { name: 'Nodule_Images_Annotated.dcm', size: '8.1 MB', icon: 'ti-photo-scan' }
      ]
    },
    {
      id: 'email-006',
      subject: 'Medication Interaction Alert - Patient #4821',
      preview: 'Pharmacy flag: Potential interaction between newly prescribed Warfarin and existing Amiodarone regimen...',
      body: `CLINICAL PHARMACY ALERT

A significant drug-drug interaction has been identified and requires prescriber review before the medication order can be processed.

PATIENT: Anthony Briggs (MRN: 4821903)
LOCATION: 6-East, Bed 612A

INTERACTION DETAILS:
New Order: Warfarin 5mg PO daily (ordered by Dr. Harrison at 11:42)
Existing Medication: Amiodarone 200mg PO daily (ongoing since admission)

SEVERITY: Major — Do Not Ignore
INTERACTION: Amiodarone significantly inhibits the CYP2C9 metabolism of Warfarin, leading to markedly increased INR and elevated bleeding risk. This interaction can persist for weeks to months after Amiodarone discontinuation due to its long half-life (40–55 days).

CLINICAL SIGNIFICANCE:
• Expected INR increase of 30–50% above baseline
• Risk of serious hemorrhage, including GI and intracranial bleeding
• Effect may not fully manifest for 1–2 weeks

PHARMACY RECOMMENDATION:
1. If Warfarin is clinically indicated, reduce initial dose by 30–50% (suggest 2.5mg PO daily)
2. Check baseline INR before first dose
3. Monitor INR every 2–3 days for the first 2 weeks
4. Set INR target and titration plan in the EHR
5. Alternatively, consider a DOAC if appropriate for the indication

ORDER STATUS: Held pending prescriber response.
Please respond via EHR or call Pharmacy at ext. 3310.

— Sarah Kim, PharmD, BCPS
Clinical Pharmacy Services`,
      sender: { email: 'pharmacy@hospital.org', name: 'Pharmacy Services', isInternal: true, trustScore: 90 },
      timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      read: false,
      starred: true,
      hasAttachments: false
    },
    {
      id: 'email-007',
      subject: 'Appointment Reschedule Request',
      preview: 'Patient Robert Chen has requested to reschedule his post-op follow-up from March 28 to April 2...',
      body: `Hi Dr. Nguyen,

A patient has requested a schedule change for an upcoming appointment. Details below:

RESCHEDULE REQUEST:
Patient: Robert Chen (MRN: 3349821)
Phone: (555) 672-1190

Original Appointment:
• Date: March 28, 2025, 10:30 AM
• Type: Post-Operative Follow-Up (14-day check)
• Procedure: Right inguinal hernia repair (performed March 14)

Requested New Date: April 2, 2025 (any morning slot)
Reason: Patient has a work conflict on the 28th and cannot take additional time off.

SCHEDULING NOTES:
• This would push the follow-up to 19 days post-op instead of the standard 14 days.
• Patient reports no current complications — incision healing well, no fever, no drainage.
• April 2 availability: 8:00 AM, 9:15 AM, or 11:00 AM slots are open.

Please confirm if the 5-day delay is acceptable, or if we should try to fit the patient in on an earlier date. I'll reach out to Mr. Chen once we have your approval.

Thank you,
Amy Delgado
Patient Scheduling Department`,
      sender: { email: 'scheduling@hospital.org', name: 'Patient Scheduling', isInternal: true, trustScore: 70 },
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      read: true,
      starred: false,
      hasAttachments: false
    },
    {
      id: 'email-008',
      subject: 'URGENT: Blood Bank Shortage - Type O Negative',
      preview: 'Current supply of O-negative blood is critically low. All elective procedures requiring transfusion...',
      body: `ATTENTION ALL CLINICAL STAFF:

The Blood Bank is issuing an URGENT advisory regarding critically low inventory of Type O Negative red blood cells.

CURRENT INVENTORY STATUS:
• O Negative RBCs: 4 units available (Critical — minimum threshold is 12 units)
• O Positive RBCs: 18 units (Adequate)
• A Negative RBCs: 6 units (Low)
• All other types: Within normal ranges

EFFECTIVE IMMEDIATELY — the following protocols are in effect:

1. ELECTIVE SURGERIES: All elective procedures with anticipated transfusion needs of >2 units should be reviewed by the Transfusion Committee. Cases may be postponed on a case-by-case basis.

2. TYPE & SCREEN: Please ensure all surgical patients have a current Type & Screen. Crossmatched but unused units must be returned within 72 hours.

3. EMERGENCY USE: O Negative will be reserved strictly for emergency situations and massive transfusion protocols (MTP). Trauma and OB emergencies will receive priority allocation.

4. CONSERVATION: Clinical teams are encouraged to adopt restrictive transfusion thresholds (Hgb <7 g/dL for stable patients) per hospital guidelines.

5. DONATION DRIVE: An emergency blood drive is being organized for tomorrow in Conference Room B, 8:00 AM – 4:00 PM. Please encourage eligible staff to donate.

We expect resupply from the regional blood center within 48 hours. We will send an update once inventory is restored to safe levels.

Questions? Contact Blood Bank at ext. 2280 or page the Transfusion Medicine fellow on call.

— Dr. Karen Ito, MD
Medical Director, Blood Bank & Transfusion Services`,
      sender: { email: 'bloodbank@hospital.org', name: 'Blood Bank Services', isInternal: true, trustScore: 85 },
      timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
      read: false,
      starred: false,
      hasAttachments: false
    },
    {
      id: 'email-009',
      subject: 'Mandatory Compliance Training Due',
      preview: 'Reminder: Annual HIPAA and infection control training modules must be completed by April 15...',
      body: `Dear Staff Member,

This is a reminder that the following mandatory training modules must be completed by April 15, 2025. Failure to complete training by the deadline may result in temporary suspension of system access until requirements are fulfilled.

REQUIRED MODULES:
1. HIPAA Privacy & Security Refresher (45 min) — Due April 15
   Status: NOT COMPLETED

2. Infection Control & Prevention Annual Update (30 min) — Due April 15
   Status: NOT COMPLETED

3. Workplace Safety & Hazard Communication (20 min) — Due April 15
   Status: COMPLETED ✓ (March 10, 2025)

4. Cultural Competency in Patient Care (25 min) — Due April 15
   Status: NOT COMPLETED

HOW TO ACCESS:
• Log in to the Learning Management System (LMS) at training.hospital.org
• Use your standard network credentials
• Navigate to "My Assignments" to see your pending modules
• Modules can be paused and resumed at any time

COMPLETION POLICY:
• All modules require a passing score of 80% or higher
• Certificates are automatically logged upon completion
• If you experience technical issues, contact IT Help Desk at ext. 1100

Supervisors: You can view your team's completion status on the LMS dashboard under "Team Compliance."

Please prioritize completion before the deadline. Thank you for your commitment to maintaining a safe and compliant care environment.

Best regards,
Mark Davidson
Director, HR & Compliance
Human Resources Department`,
      sender: { email: 'training@hospital.org', name: 'HR & Compliance', isInternal: true, trustScore: 60 },
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      read: true,
      starred: false,
      hasAttachments: true,
      attachments: [
        { name: 'Training_Schedule_2025.pdf', size: '98 KB', icon: 'ti-file-text' }
      ]
    },
    {
      id: 'email-010',
      subject: 'Discharge Summary Review - Bed 4C-112',
      preview: 'Please review and co-sign the discharge summary for patient Thompson before end of shift today...',
      body: `Dr. Nguyen,

Please review and co-sign the discharge summary for the following patient. The summary was drafted by the resident team and requires attending physician co-signature before the patient can be officially discharged.

PATIENT INFORMATION:
Patient: Carol Thompson (MRN: 8812450)
DOB: 06/22/1949 | Age: 75
Location: 4C-112
Admitting Diagnosis: Community-Acquired Pneumonia
Length of Stay: 5 days (admitted March 19)
Expected Discharge: Today by 2:00 PM (transport arranged)

DISCHARGE SUMMARY HIGHLIGHTS:
• Admission: Presented with fever (102.4°F), productive cough, and hypoxia (SpO2 88% on RA)
• Hospital Course: IV Ceftriaxone + Azithromycin x 3 days, transitioned to PO Augmentin. O2 weaned from 4L NC to room air. Repeat CXR shows improving bilateral infiltrates.
• Discharge Medications: Augmentin 875mg BID x 7 days, Guaifenesin PRN, home meds resumed
• Follow-Up: PCP appointment in 7 days (scheduled), repeat CXR in 4 weeks
• Precautions: Return to ED if fever >101°F, worsening dyspnea, or hemoptysis

PENDING ITEMS:
☐ Attending co-signature on discharge summary (you)
☐ Final medication reconciliation sign-off
☐ Patient education documentation (nursing to complete)

The discharge summary is available in the EHR under the patient's Documents tab. Please review and sign at your earliest convenience — the family is hoping for a morning discharge.

Thank you,
Medical Records Department
Quality & Documentation Services`,
      sender: { email: 'records@hospital.org', name: 'Medical Records', isInternal: true, trustScore: 75 },
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      read: false,
      starred: false,
      hasAttachments: true,
      attachments: [
        { name: 'Discharge_Summary_Thompson_C.pdf', size: '156 KB', icon: 'ti-file-text' },
        { name: 'Med_Reconciliation_Form.pdf', size: '89 KB', icon: 'ti-file-check' }
      ]
    }
  ];

  return emails.map(email => {
    const { priority, category, confidence, indicators } = analyzeEmail(
      email.subject, 
      email.preview, 
      email.sender as EmailSender
    );
    
    return {
      ...email,
      sender: email.sender as EmailSender,
      analysis: {
        priority,
        category,
        confidence,
        urgencyIndicators: indicators,
        estimatedResponseTime: priority === 'critical' ? 'Immediate' : 
                               priority === 'high' ? '< 2 hours' : 
                               priority === 'medium' ? '< 24 hours' : 'When available',
        requiresAction: priority === 'critical' || priority === 'high'
      }
    };
  });
};

// Email categorization
interface FolderRule {
  keywords: string[];
  priority: number;
}

const FOLDER_RULES: Record<EmailFolder, FolderRule> = {
  urgent: {
    keywords: ['urgent', 'stat', 'critical', 'immediate', 'emergency', 'asap'],
    priority: 1
  },
  'lab-results': {
    keywords: ['lab', 'result', 'test', 'specimen', 'pathology', 'bloodwork'],
    priority: 2
  },
  referrals: {
    keywords: ['referral', 'consult', 'transfer', 'specialist'],
    priority: 3
  },
  insurance: {
    keywords: ['insurance', 'authorization', 'pre-auth', 'claim', 'coverage', 'denied'],
    priority: 4
  },
  clinical: {
    keywords: ['patient', 'diagnosis', 'treatment', 'medication', 'prescription'],
    priority: 5
  },
  administrative: {
    keywords: ['meeting', 'schedule', 'policy', 'training', 'hr', 'payroll'],
    priority: 6
  },
  inbox: {
    keywords: [],
    priority: 99
  }
};

export const categorizeEmail = (subject: string, preview: string): EmailFolder[] => {
  const content = `${subject} ${preview}`.toLowerCase();
  const matchedFolders: { folder: EmailFolder; priority: number }[] = [];

  Object.entries(FOLDER_RULES).forEach(([folder, rule]) => {
    if (rule.keywords.some(keyword => content.includes(keyword))) {
      matchedFolders.push({ folder: folder as EmailFolder, priority: rule.priority });
    }
  });

  // Sort by priority and return folders
  if (matchedFolders.length === 0) return ['inbox'];
  
  return matchedFolders
    .sort((a, b) => a.priority - b.priority)
    .map(m => m.folder);
};

export const getFolderCounts = (emails: Array<{ folders: EmailFolder[]; read: boolean }>) => {
  const counts: Record<EmailFolder, { total: number; unread: number }> = {
    inbox: { total: 0, unread: 0 },
    urgent: { total: 0, unread: 0 },
    clinical: { total: 0, unread: 0 },
    'lab-results': { total: 0, unread: 0 },
    referrals: { total: 0, unread: 0 },
    insurance: { total: 0, unread: 0 },
    administrative: { total: 0, unread: 0 }
  };

  emails.forEach(email => {
    email.folders.forEach(folder => {
      counts[folder].total++;
      if (!email.read) counts[folder].unread++;
    });
  });

  return counts;
};
