import React, { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";

export default function FilterPopover({ filters, values, onChange, onApply, onReset, activeCount = 0 }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`h-10 px-4 rounded-lg border text-sm font-semibold inline-flex items-center gap-2 transition ${
          activeCount > 0 ? "border-primary text-primary bg-primary-soft" : "border-line text-ink-soft hover:bg-line-soft"
        }`}
      >
        <SlidersHorizontal size={15} />
        {t.common.filter}
        {activeCount > 0 && (
          <span className="bg-primary text-white rounded-full text-[11px] w-4.5 h-4.5 min-w-[18px] flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-72 bg-paper-raised border border-line rounded-xl shadow-raised p-4 z-30 animate-fadeIn">
          <div className="space-y-3.5">
            {filters.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-ink-soft mb-1.5">{f.label}</label>
                <select
                  value={values[f.key] ?? "all"}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-line bg-white text-sm focus:border-primary"
                >
                  <option value="all">{t.common.all}</option>
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-line">
            <button onClick={onReset} className="text-xs font-semibold text-ink-faint hover:text-rose transition">
              {t.common.clearAll}
            </button>
            <button
              onClick={() => {
                onApply();
                setOpen(false);
              }}
              className="h-8 px-3.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition"
            >
              {t.common.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
