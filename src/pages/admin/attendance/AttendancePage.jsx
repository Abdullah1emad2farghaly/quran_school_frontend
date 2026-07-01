import React, { useEffect, useState } from "react";
import { CheckSquare, Save, Users, BarChart3, History } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { groupsApi, attendanceApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";

import PageHeader from "../../../components/admin/common/PageHeader";
import Tabs from "../../../components/admin/common/Tabs";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import { Select } from "../../../components/admin/common/FormFields";
import Avatar from "../../../components/admin/common/Avatar";
import { AttendanceBadge } from "../../../components/admin/common/Badge";
import EmptyState from "../../../components/admin/common/EmptyState";
import { TableSkeleton } from "../../../components/admin/common/Skeleton";
import StatCard from "../../../components/admin/common/StatCard";

const STATUS_OPTIONS = ["present", "absent", "late", "excused"];

export default function AttendancePage() {
  const { t, formatDate } = useI18n();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("daily");
  const [groupsLite, setGroupsLite] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [dailyRecords, setDailyRecords] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [groupRecords, setGroupRecords] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    groupsApi.getAllGroupsLite().then((res) => {
      setGroupsLite(res.data);
      if (res.data.length) setSelectedGroup(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    if (activeTab === "daily") {
      setDailyLoading(true);
      attendanceApi.getDailyAttendance(selectedGroup, date).then((res) => {
        setDailyRecords(res.data);
        setDailyLoading(false);
      });
    }
    if (activeTab === "records") {
      setGroupRecords(null);
      attendanceApi.getGroupAttendanceRecords(selectedGroup).then((res) => setGroupRecords(res.data));
    }
    if (activeTab === "reports") {
      setReportLoading(true);
      attendanceApi.getAttendanceReport({ groupId: selectedGroup }).then((res) => {
        setReportData(res.data);
        setReportLoading(false);
      });
    }
  }, [selectedGroup, date, activeTab]);

  const updateStatus = (studentId, status) => {
    setDailyRecords((recs) => recs.map((r) => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const markAllPresent = () => {
    setDailyRecords((recs) => recs.map((r) => ({ ...r, status: "present" })));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await attendanceApi.saveDailyAttendance(
        selectedGroup,
        date,
        dailyRecords.map((r) => ({ studentId: r.studentId, status: r.status }))
      );
      toast.success(t.common.saved);
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "daily", label: t.attendance.tabs.daily },
    { key: "reports", label: t.attendance.tabs.reports },
    { key: "records", label: t.attendance.tabs.records },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader title={t.attendance.title} subtitle={t.attendance.subtitle} />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="w-56">
          <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            {groupsLite.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>
        </div>
        {activeTab === "daily" && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 px-3 rounded-lg border border-line bg-white text-sm nums-ltr focus:border-primary"
          />
        )}
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {!selectedGroup ? (
          <EmptyState title={t.attendance.chooseGroupPrompt} body="" />
        ) : activeTab === "daily" ? (
          <Card
            title={t.attendance.daily}
            headerActions={
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon={CheckSquare} onClick={markAllPresent}>{t.attendance.markAll}</Button>
                <Button size="sm" icon={Save} onClick={saveAttendance} loading={saving}>{t.attendance.saveAttendance}</Button>
              </div>
            }
            padding={false}
          >
            {dailyLoading || !dailyRecords ? (
              <div className="p-5"><TableSkeleton rows={5} cols={2} /></div>
            ) : dailyRecords.length === 0 ? (
              <EmptyState compact icon={Users} title={t.common.noResults} body={t.common.noResultsBody} />
            ) : (
              <ul className="divide-y divide-line-soft">
                {dailyRecords.map((r) => (
                  <li key={r.studentId} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.studentName} size="sm" />
                      <p className="font-semibold text-ink text-sm">{r.studentName}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(r.studentId, status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            r.status === status
                              ? statusActiveClass(status)
                              : "border-line text-ink-faint hover:bg-line-soft"
                          }`}
                        >
                          {t.attendance[status]}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : activeTab === "reports" ? (
          reportLoading || !reportData ? (
            <div className="h-64 skeleton-surface animate-shimmer rounded-2xl" />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label={t.attendance.attendanceRate} value={`${reportData.summary.rate}%`} icon={BarChart3} tone="primary" />
                <StatCard label={t.attendance.present} value={reportData.summary.present} icon={Users} tone="primary" />
                <StatCard label={t.attendance.absent} value={reportData.summary.absent} icon={Users} tone="rose" />
                <StatCard label={t.attendance.late} value={reportData.summary.late} icon={Users} tone="amber" />
              </div>
              <Card title={t.attendance.groupRecords} padding={false}>
                {reportData.studentRows.length === 0 ? (
                  <EmptyState compact title={t.common.noResults} body={t.common.noResultsBody} />
                ) : (
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-line-soft/60 border-b border-line">
                          <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase">{t.common.name}</th>
                          <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase">{t.attendance.present}</th>
                          <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase">{t.attendance.absent}</th>
                          <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase">{t.attendance.late}</th>
                          <th className="px-4 py-3 text-start text-[11.5px] font-bold text-ink-faint uppercase">{t.attendance.attendanceRate}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.studentRows.map((row) => (
                          <tr key={row.studentId} className="border-b border-line-soft last:border-0">
                            <td className="px-4 py-3 font-semibold text-ink">{row.studentName}</td>
                            <td className="px-4 py-3 tabular text-primary-dark font-bold">{row.present}</td>
                            <td className="px-4 py-3 tabular text-rose font-bold">{row.absent}</td>
                            <td className="px-4 py-3 tabular text-amber font-bold">{row.late}</td>
                            <td className="px-4 py-3 tabular font-bold">{row.rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )
        ) : (
          <Card title={t.attendance.groupRecords} padding={false}>
            {!groupRecords ? (
              <div className="p-5"><TableSkeleton rows={5} cols={3} /></div>
            ) : groupRecords.dates.length === 0 ? (
              <EmptyState compact icon={History} title={t.common.noResults} body={t.common.noResultsBody} />
            ) : (
              <div className="divide-y divide-line-soft">
                {groupRecords.dates.map((date) => {
                  const sessionRecords = groupRecords.records.filter((r) => r.date === date);
                  const presentCount = sessionRecords.filter((r) => r.status === "present").length;
                  return (
                    <div key={date} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-ink text-sm nums-ltr">{formatDate(date)}</p>
                        <span className="text-xs font-semibold text-ink-faint">{presentCount}/{sessionRecords.length} {t.attendance.present}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionRecords.map((r) => (
                          <AttendanceBadge key={r.id} status={r.status} t={t} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function statusActiveClass(status) {
  const map = {
    present: "bg-primary text-white border-primary",
    absent: "bg-rose text-white border-rose",
    late: "bg-amber text-white border-amber",
    excused: "bg-sky text-white border-sky",
  };
  return map[status];
}
