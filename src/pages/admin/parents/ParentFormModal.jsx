import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";


export default function ParentFormModal({ open, onClose, password, onSubmit, initialData, saving }) {
  const emptyForm = { name: "", phone: "", password: `${password}`, role: "Parent" };

  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(initialData ? { name: initialData.name, phone: initialData.phone } : emptyForm);
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
      title={isEdit ? t.parents.editParent : t.parents.newParent}
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
        <div className={`grid ${!initialData && 'grid-cols-2'} gap-4`}>
          <Field label={t.common.phone} required error={errors.phone}>
            <TextInput type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
          </Field>
          {
            !initialData && (
              <Field label={t.common.password}>
                <TextInput dir="ltr" disabled value={form.password} onChange={(e) => update("password", e.target.value)} />
              </Field>
            )
          }
        </div>
      </div>
    </Modal>
  );
}
