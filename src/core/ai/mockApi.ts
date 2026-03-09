// Mock API Services for AI Features
// These simulate backend AI endpoints for frontend-only development

import type {
  TriageAssessmentRequest,
  TriageAssessmentResponse,
  TriagePriority,
  PersonalizedLayout,
  UserRole,
  SchedulerRequest,
  SchedulerResponse,
  SlotSuggestion,
  PredictiveAlert,
  MessageAnalysis,
  MessageUrgency,
  ChatCard,
  DrugInteractionResult,
  BedStatusResult,
  ComplianceStatusResult,
  ExpandedViewConfig,
  EnhancedQuickAction,
  EnhancedAIMessage,
} from './types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// Feature 1: Smart Triage Priority Assessment
// ============================================
const CRITICAL_SYMPTOMS = ['chest pain', 'difficulty breathing', 'severe bleeding', 'stroke symptoms', 'unconscious'];
const URGENT_SYMPTOMS = ['high fever', 'severe pain', 'head injury', 'abdominal pain', 'broken bone'];
const SEMI_URGENT_SYMPTOMS = ['moderate pain', 'vomiting', 'dizziness', 'infection signs', 'allergic reaction'];

export async function assessTriagePriority(request: TriageAssessmentRequest): Promise<TriageAssessmentResponse> {
  await delay(300 + Math.random() * 400);
  
  const { symptoms, vitals, waitTime } = request;
  const symptomsLower = symptoms.map(s => s.toLowerCase());
  
  let priority: TriagePriority = 4;
  const factors: string[] = [];
  
  // Check for critical symptoms
  if (symptomsLower.some(s => CRITICAL_SYMPTOMS.some(cs => s.includes(cs)))) {
    priority = 1;
    factors.push('Critical symptoms detected');
  } else if (symptomsLower.some(s => URGENT_SYMPTOMS.some(us => s.includes(us)))) {
    priority = 2;
    factors.push('Urgent symptoms present');
  } else if (symptomsLower.some(s => SEMI_URGENT_SYMPTOMS.some(ss => s.includes(ss)))) {
    priority = 3;
    factors.push('Semi-urgent condition');
  }
  
  // Vitals analysis
  if (vitals) {
    if (vitals.heartRate && (vitals.heartRate > 120 || vitals.heartRate < 50)) {
      priority = Math.min(priority, 2) as TriagePriority;
      factors.push('Abnormal heart rate');
    }
    if (vitals.oxygenSaturation && vitals.oxygenSaturation < 92) {
      priority = 1;
      factors.push('Low oxygen saturation');
    }
    if (vitals.temperature && vitals.temperature > 39.5) {
      priority = Math.min(priority, 2) as TriagePriority;
      factors.push('High fever');
    }
  }
  
  // Wait time escalation
  if (waitTime > 60 && priority > 2) {
    priority = Math.max(1, priority - 1) as TriagePriority;
    factors.push('Extended wait time');
  }
  
  if (factors.length === 0) {
    factors.push('Standard triage assessment');
  }
  
  const confidence = 75 + Math.random() * 20;
  
  return { priority, confidence: Math.round(confidence), factors };
}

// ============================================
// Feature 2: AI Dashboard Personalization
// ============================================
const ROLE_WIDGETS: Record<UserRole, string[]> = {
  admin: ['appointmentStats', 'revenueChart', 'staffSchedule', 'resourceUtilization', 'topDoctors', 'recentTransactions'],
  doctor: ['myAppointments', 'patientQueue', 'pendingPrescriptions', 'labResults', 'scheduleOverview', 'patientAlerts'],
  nurse: ['patientAcuity', 'medicationSchedule', 'vitalAlerts', 'shiftHandoff', 'bedStatus', 'taskList'],
  triage: ['waitingQueue', 'priorityPatients', 'bedAvailability', 'staffStatus', 'incomingPatients', 'alertsWidget']
};

export async function getPersonalizedLayout(userId: string, role: UserRole): Promise<PersonalizedLayout> {
  await delay(200 + Math.random() * 300);
  
  const baseWidgets = ROLE_WIDGETS[role] || ROLE_WIDGETS.admin;
  
  // Simulate AI suggestions based on time of day
  const hour = new Date().getHours();
  const aiSuggestions = [];
  
  if (hour < 12) {
    aiSuggestions.push({ widgetId: baseWidgets[0], priority: 1, reason: 'Morning priority item' });
  }
  if (role === 'nurse' && hour >= 6 && hour <= 8) {
    aiSuggestions.push({ widgetId: 'shiftHandoff', priority: 1, reason: 'Shift change detected' });
  }
  if (role === 'doctor') {
    aiSuggestions.push({ widgetId: 'patientQueue', priority: 2, reason: `${Math.floor(Math.random() * 5 + 3)} patients waiting` });
  }
  
  return {
    userId,
    role,
    widgets: baseWidgets,
    aiSuggestions
  };
}

// ============================================
// Feature 3: Intelligent Appointment Scheduler
// ============================================
const DOCTORS = [
  { id: 'd1', name: 'Dr. Alex Morgan' },
  { id: 'd2', name: 'Dr. Sarah Johnson' },
  { id: 'd3', name: 'Dr. Emily Carter' },
  { id: 'd4', name: 'Dr. David Lee' },
];

