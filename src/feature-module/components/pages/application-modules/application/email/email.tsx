/* eslint-disable */
import { Link } from "react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import ImageWithBasePath from "../../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../../routes/all_routes";
import { EmailPriorityBadge, EmailSidebarAI } from "../../../../../ai";
import { getMockEmails, categorizeEmail, getFolderCounts } from "../../../../../../core/api/mock/emailMockApi";
import { AnalyzedEmail, EmailFolder, EmailPriority } from "../../../../../../core/ai/emailTypes";

// Format relative time with >24h absolute threshold
const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

// Priority border colors
const PRIORITY_BORDERS: Record<EmailPriority, string> = {
  critical: '#DC2626',
  high: '#F97316',
  medium: '#EAB308',
  low: '#22C55E'
};

interface EmailWithFolders extends AnalyzedEmail {
  folders: EmailFolder[];
}

const Email = () => {
  const [emails, setEmails] = useState<EmailWithFolders[]>([]);
  const [activeFolder, setActiveFolder] = useState<EmailFolder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailWithFolders | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Load emails on mount
  useEffect(() => {
    setLoading(true);
    const mockEmails = getMockEmails();
    const emailsWithFolders: EmailWithFolders[] = mockEmails.map(email => ({
      ...email,
      folders: categorizeEmail(email.subject, email.preview)
    }));
    emailsWithFolders.sort((a, b) => {
      const priorityOrder: Record<EmailPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.analysis.priority] - priorityOrder[b.analysis.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    setEmails(emailsWithFolders);
    setLoading(false);
  }, []);

  // Folder counts
  const folderCounts = useMemo(() => {
    return getFolderCounts(emails.map(e => ({ folders: e.folders, read: e.read })));
  }, [emails]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    let filtered = emails;
    if (activeFolder !== 'inbox') {
      filtered = filtered.filter(email => email.folders.includes(activeFolder));
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(search) ||
        email.preview.toLowerCase().includes(search) ||
        email.sender.name.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [emails, activeFolder, searchTerm]);

  // Statistics
  const stats = useMemo(() => ({
    total: filteredEmails.length,
    unread: filteredEmails.filter(e => !e.read).length,
    critical: filteredEmails.filter(e => e.analysis.priority === 'critical' && !e.read).length
  }), [filteredEmails]);

  const handleEmailClick = useCallback((email: EmailWithFolders) => {
    setSelectedEmail(email);
    setMobileView('detail');
    setEmails(prev => prev.map(e =>
      e.id === email.id ? { ...e, read: true } : e
    ));
  }, []);

  const handleBack = useCallback(() => {
    setSelectedEmail(null);
    setMobileView('list');
  }, []);

  const handleToggleStar = useCallback((emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  }, []);

  const handleToggleSelect = useCallback((emailId: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(emailId)) next.delete(emailId);
      else next.add(emailId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredEmails.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmails.map(e => e.id)));
    }
  }, [filteredEmails, selectedIds]);

  const handleBatchDelete = useCallback(() => {
    setEmails(prev => prev.filter(e => !selectedIds.has(e.id)));
    setSelectedIds(new Set());
    if (selectedEmail && selectedIds.has(selectedEmail.id)) {
      setSelectedEmail(null);
      setMobileView('list');
    }
  }, [selectedIds, selectedEmail]);

  const handleBatchRead = useCallback(() => {
    setEmails(prev => prev.map(e =>
      selectedIds.has(e.id) ? { ...e, read: true } : e
    ));
    setSelectedIds(new Set());
  }, [selectedIds]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two p-0">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="email-sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <div className="email-layout">
            {/* ═══ SIDEBAR ═══ */}
            <aside className={`email-sidebar-panel ${sidebarOpen ? 'open' : ''}`}>
              <div className="email-sidebar-inner">
                {/* Mobile close button */}
                <button
                  className="email-sidebar-close"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <i className="ti ti-x" />
                </button>

                <div className="email-profile-card">
                  <Link to="#" className="avatar avatar-md flex-shrink-0 me-2">
                    <ImageWithBasePath
                      src="assets/img/profiles/avatar-02.jpg"
                      className="rounded-circle"
                      alt="Img"
                    />
                  </Link>
                  <div className="email-profile-info">
                    <h6 className="mb-0 fw-medium">James Hong</h6>
                    <span className="email-profile-addr">Jnh343@example.com</span>
                  </div>
                </div>

                <Link
                  to="#"
                  className="btn btn-primary email-compose-btn w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#email-view"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="ti ti-edit me-2" />
                  Compose
                </Link>

                <EmailSidebarAI
                  folderCounts={folderCounts}
                  activeFolder={activeFolder}
                  onFolderChange={(f) => { setActiveFolder(f); setSidebarOpen(false); }}
                />

                <div className="email-standard-folders">
                  <h6 className="email-folder-heading">Standard Folders</h6>
                  <div className="email-folder-list">
                    {[
                      { icon: 'ti-star', label: 'Starred', count: emails.filter(e => e.starred).length },
                      { icon: 'ti-rocket', label: 'Sent', count: 14 },
                      { icon: 'ti-file', label: 'Drafts', count: 12 },
                      { icon: 'ti-trash', label: 'Deleted', count: 8 },
                    ].map(f => (
                      <button
                        key={f.label}
                        className="email-folder-item"
                        tabIndex={0}
                        aria-label={`${f.label} folder, ${f.count} items`}
                      >
                        <span className="email-folder-label">
                          <i className={`ti ${f.icon}`} />
                          {f.label}
                        </span>
                        <span className="email-folder-count">{f.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ═══ EMAIL LIST ═══ */}
            <section
              className={`email-list-panel ${mobileView === 'detail' ? 'mobile-hidden' : ''}`}
              role="region"
              aria-label="Email list"
            >
              {/* List header */}
              <div className="email-list-header">
                <div className="email-list-header-top">
                  <div className="email-list-header-left">
                    <button
                      className="email-hamburger"
                      onClick={() => setSidebarOpen(true)}
                      aria-label="Open folders"
                    >
                      <i className="ti ti-menu-2" />
                    </button>
                    <h5 className="email-list-title">
                      <i className="ti ti-sparkles text-warning" />
                      Inbox
                    </h5>
                  </div>
                  <div className="email-list-stats">
                    <span>{stats.total}</span>
                    <span className="email-stat-divider">·</span>
                    <span>{stats.unread} unread</span>
                    {stats.critical > 0 && (
                      <>
                        <span className="email-stat-divider">·</span>
                        <span className="email-stat-critical">{stats.critical} critical</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="email-list-header-bottom">
                  <div className="email-search-bar">
                    <i className="ti ti-search" />
                    <input
                      type="text"
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      aria-label="Search emails"
                    />
                  </div>
                  <button
                    className="email-refresh-btn"
                    title="Refresh"
                    aria-label="Refresh inbox"
                  >
                    <i className="ti ti-refresh" />
                  </button>
                </div>

                {/* Batch actions bar */}
                {selectedIds.size > 0 && (
                  <div className="email-batch-bar">
                    <span className="email-batch-count">{selectedIds.size} selected</span>
                    <div className="email-batch-actions">
                      <button onClick={handleBatchRead} aria-label="Mark selected as read" title="Mark as read">
                        <i className="ti ti-mail-opened" />
                        <span>Read</span>
                      </button>
                      <button onClick={handleBatchDelete} aria-label="Delete selected" title="Delete">
                        <i className="ti ti-trash" />
                        <span>Delete</span>
                      </button>
                      <button onClick={() => setSelectedIds(new Set())} aria-label="Clear selection">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Select-all row */}
                <div className="email-select-all-row">
                  <label className="email-select-all-label">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.size === filteredEmails.length && filteredEmails.length > 0}
                      onChange={handleSelectAll}
                      aria-label="Select all emails"
                    />
                    <span>Select all</span>
                  </label>
                </div>
              </div>

              {/* Email list items */}
              <div className="email-list-scroll" role="list">
                {loading ? (
                  <div className="email-list-empty">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredEmails.length === 0 ? (
                  <div className="email-list-empty">
                    <i className="ti ti-inbox-off" />
                    <p>No emails in this folder</p>
                  </div>
                ) : (
                  filteredEmails.map(email => (
                    <div
                      key={email.id}
                      className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${!email.read ? 'unread' : ''} ${selectedIds.has(email.id) ? 'checked' : ''}`}
                      style={{ borderLeftColor: PRIORITY_BORDERS[email.analysis.priority] }}
                      onClick={() => handleEmailClick(email)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEmailClick(email); } }}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${!email.read ? 'Unread: ' : ''}${email.sender.name} — ${email.subject}`}
                      aria-selected={selectedEmail?.id === email.id}
                    >
                      <div className="email-item-start">
                        <input
                          type="checkbox"
                          className="form-check-input email-item-checkbox"
                          checked={selectedIds.has(email.id)}
                          onChange={(e) => handleToggleSelect(email.id, e)}
                          onClick={e => e.stopPropagation()}
                          aria-label={`Select ${email.sender.name}`}
                        />
                        <button
                          className={`email-item-star ${email.starred ? 'starred' : ''}`}
                          onClick={(e) => handleToggleStar(email.id, e)}
                          aria-label={email.starred ? 'Unstar' : 'Star'}
                        >
                          <i className={`ti ti-star${email.starred ? '-filled' : ''}`} />
                        </button>
                        <EmailPriorityBadge analysis={email.analysis} showLabel={false} />
                      </div>

                      <div className="email-item-body">
                        <div className="email-item-row1">
                          <span className={`email-item-sender ${!email.read ? 'fw-bold' : ''}`}>
                            {email.sender.name}
                            {email.sender.isInternal && (
                              <span className="email-internal-badge">Internal</span>
                            )}
                          </span>
                          <span className="email-item-time">{formatTimeAgo(email.timestamp)}</span>
                        </div>
                        <span className={`email-item-subject ${!email.read ? 'fw-semibold' : ''}`}>
                          {email.subject}
                        </span>
                        <span className="email-item-preview">{email.preview}</span>
                        <div className="email-item-badges">
                          {email.hasAttachments && (
                            <span className="email-badge-attach">
                              <i className="ti ti-paperclip" /> Attachment
                            </span>
                          )}
                          {email.analysis.requiresAction && (
                            <span className="email-badge-action">Action Required</span>
                          )}
                          {email.analysis.urgencyIndicators.slice(0, 2).map((ind, idx) => (
                            <span key={idx} className="email-badge-urgency">{ind}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ═══ EMAIL DETAIL ═══ */}
            <section
              className={`email-detail-panel ${mobileView === 'detail' ? 'mobile-visible' : ''} ${selectedEmail ? 'has-content' : ''}`}
              role="region"
              aria-label="Email detail"
            >
              {selectedEmail ? (
                <div className="email-detail-inner">
                  {/* Detail header */}
                  <div className="email-detail-toolbar">
                    <button className="email-back-btn" onClick={handleBack} aria-label="Back to list">
                      <i className="ti ti-arrow-left" />
                      <span>Back</span>
                    </button>
                    <div className="email-detail-action-group">
                      <button className="email-detail-action" aria-label="Reply">
                        <i className="ti ti-arrow-back-up" />
                        <span>Reply</span>
                      </button>
                      <button className="email-detail-action" aria-label="Forward">
                        <i className="ti ti-arrow-forward-up" />
                        <span>Forward</span>
                      </button>
                      <button className="email-detail-action danger" aria-label="Delete">
                        <i className="ti ti-trash" />
                      </button>
                    </div>
                  </div>

                  {/* Detail content */}
                  <div className="email-detail-content">
                    {/* AI Analysis Banner */}
                    <div className="email-ai-banner">
                      <div className="email-ai-banner-row">
                        <EmailPriorityBadge analysis={selectedEmail.analysis} showDetails showLabel />
                        <span className="email-ai-sep">|</span>
                        <span className="email-ai-meta">
                          <strong>Response:</strong> {selectedEmail.analysis.estimatedResponseTime}
                        </span>
                        <span className="email-ai-sep">|</span>
                        <span className="email-ai-meta">
                          <strong>Confidence:</strong> {selectedEmail.analysis.confidence}%
                        </span>
                      </div>
                      {selectedEmail.analysis.urgencyIndicators.length > 0 && (
                        <div className="email-ai-keywords">
                          <span className="email-ai-keywords-label">Keywords:</span>
                          {selectedEmail.analysis.urgencyIndicators.map((ind, idx) => (
                            <span key={idx} className="email-ai-keyword-chip">{ind}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h4 className="email-detail-subject">{selectedEmail.subject}</h4>

                    {/* Sender info */}
                    <div className="email-sender-block">
                      <div
                        className="email-sender-avatar"
                        aria-hidden="true"
                      >
                        {selectedEmail.sender.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="email-sender-info">
                        <h6 className="email-sender-name">{selectedEmail.sender.name}</h6>
                        <span className="email-sender-email">{selectedEmail.sender.email}</span>
                        {selectedEmail.sender.department && (
                          <span className="email-sender-dept">{selectedEmail.sender.department}</span>
                        )}
                      </div>
                      <span className="email-detail-timestamp">
                        {new Date(selectedEmail.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="email-body-block">
                      {selectedEmail.body.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>
                          {paragraph.split('\n').map((line, lidx, arr) => (
                            <span key={lidx}>
                              {line}
                              {lidx < arr.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      ))}
                    </div>

                    {/* Attachments */}
                    {selectedEmail.hasAttachments && selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                      <div className="email-attachments-block">
                        <h6>
                          <i className="ti ti-paperclip" /> Attachments ({selectedEmail.attachments.length})
                        </h6>
                        {selectedEmail.attachments.map((att, idx) => (
                          <div className="email-attachment-item" key={idx}>
                            <i className={`ti ${att.icon}`} />
                            <div>
                              <span className="email-attachment-name">{att.name}</span>
                              <span className="email-attachment-size">{att.size}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="email-detail-empty">
                  <i className="ti ti-mail-opened" />
                  <p>Select an email to view</p>
                </div>
              )}
            </section>
          </div>

          {/* ═══ MOBILE COMPOSE FAB ═══ */}
          <button
            className="email-compose-fab"
            data-bs-toggle="modal"
            data-bs-target="#email-view"
            aria-label="Compose email"
          >
            <i className="ti ti-edit" />
          </button>
        </div>
      </div>

      {/* Compose Modal */}
      <div className="modal fade" id="email-view" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Compose Email</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">To</label>
                <input type="email" className="form-control" placeholder="recipient@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Subject</label>
                <input type="text" className="form-control" placeholder="Email subject" />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows={6} placeholder="Type your message..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">
                <i className="ti ti-send me-1" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Email;
