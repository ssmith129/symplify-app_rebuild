import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import ImageWithBasePath from '../../../core/imageWithBasePath';
import {
  sendEnhancedAIMessage,
  getEnhancedQuickActions,
  executeAIAction,
  type AIAction,
  type UserRoleType,
} from '../../../core/ai/mockApi';
import type {
  EnhancedAIMessage,
  EnhancedQuickAction,
  ExpandedViewConfig,
} from '../../../core/ai/types';
import ChatMessageCard from './assistant/ChatMessageCard';
import ConfidenceIndicator from './assistant/ConfidenceIndicator';
import HIPAABadge from './assistant/HIPAABadge';
import QuickActionsBar from './assistant/QuickActionsBar';
import VoiceInputToggle from './assistant/VoiceInputToggle';
import ExpandedPanel from './assistant/ExpandedPanel';

interface AIAssistantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRoleType;
  userName?: string;
}

const AIAssistantPopup: React.FC<AIAssistantPopupProps> = ({
  isOpen,
  onClose,
  userRole = 'admin',
  userName = 'User',
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<EnhancedAIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState<EnhancedQuickAction[]>([]);
  const [pinnedActionIds, setPinnedActionIds] = useState<Set<string>>(new Set());
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedView, setExpandedView] = useState<ExpandedViewConfig | null>(null);
  const [expandedMsgIds, setExpandedMsgIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Load quick actions on mount
  useEffect(() => {
    setQuickActions(getEnhancedQuickActions(userRole));
  }, [userRole]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: EnhancedAIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${userName}! I'm your AI Assistant for Symplify. I can help with scheduling, drug interaction checks, triage assessments, clinical alerts, shift handoffs, and more. How can I assist you today?`,
        timestamp: Date.now(),
        actions: [
          { id: 'w-1', label: 'Schedule Appointment', type: 'appointment', icon: 'ti-calendar-plus' },
          { id: 'w-2', label: 'Drug Interaction Check', type: 'action', icon: 'ti-pill' },
          { id: 'w-3', label: 'Clinical Alerts', type: 'action', icon: 'ti-alert-triangle' },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, userName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', handleTab);
    return () => dialog.removeEventListener('keydown', handleTab);
  }, [isOpen, isMinimized]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: EnhancedAIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendEnhancedAIMessage(content, messages, userRole);
      setMessages(prev => [...prev, response.message]);

      // Auto-expand panel for complex results
      if (response.message.expandedView && response.message.expandable) {
        // Don't auto-expand, let user click
      }
    } catch (error) {
      console.error('AI message error:', error);
      const errorMessage: EnhancedAIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, userRole]);

  // Handle quick action click
  const handleQuickAction = (action: EnhancedQuickAction) => {
    handleSendMessage(action.prompt);
  };

  // Toggle pin
  const handleTogglePin = (id: string) => {
    setPinnedActionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Handle action button click
  const handleActionClick = async (action: AIAction) => {
    try {
      // Check if the action triggers an expanded view
      if (action.payload?.expand) {
        const viewType = action.payload.expand as ExpandedViewConfig['type'];
        setExpandedView({ type: viewType, title: action.label });
        return;
      }

      const result = await executeAIAction(action, userRole);

      if (result.success && action.type === 'navigation' && action.payload?.path) {
        navigate(action.payload.path as string);
        onClose();
      } else if (result.success && action.type === 'appointment') {
        navigate('/new-appointment');
        onClose();
      } else {
        const responseMessage: EnhancedAIMessage = {
          id: `action-${Date.now()}`,
          role: 'assistant',
          content: result.message,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    } catch (error) {
      console.error('Action error:', error);
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (text: string) => {
    setInputValue(text);
    // Auto-send after short delay
    setTimeout(() => handleSendMessage(text), 300);
  };

  // Handle expand toggle on message
  const handleToggleExpand = (msgId: string, config?: ExpandedViewConfig) => {
    if (config) {
      setExpandedView(config);
    }
    setExpandedMsgIds(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (expandedView) {
        setExpandedView(null);
      } else {
        onClose();
      }
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  const isExpanded = expandedView !== null;

  return (
    <div
      ref={dialogRef}
      className={`ai-assistant-popup ${isMinimized ? 'minimized' : ''} ${isExpanded ? 'expanded' : ''}`}
      role="dialog"
      aria-label="AI Assistant"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="ai-popup-header">
        <div className="d-flex align-items-center">
          <div className="ai-avatar me-2">
            <i className="ti ti-robot fs-18" />
          </div>
          <div>
            <h6 className="mb-0 fw-bold text-white">AI Assistant</h6>
            <span className="fs-11 text-white-50">
              {isTyping ? 'Analyzing...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-1">
          {isExpanded && (
            <button
              className="btn btn-sm btn-icon text-white"
              onClick={() => setExpandedView(null)}
              aria-label="Collapse expanded panel"
            >
              <i className="ti ti-arrows-minimize" />
            </button>
          )}
          <button
            className="btn btn-sm btn-icon text-white"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <i className={`ti ${isMinimized ? 'ti-maximize' : 'ti-minus'}`} />
          </button>
          <button
            className="btn btn-sm btn-icon text-white"
            onClick={onClose}
            aria-label="Close AI Assistant"
          >
            <i className="ti ti-x" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="ai-popup-content-wrapper">
          {/* Chat pane */}
          <div className="ai-popup-chat-pane">
            {/* Messages Container */}
            <div className="ai-popup-body" role="log" aria-live="polite">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="ai-message-avatar">
                      <i className="ti ti-robot" />
                    </div>
                  )}
                  <div className="ai-message-content">
                    {/* Text content - expandable */}
                    {msg.expandable && msg.content.length > 180 && !expandedMsgIds.has(msg.id) ? (
                      <div className="ai-msg-expandable">
                        <p className="mb-1">{msg.content.slice(0, 180)}...</p>
                        <button
                          className="ai-show-more-btn"
                          onClick={() => handleToggleExpand(msg.id)}
                        >
                          Show more <i className="ti ti-chevron-down" />
                        </button>
                      </div>
                    ) : (
                      <p className="mb-1">{msg.content}</p>
                    )}

                    {/* Inline chat cards */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div className="ai-msg-cards">
                        {msg.cards.map((card, idx) => (
                          <ChatMessageCard key={idx} card={card} />
                        ))}
                      </div>
                    )}

                    {/* Confidence indicator */}
                    {typeof msg.confidence === 'number' && (
                      <ConfidenceIndicator confidence={msg.confidence} />
                    )}

                    {/* HIPAA badge */}
                    {msg.hipaaProtected && <HIPAABadge />}

                    {/* Action buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="ai-message-actions mt-2">
                        {msg.actions.map((action) => (
                          <button
                            key={action.id}
                            className="btn btn-sm btn-outline-light ai-action-btn"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.icon && <i className={`ti ${action.icon} me-1`} />}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Expand panel trigger */}
                    {msg.expandedView && (
                      <button
                        className="ai-expand-trigger"
                        onClick={() => setExpandedView(msg.expandedView!)}
                        aria-label={`Open ${msg.expandedView.title} detail panel`}
                      >
                        <i className="ti ti-arrows-maximize" />
                        <span>Open Detail View</span>
                      </button>
                    )}

                    <span className="ai-message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="ai-message-avatar user">
                      <ImageWithBasePath
                        src="assets/img/users/user-01.jpg"
                        alt="User"
                        className="rounded-circle"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="ai-message assistant">
                  <div className="ai-message-avatar">
                    <i className="ti ti-robot" />
                  </div>
                  <div className="ai-message-content typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActionsBar
              actions={quickActions}
              pinnedIds={pinnedActionIds}
              onAction={handleQuickAction}
              onTogglePin={handleTogglePin}
            />

            {/* Input Area */}
            <form className="ai-popup-footer" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  aria-label="Message input"
                />
                <VoiceInputToggle
                  onTranscript={handleVoiceTranscript}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <Spin size="small" />
                  ) : (
                    <i className="ti ti-send" />
                  )}
                </button>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted fs-10">
                  <i className="ti ti-sparkles me-1" />
                  Powered by Symplify AI
                </small>
              </div>
            </form>
          </div>

          {/* Expanded detail pane */}
          {isExpanded && expandedView && (
            <ExpandedPanel
              config={expandedView}
              onCollapse={() => setExpandedView(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistantPopup;
