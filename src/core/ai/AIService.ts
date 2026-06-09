// AIService — pluggable backend boundary for the AI Assistant popup.
//
// The popup historically imported `sendEnhancedAIMessage`,
// `getEnhancedQuickActions`, and `executeAIAction` directly from `mockApi.ts`,
// which made the mock engine impossible to swap for a real service in
// production. This interface restores that seam.
//
// Inject a custom implementation via the `aiService` prop on
// <AIAssistantPopup> / <AIAssistantWidget>. When omitted, the popup falls
// back to `mockAIService` — the original behaviour, unchanged.

import {
  sendEnhancedAIMessage,
  getEnhancedQuickActions,
  executeAIAction,
  type AIAction,
  type UserRoleType,
  type EnhancedAIConversationResponse,
} from './mockApi';
import type { EnhancedAIMessage, EnhancedQuickAction } from './types';

export type { AIAction, UserRoleType, EnhancedAIConversationResponse };

export interface AIService {
  /** Send a user message and return the assistant response (+ optional suggested actions). */
  sendMessage(
    message: string,
    history: EnhancedAIMessage[],
    userRole: UserRoleType,
  ): Promise<EnhancedAIConversationResponse>;

  /** Quick-action chips available for the given role (and current context, in mock). */
  getQuickActions(userRole: UserRoleType): EnhancedQuickAction[];

  /** Execute a card/message action button (navigation / appointment / action / info). */
  executeAction(
    action: AIAction,
    userRole: UserRoleType,
  ): Promise<{ success: boolean; message: string; data?: unknown }>;
}

/**
 * Default service backed by the bundled mock engine. Preserves the exact
 * behaviour of the previous direct-import wiring.
 */
export const mockAIService: AIService = {
  sendMessage: sendEnhancedAIMessage,
  getQuickActions: getEnhancedQuickActions,
  executeAction: executeAIAction,
};
