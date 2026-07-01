import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import Modal from "../components/admin/common/Modal";
import Button from "../components/admin/common/Button";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const { t } = useI18n();
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    ({ title, body, confirmLabel, variant = "danger" } = {}) => {
      setState({
        title: title || t.common.confirmDeleteTitle,
        body: body || t.common.confirmDeleteBody,
        confirmLabel: confirmLabel || t.common.delete,
        variant,
      });
      return new Promise((resolve) => {
        resolver.current = resolve;
      });
    },
    [t]
  );

  const handleClose = (result) => {
    setState(null);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => handleClose(false)} title="" size="sm">
        {state && (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-rose-soft text-rose flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-base font-bold text-ink mb-1.5">{state.title}</h3>
            <p className="text-sm text-ink-faint leading-relaxed mb-6">{state.body}</p>
            <div className="flex items-center justify-center gap-2.5">
              <Button variant="secondary" onClick={() => handleClose(false)}>
                {t.common.cancel}
              </Button>
              <Button variant={state.variant === "danger" ? "danger" : "primary"} onClick={() => handleClose(true)}>
                {state.confirmLabel}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
