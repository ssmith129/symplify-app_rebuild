/* eslint-disable */
import { Link } from "react-router";
import { useState, useMemo, useCallback } from "react";
import { all_routes } from "../../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../../core/imageWithBasePath";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import 'overlayscrollbars/overlayscrollbars.css';
import { SmartMessageRouter, MessageUrgencyIndicator, EmailPriorityBadge, QUICK_RESPONSES } from "../../../../ai";
import type { EmailAnalysis, EmailPriority } from "../../../../../../core/ai/emailTypes";

// ── Types ──

type UrgencyLevel = 'critical' | 'high' | 'normal' | 'low';

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  /** Use initials instead of avatar image */
  initials?: string;
  initialsClass?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  /** AI-derived analysis for the most recent message */
  analysis: EmailAnalysis;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  time: string;
  isMe: boolean;
}

// ── Mock analysis helper ──

const buildAnalysis = (
  priority: EmailPriority,
  confidence: number,
  indicators: string[],
  requiresAction: boolean
): EmailAnalysis => ({
  priority,
  category: priority === 'critical' ? 'clinical-urgent' : priority === 'high' ? 'clinical-routine' : 'administrative',
  confidence,
  urgencyIndicators: indicators,
  estimatedResponseTime:
    priority === 'critical' ? 'Immediate' :
    priority === 'high' ? '< 2 hours' :
    priority === 'medium' ? '< 24 hours' : 'When available',
  requiresAction,
});

// ── Urgency detection (mirrors MessageUrgencyIndicator logic) ──

const URGENCY_KEYWORDS: Record<UrgencyLevel, string[]> = {
  critical: ['stat', 'emergency', 'code', 'critical', 'immediate', 'now', 'life threatening', 'code blue'],
  high: ['urgent', 'asap', 'priority', 'important', 'quickly', 'soon'],
  normal: [],
  low: ['fyi', 'when you can', 'no rush', 'whenever', 'low priority'],
};

const detectUrgency = (text: string): UrgencyLevel => {
  const lower = text.toLowerCase();
  for (const kw of URGENCY_KEYWORDS.critical) { if (lower.includes(kw)) return 'critical'; }
  for (const kw of URGENCY_KEYWORDS.high) { if (lower.includes(kw)) return 'high'; }
  for (const kw of URGENCY_KEYWORDS.low) { if (lower.includes(kw)) return 'low'; }
  return 'normal';
};

// ── Priority border color map ──

const PRIORITY_BORDERS: Record<EmailPriority, string> = {
  critical: '#DC2626',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E',
};

// ── Mock data ──

