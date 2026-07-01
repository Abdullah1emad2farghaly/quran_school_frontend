import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const TONE_STYLES = {
  primary: { bg: "bg-primary-soft", icon: "text-primary-dark", ring: "ring-primary/10" },
  gold: { bg: "bg-gold-soft", icon: "text-gold-dark", ring: "ring-gold/10" },
  sky: { bg: "bg-sky-soft", icon: "text-sky", ring: "ring-sky/10" },
  rose: { bg: "bg-rose-soft", icon: "text-rose", ring: "ring-rose/10" },
  amber: { bg: "bg-amber-soft", icon: "text-amber", ring: "ring-amber/10" },
  neutral: { bg: "bg-line-soft", icon: "text-ink-soft", ring: "ring-ink/5" },
};

export default function StatCard({ label, value, icon: Icon, tone = "primary", trend, trendLabel, loading = false }) {
  const style = TONE_STYLES[tone] || TONE_STYLES.primary;

  if (loading) {
    return (
      <div className="bg-paper-raised border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton-surface animate-shimmer h-10 w-10 rounded-xl" />
        </div>
        <div className="skeleton-surface animate-shimmer h-3.5 w-24 rounded mb-2.5" />
        <div className="skeleton-surface animate-shimmer h-7 w-16 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-paper-raised border border-line rounded-2xl p-5 hover:shadow-card transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.icon}`}>
          <Icon size={19} strokeWidth={2.2} />
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold ${trend >= 0 ? "text-primary" : "text-rose"}`}
          >
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-[13px] font-medium text-ink-faint mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-ink tabular nums-ltr">{value}</p>
      {trendLabel && <p className="text-xs text-ink-faint mt-1">{trendLabel}</p>}
    </div>
  );
}
