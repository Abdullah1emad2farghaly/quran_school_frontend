import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput, Select } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const emptyForm = { name: "", capacity: "20", teacherId: "" };

export default function GroupFormModal({ open, onClose, onSubmit, initialData, teachers = [], saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { name: initialData.groupName,  capacity: initialData.maxStudents, teacherId: initialData.teacherId || "" }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    if (!form.teacherId) errs.teacherId = t.common.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, capacity: Number(form.capacity) || 20 });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t.groups.editGroup : t.groups.newGroup}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{isEdit ? t.common.save : t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 grid-col-1 gap-4">
          <Field label={t.groups.groupName} required error={errors.name}>
            <TextInput value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} error={errors.name} />
          </Field>
          <Field label={t.groups.capacity}>
            <TextInput type="number" min="1" dir="ltr" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
          </Field>
        </div>
        <Field label={t.groups.assignedTeacher} required error={errors.teacherId}>
          <Select value={form.teacherId} onChange={(e) => update("teacherId", e.target.value)} error={errors.teacherId}>
            <option value="">{t.common.selectOption}</option>
            {teachers.map((tc) => (
              <option key={tc.id} value={tc.id}>{tc.name}</option>
            ))}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
