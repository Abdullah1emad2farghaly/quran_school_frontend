import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Plus, Clock, CalendarDays, Users } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { groupsApi, teachersApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import Avatar from "../../../components/admin/common/Avatar";
import Badge, { StatusBadge } from "../../../components/admin/common/Badge";
import Tabs from "../../../components/admin/common/Tabs";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import EmptyState from "../../../components/admin/common/EmptyState";
import GroupFormModal from "./GroupFormModal";
import ScheduleDayModal from "./ScheduleDayModal";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams] = useSearchParams();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [group, setGroup] = useState(null);
  const [teachersLite, setTeachersLite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "schedule" ? "schedule" : "students");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  const loadGroup = () => {
    groupsApi.getGroup(groupId).then((res) => setGroup(res.data));
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([groupsApi.getGroup(groupId)]).then(([g]) => {
      if (mounted) {
        setGroup(g.data);
        setLoading(false);
      }
    }).catch(() => mounted && setLoading(false));
    teachersApi.listTeachers({ pageSize: 100 }).then((res) => mounted && setTeachersLite(res.data));
    return () => { mounted = false; };
  }, [groupId]);

  const handleEditSubmit = async (form) => {

    setSaving(true);
    try {
      const res = await groupsApi.updateGroup(groupId, form);
      console.log(res)
      setGroup({ ...group, ...res.data.group, groupName: res.data.group.name });
      toast.success(t.common.saved);
      setEditOpen(false);
    } catch (err) {
      if (Array.isArray(err.msg)) {
        err.msg.forEach((error) => {
          toast.error(error.msg[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err.msg[window.localStorage.getItem('academy_lang')])
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await groupsApi.deleteGroup(groupId);
      toast.success(t.common.deleted);
      navigate("/admin/groups");
    } catch (err) {
      if (Array.isArray(err.msg)) {
        err.msg.forEach((error) => {
          toast.error(error.msg[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err.msg[window.localStorage.getItem('academy_lang')])
      }
    }
  };

  const openAddDay = () => { setEditingDay(null); setScheduleModalOpen(true); };
  const openEditDay = (day) => { setEditingDay(day); setScheduleModalOpen(true); };

  const handleScheduleSubmit = async (form) => {
    setScheduleSaving(true);
    try {
      if (editingDay) {
        await groupsApi.updateScheduleDay(editingDay.id, { ...form, groupId, });
      } else {
        await groupsApi.addScheduleDay(groupId, form);
      }
      toast.success(t.common.saved);
      setScheduleModalOpen(false);
      loadGroup();
    } catch (err) {
      if (Array.isArray(err.msg)) {
        err.msg.forEach((error) => {
          toast.error(error.msg[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err.msg[window.localStorage.getItem('academy_lang')])
      }
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleDeleteDay = async (day) => {
    const ok = await confirm({ confirmLabel: t.common.delete });
    if (!ok) return;
    try {
      await groupsApi.deleteScheduleDay(day.id);
      toast.success(t.common.deleted);
      loadGroup();
    } catch (err) {
      if (Array.isArray(err.msg)) {
        err.msg.forEach((error) => {
          toast.error(error.msg[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err.msg[window.localStorage.getItem('academy_lang')])
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="h-8 w-40 skeleton-surface animate-shimmer rounded" />
        <div className="h-32 skeleton-surface animate-shimmer rounded-2xl" />
        <div className="h-64 skeleton-surface animate-shimmer rounded-2xl" />
      </div>
    );
  }

  if (!group) return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;

  const tabs = [
    { key: "students", label: `${t.groups.groupStudents} (${group?.students?.length ? group?.students?.length : 0})` },
    { key: "schedule", label: t.groups.schedule },
  ];

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/admin/groups")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-extrabold text-ink">{group.groupName}</h1>
            <p className="text-sm text-ink-faint mt-0.5">G-{group.groupId}</p>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <StatusBadge status={group.isActive} t={t} />
              <Badge tone="gold">{group?.students?.length}/{group.maxStudents} {t.groups.seats}</Badge>
            </div>
            {group.currentSurah ? <span className="font-medium text-ink-soft">{group.currentSurah}</span> : <span className="text-ink-faint italic">{t.groups.noSurah}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
            <Button variant="dangerGhost" icon={Trash2} onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-line">
          <Avatar name={group.teacherName || "?"} size="md" />
          <div>
            <p className="text-[11px] text-ink-faint font-medium">{t.groups.assignedTeacher}</p>
            <p className="text-sm font-bold text-ink">{group.teacherName || t.groups.noTeacher}</p>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "students" && (
          <Card padding={false}>
            {!group?.students || group?.students?.length === 0 ? (
              <EmptyState compact icon={Users} title={t.common.noResults} body={t.common.noResultsBody} />
            ) : (
              <ul className="divide-y divide-line-soft">
                {group?.students?.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => navigate(`/admin/students/${s.id}`)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-line-soft/50 cursor-pointer transition"
                  >
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-sm">{s.name}</p>
                      <p className="text-[11.5px] text-ink-faint">{t.students.memorizedParts}: {s.memorizedParts}/30</p>
                    </div>
                    {/* <PaidBadge status={s.subscriptionStatus} t={t} /> */}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {activeTab === "schedule" && (
          <Card
            title={t.schedule.title}
            headerActions={<Button size="sm" icon={Plus} onClick={openAddDay}>{t.schedule.addDay}</Button>}
            padding={false}
          >
            {(!group?.schedules || group?.schedules?.length === 0) ? (
              <EmptyState compact icon={CalendarDays} title={t.schedule.noSchedule} body={t.schedule.noScheduleBody} actionLabel={t.schedule.addDay} onAction={openAddDay} />
            ) : (
              <ul className="divide-y divide-line-soft">
                {group?.schedules?.map((day) => (
                  <li key={day.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary-dark flex items-center justify-center shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-ink text-sm">{t.days?.[day.day]}</p>
                        <p className="text-[12px] text-ink-faint nums-ltr">{day.startTime} – {day.endTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditDay(day)} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-line-soft hover:text-ink transition">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDeleteDay(day)} className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-faint hover:bg-rose-soft hover:text-rose transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      <GroupFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={group} teachers={teachersLite} saving={saving} />
      <ScheduleDayModal open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onSubmit={handleScheduleSubmit} initialData={editingDay} saving={scheduleSaving} />
    </div>
  );
}
