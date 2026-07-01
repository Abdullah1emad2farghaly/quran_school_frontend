import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  const { t, formatNumber } = useI18n();

  if (totalPages <= 0) return null;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageNumbers = () => {
    const nums = [];
    const span = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - span && i <= page + span)) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "…") {
        nums.push("…");
      }
    }
    return nums;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-t border-line flex-wrap gap-3">
      <p className="text-[13px] text-ink-faint">
        {t.common.showing} <span className="font-semibold text-ink">{formatNumber(start)}–{formatNumber(end)}</span>{" "}
        {t.common.of} <span className="font-semibold text-ink">{formatNumber(total)}</span> {t.common.results}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-line-soft disabled:opacity-35 disabled:hover:bg-transparent transition rtl:rotate-180"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers().map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-ink-faint text-sm">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold tabular transition ${
                n === page ? "bg-primary text-white" : "text-ink-soft hover:bg-line-soft"
              }`}
            >
              {n}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-line-soft disabled:opacity-35 disabled:hover:bg-transparent transition rtl:rotate-180"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