const MOCK_CONTACTS: ChatContact[] = [
  {
    id: 'c1',
    name: 'Mark Smith',
    avatar: 'assets/img/users/user-02.jpg',
    lastMessage: 'URGENT: Patient in Room 302 needs immediate assistance!',
    time: '10:10 AM',
    unreadCount: 2,
    isOnline: true,
    analysis: buildAnalysis('critical', 94, ['urgent', 'immediate'], true),
  },
  {
    id: 'c2',
    name: 'Eugene Sikora',
    avatar: 'assets/img/users/user-03.jpg',
    lastMessage: 'Lab results for patient Wilson are abnormal — review needed',
    time: '08:26 AM',
    unreadCount: 5,
    isOnline: false,
    analysis: buildAnalysis('high', 87, ['abnormal results', 'review needed'], true),
  },
  {
    id: 'c3',
    name: 'Robert Fassett',
    avatar: 'assets/img/users/user-04.jpg',
    lastMessage: 'Here are some of the vendor proposals for new equipment',
    time: 'yesterday',
    unreadCount: 0,
    isOnline: true,
    analysis: buildAnalysis('low', 75, [], false),
  },
  {
    id: 'c4',
    name: 'Andrew Fletcher',
    avatar: 'assets/img/users/user-05.jpg',
    lastMessage: 'Use tools like Trello to track project milestones',
    time: 'yesterday',
    isOnline: false,
    analysis: buildAnalysis('low', 72, [], false),
  },
  {
    id: 'c5',
    name: 'Tyron Derby',
    avatar: '',
    initials: 'TD',
    initialsClass: 'badge-soft-purple fw-semibold',
    lastMessage: "Pre-authorization denied for cardiac procedure — appeal ASAP",
    time: '12:55 PM',
    unreadCount: 1,
    isOnline: false,
    analysis: buildAnalysis('high', 82, ['denied', 'asap'], true),
  },
  {
    id: 'c6',
    name: 'Anna Johnson',
    avatar: 'assets/img/users/user-06.jpg',
    lastMessage: 'Shift handoff notes are ready for tonight',
    time: '12:54 PM',
    isOnline: true,
    analysis: buildAnalysis('medium', 68, [], false),
  },
  {
    id: 'c7',
    name: 'Emily Davis',
    avatar: 'assets/img/users/user-07.jpg',
    lastMessage: 'Sure, I can help with the patient referral paperwork',
    time: '11:47 PM',
    isOnline: false,
    analysis: buildAnalysis('medium', 65, ['referral'], false),
  },
  {
    id: 'c8',
    name: 'Susan Denton',
    avatar: 'assets/img/users/user-08.jpg',
    lastMessage: "I'll share the meeting notes shortly — FYI only",
    time: '10:43 PM',
    isOnline: false,
    analysis: buildAnalysis('low', 75, [], false),
  },
  {
    id: 'c9',
    name: 'David Cruz',
    avatar: 'assets/img/users/user-09.jpg',
    lastMessage: 'Let me know if you need anything else for the audit',
    time: '10:43 PM',
    isOnline: false,
    analysis: buildAnalysis('low', 70, [], false),
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', text: 'Hey mark! Did you check out the new logo design?', sender: 'Mark Smith', time: '02:39 PM', isMe: false },
    { id: 'm2', text: 'Not yet. Can you send it here?', sender: 'You', time: '02:39 PM', isMe: true },
    { id: 'm3', text: 'Sure! Please check the below logo Attached!!!', sender: 'Mark Smith', time: '02:39 PM', isMe: false },
    { id: 'm4', text: 'Looks clean! I like the font. Maybe try a slightly darker blue?', sender: 'You', time: '10:00 AM', isMe: true },
    { id: 'm5', text: 'Perfect! That layout will work great on the landing page. 👍', sender: 'Mark Smith', time: '10:05 AM', isMe: false },
    { id: 'm6', text: 'Perfect It looks Great!!!', sender: 'You', time: '10:00 AM', isMe: true },
    { id: 'm7', text: 'URGENT: Patient in Room 302 needs immediate assistance!', sender: 'Mark Smith', time: '10:15 AM', isMe: false },
  ],
  c2: [
    { id: 'e1', text: 'Good morning, do you have a moment to review some lab work?', sender: 'Eugene Sikora', time: '08:00 AM', isMe: false },
    { id: 'e2', text: 'Sure, send them over.', sender: 'You', time: '08:05 AM', isMe: true },
    { id: 'e3', text: 'Lab results for patient Wilson are abnormal — review needed', sender: 'Eugene Sikora', time: '08:26 AM', isMe: false },
  ],
};

// ── Dropdown menu for messages (DRY helper) ──

