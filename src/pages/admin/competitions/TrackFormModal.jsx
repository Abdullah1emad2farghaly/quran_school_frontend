import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const emptyForm = { name: "", requiredParts: "5", maxAge: "16" };

export default function TrackFormModal({ open, onClose, onSubmit, initialData, saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { name: initialData.name, requiredParts: String(initialData.requiredParts), maxAge: String(initialData.maxAge) }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: form.name, requiredParts: Number(form.requiredParts) || 1, maxAge: Number(form.maxAge) || 18 });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t.competitions.editTrack : t.competitions.newTrack}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{isEdit ? t.common.save : t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.competitions.trackName} required error={errors.name}>
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.competitions.requiredParts}>
            <TextInput type="number" min="1" max="30" dir="ltr" value={form.requiredParts} onChange={(e) => update("requiredParts", e.target.value)} />
          </Field>
          <Field label={t.competitions.maxAge}>
            <TextInput type="number" min="1" dir="ltr" value={form.maxAge} onChange={(e) => update("maxAge", e.target.value)} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
