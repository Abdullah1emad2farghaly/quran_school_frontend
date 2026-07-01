import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const emptyForm = { name: "", startDate: "", endDate: "", location: "" };

export default function CompetitionFormModal({ open, onClose, onSubmit, initialData, saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { name: initialData.name, startDate: initialData.startDate, endDate: initialData.endDate, location: initialData.location }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    if (!form.startDate) errs.startDate = t.common.required;
    if (!form.endDate) errs.endDate = t.common.required;
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
      title={isEdit ? t.competitions.editCompetition : t.competitions.newCompetition}
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
        <div className="grid grid-cols-2 gap-4">
          <Field label={t.competitions.startDate} required error={errors.startDate}>
            <TextInput type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} error={errors.startDate} />
          </Field>
          <Field label={t.competitions.endDate} required error={errors.endDate}>
            <TextInput type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} error={errors.endDate} />
          </Field>
        </div>
        <Field label={t.competitions.location} hint={t.common.optional}>
          <TextInput value={form.location} onChange={(e) => update("location", e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
