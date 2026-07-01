import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, MapPin, Calendar, Download } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { competitionsApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";
import { exportToCSV } from "../../../utils/helpers";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import { CompetitionStatusBadge } from "../../../components/admin/common/Badge";
import CompetitionFormModal from "./CompetitionFormModal";

export default function CompetitionsListPage() {
  const { t, formatDate } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => competitionsApi.listCompetitions(params), []);
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
    { key: "status", label: t.common.status, options: ["upcoming", "ongoing", "completed"].map((s) => ({ value: s, label: t.competitions.statusLabels[s] })) },
  ];

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (comp) => { setEditing(comp); setFormOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await competitionsApi.updateCompetition(editing.id, form);
        toast.success(t.common.saved);
      } else {
        await competitionsApi.createCompetition(form);
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

  const handleDelete = async (comp) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await competitionsApi.deleteCompetition(comp.id);
      toast.success(t.common.deleted);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const handleExport = () => {
    exportToCSV("competitions", dt.rows, [
      { key: "name", label: t.common.name },
      { key: "startDate", label: t.competitions.startDate },
      { key: "endDate", label: t.competitions.endDate },
      { key: "location", label: t.competitions.location },
      { key: "status", label: t.common.status },
    ]);
    toast.success(t.common.export);
  };

  const columns = [
    {
      key: "name",
      label: t.common.name,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-[11.5px] text-ink-faint flex items-center gap-1 mt-0.5"><MapPin size={11} /> {row.location}</p>
        </div>
      ),
    },
    {
      key: "dates",
      label: `${t.competitions.startDate} – ${t.competitions.endDate}`,
      render: (row) => (
        <span className="text-[13px] text-ink-soft font-medium nums-ltr flex items-center gap-1.5">
          <Calendar size={13} className="text-ink-faint" />
          {formatDate(row.startDate)} – {formatDate(row.endDate)}
        </span>
      ),
    },
    { key: "tracks", label: t.competitions.tracks, render: (row) => <span className="tabular font-semibold text-ink-soft">{row.tracks.length}</span> },
    { key: "status", label: t.common.status, render: (row) => <CompetitionStatusBadge status={row.status} t={t} /> },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.competitions.details, icon: Eye, onClick: () => navigate(`/competitions/${row.id}`) },
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
        title={t.competitions.title}
        subtitle={t.competitions.subtitle}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>
            <Button icon={Plus} onClick={openCreate}>{t.competitions.newCompetition}</Button>
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
        onRowClick={(row) => navigate(`/competitions/${row.id}`)}
        emptyAction={{ label: t.competitions.newCompetition, onClick: openCreate }}
      />

      <CompetitionFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} saving={saving} />
    </div>
  );
}
