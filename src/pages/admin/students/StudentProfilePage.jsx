import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Phone, Calendar, FolderKanban, BookOpenCheck, Star } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { studentsApi, memorizationApi, attendanceApi, subscriptionsApi, groupsApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import Avatar from "../../../components/admin/common/Avatar";
import Badge, { StatusBadge, PaidBadge, GradeBadge, AttendanceBadge } from "../../../components/admin/common/Badge";
import Tabs from "../../../components/admin/common/Tabs";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import EmptyState from "../../../components/admin/common/EmptyState";
import { TableSkeleton } from "../../../components/admin/common/Skeleton";
import StudentFormModal from "./StudentFormModal";
import calculateAge from "../../../utils/CalculateAge";

export default function StudentProfilePage() {
  const { studentId } = useParams();
  const { t, isRtl, formatDate } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [groupsLite, setGroupsLite] = useState([]);
  const [saving, setSaving] = useState(false);

  const [memHistory, setMemHistory] = useState(null);
  const [progress, setProgress] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    studentsApi.getStudent(studentId).then((res) => {
      if (mounted) {
        setStudent(res);
        setLoading(false);
      }
    }).catch(() => mounted && setLoading(false));
    groupsApi.getAllGroupsLite().then((res) => mounted && setGroupsLite(res.data));
    return () => { mounted = false; };
  }, [studentId]);

  useEffect(() => {
    if (activeTab === "memorization" && !memHistory) {
      memorizationApi.getStudentMemorizationHistory(studentId).then((res) => {
        console.log(res)
        setMemHistory(res.memorization.sessions)
      });
      memorizationApi.getStudentProgress(studentId).then((res) => setProgress(res.data));
    }
    if (activeTab === "attendance" && !attendanceRecords && student?.groupId) {
      attendanceApi.getGroupAttendanceRecords(studentId).then((res) => {
        console.log(res.attendance)
        setAttendanceRecords(res.attendance);
      });
    }
    if (activeTab === "subscription" && !subscriptions) {
      subscriptionsApi.listSubscriptions({ pageSize: 50 }).then((res) => {
        setSubscriptions(res.data.filter((s) => s.studentId === studentId));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, student]);

  const handleEditSubmit = async (form) => {
    setSaving(true);
    try {
      const group = groupsLite.find((g) => g.id === form.groupId);
      const payload = { ...form, groupName: group?.name || null, groupId: form.groupId || null };
      const res = await studentsApi.updateStudent(studentId, payload);
      setStudent(res.data);
      toast.success(t.common.saved);
      setEditOpen(false);
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({ body: t.students.deleteWarning });
    if (!ok) return;
    try {
      await studentsApi.deleteStudent(studentId);
      toast.success(t.common.deleted);
      navigate("/students");
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="h-8 w-40 skeleton-surface animate-shimmer rounded" />
        <div className="h-40 skeleton-surface animate-shimmer rounded-2xl" />
        <div className="h-64 skeleton-surface animate-shimmer rounded-2xl" />
      </div>
    );
  }

  if (!student) {
    return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;
  }

  const tabs = [
    { key: "overview", label: t.students.tabs.overview },
    { key: "memorization", label: t.students.tabs.memorization },
    { key: "attendance", label: t.students.tabs.attendance },
  ];

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/admin/students")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      {/* Profile header */}
      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} size="xl" />
            <div>
              <h1 className="text-xl font-extrabold text-ink">{student.name}</h1>
              <p className="text-sm text-ink-faint mt-0.5">{t.students.profile} · {student.id.toString().padStart(4,'0')}-S</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
            <Button variant="dangerGhost" icon={Trash2} onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-line">
          <InfoItem icon={Calendar} label={t.common.age} value={`${calculateAge(student.birthDate)}`} />
          <InfoItem icon={Phone} label={t.students.guardianName} value={student.parentName} />
          <InfoItem icon={FolderKanban} label={t.students.currentGroup} value={student.groupName || t.students.noGroup} />
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title={t.common.details}>
              <dl className="space-y-3">
                <Row label={t.common.gender} value={t.common[student.gender]} />
                <Row label={t.students.birthDate} value={formatDate(student.birthDate)} />
                <Row label={t.students.enrollDate} value={formatDate(student.createdAt)} />
                <Row label={t.common.phone} value={student.phone || t.common.notProvided} ltr />
                <Row label={t.students.level} value={student.currentSurah} />
              </dl>
            </Card>
          </div>
        )}


        {activeTab === "memorization" && (
          <div className="space-y-5">
            <Card title={t.memorization.history} padding={false}>
              {!memHistory ? (
                <TableSkeleton rows={4} cols={4} />
              ) : memHistory.length === 0 ? (
                <EmptyState compact title={t.common.noResults} body={t.common.noResultsBody} />
              ) : (
                <ul className="divide-y divide-line-soft">
                  {memHistory.map((m) => (
                    <li key={m?.sessionId} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <p className="font-bold text-ink text-sm">{m?.memorization?.surahName} <span className="text-ink-faint font-medium">({t.memorization.fromAyah} {m?.memorization?.fromAyah}–{m?.memorization?.toAyah})</span></p>
                        <GradeBadge grade={m?.memorizationScore} t={t} />
                      </div>
                      <p className="text-[13px] text-ink-soft leading-relaxed">{m?.notes}</p>
                      <p className="text-[11px] text-ink-faint mt-1.5 nums-ltr">{formatDate(m?.sessionDate)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}

        {activeTab === "attendance" && (
          <Card title={t.attendance.groupRecords} padding={false}>
            {!student.groupId ? (
              <EmptyState compact title={t.students.noGroup} body={t.attendance.chooseGroupPrompt} />
            ) : !attendanceRecords ? (
              <TableSkeleton rows={4} cols={2} />
            ) : attendanceRecords.length === 0 ? (
              <EmptyState compact title={t.common.noResults} body={t.common.noResultsBody} />
            ) : (
              <ul className="divide-y divide-line-soft">
                {attendanceRecords.map((r) => (
                  r.sessionId && (
                    <li key={r.attendanceId} className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm font-medium text-ink-soft nums-ltr">{formatDate(r.date)}</span>
                      <AttendanceBadge status={r.status} t={t} />
                    </li>
                  )
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      <StudentFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={student}
        groups={groupsLite}
        saving={saving}
      />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-line-soft flex items-center justify-center text-ink-faint shrink-0">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-[11px] text-ink-faint font-medium">{label}</p>
        <p className="text-sm font-bold text-ink mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value, ltr }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-ink-faint font-medium">{label}</dt>
      <dd className={`font-semibold text-ink ${ltr ? "nums-ltr" : ""}`}>{value}</dd>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-paper-raised border border-line rounded-xl p-4">
      <p className="text-xl font-extrabold text-ink tabular">{value}</p>
      <p className="text-[11.5px] text-ink-faint font-medium mt-0.5">{label}</p>
    </div>
  );
}