export async function getSmartSlotSuggestions(request: SchedulerRequest): Promise<SchedulerResponse> {
  await delay(400 + Math.random() * 500);
  
  const slots: SlotSuggestion[] = [];
  const baseDate = new Date();
  
  // Generate 6 AI-suggested slots
  for (let i = 0; i < 6; i++) {
    const slotDate = new Date(baseDate);
    slotDate.setDate(slotDate.getDate() + Math.floor(i / 2) + 1);
    slotDate.setHours(9 + (i % 4) * 2, i % 2 === 0 ? 0 : 30, 0, 0);
    
    const doctor = DOCTORS[i % DOCTORS.length];
    const score = 5 - (i * 0.5);
    const noShowRisk = 10 + Math.random() * 25;
    
    slots.push({
      datetime: slotDate.toISOString(),
      score: Math.max(1, Math.round(score)),
      factors: {
        providerPreference: 70 + Math.random() * 30,
        patientConvenience: 60 + Math.random() * 40,
        noShowRisk,
        waitTimeOptimal: 75 + Math.random() * 25
      },
      conflicts: i === 3 ? ['Near lunch break'] : [],
      providerId: doctor.id,
      providerName: doctor.name
    });
  }
  
  return {
    slots: slots.sort((a, b) => b.score - a.score),
    patientPreferences: {
      preferredTime: 'Morning',
      historicalNoShowRate: 8 + Math.random() * 12
    }
  };
}

// ============================================
// Feature 4: Clinical Alert Prediction System
// ============================================
const PATIENT_NAMES = [
  { name: 'Maria Santos', image: 'user-01.jpg' },
  { name: 'James Wilson', image: 'user-02.jpg' },
  { name: 'Emily Chen', image: 'user-03.jpg' },
  { name: 'Robert Johnson', image: 'user-04.jpg' },
];

const PREDICTED_EVENTS = [
  'Sepsis risk elevation',
  'Cardiac arrhythmia warning',
  'Respiratory distress prediction',
  'Blood glucose instability',
  'Fall risk increase',
  'Medication interaction alert'
];

const RECOMMENDED_ACTIONS = [
  ['Order blood cultures immediately', 'Start empiric antibiotics', 'Increase monitoring frequency'],
  ['Continuous ECG monitoring', 'Cardiology consult', 'Review current medications'],
  ['Oxygen therapy assessment', 'Respiratory therapy consult', 'ABG analysis'],
  ['Blood glucose monitoring q1h', 'Insulin adjustment review', 'Endocrinology consult'],
  ['Implement fall precautions', 'Bed alarm activation', 'Physical therapy evaluation'],
  ['Pharmacy review', 'Hold conflicting medications', 'Monitor for adverse effects']
];

export async function getClinicalAlerts(): Promise<PredictiveAlert[]> {
  await delay(300 + Math.random() * 400);
  
  const alerts: PredictiveAlert[] = [];
  const numAlerts = 2 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numAlerts; i++) {
    const eventIndex = Math.floor(Math.random() * PREDICTED_EVENTS.length);
    const patient = PATIENT_NAMES[i % PATIENT_NAMES.length];
    const riskLevels: Array<'critical' | 'high' | 'moderate' | 'low'> = ['critical', 'high', 'moderate', 'low'];
    const riskLevel = riskLevels[Math.min(i, 3)];
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      patientId: `patient-${i + 1}`,
      patientName: patient.name,
      patientImage: patient.image,
      riskLevel,
      predictedEvent: PREDICTED_EVENTS[eventIndex],
      timeframe: `${2 + Math.floor(Math.random() * 4)} hours`,
      confidence: 70 + Math.floor(Math.random() * 25),
      contributingFactors: [
        'Vital sign trends',
        'Lab result patterns',
        'Historical data analysis'
      ].slice(0, 2 + Math.floor(Math.random() * 2)),
      recommendedActions: RECOMMENDED_ACTIONS[eventIndex],
      timestamp: Date.now()
    });
  }
  
  return alerts;
}

// ============================================
// Feature 5: Smart Message Router Analysis
// ============================================
const RECIPIENTS = [
  { id: 'r1', name: 'Dr. Sarah Johnson', role: 'Attending Physician', avatar: 'doctor-01.jpg' },
  { id: 'r2', name: 'Nurse Emily', role: 'Charge Nurse', avatar: 'user-05.jpg' },
  { id: 'r3', name: 'Dr. Michael Chen', role: 'Specialist', avatar: 'doctor-02.jpg' },
  { id: 'r4', name: 'Admin Staff', role: 'Administration', avatar: 'user-06.jpg' },
];

const URGENT_KEYWORDS = ['urgent', 'emergency', 'critical', 'immediate', 'asap', 'stat'];
const CLINICAL_KEYWORDS = ['patient', 'medication', 'prescription', 'diagnosis', 'treatment', 'lab', 'vitals'];
const ADMIN_KEYWORDS = ['schedule', 'appointment', 'billing', 'insurance', 'records', 'documentation'];

