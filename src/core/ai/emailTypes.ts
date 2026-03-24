// src/core/ai/emailTypes.ts
// Email types for Symplify Platform AI-Enhanced Communication System

export type EmailPriority = 'critical' | 'high' | 'medium' | 'low';

export type EmailCategory = 
  | 'clinical-urgent'
  | 'clinical-routine'
  | 'lab-results'
  | 'referral'
  | 'insurance'
  | 'appointment'
  | 'administrative'
  | 'newsletter';

export interface EmailSender {
  email: string;
  name: string;
  department?: string;
  isInternal: boolean;
  trustScore: number; // 0-100
}

export interface EmailAnalysis {
  priority: EmailPriority;
  category: EmailCategory;
  confidence: number;
  urgencyIndicators: string[];
  estimatedResponseTime: string;
  requiresAction: boolean;
}

export interface EmailAttachment {
  name: string;
  size: string;
  icon: string; // tabler icon class e.g. 'ti-file-text'
}

export interface AnalyzedEmail {
  id: string;
  subject: string;
  preview: string;
  body: string;
  sender: EmailSender;
  timestamp: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  attachments?: EmailAttachment[];
  analysis: EmailAnalysis;
}

export type EmailFolder = 
  | 'inbox'
  | 'clinical'
  | 'administrative'
  | 'urgent'
  | 'lab-results'
  | 'referrals'
  | 'insurance';
