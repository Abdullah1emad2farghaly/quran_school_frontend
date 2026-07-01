import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpenCheck, TrendingUp } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { memorizationApi, studentsApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable from "../../../components/admin/common/DataTable";
import Avatar from "../../../components/admin/common/Avatar";
import { GradeBadge } from "../../../components/admin/common/Badge";
import StatCard from "../../../components/admin/common/StatCard";
import MemorizationFormModal from "./MemorizationFormModal";

export default function MemorizationPage() {
  const { t, formatDate } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();

  const [studentsLite, setStudentsLite] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => memorizationApi.listMemorizationRecords(params), []);
  const dt = useDataTable(fetcher, { pageSize: 8 });

  useEffect(() => {
    studentsApi.listStudents({ pageSize: 200 }).then((res) => setStudentsLite(res.data));
  }, []);

  const filterDefs = [
    { key: "grade", label: t.memorization.grade, options: ["excellent", "veryGood", "good", "needsWork"].map((g) => ({ value: g, label: t.memorization.gradeLevels[g] })) },
  ];

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      await memorizationApi.createMemorizationRecord(form);
      toast.success(t.common.created);
      setFormOpen(false);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const totalThisMonth = dt.pagination.total;

  const columns = [
    {
      key: "studentName",
      label: t.common.name,
      render: (row) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/students/${row.studentId}`)}>
          <Avatar name={row.studentName} size="sm" />
          <p className="font-semibold text-ink hover:text-primary transition">{row.studentName}</p>
        </div>
      ),
    },
    {
      key: "surah",
      label: t.memorization.surah,
      render: (row) => (
        <span className="font-medium text-ink-soft">
          {row.surah} <span className="text-ink-faint">({row.fromAyah}–{row.toAyah})</span>
        </span>
      ),
    },
    { key: "grade", label: t.memorization.grade, render: (row) => <GradeBadge grade={row.grade} t={t} /> },
    { key: "date", label: t.common.date, render: (row) => <span className="nums-ltr text-ink-soft">{formatDate(row.date)}</span> },
    {
      key: "teacherNote",
      label: t.memorization.teacherNotes,
      render: (row) => <span className="text-ink-faint text-[13px] line-clamp-1 max-w-xs block">{row.teacherNote}</span>,
    },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.memorization.title}
        subtitle={t.memorization.subtitle}
        actions={<Button icon={Plus} onClick={() => setFormOpen(true)}>{t.memorization.record}</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={t.memorization.history} value={totalThisMonth} icon={BookOpenCheck} tone="primary" />
        <StatCard label={t.memorization.gradeLevels.excellent} value={dt.rows.filter((r) => r.grade === "excellent").length} icon={TrendingUp} tone="sky" />
        <StatCard label={t.memorization.gradeLevels.good} value={dt.rows.filter((r) => r.grade === "good").length} icon={TrendingUp} tone="gold" />
        <StatCard label={t.memorization.gradeLevels.needsWork} value={dt.rows.filter((r) => r.grade === "needsWork").length} icon={TrendingUp} tone="rose" />
      </div>

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
        emptyAction={{ label: t.memorization.record, onClick: () => setFormOpen(true) }}
      />

      <MemorizationFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} students={studentsLite} saving={saving} />
    </div>
  );
}