export async function analyzeMessage(content: string): Promise<MessageAnalysis> {
  await delay(200 + Math.random() * 300);
  
  const contentLower = content.toLowerCase();
  const words = contentLower.split(/\s+/);
  
  // Determine urgency
  let urgency: MessageUrgency = 'normal';
  if (URGENT_KEYWORDS.some(k => contentLower.includes(k))) {
    urgency = contentLower.includes('emergency') || contentLower.includes('critical') ? 'critical' : 'high';
  } else if (content.includes('!') || content.includes('?')) {
    urgency = 'normal';
  } else {
    urgency = 'low';
  }
  
  // Determine category
  let category = 'General';
  if (CLINICAL_KEYWORDS.some(k => contentLower.includes(k))) {
    category = 'Clinical';
  } else if (ADMIN_KEYWORDS.some(k => contentLower.includes(k))) {
    category = 'Administrative';
  }
  
  // Suggest recipients based on content
  const suggestedRecipients = RECIPIENTS
    .map(r => ({
      ...r,
      relevance: Math.floor(50 + Math.random() * 50)
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
  
  // If clinical, prioritize doctors
  if (category === 'Clinical') {
    suggestedRecipients.sort((a, b) => {
      if (a.role.includes('Physician') || a.role.includes('Specialist')) return -1;
      if (b.role.includes('Physician') || b.role.includes('Specialist')) return 1;
      return 0;
    });
  }
  
  // Generate suggested responses
  const suggestedResponses: string[] = [];
  if (category === 'Clinical') {
    suggestedResponses.push(
      'I will review the patient records and get back to you shortly.',
      'Please provide the patient ID for further assessment.',
      'Acknowledged. Initiating clinical protocol.'
    );
  } else if (category === 'Administrative') {
    suggestedResponses.push(
      'I will check the schedule and confirm availability.',
      'The documentation has been processed.',
      'Please allow 24-48 hours for processing.'
    );
  } else {
    suggestedResponses.push(
      'Thank you for reaching out. I will respond shortly.',
      'Received. I will look into this.',
      'Acknowledged. Will follow up soon.'
    );
  }
  
  // Determine sentiment
  const sentiment = urgency === 'critical' || urgency === 'high' ? 'urgent' : 'neutral';
  
  // Extract keywords
  const keywords = words
    .filter(w => w.length > 4)
    .filter(w => [...CLINICAL_KEYWORDS, ...ADMIN_KEYWORDS, ...URGENT_KEYWORDS].some(k => w.includes(k)))
    .slice(0, 5);
  
  return {
    urgency,
    category,
    suggestedRecipients,
    suggestedResponses,
    sentiment,
    keywords
  };
}

// ============================================
// Mock WebSocket for Real-time Alerts
// ============================================
type AlertCallback = (alerts: PredictiveAlert[]) => void;

class MockAlertWebSocket {
  private callback: AlertCallback | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private connected = false;

  connect(onAlerts: AlertCallback) {
    this.callback = onAlerts;
    this.connected = true;
    
    // Initial alerts
    getClinicalAlerts().then(alerts => {
      if (this.callback && this.connected) {
        this.callback(alerts);
      }
    });
    
    // Periodic updates
    this.interval = setInterval(() => {
      if (this.callback && this.connected) {
        getClinicalAlerts().then(alerts => {
          if (this.callback && this.connected) {
            this.callback(alerts);
          }
        });
      }
    }, 30000); // Update every 30 seconds
    
    return () => this.disconnect();
  }

  disconnect() {
    this.connected = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.callback = null;
  }

  isConnected() {
    return this.connected;
  }
}

export const alertWebSocket = new MockAlertWebSocket();

// ============================================
// Feature 6: Intelligent Calendar Scheduling
// ============================================
export interface CalendarSlot {
  id: string;
  datetime: string;
  endTime: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  matchScore: number;
  noShowRisk: number;
  factors: {
    providerAvailability: number;
    patientConvenience: number;
    historicalSuccess: number;
    resourceOptimization: number;
  };
  appointmentType: string;
  status: 'available' | 'recommended' | 'limited';
}

export interface CalendarDaySlots {
  date: string;
  slots: CalendarSlot[];
  dayInsights: {
    totalSlots: number;
    optimalSlots: number;
    averageNoShowRisk: number;
    busyPeriods: string[];
  };
}

const PROVIDER_DATA = [
  { id: 'd1', name: 'Dr. Alex Morgan', image: 'assets/img/users/user-01.jpg', specialty: 'General Practice' },
  { id: 'd2', name: 'Dr. Sarah Johnson', image: 'assets/img/users/user-02.jpg', specialty: 'Internal Medicine' },
  { id: 'd3', name: 'Dr. Emily Carter', image: 'assets/img/users/user-03.jpg', specialty: 'Pediatrics' },
  { id: 'd4', name: 'Dr. David Lee', image: 'assets/img/users/user-04.jpg', specialty: 'Cardiology' },
  { id: 'd5', name: 'Dr. Maria Santos', image: 'assets/img/users/user-05.jpg', specialty: 'Dermatology' },
];

const APPOINTMENT_TYPES = [
  'General Consultation',
  'Follow-up Visit',
  'Annual Physical',
  'Specialist Referral',
  'Urgent Care',
  'Telehealth Visit',
];

export async function getCalendarDaySlots(date: string): Promise<CalendarDaySlots> {
  await delay(300 + Math.random() * 400);

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay();

  // Weekend has fewer slots
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const numSlots = isWeekend ? 3 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 4);

  const slots: CalendarSlot[] = [];
  const startHour = 8; // 8 AM
  const endHour = 17; // 5 PM

  for (let i = 0; i < numSlots; i++) {
    const provider = PROVIDER_DATA[i % PROVIDER_DATA.length];
    const hour = startHour + Math.floor((i / numSlots) * (endHour - startHour));
    const minute = Math.random() > 0.5 ? 0 : 30;

    const slotDate = new Date(selectedDate);
    slotDate.setHours(hour, minute, 0, 0);

    const endDate = new Date(slotDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const matchScore = Math.round(60 + Math.random() * 40);
    const noShowRisk = Math.round(5 + Math.random() * 30);

    // Determine status based on scores
    let status: 'available' | 'recommended' | 'limited' = 'available';
    if (matchScore >= 85 && noShowRisk < 15) {
      status = 'recommended';
    } else if (matchScore < 70 || noShowRisk > 25) {
      status = 'limited';
    }

    slots.push({
      id: `slot-${date}-${i}`,
      datetime: slotDate.toISOString(),
      endTime: endDate.toISOString(),
      providerId: provider.id,
      providerName: provider.name,
      providerImage: provider.image,
      matchScore,
      noShowRisk,
      factors: {
        providerAvailability: Math.round(70 + Math.random() * 30),
        patientConvenience: Math.round(60 + Math.random() * 40),
        historicalSuccess: Math.round(75 + Math.random() * 25),
        resourceOptimization: Math.round(65 + Math.random() * 35),
      },
      appointmentType: APPOINTMENT_TYPES[Math.floor(Math.random() * APPOINTMENT_TYPES.length)],
      status,
    });
  }

  // Sort by match score
  slots.sort((a, b) => b.matchScore - a.matchScore);

  // Calculate day insights
  const avgNoShowRisk = slots.reduce((sum, s) => sum + s.noShowRisk, 0) / slots.length;
  const optimalSlots = slots.filter(s => s.status === 'recommended').length;

  const busyPeriods: string[] = [];
  if (Math.random() > 0.5) busyPeriods.push('11:00 AM - 12:00 PM');
  if (Math.random() > 0.6) busyPeriods.push('2:00 PM - 3:00 PM');

  return {
    date,
    slots,
    dayInsights: {
      totalSlots: slots.length,
      optimalSlots,
      averageNoShowRisk: Math.round(avgNoShowRisk),
      busyPeriods,
    },
  };
}

export interface BookedAppointment {
  id: string;
  title: string;
  start: string;
  end: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  patientName: string;
  appointmentType: string;
  matchScore: number;
  noShowRisk: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export async function bookCalendarSlot(
  slot: CalendarSlot,
  patientName: string = 'Patient'
): Promise<BookedAppointment> {
  await delay(400 + Math.random() * 300);

  return {
    id: `apt-${Date.now()}`,
    title: `${patientName} - ${slot.appointmentType}`,
    start: slot.datetime,
    end: slot.endTime,
    providerId: slot.providerId,
    providerName: slot.providerName,
    providerImage: slot.providerImage,
    patientName,
    appointmentType: slot.appointmentType,
    matchScore: slot.matchScore,
    noShowRisk: slot.noShowRisk,
    status: 'confirmed',
  };
}

// ============================================
// Feature 7: AI Assistance Agent
// ============================================
export type UserRoleType = 'doctor' | 'nurse' | 'admin';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: AIAction[];
  navigationLink?: string;
}

export interface AIAction {
  id: string;
  label: string;
  type: 'navigation' | 'appointment' | 'action' | 'info';
  payload?: Record<string, unknown>;
  icon?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  roles: UserRoleType[];
}

export interface AIConversationResponse {
  message: AIMessage;
  suggestedActions?: AIAction[];
}

// Quick actions by role
const QUICK_ACTIONS: QuickAction[] = [
  // Doctor actions
  { id: 'qa-1', label: 'View My Schedule', icon: 'ti-calendar', prompt: 'Show me my schedule for today', roles: ['doctor'] },
  { id: 'qa-2', label: 'Patient Queue', icon: 'ti-users', prompt: 'Show my patient queue', roles: ['doctor'] },
  { id: 'qa-3', label: 'Write Prescription', icon: 'ti-prescription', prompt: 'Help me write a prescription', roles: ['doctor'] },
  { id: 'qa-4', label: 'Lab Results', icon: 'ti-flask', prompt: 'Show pending lab results', roles: ['doctor'] },

  // Nurse actions
  { id: 'qa-5', label: 'Patient Vitals', icon: 'ti-heartbeat', prompt: 'Record patient vitals', roles: ['nurse'] },
  { id: 'qa-6', label: 'Medication Schedule', icon: 'ti-pill', prompt: 'Show medication schedule', roles: ['nurse'] },
  { id: 'qa-7', label: 'Shift Handoff', icon: 'ti-transfer', prompt: 'Prepare shift handoff report', roles: ['nurse'] },
  { id: 'qa-8', label: 'Bed Status', icon: 'ti-bed', prompt: 'Show current bed availability', roles: ['nurse'] },

  // Admin actions
  { id: 'qa-9', label: 'Daily Reports', icon: 'ti-report', prompt: 'Generate daily reports', roles: ['admin'] },
  { id: 'qa-10', label: 'Staff Schedule', icon: 'ti-calendar-time', prompt: 'Show staff schedule', roles: ['admin'] },
  { id: 'qa-11', label: 'Revenue Overview', icon: 'ti-chart-bar', prompt: 'Show revenue overview', roles: ['admin'] },
  { id: 'qa-12', label: 'Pending Approvals', icon: 'ti-checkbox', prompt: 'Show pending approvals', roles: ['admin'] },

  // Common actions
  { id: 'qa-13', label: 'Schedule Appointment', icon: 'ti-calendar-plus', prompt: 'Help me schedule an appointment', roles: ['doctor', 'nurse', 'admin'] },
  { id: 'qa-14', label: 'Find Patient', icon: 'ti-search', prompt: 'Help me find a patient', roles: ['doctor', 'nurse', 'admin'] },
  { id: 'qa-15', label: 'Navigate Platform', icon: 'ti-compass', prompt: 'Help me navigate the platform', roles: ['doctor', 'nurse', 'admin'] },
];

// Navigation mapping
const NAVIGATION_MAP: Record<string, { path: string; description: string }> = {
  'dashboard': { path: '/dashboard', description: 'Main Dashboard' },
  'appointments': { path: '/appointments', description: 'Appointments' },
  'calendar': { path: '/application/calendar', description: 'Calendar' },
  'patients': { path: '/patients', description: 'Patient List' },
  'doctors': { path: '/doctors', description: 'Doctor List' },
  'messages': { path: '/messages', description: 'Messages' },
  'reports': { path: '/accounts/invoices', description: 'Reports & Invoices' },
  'settings': { path: '/settings/profile-settings', description: 'Settings' },
  'pharmacy': { path: '/pharmacy', description: 'Pharmacy' },
  'lab': { path: '/lab', description: 'Laboratory' },
};

// Response templates for different intents
const RESPONSE_TEMPLATES = {
  greeting: [
    "Hello! I'm your AI Assistant for Symplify. How can I help you today?",
    "Hi there! I'm here to help you with appointments, navigation, and quick actions. What do you need?",
    "Welcome! I can help you schedule appointments, find information, or navigate the platform. What would you like to do?",
  ],

  scheduling: [
    "I can help you schedule an appointment. Here are the available options:",
    "Let me help you with scheduling. I'll find the best available slots for you.",
    "Sure! I'll assist you with appointment scheduling. What type of appointment do you need?",
  ],

  navigation: [
    "I can help you navigate to any section of the platform. Here are some quick links:",
    "Where would you like to go? I can take you to any page in the system.",
    "Let me help you find what you're looking for. Here are the main sections:",
  ],

  patientSearch: [
    "I can help you find patient information. Please provide the patient name or ID.",
    "Let me search for the patient. What details do you have?",
    "I'll help you locate the patient record. Please share any identifying information.",
  ],

  schedule: [
    "Here's your schedule overview for today. You have several appointments lined up.",
    "Let me pull up your schedule. I can see your upcoming appointments.",
    "Your schedule is ready. Here's what you have planned:",
  ],

  fallback: [
    "I understand you need help with that. Let me provide some options:",
    "I can assist with that. Here are some things I can help you with:",
    "Sure, I'm here to help. Here's what I can do for you:",
  ],
};

// ── Expanded Intent Detection ──

const INTENT_PATTERNS: Record<string, RegExp> = {
  greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i,
  scheduling: /(schedule|book|appointment|reschedule|cancel appointment|make an appointment|find.*slot)/i,
  navigation: /(go to|navigate|take me|open|show me|where is|find the)/i,
  patientSearch: /(find patient|search patient|patient.*record|look up patient)/i,
  schedule: /(my schedule|my appointments|what do I have|my day|my calendar)/i,
  help: /(help|what can you do|assist|support)/i,
  // New clinical intents
  drugInteraction: /(drug interaction|medication interaction|check.*interact|combine.*medication|metformin|lisinopril|warfarin)/i,
  triage: /(triage|priority|acuity|chest pain|breathing|o2|oxygen|vitals|assess patient)/i,
  clinicalAlerts: /(clinical alert|predictive alert|risk alert|show.*alert|patient.*risk)/i,
  shiftHandoff: /(shift handoff|handoff|handover|sbar|shift report|end of shift)/i,
  labResults: /(lab result|lab report|blood work|test result|pathology)/i,
  // New operational intents
  bedStatus: /(bed status|bed availability|available bed|bed count|ward capacity)/i,
  staffSchedule: /(staff schedule|who.*(on|working)|staff conflict|coverage)/i,
  compliance: /(compliance|regulatory|audit|hipaa status|compliance score)/i,
  pendingApprovals: /(pending approval|approve|authorization|waiting.*approval)/i,
  // New communication intents
  messageUrgency: /(message urgency|urgent message|triage message|analyze message)/i,
  notificationSummary: /(notification summary|unread notification|notification overview|alert summary)/i,
  emailPriority: /(email priority|important email|email overview|inbox summary)/i,
};

type IntentType = keyof typeof ENHANCED_RESPONSE_TEMPLATES;

const ENHANCED_RESPONSE_TEMPLATES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm your AI Assistant for Symplify. I can help with clinical workflows, scheduling, drug interactions, triage assessment, and more. How can I assist you?",
    "Hi there! I'm here to help with appointments, clinical alerts, shift handoffs, drug checks, and platform navigation. What do you need?",
  ],
  scheduling: [
    "I'll find the best available appointment slots for you. Here are AI-optimized suggestions based on provider availability and patient history:",
    "Let me help you with scheduling. I've analyzed provider availability and patient preferences to suggest optimal slots:",
  ],
  navigation: [
    "I can help you navigate to any section of the platform. Here are some quick links:",
    "Where would you like to go? I can take you to any page in the system.",
  ],
  patientSearch: [
    "I can help you find patient information. Please provide the patient name or ID.",
    "Let me search for the patient. What details do you have?",
  ],
  schedule: [
    "Here's your schedule overview for today. You have several appointments lined up.",
    "Let me pull up your schedule. I can see your upcoming appointments.",
  ],
  help: [
    "I can assist with: scheduling, drug interaction checks, triage assessment, clinical alerts, shift handoffs, bed status, compliance, and platform navigation. What would you like to do?",
  ],
  drugInteraction: [
    "I'll check for potential drug interactions. Here are the results from the interaction analysis:",
  ],
  triage: [
    "I've assessed the clinical indicators. Here is the triage priority recommendation based on the symptoms and vitals provided:",
  ],
  clinicalAlerts: [
    "Here are the current clinical alerts from the predictive monitoring system. These are ranked by risk severity:",
  ],
  shiftHandoff: [
    "I'll prepare the shift handoff summary. Here's an overview of your current patients and key items for the incoming shift:",
  ],
  labResults: [
    "Here are the pending lab results that need your attention. Critical values are flagged:",
  ],
  bedStatus: [
    "Here's the current bed availability across departments. I've highlighted areas with limited capacity:",
  ],
  staffSchedule: [
    "Here's the staff schedule overview. I've identified any coverage gaps or conflicts:",
  ],
  compliance: [
    "Here's your compliance status summary. Items requiring attention are flagged:",
  ],
  pendingApprovals: [
    "You have pending items requiring approval. Here's a summary ordered by urgency:",
  ],
  messageUrgency: [
    "I've analyzed the message urgency. Here's the triage assessment:",
  ],
  notificationSummary: [
    "Here's your notification summary. Critical items are highlighted:",
  ],
  emailPriority: [
    "Here's your email priority overview. High-priority clinical messages are flagged:",
  ],
  fallback: [
    "I understand you need help with that. Let me provide some options:",
    "I can assist with that. Here are some things I can help you with:",
  ],
};

function detectIntent(message: string): IntentType {
  const lowerMessage = message.toLowerCase();
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(lowerMessage)) {
      return intent as IntentType;
    }
  }
  return 'fallback';
}