const MessageDropdown = () => (
  <ul className="dropdown-menu p-2">
    {[
      { icon: 'ti-heart', label: 'Reply' },
      { icon: 'ti-pinned', label: 'Forward' },
      { icon: 'ti-file-export', label: 'Copy' },
      { icon: 'ti-heart', label: 'Mark as Favourite' },
      { icon: 'ti-trash', label: 'Delete' },
      { icon: 'ti-check', label: 'Mark as Unread' },
      { icon: 'ti-box-align-right', label: 'Archive Chat' },
      { icon: 'ti-pinned', label: 'Pin Chat' },
    ].map((item) => (
      <li key={item.label}>
        <Link className="dropdown-item" to="#">
          <i className={`ti ${item.icon} me-1`} />
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

// ══════════════════════════════════════════════
// Chat Component
// ══════════════════════════════════════════════

const Chat = () => {
  const [showSmartComposer, setShowSmartComposer] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const activeContact = useMemo(
    () => MOCK_CONTACTS.find(c => c.id === activeContactId) ?? MOCK_CONTACTS[0],
    [activeContactId]
  );

  const activeMessages = useMemo(
    () => MOCK_MESSAGES[activeContactId] ?? [],
    [activeContactId]
  );

  // Detect urgency of the last incoming message for quick-reply suggestions
  const lastIncomingUrgency = useMemo<UrgencyLevel>(() => {
    const lastIncoming = [...activeMessages].reverse().find(m => !m.isMe);
    if (!lastIncoming) return 'normal';
    return detectUrgency(lastIncoming.text);
  }, [activeMessages]);

  const handleSendSmartMessage = useCallback((content: string, _recipients: string[]) => {
    setShowSmartComposer(false);
  }, []);

  const handleQuickReply = useCallback((text: string) => {
    setMessageInput(text);
    setShowQuickReplies(false);
  }, []);

  const handleContactClick = useCallback((id: string) => {
    setActiveContactId(id);
    setShowQuickReplies(false);
    setMessageInput('');
  }, []);

  // Sort contacts: critical/high first
  const sortedContacts = useMemo(() => {
    const order: Record<EmailPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...MOCK_CONTACTS].sort((a, b) => order[a.analysis.priority] - order[b.analysis.priority]);
  }, []);

  return (
    <>
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3">
          <div className="flex-grow-1">
            <h4 className="fs-18 fw-semibold mb-0">Chat</h4>
          </div>
          <div className="text-end">
            <ol className="breadcrumb m-0 py-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.dashboard}>Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="#">Applications</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Chat
              </li>
            </ol>
          </div>
        </div>

        <div className="card shadow-none mb-0">
          <div className="card-body p-0">
            <div className="d-md-flex">

              {/* ═══ SIDEBAR — Contact List ═══ */}
              <div className="chat-user-nav">
                <div>
                  <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar me-2 flex-shrink-0">
                        <ImageWithBasePath src="assets/img/users/user-01.jpg" alt="user" />
                      </span>
                      <div>
                        <h6 className="fs-14 mb-1">James Hong</h6>
                        <p className="mb-0">Admin</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className={`btn p-2 ${showSmartComposer ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setShowSmartComposer(!showSmartComposer)}
                        title="AI-Powered Smart Compose"
                      >
                        <i className="ti ti-sparkles" />
                      </button>
                      <Link to="#" className="btn p-2 btn-primary" title="New Chat">
                        <i className="ti ti-plus" />
                      </Link>
                    </div>
                  </div>

                  {/* AI Smart Compose Panel */}
                  {showSmartComposer && (
                    <div className="p-3 border-bottom bg-light">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-sparkles text-warning me-2" />
                        <h6 className="mb-0 fs-14">AI Smart Compose</h6>
                      </div>
                      <SmartMessageRouter
                        onSend={handleSendSmartMessage}
                        placeholder="Type your message... AI will analyze urgency and suggest routing"
                      />
                    </div>
                  )}

                  <div>
                    <div className="input-group w-auto input-group-flat p-4 pb-0">
                      <span className="input-group-text border-end-0">
                        <i className="ti ti-search" />
                      </span>
                      <input type="text" className="form-control" placeholder="Search Keyword" />
                    </div>
                    <OverlayScrollbarsComponent
                      style={{ maxHeight: "calc(100vh - 18rem)" }}
                      className="chat-users p-4"
                    >
                      <h6 className="mb-3">All Messages</h6>

                      {sortedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`chat-contact-item d-flex align-items-center justify-content-between rounded p-3 user-list mb-1 ${activeContactId === contact.id ? 'active' : ''}`}
                          style={{ borderLeftColor: PRIORITY_BORDERS[contact.analysis.priority] }}
                          onClick={() => handleContactClick(contact.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => { if (e.key === 'Enter') handleContactClick(contact.id); }}
                        >
                          <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                            {contact.initials ? (
                              <Link to="#" className={`avatar me-2 flex-shrink-0 ${contact.initialsClass || ''}`}>
                                {contact.initials}
                              </Link>
                            ) : (
                              <Link to="#" className="avatar me-2 flex-shrink-0">
                                <ImageWithBasePath src={contact.avatar} alt="user" />
                              </Link>
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div className="d-flex align-items-center gap-1 mb-1">
                                <h6 className="fs-14 mb-0 text-truncate">
                                  <Link to="#">{contact.name}</Link>
                                </h6>
                                <EmailPriorityBadge analysis={contact.analysis} showLabel={false} />
                              </div>
                              <p className="mb-0 text-truncate" style={{ maxWidth: 160 }}>
                                {contact.lastMessage}
                              </p>
                              {/* Urgency badges + Action Required */}
                              <div className="d-flex flex-wrap gap-1 mt-1">
                                {contact.analysis.requiresAction && (
                                  <span className="email-badge-action">Action Required</span>
                                )}
                                {contact.analysis.urgencyIndicators.slice(0, 2).map((ind, idx) => (
                                  <span key={idx} className="email-badge-urgency">{ind}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-end flex-shrink-0 ms-2">
                            <span className="text-dark d-block mb-1" style={{ fontSize: 12 }}>{contact.time}</span>
                            {contact.unreadCount ? (
                              <span className="badge ms-auto bg-danger rounded-circle message-count">
                                {contact.unreadCount}
                              </span>
                            ) : (
                              <span className="d-block text-success">
                                <i className="ti ti-checks" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </OverlayScrollbarsComponent>
                  </div>
                </div>
              </div>

              {/* ═══ MAIN — Conversation Area ═══ */}
              <div className="flex-fill chat-messages">
                <div className="card border-0 mb-0">

                  {/* ── Conversation Header ── */}
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3 p-3">
                    <div className="d-flex align-items-center">
                      <span className="avatar me-2 flex-shrink-0">
                        {activeContact.initials ? (
                          <span className={activeContact.initialsClass}>{activeContact.initials}</span>
                        ) : (
                          <ImageWithBasePath src={activeContact.avatar} alt="user" />
                        )}
                      </span>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fs-14 fw-semibold mb-0">{activeContact.name}</h6>
                          <EmailPriorityBadge analysis={activeContact.analysis} showLabel />
                        </div>
                        <p className="mb-0 d-inline-flex align-items-center">
                          {activeContact.isOnline ? (
                            <><i className="ti ti-point-filled text-success" /> Online</>
                          ) : (
                            <><i className="ti ti-point-filled text-secondary" /> Offline</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="gap-2 d-flex align-items-center flex-wrap">
                      {/* Smart Actions (ported from Email) */}
                      {activeContact.analysis.requiresAction && (
                        <>
                          <button className="btn btn-sm btn-outline-danger" title="Escalate to supervisor">
                            <i className="ti ti-alert-triangle me-1" /> Escalate
                          </button>
                          <button className="btn btn-sm btn-outline-primary" title="Assign to team member">
                            <i className="ti ti-user-plus me-1" /> Assign
                          </button>
                        </>
                      )}
                      <Link to="voice-call.html" className="btn btn-icon btn-light" title="Voice Call">
                        <i className="ti ti-phone" />
                      </Link>
                      <Link to="video-call.html" className="btn btn-icon btn-light" title="Video Call">
                        <i className="ti ti-video" />
                      </Link>
                      <Link to="#" className="btn btn-icon btn-light" title="Info">
                        <i className="ti ti-info-circle" />
                      </Link>
                      <Link to="#" className="btn btn-icon btn-light close-chat d-md-none">
                        <i className="ti ti-x" />
                      </Link>
                    </div>
                  </div>

                  {/* ── AI Analysis Banner (ported from Email detail) ── */}
                  {(activeContact.analysis.priority === 'critical' || activeContact.analysis.priority === 'high') && (
                    <div className="chat-ai-banner">
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        <EmailPriorityBadge analysis={activeContact.analysis} showDetails showLabel />
                        <span className="chat-ai-sep">|</span>
                        <span className="chat-ai-meta">
                          <strong>Response:</strong> {activeContact.analysis.estimatedResponseTime}
                        </span>
                        <span className="chat-ai-sep">|</span>
                        <span className="chat-ai-meta">
                          <strong>Confidence:</strong> {activeContact.analysis.confidence}%
                        </span>
                      </div>
                      {activeContact.analysis.urgencyIndicators.length > 0 && (
                        <div className="d-flex align-items-center flex-wrap gap-1 mt-2">
                          <span className="chat-ai-kw-label">Keywords:</span>
                          {activeContact.analysis.urgencyIndicators.map((ind, idx) => (
                            <span key={idx} className="chat-ai-kw-chip">{ind}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Messages ── */}
                  <div className="card-body p-0">
                    <OverlayScrollbarsComponent style={{ maxHeight: "calc(100vh - 22rem)" }} className="message-body p-4">

                      {activeMessages.map((msg) => {
                        const msgUrgency = !msg.isMe ? detectUrgency(msg.text) : 'normal';

                        return msg.isMe ? (
                          /* ── Sent message ── */
                          <div key={msg.id} className="chat-list ms-auto mb-3">
                            <div className="d-flex align-items-start justify-content-end">
                              <div>
                                <div className="d-flex align-items-center justify-content-end mb-1">
                                  <p className="mb-0 d-inline-flex align-items-center">
                                    <i className="ti ti-checks text-success me-1" />
                                    {msg.time}
                                    <i className="ti ti-point-filled mx-2" />
                                  </p>
                                  <h6 className="fs-14 fw-semibold mb-0">You</h6>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="me-2">
                                    <Link to="#" data-bs-toggle="dropdown">
                                      <i className="ti ti-dots-vertical" />
                                    </Link>
                                    <MessageDropdown />
                                  </div>
                                  <div className="message-box sent-message p-3">
                                    <p className="mb-0 fs-16">{msg.text}</p>
                                  </div>
                                </div>
                              </div>
                              <span className="avatar ms-2 online flex-shrink-0">
                                <ImageWithBasePath src="assets/img/users/user-11.jpg" alt="user" />
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* ── Received message ── */
                          <div key={msg.id} className="chat-list mb-3">
                            <div className="d-flex align-items-start">
                              <span className="avatar online me-2 flex-shrink-0">
                                {activeContact.initials ? (
                                  <span className={activeContact.initialsClass}>{activeContact.initials}</span>
                                ) : (
                                  <ImageWithBasePath src={activeContact.avatar} alt="user" />
                                )}
                              </span>
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <h6 className="fs-14 mb-0">{msg.sender}</h6>
                                  <p className="mb-0 d-inline-flex align-items-center">
                                    <i className="ti ti-point-filled mx-2" />
                                    {msg.time}
                                  </p>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="message-box receive-message p-3"
                                    style={
                                      msgUrgency === 'critical' ? { borderLeft: `3px solid ${PRIORITY_BORDERS.critical}` } :
                                      msgUrgency === 'high' ? { borderLeft: `3px solid ${PRIORITY_BORDERS.high}` } :
                                      undefined
                                    }
                                  >
                                    <p className="mb-0 fs-16">{msg.text}</p>
                                    {/* Inline urgency indicator on message */}
                                    {msgUrgency !== 'normal' && (
                                      <div className="mt-2">
                                        <MessageUrgencyIndicator message={msg.text} showLabel />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ms-2">
                                    <Link to="#" data-bs-toggle="dropdown">
                                      <i className="ti ti-dots-vertical" />
                                    </Link>
                                    <MessageDropdown />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    </OverlayScrollbarsComponent>

                    {/* ── Message Footer ── */}
                    <div className="message-footer border-top p-3">

                      {/* AI Urgency Indicator for typed message */}
                      {messageInput && (
                        <div className="mb-2">
                          <MessageUrgencyIndicator message={messageInput} showLabel />
                        </div>
                      )}

                      {/* AI-Suggested Quick Replies (ported from Email quick responses) */}
                      {lastIncomingUrgency !== 'normal' && (
                        <div className="chat-quick-replies mb-2">
                          <div className="d-flex align-items-center gap-1 mb-1">
                            <i className="ti ti-sparkles text-warning" style={{ fontSize: 13 }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Suggested Replies</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1">
                            {QUICK_RESPONSES[lastIncomingUrgency].map((response, idx) => (
                              <button
                                key={idx}
                                className="chat-quick-reply-btn"
                                onClick={() => handleQuickReply(response)}
                              >
                                {response}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="d-flex align-items-center">
                        <div className="flex-fill">
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Type Something..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                          />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-icon btn-outline-warning"
                            onClick={() => setShowSmartComposer(!showSmartComposer)}
                            title="AI Smart Compose"
                          >
                            <i className="ti ti-sparkles" />
                          </button>
                          <Link to="#" className="btn btn-icon btn-light">
                            <i className="ti ti-photo-plus" />
                          </Link>
                          <Link to="#" className="btn btn-icon btn-light">
                            <i className="ti ti-mood-smile-beam" />
                          </Link>
                          <div>
                            <Link to="#" className="btn btn-icon btn-outline-light" data-bs-toggle="dropdown" aria-label="more options">
                              <i className="ti ti-dots-vertical" />
                            </Link>
                            <ul className="dropdown-menu p-2">
                              <li><Link to="#" className="dropdown-item"><i className="ti ti-camera-selfie me-2" />Camera</Link></li>
                              <li><Link to="#" className="dropdown-item"><i className="ti ti-photo-up me-2" />Gallery</Link></li>
                              <li><Link to="#" className="dropdown-item"><i className="ti ti-music me-2" />Audio</Link></li>
                              <li><Link to="#" className="dropdown-item"><i className="ti ti-map-pin-share me-2" />Location</Link></li>
                              <li><Link to="#" className="dropdown-item"><i className="ti ti-user-check me-2" />Contact</Link></li>
                            </ul>
                          </div>
                          <button className="btn btn-primary">
                            <i className="ti ti-send" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-center bg-white p-2 border-top">
        <p className="text-dark mb-0">
          2025 ©{" "}
          <Link to="#" className="link-primary">Symplify</Link>
          , All Rights Reserved
        </p>
      </div>
    </div>
    </>
  );
};

export default Chat;
