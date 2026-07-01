import React, { useEffect, useState } from "react";
import Modal from "../../../components/admin/common/Modal";
import Button from "../../../components/admin/common/Button";
import { Field, Select } from "../../../components/admin/common/FormFields";
import { useI18n } from "../../../i18n/I18nContext";
import { DAY_KEYS } from "../../../utils/helpers";

const emptyForm = {
  day: "sat",
  startTime: "16:00",
  endTime: "17:30",
};

export default function ScheduleDayModal({
  open,
  onClose,
  onSubmit,
  initialData,
  saving,
}) {
  const { t } = useI18n();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              day: initialData.day,
              startTime: initialData.startTime,
              endTime: initialData.endTime,
            }
          : emptyForm
      );
      setError("");
    }
  }, [open, initialData]);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  
  const handleSubmit = async () => {
    
    if (!form.startTime || !form.endTime) {
      setError(t.common.required);
      return;
    }

    if (form.endTime <= form.startTime) {
      setError(
        t.schedule.invalidTime ||
          "End time must be later than start time."
      );
      return;
    }

    setError("");
    onSubmit(form);
  };
  const days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
  const s = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t.schedule.editDay : t.schedule.addDay}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.common.cancel}
          </Button>

          <Button onClick={handleSubmit} loading={saving}>
            {isEdit ? t.common.save : t.common.saveCreate}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t.schedule.dayOfWeek}>
          <Select
            value={s[days.indexOf(form.day)]}
            onChange={(e) => update("day", e.target.value)}
          >
            {DAY_KEYS.map((day) => (
              <option key={day} value={day} defaultValue={days[s.indexOf(day)]}  >
                {t.schedule.days[day]}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t.schedule.startTime}>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => update("startTime", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 nums-ltr"
            />
          </Field>

          <Field label={t.schedule.endTime} error={error}>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => update("endTime", e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm nums-ltr focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              }`}
            />
          </Field>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}