function getRandomResponse(intent: IntentType): string {
  const responses = ENHANCED_RESPONSE_TEMPLATES[intent] || ENHANCED_RESPONSE_TEMPLATES.fallback;
  return responses[Math.floor(Math.random() * responses.length)];
}

function extractNavigationTarget(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const [key, value] of Object.entries(NAVIGATION_MAP)) {
    if (lowerMessage.includes(key) || lowerMessage.includes(value.description.toLowerCase())) {
      return key;
    }
  }
  return null;
}

// ── Drug interaction bridge ──

const DRUG_INTERACTIONS: Record<string, DrugInteractionResult> = {
  'metformin+lisinopril': {
    drug1: 'Metformin', drug2: 'Lisinopril', severity: 'moderate',
    description: 'Combined use may increase the risk of lactic acidosis in patients with renal impairment.',
    recommendation: 'Monitor renal function regularly. Consider dose adjustment if eGFR falls below 45 mL/min.',
    confidence: 87,
  },
  'warfarin+aspirin': {
    drug1: 'Warfarin', drug2: 'Aspirin', severity: 'major',
    description: 'Increased risk of bleeding. Aspirin inhibits platelet function while warfarin inhibits coagulation factors.',
    recommendation: 'Avoid combination unless specifically indicated. Monitor INR closely if co-prescribed.',
    confidence: 94,
  },
  'default': {
    drug1: 'Drug A', drug2: 'Drug B', severity: 'minor',
    description: 'No significant interaction identified at standard therapeutic doses.',
    recommendation: 'Continue monitoring as clinically appropriate. Report any unexpected side effects.',
    confidence: 72,
  },
};

