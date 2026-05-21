// AIAssistantWidget — self-contained shell around <AIAssistantPopup>.
//
// Owns the open/closed state and renders the bottom-right floating action
// button (FAB) trigger described in the mockup's #aiFab block. Parents that
// need to control open state externally can still use <AIAssistantPopup>
// directly; this widget is for the common "drop it anywhere" case.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import AIAssistantPopup, {
  type AIAssistantPopupProps,
} from './assistant/AIAssistantPopup';

export interface AIAssistantWidgetProps
  extends Omit<AIAssistantPopupProps, 'isOpen' | 'onClose'> {
  /** Open on mount. Default false. */
  defaultOpen?: boolean;
  /** Notified whenever the popup opens or closes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Hide the built-in FAB trigger (e.g. when a custom trigger lives elsewhere). */
  hideTrigger?: boolean;
  /** Accessible label for the FAB. Defaults to 'Open AI Assistant'. */
  triggerLabel?: string;
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  defaultOpen = false,
  onOpenChange,
  hideTrigger = false,
  triggerLabel = 'Open AI Assistant',
  ...popupProps
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const fabRef = useRef<HTMLButtonElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setIsOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  // Return focus to the FAB when the popup closes (a11y).
  useEffect(() => {
    if (!isOpen) fabRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      {!hideTrigger && (
        <button
          ref={fabRef}
          type="button"
          className="ai-assistant-fab btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => setOpen(!isOpen)}
          aria-label={triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="ai-assistant-popup"
          hidden={isOpen}
        >
          <i className="ti ti-robot fs-20" aria-hidden="true" />
        </button>
      )}

      <AIAssistantPopup
        {...popupProps}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default AIAssistantWidget;
