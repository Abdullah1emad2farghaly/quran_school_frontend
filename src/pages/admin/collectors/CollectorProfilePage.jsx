import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil, Phone, Mail, Wallet, CircleDollarSign, Users } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { collectorsApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";
import { formatCurrency } from "../../../utils/helpers";

import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge, PaidBadge } from "../../../components/admin/common/Badge";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import StatCard from "../../../components/admin/common/StatCard";
import EmptyState from "../../../components/admin/common/EmptyState";
import CollectorFormModal from "./CollectorFormModal";

export default function CollectorProfilePage() {
  const { collectorId } = useParams();
  const { t, isRtl, lang } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [collector, setCollector] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([collectorsApi.getCollector(collectorId), collectorsApi.getCollectorStatistics(collectorId)])
      .then(([c, s]) => {
        if (mounted) {
          setCollector(c.data);
          setStats(s.data);
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [collectorId]);

  const handleEditSubmit = async (form) => {
    setSaving(true);
    try {
      const res = await collectorsApi.updateCollector(collectorId, form);
      setCollector(res.data);
      toast.success(t.common.saved);
      setEditOpen(false);
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
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

  if (!collector) return <EmptyState title={t.common.noResults} body={t.common.noResultsBody} />;

  return (
    <div className="animate-fadeIn">
      <button onClick={() => navigate("/collectors")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint hover:text-ink transition mb-4">
        <BackIcon size={15} />
        {t.common.back}
      </button>

      <div className="bg-paper-raised border border-line rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={collector.name} size="xl" />
            <div>
              <h1 className="text-xl font-extrabold text-ink">{collector.name}</h1>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-sm text-ink-faint">
                <span className="flex items-center gap-1.5 nums-ltr"><Phone size={13} /> {collector.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} /> {collector.email}</span>
              </div>
              <div className="mt-2.5"><StatusBadge status={collector.status} t={t} /></div>
            </div>
          </div>
          <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>{t.common.edit}</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label={t.collectors.collectedThisMonth} value={formatCurrency(stats.totalCollected, "EGP", lang)} icon={Wallet} tone="primary" />
        <StatCard label={t.collectors.pendingAmount} value={formatCurrency(stats.totalPending, "EGP", lang)} icon={CircleDollarSign} tone="rose" />
        <StatCard label={t.collectors.assignedStudents} value={stats.studentsHandled} icon={Users} tone="sky" />
      </div>

      <Card title={t.collectors.collectionHistory} padding={false}>
        {stats.history.length === 0 ? (
          <EmptyState compact title={t.common.noResults} />
        ) : (
          <ul className="divide-y divide-line-soft">
            {stats.history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={h.studentName} size="sm" />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{h.studentName}</p>
                    <p className="text-[11.5px] text-ink-faint nums-ltr">{h.month} {h.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-ink tabular nums-ltr">{formatCurrency(h.amount, "EGP", lang)}</span>
                  <PaidBadge status={h.status} t={t} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <CollectorFormModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditSubmit} initialData={collector} saving={saving} />
    </div>
  );
}