function parseDrugPair(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('metformin') && lower.includes('lisinopril')) return 'metformin+lisinopril';
  if (lower.includes('warfarin') && lower.includes('aspirin')) return 'warfarin+aspirin';
  return 'default';
}

export async function checkDrugInteraction(message: string): Promise<DrugInteractionResult> {
  await delay(400 + Math.random() * 400);
  const key = parseDrugPair(message);
  return DRUG_INTERACTIONS[key] || DRUG_INTERACTIONS['default'];
}

// ── Bed status bridge ──

export async function getBedStatus(): Promise<BedStatusResult> {
  await delay(300 + Math.random() * 300);
  return {
    totalBeds: 120,
    occupied: 94,
    available: 26,
    departments: [
      { name: 'ICU', available: 2, total: 20 },
      { name: 'General Ward', available: 12, total: 50 },
      { name: 'Pediatrics', available: 5, total: 18 },
      { name: 'Maternity', available: 4, total: 16 },
      { name: 'Emergency', available: 3, total: 16 },
    ],
  };
}

// ── Compliance bridge ──

export async function getComplianceStatus(): Promise<ComplianceStatusResult> {
  await delay(300 + Math.random() * 300);
  return {
    overallScore: 87,
    categories: [
      { name: 'HIPAA Documentation', score: 94, status: 'pass' },
      { name: 'Patient Consent Forms', score: 78, status: 'warning' },
      { name: 'Medication Reconciliation', score: 91, status: 'pass' },
      { name: 'Discharge Summaries', score: 65, status: 'fail' },
      { name: 'Infection Control', score: 96, status: 'pass' },
    ],
    pendingItems: 7,
  };
}

