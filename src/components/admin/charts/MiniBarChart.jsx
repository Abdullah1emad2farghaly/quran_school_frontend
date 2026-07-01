import React from "react";

export default function MiniBarChart({ data, valueKey = "count", labelKey = "label" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-44 px-1">
      {data.map((d, i) => {
        const heightPct = Math.max(6, Math.round((d[valueKey] / max) * 100));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex items-end justify-center h-36">
              <div
                className="w-full max-w-[34px] rounded-t-md bg-primary/15 group-hover:bg-primary/25 transition-all relative"
                style={{ height: `${heightPct}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-md bg-primary" />
                <span className="absolute -top-6 inset-x-0 text-center text-[11px] font-bold text-ink tabular opacity-0 group-hover:opacity-100 transition-opacity">
                  {d[valueKey]}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-ink-faint">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}
