import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Users, CalendarClock, Download } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { groupsApi, teachersApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { exportToCSV } from "../../../utils/helpers";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import { StatusBadge } from "../../../components/admin/common/Badge";
import Badge from "../../../components/admin/common/Badge";
import GroupFormModal from "./GroupFormModal";

export default function GroupsListPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const [teachersLite, setTeachersLite] = useState([]);
  const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => groupsApi.listGroups(params), []);
  const dt = useDataTable(fetcher, { pageSize: 8 });

  useEffect(() => {
    teachersApi.listTeachers({ pageSize: 100 }).then((res) => setTeachersLite(res.data));
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setFormOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterDefs = [
    { key: "level", label: t.groups.level, options: ["beginner", "intermediate", "advanced", "hafiz"].map((l) => ({ value: l, label: t.students.levels[l] })) },
    { key: "status", label: t.common.status, options: [{ value: "active", label: t.common.active }, { value: "inactive", label: t.common.inactive }] },
  ];

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (group) => { setEditing(group); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await groupsApi.updateGroup(editing.id, form);
        toast.success(t.common.saved);
      } else {
        await groupsApi.createGroup(form);
        toast.success(t.common.created);
      }
      setFormOpen(false);
      dt.refresh();
    } catch (err) {
      console.log(err)
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (group) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await groupsApi.deleteGroup(group.id);
      toast.success(t.common.deleted);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const handleExport = () => {
    exportToCSV("groups", dt.rows, [
      { key: "name", label: t.groups.groupName },
      { key: "teacherName", label: t.groups.assignedTeacher },
      { key: "level", label: t.groups.level },
      { key: "capacity", label: t.groups.capacity },
      { key: "status", label: t.common.status },
    ]);
    toast.success(t.common.export);
  };

  const columns = [
    {
      key: "name",
      label: t.groups.groupName,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.groupName}</p>
          <p className="text-[11.5px] text-ink-faint">G-{row.id}</p>
        </div>
      ),
    },
    { key: "level", label: t.groups.level, render: (row) =>  row.currentSurah ? <span className="font-medium text-ink-soft">{row.currentSurah}</span> : <span className="text-ink-faint italic">{t.groups.noSurah}</span> },
    {
      key: "teacherName",
      label: t.groups.assignedTeacher,
      render: (row) => row.teacherName ? <span className="font-medium text-ink-soft">{row.teacherName}</span> : <span className="text-ink-faint italic">{t.groups.noTeacher}</span>,
    },
    { key: "capacity", label: t.groups.capacity, render: (row) => <span className="tabular"> {row.maxStudents}/{row.studentsCount} {t.groups.seats}</span> },
    {
      key: "schedule",
      label: t.groups.schedule,
      render: (row) => <span className="text-xs font-semibold text-ink-soft">{row.scheduleDaysCount} {row.scheduleDaysCount <= 1 ? "day" : "days"}/wk</span>,
    },
    { key: "status", label: t.common.status, render: (row) => <StatusBadge status={row.isActive} t={t} /> },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.groups.groupStudents, icon: Users, onClick: () => navigate(`/admin/groups/${row.id}`) },
            { label: t.groups.manageSchedule, icon: CalendarClock, onClick: () => navigate(`/admin/groups/${row.id}?tab=schedule`) },
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
        title={t.groups.title}
        subtitle={t.groups.subtitle}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>
            <Button icon={Plus} onClick={openCreate}>{t.groups.newGroup}</Button>
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
        onRowClick={(row) => navigate(`/admin/groups/${row.id}`)}
        emptyAction={{ label: t.groups.newGroup, onClick: openCreate }}
      />

      <GroupFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} teachers={teachersLite} saving={saving} />
    </div>
  );
}