// ── Enhanced action generation ──

function generateActions(intent: string, message: string): AIAction[] {
  const actions: AIAction[] = [];

  switch (intent) {
    case 'scheduling':
      actions.push(
        { id: 'act-1', label: 'New Appointment', type: 'appointment', icon: 'ti-calendar-plus' },
        { id: 'act-2', label: 'View Calendar', type: 'navigation', payload: { path: '/application/calendar' }, icon: 'ti-calendar' },
      );
      break;
    case 'navigation': {
      const target = extractNavigationTarget(message);
      if (target && NAVIGATION_MAP[target]) {
        actions.push({
          id: 'nav-1', label: `Go to ${NAVIGATION_MAP[target].description}`,
          type: 'navigation', payload: { path: NAVIGATION_MAP[target].path }, icon: 'ti-arrow-right',
        });
      } else {
        actions.push(
          { id: 'nav-1', label: 'Dashboard', type: 'navigation', payload: { path: '/dashboard' }, icon: 'ti-dashboard' },
          { id: 'nav-2', label: 'Appointments', type: 'navigation', payload: { path: '/appointments' }, icon: 'ti-calendar' },
          { id: 'nav-3', label: 'Patients', type: 'navigation', payload: { path: '/patients' }, icon: 'ti-users' },
        );
      }
      break;
    }
    case 'patientSearch':
      actions.push(
        { id: 'ps-1', label: 'Search Patients', type: 'navigation', payload: { path: '/patients' }, icon: 'ti-search' },
      );
      break;
    case 'schedule':
      actions.push(
        { id: 'sch-1', label: "Today's Appointments", type: 'navigation', payload: { path: '/appointments' }, icon: 'ti-calendar-check' },
        { id: 'sch-2', label: 'View Full Calendar', type: 'navigation', payload: { path: '/application/calendar' }, icon: 'ti-calendar' },
      );
      break;
    case 'drugInteraction':
      actions.push(
        { id: 'di-1', label: 'Open Drug Checker', type: 'action', icon: 'ti-pill', payload: { expand: 'drug-interaction' } },
      );
      break;
    case 'triage':
      actions.push(
        { id: 'tr-1', label: 'Full Assessment', type: 'action', icon: 'ti-stethoscope', payload: { expand: 'triage' } },
      );
      break;
    case 'clinicalAlerts':
      actions.push(
        { id: 'ca-1', label: 'View All Alerts', type: 'navigation', payload: { path: '/notifications' }, icon: 'ti-bell' },
      );
      break;
    case 'shiftHandoff':
      actions.push(
        { id: 'sh-1', label: 'Open Shift Handoff', type: 'navigation', payload: { path: '/shift-handoff' }, icon: 'ti-transfer' },
        { id: 'sh-2', label: 'Generate SBAR', type: 'action', icon: 'ti-file-text', payload: { expand: 'shift-handoff' } },
      );
      break;
    case 'bedStatus':
      actions.push(
        { id: 'bs-1', label: 'Detailed Bed Map', type: 'info', icon: 'ti-bed' },
      );
      break;
    case 'compliance':
      actions.push(
        { id: 'cp-1', label: 'Full Compliance Report', type: 'info', icon: 'ti-shield-check' },
      );
      break;
    case 'notificationSummary':
      actions.push(
        { id: 'ns-1', label: 'View Notifications', type: 'navigation', payload: { path: '/notifications' }, icon: 'ti-bell' },
      );
      break;
    case 'emailPriority':
      actions.push(
        { id: 'ep-1', label: 'Open Email', type: 'navigation', payload: { path: '/application/email' }, icon: 'ti-mail' },
      );
      break;
    default:
      actions.push(
        { id: 'help-1', label: 'Schedule Appointment', type: 'appointment', icon: 'ti-calendar-plus' },
        { id: 'help-2', label: 'Navigate Platform', type: 'info', icon: 'ti-compass' },
        { id: 'help-3', label: 'Quick Actions', type: 'info', icon: 'ti-bolt' },
      );
      break;
  }

  return actions;
}

