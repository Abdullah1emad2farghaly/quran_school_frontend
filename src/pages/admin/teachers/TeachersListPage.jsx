import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, FolderKanban, Download } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { teachersApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { exportToCSV } from "../../../utils/helpers";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import Avatar from "../../../components/admin/common/Avatar";
import { StatusBadge } from "../../../components/admin/common/Badge";
import TeacherFormModal from "./TeacherFormModal";

let randomNumber = Math.floor(100000 + Math.random() * 900000);

export default function TeachersListPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => teachersApi.listTeachers(params), []);
  const dt = useDataTable(fetcher, { pageSize: 8 });

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setFormOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterDefs = [
    { key: "status", label: t.common.status, options: [{ value: "active", label: t.common.active }, { value: "inactive", label: t.common.inactive }] },
  ];

  const openCreate = () => { setEditing(null); setFormOpen(true); randomNumber = Math.floor(100000 + Math.random() * 900000) };
  const openEdit = (teacher) => { setEditing(teacher); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await teachersApi.updateTeacher(editing.userId, form);
        toast.success(t.common.saved);
      } else {
        await teachersApi.createTeacher(form);
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

  const handleDelete = async (teacher) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await teachersApi.deleteTeacher(teacher.id);
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
    exportToCSV("teachers", dt.rows, [
      { key: "name", label: t.common.name },
      // { key: "specialization", label: t.teachers.specialization },
      { key: "phone", label: t.common.phone },
      // { key: "experienceYears", label: t.teachers.experience },
      // { key: "status", label: t.common.status },
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
            <p className="text-[11.5px] text-ink-faint leading-tight nums-ltr">{row.phone}</p>
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
    {
      key: "groupsNumber", label: t.groups.groupsNumber, render: (row) => (
        <span>
          {row.totalGroups === 1 ?
            t.groups.onlyOneGroup : row.totalGroups === 2 ?
              t.groups.towGroups : row.totalGroups > 2 && row.totalGroups < 11 ?
                `${row.totalGroups} ${t.groups.groups}` : row.totalGroups >= 11 ? `${row.totalGroups} ${t.groups.group}` : `0 ${t.groups.group}`}
        </span>
      )
    },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.teachers.assignedGroups, icon: FolderKanban, onClick: () => navigate(`/admin/teachers/${row.id}`) },
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
        title={t.teachers.title}
        subtitle={t.teachers.subtitle}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>
            <Button icon={Plus} onClick={openCreate}>{t.teachers.newTeacher}</Button>
          </>
        }
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="flex-1 min-w-[240px]" />
        <FilterPopover filters={filterDefs} values={dt.filters} onChange={dt.updateFilter} onApply={dt.refresh} onReset={dt.resetFilters} activeCount={dt.activeFilterCount} />
      </div>

      <DataTable
        columns={columns}
        rows={dt.rows}
        loading={dt.loading}
        pagination={dt.pagination}
        onPageChange={dt.setPage}
        onRowClick={(row) => navigate(`/admin/teachers/${row.userId}`)}
        emptyAction={{ label: t.teachers.newTeacher, onClick: openCreate }}
      />

      <TeacherFormModal open={formOpen} password={randomNumber} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} saving={saving} />
    </div>
  );
}
