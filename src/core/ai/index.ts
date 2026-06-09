// AI Core Module Index - Symplify Platform
// Export all AI-related types, services, and utilities

// Types
export * from './types';

// Pluggable assistant backend
export { mockAIService, type AIService } from './AIService';

// Mock API Services
export {
  assessTriagePriority,
  getPersonalizedLayout,
  getSmartSlotSuggestions,
  getClinicalAlerts,
  analyzeMessage,
  alertWebSocket,
} from './mockApi';