// ── Enhanced Quick Actions (categorized) ──

const ENHANCED_QUICK_ACTIONS: EnhancedQuickAction[] = [
  // Clinical
  { id: 'eqa-1', label: 'Drug Interaction Check', icon: 'ti-pill', prompt: 'Check drug interactions', roles: ['doctor', 'nurse', 'admin'], category: 'clinical' },
  { id: 'eqa-2', label: 'Triage Assessment', icon: 'ti-stethoscope', prompt: 'Assess triage priority for a patient', roles: ['doctor', 'nurse'], category: 'clinical' },
  { id: 'eqa-3', label: 'Clinical Alerts', icon: 'ti-alert-triangle', prompt: 'Show clinical alerts', roles: ['doctor', 'nurse'], category: 'clinical' },
  { id: 'eqa-4', label: 'Lab Results', icon: 'ti-flask', prompt: 'Show pending lab results', roles: ['doctor', 'nurse'], category: 'clinical' },
  { id: 'eqa-5', label: 'Shift Handoff', icon: 'ti-transfer', prompt: 'Prepare shift handoff report', roles: ['nurse', 'doctor'], category: 'clinical', contextual: true, timeRange: { start: 6, end: 8 } },
  { id: 'eqa-6', label: 'Bed Availability', icon: 'ti-bed', prompt: 'Show current bed availability', roles: ['nurse', 'admin'], category: 'clinical' },

  // Administrative
  { id: 'eqa-7', label: 'Schedule Appointment', icon: 'ti-calendar-plus', prompt: 'Help me schedule an appointment', roles: ['doctor', 'nurse', 'admin'], category: 'administrative' },
  { id: 'eqa-8', label: 'Staff Schedule', icon: 'ti-calendar-time', prompt: 'Show staff schedule', roles: ['admin'], category: 'administrative' },
  { id: 'eqa-9', label: 'Compliance Status', icon: 'ti-shield-check', prompt: 'Show compliance status', roles: ['admin'], category: 'administrative' },
  { id: 'eqa-10', label: 'Pending Approvals', icon: 'ti-checkbox', prompt: 'Show pending approvals', roles: ['admin'], category: 'administrative' },
  { id: 'eqa-11', label: 'Daily Reports', icon: 'ti-report', prompt: 'Generate daily reports', roles: ['admin'], category: 'administrative', contextual: true, timeRange: { start: 16, end: 20 } },
  { id: 'eqa-12', label: 'Find Patient', icon: 'ti-search', prompt: 'Help me find a patient', roles: ['doctor', 'nurse', 'admin'], category: 'administrative' },

  // Navigation
  { id: 'eqa-13', label: 'Dashboard', icon: 'ti-dashboard', prompt: 'Go to dashboard', roles: ['doctor', 'nurse', 'admin'], category: 'navigation' },
  { id: 'eqa-14', label: 'Notifications', icon: 'ti-bell', prompt: 'Show notification summary', roles: ['doctor', 'nurse', 'admin'], category: 'navigation' },
  { id: 'eqa-15', label: 'Email Inbox', icon: 'ti-mail', prompt: 'Show email priority overview', roles: ['doctor', 'nurse', 'admin'], category: 'navigation' },
  { id: 'eqa-16', label: 'Messages', icon: 'ti-message', prompt: 'Go to messages', roles: ['doctor', 'nurse', 'admin'], category: 'navigation' },
];

export function getQuickActions(role: UserRoleType): QuickAction[] {
  return QUICK_ACTIONS.filter(action => action.roles.includes(role));
}

export function getEnhancedQuickActions(role: UserRoleType): EnhancedQuickAction[] {
  const hour = new Date().getHours();
  return ENHANCED_QUICK_ACTIONS
    .filter(a => a.roles.includes(role))
    .filter(a => {
      if (!a.contextual || !a.timeRange) return true;
      return hour >= a.timeRange.start && hour <= a.timeRange.end;
    });
}

// ── Enhanced sendAIMessage with cards ──

export interface EnhancedAIConversationResponse {
  message: EnhancedAIMessage;
  suggestedActions?: AIAction[];
}

