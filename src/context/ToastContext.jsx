import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, X, Info } from "lucide-react";

const ToastContext = createContext(null);

let idSeq = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, variant = "success") => {
      const id = idSeq++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      timers.current[id] = setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const api = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-5 inset-x-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const variantStyles = {
    success: { bg: "bg-ink text-paper", icon: <CheckCircle2 size={17} className="text-primary-light shrink-0" /> },
    error: { bg: "bg-rose text-white", icon: <XCircle size={17} className="text-white shrink-0" /> },
    info: { bg: "bg-ink text-paper", icon: <Info size={17} className="text-sky shrink-0" /> },
  };
  const style = variantStyles[toast.variant] || variantStyles.success;

  return (
    <div
      className={`pointer-events-auto animate-slideUp ${style.bg} rounded-xl shadow-modal px-4 py-3 flex items-center gap-3 min-w-[260px] max-w-md`}
      role="status"
    >
      {style.icon}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition shrink-0" aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
