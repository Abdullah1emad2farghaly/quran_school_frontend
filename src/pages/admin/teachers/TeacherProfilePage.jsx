import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Phone, Mail, Award, Briefcase } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { teachersApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge } from "../../../components/admin/common/Badge";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import EmptyState from "../../../components/admin/common/EmptyState";
import TeacherFormModal from "./TeacherFormModal";

export default function TeacherProfilePage() {
  const param = useParams();
  const userId = param.teacherId;
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [teacher, setTeacher] = useState(null);
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([teachersApi.getTeacher(userId)]).then(([tch]) => {
      if (mounted) {
        setTeacher(tch);
        setGroups(tch.groups)
        setLoading(false);
      }
    }).catch((err) => {
      mounted && setLoading(false);
      console.log(err)
    });
    return () => { mounted = false; };
  }, [userId]);

  const handleEditSubmit = async (form) => {
    setSaving(true);
    try {
      const res = await teachersApi.updateTeacher(userId, form);
      setTeacher({ ...teacher, ...res.data.user });
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
      await teachersApi.deleteTeacher(userId);
      toast.success(t.common.deleted);
      navigate("/teachers");
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
        <div className="h-36 skeleton-surface animate-shimmer rounded-2xl" />
        <div className="h-56 skeleton-surface animate-shimmer rounded-2xl" />
      </div>
    );
  }

  if (!teacher) return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/admin/teachers")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={teacher.name} size="xl" />
            <div>
              <h1 className="text-xl font-extrabold text-ink">{teacher.name}</h1>
              <p className="text-sm text-ink-faint mt-0.5">T-{teacher?.id?.toString()?.padStart(4, '0')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
            <Button variant="dangerGhost" icon={Trash2} onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-line">
          <InfoItem icon={Phone} label={t.common.phone} value={teacher.phone} ltr />
        </div>
      </div>

      <Card title={`${t.teachers.assignedGroups} (${groups?.length || 0})`} padding={false}>
        {groups.length === 0 ? (
          <EmptyState compact title={t.teachers.noGroups} body="" />
        ) : (
          <ul className="divide-y divide-line-soft">
            {groups.map((g) => (
              <li
                key={g.id}
                onClick={() => navigate(`/admin/groups/${g.id}`)}
                className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-line-soft/50 cursor-pointer transition"
              >
                <div>
                  <p className="font-semibold text-ink text-sm">{g.name}</p>
                  <p className="text-xs text-ink-faint">{t.groups.level} : {g.currentSurah ?? t.groups.noSurah}</p>
                </div>
                <span className="text-xs font-bold text-ink-faint">{g.maxStudents}/{g.totalStudents} {t.groups.seats}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <TeacherFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={teacher} saving={saving} />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-line-soft flex items-center justify-center text-ink-faint shrink-0">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-ink-faint font-medium">{label}</p>
        <p className={`text-sm font-bold text-ink mt-0.5 truncate ${ltr ? "nums-ltr" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
