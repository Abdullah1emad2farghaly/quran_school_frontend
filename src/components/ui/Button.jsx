import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({ children, isLoading, disabled, className = "", ...rest }) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl
        bg-forest-800 px-6 py-3.5 text-base font-semibold text-white
        shadow-sm transition-all duration-150
        hover:bg-forest-700 active:bg-forest-900
        disabled:cursor-not-allowed disabled:opacity-70
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2
        ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 size={20} className="animate-spin" aria-hidden="true" />}
      <span>{isLoading ? "جاري تسجيل الدخول..." : children}</span>
    </button>
  );
}
