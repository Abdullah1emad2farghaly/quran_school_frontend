import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput, Select } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const emptyForm = { name: "", email: "", role: "teacher" };

export default function UserFormModal({ open, onClose, onSubmit, saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    if (!form.email.trim()) errs.email = t.common.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.users.newUser}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.common.name} required error={errors.name}>
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
        </Field>
        <Field label={t.common.email} required error={errors.email}>
          <TextInput dir="ltr" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
        </Field>
        <Field label={t.users.role} required>
          <Select value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="admin">{t.users.roles.admin}</option>
            <option value="teacher">{t.users.roles.teacher}</option>
            <option value="parent">{t.users.roles.parent}</option>
            <option value="collector">{t.users.roles.collector}</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
