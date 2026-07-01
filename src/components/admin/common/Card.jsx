import React from "react";

export default function Card({ children, className = "", padding = true, title, subtitle, headerActions }) {
  return (
    <div className={`bg-paper-raised pt-4 border border-line rounded-2xl ${className}`}>
      {(title || headerActions) && (
        <div className="flex items-center justify-between gap-3 px-5 pt-4.5 pb-3.5 border-b border-line">
          <div>
            {title && <h3 className="text-[15px] font-bold text-ink">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-faint mt-0.5">{subtitle}</p>}
          </div>
          {headerActions}
        </div>
      )}
      <div className={padding ? "p-5" : ""}>{children}</div>
    </div>
  );
}
