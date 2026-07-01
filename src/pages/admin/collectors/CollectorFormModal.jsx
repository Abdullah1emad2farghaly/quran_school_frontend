import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const emptyForm = { name: "", phone: "", email: "" };

export default function CollectorFormModal({ open, onClose, onSubmit, initialData, saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { name: initialData.name, phone: initialData.phone, email: initialData.email }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    if (!form.phone.trim()) errs.phone = t.common.required;
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
      title={isEdit ? t.collectors.editCollector : t.collectors.newCollector}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{isEdit ? t.common.save : t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.common.name} required error={errors.name}>
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
        </Field>
        <Field label={t.common.phone} required error={errors.phone}>
          <TextInput dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
        </Field>
        <Field label={t.common.email} hint={t.common.optional}>
          <TextInput dir="ltr" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
