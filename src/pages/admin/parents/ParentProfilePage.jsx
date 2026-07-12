import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { parentsApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge, PaidBadge } from "../../../components/admin/common/Badge";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import EmptyState from "../../../components/admin/common/EmptyState";
import ParentFormModal from "./ParentFormModal";

export default function ParentProfilePage() {
  const { parentId } = useParams();
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([parentsApi.getParent(parentId), parentsApi.getParentChildren(parentId)]).then(([p, c]) => {
      if (mounted) {
        setParent(p);
        setChildren(c);
        setLoading(false);
      }
    }).catch(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [parentId]);


  const handleEditSubmit = async (form) => {
    setSaving(true);
    try {
      const res = await parentsApi.updateParent(parent.userId || parent.id, form);
      console.log(res);
      setParent(res);
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
      await parentsApi.deleteParent(parent.userId || parent.id);
      toast.success(t.common.deleted);
      navigate("/admin/parents");
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

  if (!parent) return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/admin/parents")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={parent.name} size="xl" />
            <div>
              <h1 className="text-xl font-extrabold text-ink">{parent.name}</h1>
              <p className="text-sm text-ink-faint mt-0.5">{t.parents.profile} · {parent.id.toString().padStart(4, '0')}-P</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
            <Button variant="dangerGhost" icon={Trash2} onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-line">
          <InfoItem icon={Phone} label={t.common.phone} value={parent.phone} ltr />
        </div>
      </div>

      <Card title={`${t.parents.children} (${children?.length || 0})`} padding={false}>
        {children.length === 0 ? (
          <EmptyState compact title={t.parents.noChildren} body="" />
        ) : (
          <ul className="divide-y divide-line-soft">
            {children.map((child) => (
              <li
                key={child.id}
                onClick={() => navigate(`/admin/students/${child.id}`)}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-line-soft/50 cursor-pointer transition"
              >
                <Avatar name={child.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm">{child.name}</p>
                  <p className="text-[11.5px] text-ink-faint">{child.groupName || t.students.noGroup}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ParentFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={parent} saving={saving} />
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
