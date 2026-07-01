import React from "react";

const TONES = {
  green: "bg-primary-soft text-primary-dark",
  rose: "bg-rose-soft text-rose",
  amber: "bg-amber-soft text-amber",
  gold: "bg-gold-soft text-gold-dark",
  sky: "bg-sky-soft text-sky",
  neutral: "bg-line-soft text-ink-soft",
};

export default function Badge({ children, tone = "neutral", dot = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${tone === "green" ? "bg-primary" : tone === "rose" ? "bg-rose" : tone === "amber" ? "bg-amber" : tone === "gold" ? "bg-gold" : tone === "sky" ? "bg-sky" : "bg-ink-faint"}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status, t }) {
  return (
    <Badge tone={status ? "green" : "neutral"} dot>
      {status ? t.common.active : t.common.inactive}
    </Badge>
  );
}

export function PaidBadge({ status, t }) {
  const isPaid = status === "paid";
  return (
    <Badge tone={isPaid ? "green" : "rose"} dot>
      {isPaid ? t.common.paid : t.common.unpaid}
    </Badge>
  );
}

export function GradeBadge({ grade, t }) {
  const toneMap = { excellent: "green", veryGood: "sky", good: "gold", needsWork: "rose" };
  return <Badge tone={toneMap[grade] || "neutral"}>{t.memorization.gradeLevels[grade] || grade}</Badge>;
}

export function CompetitionStatusBadge({ status, t }) {
  const toneMap = { upcoming: "sky", ongoing: "gold", completed: "neutral" };
  return <Badge tone={toneMap[status] || "neutral"} dot>{t.competitions.statusLabels[status] || status}</Badge>;
}

export function AttendanceBadge({ status, t }) {
  const toneMap = { present: "green", absent: "rose", late: "amber", excused: "sky" };
  return <Badge tone={toneMap[status] || "neutral"}>{t.attendance[status] || status}</Badge>;
}
