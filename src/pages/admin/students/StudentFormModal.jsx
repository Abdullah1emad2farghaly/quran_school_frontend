import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput, Select } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";
import { listGroups } from "../../../api/services/groupsService";
import { listParents } from "../../../api/services/parentsService";

const emptyForm = {
  name: "",
  gender: "male",
  birthDate: "",
  groupId: "",
  parentId: "",
};

export default function StudentFormModal({ open, onClose, groups, parents, onSubmit, initialData, saving }) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
 
  

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
            name: initialData.studentName || "",
            gender: initialData.gender || "male",
            birthDate: initialData.birthDate.split("T")[0] || "",
            groupId: initialData.groupId || "",
          }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialData]);

  

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t.common.required;
    if (!form.birthDate) errs.birthDate = t.common.required;
    if (!form?.parentId?.trim()) errs.guardianName = t.common.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    // if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t.students.editStudent : t.students.newStudent}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{isEdit ? t.common.save : t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.common.name} required error={errors.name}>
          <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={t.common.name} error={errors.name} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t.common.gender} required>
            <Select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              <option value="male">{t.common.male}</option>
              <option value="female">{t.common.female}</option>
            </Select>
          </Field>
          <Field label={t.students.birthDate} required error={errors.birthDate}>
            <TextInput type="date" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} error={errors.birthDate} />
          </Field>
        </div>

        {/* <Field label={t.students.guardianName} required error={errors.guardianName}>
          <TextInput value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} placeholder={t.students.guardianName} error={errors.guardianName} />
        </Field> */}

        {/* <Field label={t.common.phone} hint={t.common.optional}>
          <TextInput type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 10 1234 5678" />
        </Field> */}

        {
          !initialData && (
            <Field label={t.students.guardianName} required error={errors.guardianName}>
              <Select value={form.parentId} onChange={(e) => update("parentId", e.target.value)}>
                <option value="">{t.students.noGroup}</option>
                {parents?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
          )
        }
        <Field label={t.students.currentGroup}>
          <Select value={form.groupId} onChange={(e) => update("groupId", e.target.value)}>
            <option value="">{t.students.noGroup}</option>
            {groups?.map((g) => (
              <option key={g.id} value={g.id}>{g.groupName}</option>
            ))}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
