import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, GraduationCap, UserCheck, FolderKanban, Trophy, Wallet, Banknote,
  UserPlus, ClipboardCheck, FolderPlus, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, BookOpenCheck, CalendarPlus, Star,
} from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { dashboardApi } from "../../../api";
import PageHeader from "../../../components/admin/common/PageHeader";
import StatCard from "../../../components/admin/common/StatCard";
import Card from "../../../components/admin/common/Card";
import MiniBarChart from "../../../components/admin/charts/MiniBarChart";
import DonutChart from "../../../components/admin/charts/DonutChart";
import EmptyState from "../../../components/admin/common/EmptyState";

const ACTIVITY_ICON = {
  student_added: { icon: UserPlus, tone: "text-primary-dark bg-primary-soft" },
  payment_received: { icon: CheckCircle2, tone: "text-primary-dark bg-primary-soft" },
  memorization_recorded: { icon: BookOpenCheck, tone: "text-sky bg-sky-soft" },
  group_created: { icon: FolderPlus, tone: "text-gold-dark bg-gold-soft" },
  attendance_marked: { icon: ClipboardCheck, tone: "text-sky bg-sky-soft" },
  competition_registered: { icon: Star, tone: "text-gold-dark bg-gold-soft" },
  payment_overdue: { icon: AlertTriangle, tone: "text-rose bg-rose-soft" },
};

export default function DashboardPage() {
  const { t, lang, formatDate, isRtl } = useI18n();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dashboardApi.getDashboardSummary().then((res) => {
      if (mounted) {
        setSummary(res.data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const stats = summary
    ? [
        { key: "totalStudents", value: summary.totalStudents, icon: Users, tone: "primary", trend: 8, to: "/students" },
        { key: "totalTeachers", value: summary.totalTeachers, icon: GraduationCap, tone: "sky", trend: 4, to: "/teachers" },
        { key: "totalParents", value: summary.totalParents, icon: UserCheck, tone: "gold", trend: 3, to: "/parents" },
        { key: "totalGroups", value: summary.totalGroups, icon: FolderKanban, tone: "amber", trend: 0, to: "/groups" },
        { key: "totalCompetitions", value: summary.totalCompetitions, icon: Trophy, tone: "gold", to: "/competitions" },
        { key: "paidSubs", value: summary.paidSubscriptions, icon: Wallet, tone: "primary", trend: 12, to: "/subscriptions" },
        { key: "unpaidSubs", value: summary.unpaidSubscriptions, icon: Banknote, tone: "rose", trend: -5, to: "/subscriptions" },
      ]
    : [];

  const quickActions = [
    { key: "addStudent", icon: UserPlus, to: "/students?new=1" },
    { key: "addTeacher", icon: GraduationCap, to: "/teachers?new=1" },
    { key: "createGroup", icon: FolderPlus, to: "/groups?new=1" },
    { key: "recordAttendance", icon: CalendarPlus, to: "/attendance" },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} />

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <StatCard key={i} loading />)
          : stats.map((s) => (
              <button key={s.key} onClick={() => navigate(s.to)} className="text-start">
                <StatCard label={t.dashboard[s.key]} value={s.value} icon={s.icon} tone={s.tone} trend={s.trend} trendLabel={s.trend !== undefined ? t.dashboard.vsLastMonth : undefined} />
              </button>
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Enrollment trend */}
        <Card title={t.dashboard.enrollmentTrend} className="xl:col-span-2">
          {loading ? (
            <div className="h-44 skeleton-surface animate-shimmer rounded-lg" />
          ) : (
            <MiniBarChart data={summary.enrollmentTrend} valueKey="count" labelKey="label" />
          )}
        </Card>

        {/* Subscription breakdown */}
        <Card title={t.dashboard.subBreakdown}>
          {loading ? (
            <div className="h-44 skeleton-surface animate-shimmer rounded-lg" />
          ) : (
            <>
              <DonutChart
                data={[
                  { name: t.common.paid, value: summary.paidSubscriptions },
                  { name: t.common.unpaid, value: summary.unpaidSubscriptions },
                ]}
                colors={["#0d6e5e", "#b5483f"]}
                centerValue={summary.paidSubscriptions + summary.unpaidSubscriptions}
                centerLabel={t.common.all}
              />
              <div className="flex items-center justify-center gap-5 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> {t.common.paid} ({summary.paidSubscriptions})
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose" /> {t.common.unpaid} ({summary.unpaidSubscriptions})
                </span>
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        {/* Recent activity */}
        <Card
          title={t.dashboard.recentActivities}
          className="xl:col-span-2"
          padding={false}
          headerActions={
            <button className="text-xs font-bold text-primary hover:text-primary-dark transition">
              {t.dashboard.viewAll}
            </button>
          }
        >
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg skeleton-surface animate-shimmer" />
              ))}
            </div>
          ) : summary.activities.length === 0 ? (
            <EmptyState compact title={t.common.noResults} body={t.common.noResultsBody} />
          ) : (
            <ul className="divide-y divide-line-soft">
              {summary.activities.map((a) => {
                const meta = ACTIVITY_ICON[a.type] || ACTIVITY_ICON.student_added;
                const ActivityIcon = meta.icon;
                return (
                  <li key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.tone}`}>
                      <ActivityIcon size={16} />
                    </div>
                    <p className="text-[13.5px] text-ink-soft leading-snug flex-1">
                      <span className="font-bold text-ink">{a.actor}</span>{" "}
                      {t.dashboard.activity[a.type]}{" "}
                      <span className="font-semibold text-ink">{a.target}</span>
                    </p>
                    <span className="text-[11px] text-ink-faint shrink-0 nums-ltr">{formatDate(a.time)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Quick actions */}
        <Card title={t.dashboard.quickActions}>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.key}
                onClick={() => navigate(a.to)}
                className="flex flex-col items-start gap-2.5 p-3.5 rounded-xl border border-line hover:border-primary hover:bg-primary-soft/50 transition group text-start"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary-dark flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                  <a.icon size={17} />
                </div>
                <span className="text-[12.5px] font-bold text-ink leading-tight">{t.dashboard[a.key]}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
