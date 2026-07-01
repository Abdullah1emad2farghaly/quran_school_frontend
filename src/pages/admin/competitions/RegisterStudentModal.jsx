import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, Select } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";

export default function RegisterStudentModal({ open, onClose, onSubmit, tracks = [], students = [], saving }) {
  const { t } = useI18n();
  const [studentId, setStudentId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStudentId("");
      setTrackId(tracks[0]?.id || "");
      setError("");
    }
  }, [open, tracks]);

  const handleSubmit = () => {
    if (!studentId || !trackId) {
      setError(t.common.required);
      return;
    }
    onSubmit({ studentId, trackId });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.competitions.registerStudent}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving}>{t.common.saveCreate}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.memorization.selectStudent} required error={!studentId ? error : ""}>
          <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">{t.common.selectOption}</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.age})</option>
            ))}
          </Select>
        </Field>
        <Field label={t.competitions.filterByTrack} required>
          <Select value={trackId} onChange={(e) => setTrackId(e.target.value)}>
            {tracks.map((tr) => (
              <option key={tr.id} value={tr.id}>{tr.name}</option>
            ))}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
