import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const VARIANTS = {
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-700",
    icon: AlertCircle,
  },
  success: {
    wrapper: "border-forest-200 bg-forest-50 text-forest-800",
    icon: CheckCircle2,
  },
};

export default function Alert({ variant = "error", children }) {
  const { wrapper, icon: Icon } = VARIANTS[variant];

  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${wrapper}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
