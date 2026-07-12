import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, FolderInput, FolderMinus, Download } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { studentsApi, groupsApi } from "../../../api";
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
import Modal from "../../../components/admin/common/Modal";
import { Field, Select } from "../../../components/admin/common/FormFields";
import StudentFormModal from "./StudentFormModal";
import axios from "axios";
import calculateAge from "../../../utils/CalculateAge";
import { listGroups } from "../../../api/services/groupsService";
import { listParents } from "../../../api/services/parentsService";
import HandleErrors from "../../../utils/HandleErrors";

export default function StudentsListPage() {
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();

  const [groupsLite, setGroupsLite] = useState([]);
  const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignGroupId, setAssignGroupId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [groups, setGroups] = useState([]);
  const [parents, setParents] = useState([]);

  const fetcher = useCallback((params) => studentsApi.listStudents(params), []);

  const dt = useDataTable(fetcher, { pageSize: 8 });


  const filterDefs = [
    { key: "groupId", label: t.students.filterByGroup, options: groupsLite.map((g) => ({ value: g.id, label: g.name })) },
    { key: "status", label: t.students.filterByStatus, options: [{ value: "active", label: t.common.active }, { value: "inactive", label: t.common.inactive }] },
    { key: "gender", label: t.students.filterByGender, options: [{ value: "male", label: t.common.male }, { value: "female", label: t.common.female }] },
  ];

  const openCreate = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };
  useEffect(() => {
    const Group = async () => {
      try {
        const res = await listGroups()
        setGroups(res.data);
        const parentsRes = await listParents()
        setParents(parentsRes.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }
    Group();
  }, []);

  // console.log(editingStudent)
  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      const group = groupsLite.find((g) => g.id === form.groupId);
      const payload = { ...form, groupId: form.groupId || null };
      if (editingStudent) {
        console.log(editingStudent)
        await studentsApi.updateStudent(editingStudent.id, payload);
        toast.success(t.common.saved);
      } else {
        await studentsApi.createStudent(payload);
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

  const handleDelete = async (student) => {
    const ok = await confirm({ body: t.students.deleteWarning });
    if (!ok) return;
    try {
      await studentsApi.deleteStudent(student.id);
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

  const handleRemoveFromGroup = async (student) => {
    const ok = await confirm({
      title: t.students.removeFromGroup,
      body: t.students.confirmRemoveFromGroup,
      confirmLabel: t.students.removeFromGroup,
    });
    if (!ok) return;
    try {
      await studentsApi.removeStudentFromGroup(student.id);
      toast.success(t.common.saved);
      dt.refresh();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const openAssign = (student) => {
    console.log(student)
    setAssignTarget(student);
    setAssignGroupId(student.groupId || "");
  };
  console.log(assignGroupId)

  const submitAssign = async () => {
    if (!assignGroupId) return;
    setAssigning(true);
    try {
      await studentsApi.assignStudentToGroup(assignTarget.id, assignGroupId);
      toast.success(t.common.saved);
      setAssignTarget(null);
      dt.refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.msg || t.common.somethingWrong);
    } finally {
      setAssigning(false);
    }
  };

  const handleExport = () => {
    exportToCSV(
      "students",
      dt.rows,
      [
        { key: "studentName", label: t.common.name },
        { key: "gender", label: t.common.gender },
        { key: "birthDate", label: t.common.age },
        { key: "groupName", label: t.students.currentGroup },
      ]
    );
    toast.success(t.common.export);
  };

  const columns = [
    {
      key: "studentName",
      label: t.common.name,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.studentName} size="sm" />
          <div>
            <p className="font-semibold text-ink leading-tight">{row.studentName}</p>
            <p className="text-[11.5px] text-ink-faint leading-tight nums-rtl">{row.parentPhone}</p>
          </div>
        </div>
      ),
    },
    { key: "birthDate", label: t.common.age, render: (row) => <span className="tabular">{calculateAge(row.birthDate)}</span> },
    {
      key: "groupName",
      label: t.students.currentGroup,
      render: (row) =>
        row.groupName ? (
          <span className="text-ink-soft font-medium">{row.groupName}</span>
        ) : (
          <span className="text-ink-faint italic">{t.students.noGroup}</span>
        ),
    },
    {
      key: "teacherName", label: t.common.teacherName, render: (row) =>
        row.teacherName ? (
          <span className="tabular font-semibold text-primary-dark">{row.teacherName}</span>
        ) : (
          <span className="text-ink-faint italic">{t.students.noGroup}</span>
        )
    },
    {
      key: "teacherPhone", label: t.common.teacherPhone, render: (row) =>
        row.teacherPhone ? (
          <span>{row.teacherPhone}</span>
        ) : (
          <span className="text-ink-faint italic">{t.students.noGroup}</span>
        )
    },
    {
      key: "actions",
      label: t.common.actions,
      className: "w-16",
      render: (row) => (
        <RowActions
          items={[
            { label: t.common.view, icon: Eye, onClick: () => navigate(`/admin/students/${row.id}`) },
            { label: t.common.edit, icon: Pencil, onClick: () => openEdit(row) },
            row.groupName
              ? { label: t.students.removeFromGroup, icon: FolderMinus, onClick: () => handleRemoveFromGroup(row) }
              : { label: t.students.assignToGroup, icon: FolderInput, onClick: () => openAssign(row) },
            { label: t.common.delete, icon: Trash2, danger: true, onClick: () => handleDelete(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.students.title}
        subtitle={t.students.subtitle}
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>
            <Button icon={Plus} onClick={openCreate}>{t.students.newStudent}</Button>
          </>
        }
      />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="flex-1 min-w-[240px]" />
        <FilterPopover
          filters={filterDefs}
          values={dt.filters}
          onChange={dt.updateFilter}
          onApply={dt.refresh}
          onReset={dt.resetFilters}
          activeCount={dt.activeFilterCount}
        />
      </div>

      <DataTable
        columns={columns}
        rows={dt.rows}
        loading={dt.loading}
        pagination={dt.pagination}
        onPageChange={dt.setPage}
        onRowClick={(row) => navigate(`/admin/students/${row.id}`)}
        emptyAction={{ label: t.students.newStudent, onClick: openCreate }}
      />

      <StudentFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingStudent}
        saving={saving}
        groups={groups}
        parents={parents}
      />

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={t.students.assignToGroup}
        subtitle={assignTarget?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssignTarget(null)}>{t.common.cancel}</Button>
            <Button onClick={submitAssign} loading={assigning} disabled={!assignGroupId}>{t.common.save}</Button>
          </>
        }
      >
        <Field label={t.students.selectGroupToAssign}>
          <Select value={assignGroupId} onChange={(e) => setAssignGroupId(e.target.value)}>
            <option value="">{t.common.selectOption}</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </Select>
        </Field>
      </Modal>
    </div>
  );
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)));
}
