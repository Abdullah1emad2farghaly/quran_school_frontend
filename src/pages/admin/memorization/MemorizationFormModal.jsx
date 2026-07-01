import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput, Select, TextArea } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

const SURAHS = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Yaseen",
  "Al-Mulk", "Al-Kahf", "Ar-Rahman", "Al-Waqi'ah", "An-Naba", "Al-Qiyamah",
];

const emptyForm = { studentId: "", surah: SURAHS[0], fromAyah: "1", toAyah: "10", grade: "good", teacherNote: "" };

export default function MemorizationFormModal({ open, onClose, onSubmit, students = [], saving }) {
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
    if (!form.studentId) errs.studentId = t.common.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, fromAyah: Number(form.fromAyah), toAyah: Number(form.toAyah) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.memorization.newRecord}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.memorization.selectStudent} required error={errors.studentId}>
          <Select value={form.studentId} onChange={(e) => update("studentId", e.target.value)} error={errors.studentId}>
            <option value="">{t.common.selectOption}</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </Field>

        <Field label={t.memorization.surah}>
          <Select value={form.surah} onChange={(e) => update("surah", e.target.value)}>
            {SURAHS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t.memorization.fromAyah}>
            <TextInput type="number" min="1" dir="ltr" value={form.fromAyah} onChange={(e) => update("fromAyah", e.target.value)} />
          </Field>
          <Field label={t.memorization.toAyah}>
            <TextInput type="number" min="1" dir="ltr" value={form.toAyah} onChange={(e) => update("toAyah", e.target.value)} />
          </Field>
        </div>

        <Field label={t.memorization.grade}>
          <Select value={form.grade} onChange={(e) => update("grade", e.target.value)}>
            <option value="excellent">{t.memorization.gradeLevels.excellent}</option>
            <option value="veryGood">{t.memorization.gradeLevels.veryGood}</option>
            <option value="good">{t.memorization.gradeLevels.good}</option>
            <option value="needsWork">{t.memorization.gradeLevels.needsWork}</option>
          </Select>
        </Field>

        <Field label={t.memorization.teacherNotes} hint={t.common.optional}>
          <TextArea value={form.teacherNote} onChange={(e) => update("teacherNote", e.target.value)} rows={3} />
        </Field>
      </div>
    </Modal>
  );
}
