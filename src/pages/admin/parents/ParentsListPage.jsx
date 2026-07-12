import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Users, Download } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { parentsApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { exportToCSV } from "../../../utils/helpers";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge } from "../../../components/admin/common/Badge";
import ParentFormModal from "./ParentFormModal";

let randomNumber = Math.floor(100000 + Math.random() * 900000);

export default function ParentsListPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => parentsApi.listParents(params), []);
  const dt = useDataTable(fetcher, { pageSize: 8 });

  const openCreate = () => { setEditing(null); setFormOpen(true); randomNumber = Math.floor(100000 + Math.random() * 900000) };
  const openEdit = (p) => { setEditing(p); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);

    try {
      if (editing) {
        await parentsApi.updateParent(editing.userId, form);
        toast.success(t.common.saved);
      } else {
        await parentsApi.createParent(form);
        toast.success(t.common.created);
      }
      setFormOpen(false);
      dt.refresh();
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

  const handleDelete = async (parent) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await parentsApi.deleteParent(parent.userId || parent.id);
      toast.success(t.common.deleted);
      dt.refresh();
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


  const handleExport = () => {
    exportToCSV("parents", dt.rows, [
      { key: "name", label: t.common.name },
      { key: "phone", label: t.common.phone },
    ]);
    toast.success(t.common.export);
  };

  const columns = [
    {
      key: "name",
      label: t.common.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-semibold text-ink leading-tight">{row.name}</p>
            <p className="text-[11.5px] text-ink-faint leading-tight nums-ltr">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "createdAt", label: t.teachers.createdAt, render: (row) => (
        <div className="flex justify-center flex-col items-start">
          <p className="tabular font-semibold">{row.createdAt.split("T")[0]}</p>
          <p className="tabular text-gray-500">{row.createdAt.split("T")[1].split(".")[0]}</p>
        </div>
      )
    },
    { key: "phone", label: t.common.phone, render: (row) => <span className="nums-ltr">{row.phone}</span> },
    {
      key: "totalStudents", label: t.parents.children, render: (row) => (
        <div>
          <p>{row.totalStudents}</p>
        </div>
      )
    },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.parents.viewChildren, icon: Users, onClick: () => navigate(`/admin/parents/${row.id}`) },
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
        title={t.parents.title}
        subtitle={t.parents.subtitle}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>
            <Button icon={Plus} onClick={openCreate}>{t.parents.newParent}</Button>
          </>
        }
      />

      <div className="mb-4">
        <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="max-w-md" />
      </div>

      <DataTable
        columns={columns}
        rows={dt.rows}
        loading={dt.loading}
        pagination={dt.pagination}
        onPageChange={dt.setPage}
        onRowClick={(row) => navigate(`/admin/parents/${row.id}`)}
        emptyAction={{ label: t.parents.newParent, onClick: openCreate }}
      />

      <ParentFormModal open={formOpen} password={randomNumber} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} saving={saving} />
    </div>
  );
}
