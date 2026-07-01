import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Phone, Mail } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { collectorsApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge } from "../../../components/admin/common/Badge";
import CollectorFormModal from "./CollectorFormModal";

export default function CollectorsListPage() {
  const { t, formatDate } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => collectorsApi.listCollectors(params), []);
  const dt = useDataTable(fetcher, { pageSize: 10 });

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (c) => { setEditing(c); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await collectorsApi.updateCollector(editing.id, form);
        toast.success(t.common.saved);
      } else {
        await collectorsApi.createCollector(form);
        toast.success(t.common.created);
      }
      setFormOpen(false);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await collectorsApi.deleteCollector(c.id);
      toast.success(t.common.deleted);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const columns = [
    {
      key: "name",
      label: t.common.name,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <span className="font-semibold text-ink">{row.name}</span>
        </div>
      ),
    },
    {
      key: "contact",
      label: t.common.phone,
      render: (row) => (
        <div className="text-[13px] text-ink-soft space-y-0.5">
          <p className="flex items-center gap-1.5 nums-ltr"><Phone size={12} className="text-ink-faint" /> {row.phone}</p>
          <p className="flex items-center gap-1.5 text-ink-faint"><Mail size={12} /> {row.email}</p>
        </div>
      ),
    },
    { key: "assignedStudentsCount", label: t.collectors.assignedStudents, render: (row) => <span className="tabular font-semibold text-ink-soft">{row.assignedStudentsCount}</span> },
    { key: "joinDate", label: t.common.joinDate, render: (row) => <span className="text-ink-faint nums-ltr">{formatDate(row.joinDate)}</span> },
    { key: "status", label: t.common.status, render: (row) => <StatusBadge status={row.status} t={t} /> },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.collectors.statistics, icon: Eye, onClick: () => navigate(`/collectors/${row.id}`) },
            { label: t.common.edit, icon: Pencil, onClick: () => openEdit(row) },
            { label: t.common.delete, icon: Trash2, danger: true, onClick: () => handleDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.collectors.title}
        subtitle={t.collectors.subtitle}
        actions={<Button icon={Plus} onClick={openCreate}>{t.collectors.newCollector}</Button>}
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="flex-1 min-w-[240px]" />
      </div>

      <DataTable
        columns={columns}
        rows={dt.rows}
        loading={dt.loading}
        pagination={dt.pagination}
        onPageChange={dt.setPage}
        onRowClick={(row) => navigate(`/collectors/${row.id}`)}
        emptyAction={{ label: t.collectors.newCollector, onClick: openCreate }}
      />

      <CollectorFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} saving={saving} />
    </div>
  );
}