export async function sendEnhancedAIMessage(
  message: string,
  conversationHistory: EnhancedAIMessage[],
  userRole: UserRoleType
): Promise<EnhancedAIConversationResponse> {
  await delay(600 + Math.random() * 800);

  const intent = detectIntent(message);
  const responseText = getRandomResponse(intent);
  const actions = generateActions(intent, message);

  let cards: ChatCard[] | undefined;
  let confidence: number | undefined;
  let hipaaProtected = false;
  let expandable = false;
  let expandedView: ExpandedViewConfig | undefined;
  let navigationLink: string | undefined;

  // Bridge to existing AI features based on intent
  switch (intent) {
    case 'drugInteraction': {
      const result = await checkDrugInteraction(message);
      cards = [{ type: 'drug-interaction', data: result as unknown as Record<string, unknown> }];
      confidence = result.confidence;
      hipaaProtected = true;
      expandedView = { type: 'drug-interaction', title: 'Drug Interaction Details' };
      expandable = true;
      break;
    }
    case 'triage': {
      const triageResult = await assessTriagePriority({
        patientId: 'patient-chat',
        symptoms: extractSymptoms(message),
        vitals: extractVitals(message),
        waitTime: 15,
      });
      cards = [{ type: 'triage', data: triageResult as unknown as Record<string, unknown> }];
      confidence = triageResult.confidence;
      hipaaProtected = true;
      break;
    }
    case 'clinicalAlerts': {
      const alerts = await getClinicalAlerts();
      cards = alerts.slice(0, 3).map(a => ({ type: 'alert' as const, data: a as unknown as Record<string, unknown> }));
      hipaaProtected = true;
      expandable = true;
      expandedView = { type: 'alerts', title: 'Clinical Alerts' };
      break;
    }
    case 'scheduling': {
      const slotsRes = await getSmartSlotSuggestions({ patientId: 'patient-chat', appointmentType: 'General Consultation' });
      cards = slotsRes.slots.slice(0, 3).map(s => ({ type: 'slot' as const, data: s as unknown as Record<string, unknown> }));
      expandedView = { type: 'scheduler', title: 'Appointment Scheduler' };
      expandable = true;
      break;
    }
    case 'bedStatus': {
      const beds = await getBedStatus();
      cards = [{ type: 'bed-status', data: beds as unknown as Record<string, unknown> }];
      break;
    }
    case 'compliance': {
      const comp = await getComplianceStatus();
      cards = [{ type: 'compliance', data: comp as unknown as Record<string, unknown> }];
      break;
    }
    case 'shiftHandoff':
      expandedView = { type: 'shift-handoff', title: 'Shift Handoff Report' };
      expandable = true;
      break;
    case 'navigation': {
      const target = extractNavigationTarget(message);
      if (target && NAVIGATION_MAP[target]) {
        navigationLink = NAVIGATION_MAP[target].path;
      }
      break;
    }
    case 'notificationSummary':
      cards = [{
        type: 'patient-summary', data: {
          title: 'Notification Summary',
          items: [
            { label: 'Critical', value: 3, color: 'danger' },
            { label: 'High', value: 4, color: 'warning' },
            { label: 'Medium', value: 8, color: 'info' },
            { label: 'Low', value: 5, color: 'success' },
          ],
        },
      }];
      break;
    case 'emailPriority':
      cards = [{
        type: 'patient-summary', data: {
          title: 'Email Priority Overview',
          items: [
            { label: 'Urgent', value: 2, color: 'danger' },
            { label: 'Clinical', value: 6, color: 'warning' },
            { label: 'Administrative', value: 12, color: 'info' },
            { label: 'General', value: 8, color: 'secondary' },
          ],
        },
      }];
      break;
  }

  const response: EnhancedAIMessage = {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: responseText,
    timestamp: Date.now(),
    actions,
    navigationLink,
    cards,
    confidence,
    hipaaProtected,
    expandable,
    expandedView,
  };

  return { message: response, suggestedActions: actions };
}

// ── Helpers for parsing clinical input ──

function extractSymptoms(message: string): string[] {
  const symptomKeywords = ['chest pain', 'difficulty breathing', 'headache', 'fever', 'nausea', 'vomiting', 'dizziness', 'abdominal pain', 'cough', 'fatigue'];
  const lower = message.toLowerCase();
  return symptomKeywords.filter(s => lower.includes(s));
}

function extractVitals(message: string): { heartRate?: number; oxygenSaturation?: number; temperature?: number } | undefined {
  const vitals: Record<string, number> = {};
  const o2Match = message.match(/o2.*?(\d{2,3})%?|oxygen.*?(\d{2,3})%?|spo2.*?(\d{2,3})%?/i);
  if (o2Match) vitals.oxygenSaturation = parseInt(o2Match[1] || o2Match[2] || o2Match[3]);
  const hrMatch = message.match(/(?:heart rate|hr|pulse).*?(\d{2,3})/i);
  if (hrMatch) vitals.heartRate = parseInt(hrMatch[1]);
  const tempMatch = message.match(/(?:temp|temperature).*?([\d.]+)/i);
  if (tempMatch) vitals.temperature = parseFloat(tempMatch[1]);
  return Object.keys(vitals).length > 0 ? vitals : undefined;
}

// ── Legacy sendAIMessage kept for backward compat ──

export async function sendAIMessage(
  message: string,
  conversationHistory: AIMessage[],
  userRole: UserRoleType
): Promise<AIConversationResponse> {
  const enhanced = await sendEnhancedAIMessage(message, [], userRole);
  return {
    message: {
      id: enhanced.message.id,
      role: enhanced.message.role,
      content: enhanced.message.content,
      timestamp: enhanced.message.timestamp,
      actions: enhanced.message.actions,
      navigationLink: enhanced.message.navigationLink,
    },
    suggestedActions: enhanced.suggestedActions,
  };
}

export async function executeAIAction(
  action: AIAction,
  userRole: UserRoleType
): Promise<{ success: boolean; message: string; data?: unknown }> {
  await delay(300 + Math.random() * 500);

  switch (action.type) {
    case 'navigation':
      return { success: true, message: `Navigating to ${action.label}`, data: action.payload };
    case 'appointment':
      return { success: true, message: 'Opening appointment scheduler...', data: { redirectTo: '/application/calendar' } };
    case 'action':
      return { success: true, message: `Executing: ${action.label}` };
    case 'info':
      return { success: true, message: `Here's the information you requested about ${action.label}` };
    default:
      return { success: false, message: 'Unknown action type' };
  }
}
