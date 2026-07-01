import React, { useCallback, useState } from "react";
import { Plus, Trash2, ShieldCheck, GraduationCap, UsersRound, Banknote } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { usersApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { useConfirm } from "../../../context/ConfirmContext";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable, { RowActions } from "../../../components/admin/common/DataTable";
import Avatar from "../../../components/admin/common/Avatar";
import Badge, { StatusBadge } from "../../../components/admin/common/Badge";
import UserFormModal from "./UserFormModal";

const ROLE_ICONS = { admin: ShieldCheck, teacher: GraduationCap, parent: UsersRound, collector: Banknote };
const ROLE_TONES = { admin: "gold", teacher: "green", parent: "sky", collector: "amber" };

export default function UsersRolesPage() {
  const { t, formatDate } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetcher = useCallback((params) => usersApi.listUsers(params), []);
  const dt = useDataTable(fetcher, { pageSize: 10 });

  const filterDefs = [
    {
      key: "role",
      label: t.users.filterByRole,
      options: ["admin", "teacher", "parent", "collector"].map((r) => ({ value: r, label: t.users.roles[r] })),
    },
  ];

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      await usersApi.createUser(form);
      toast.success(t.common.created);
      setFormOpen(false);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    const ok = await confirm({});
    if (!ok) return;
    try {
      await usersApi.deleteUser(u.id);
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
          <div>
            <p className="font-semibold text-ink">{row.name}</p>
            <p className="text-[11.5px] text-ink-faint nums-ltr">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: t.users.role,
      render: (row) => {
        const Icon = ROLE_ICONS[row.role] || ShieldCheck;
        return (
          <Badge tone={ROLE_TONES[row.role] || "neutral"}>
            <Icon size={12} /> {t.users.roles[row.role] || row.role}
          </Badge>
        );
      },
    },
    {
      key: "lastLogin",
      label: t.users.lastLogin,
      render: (row) => <span className="text-ink-faint text-[13px] nums-ltr">{row.lastLogin ? formatDate(row.lastLogin) : t.users.never}</span>,
    },
    { key: "status", label: t.common.status, render: (row) => <StatusBadge status={row.status} t={t} /> },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions items={[{ label: t.common.delete, icon: Trash2, danger: true, onClick: () => handleDelete(row) }]} />
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.users.title}
        subtitle={t.users.subtitle}
        actions={<Button icon={Plus} onClick={() => setFormOpen(true)}>{t.users.newUser}</Button>}
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="flex-1 min-w-[240px]" />
        <FilterPopover filters={filterDefs} values={dt.filters} onChange={dt.updateFilter} onApply={dt.refresh} onReset={dt.resetFilters} activeCount={dt.activeFilterCount} />
      </div>

      <DataTable columns={columns} rows={dt.rows} loading={dt.loading} pagination={dt.pagination} onPageChange={dt.setPage} />

      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
