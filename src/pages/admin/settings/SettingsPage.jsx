import React, { useEffect, useState } from "react";
import { Building2, Trophy, Wallet, Save } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { settingsApi } from "../../../api";
import { useToast } from "../../../context/ToastContext";

import PageHeader from "../../../components/admin/common/PageHeader";
import Card from "../../../components/admin/common/Card";
import Button from "../../../components/admin/common/Button";
import { Field, TextInput, TextArea, Select } from "../../../components/admin/common/FormFields";

const CURRENCIES = ["EGP", "USD", "SAR", "AED", "KWD"];

export default function SettingsPage() {
  const { t } = useI18n();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.getSettings().then((res) => setForm(res.data)).finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await settingsApi.updateSettings(form);
      setForm(res.data);
      toast.success(t.common.saved);
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="h-8 w-40 skeleton-surface animate-shimmer rounded" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-44 skeleton-surface animate-shimmer rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.settings.title}
        subtitle={t.settings.subtitle}
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>{t.settings.saveSettings}</Button>}
      />

      <div className="space-y-5 max-w-3xl">
        <Card title={t.settings.schoolInfo} headerActions={<Building2 size={18} className="text-primary" />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.settings.schoolName} className="col-span-2">
              <TextInput value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} />
            </Field>
            <Field label={t.settings.schoolPhone}>
              <TextInput dir="ltr" value={form.schoolPhone} onChange={(e) => update("schoolPhone", e.target.value)} />
            </Field>
            <Field label={t.settings.schoolEmail}>
              <TextInput dir="ltr" type="email" value={form.schoolEmail} onChange={(e) => update("schoolEmail", e.target.value)} />
            </Field>
            <Field label={t.settings.schoolAddress} className="col-span-2">
              <TextArea rows={2} value={form.schoolAddress} onChange={(e) => update("schoolAddress", e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title={t.settings.competitionSettings} headerActions={<Trophy size={18} className="text-gold" />}>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.settings.defaultMaxAge}>
              <TextInput type="number" dir="ltr" value={form.competitionDefaultMaxAge} onChange={(e) => update("competitionDefaultMaxAge", Number(e.target.value))} />
            </Field>
            <Field label={t.settings.registrationDeadlineDays}>
              <TextInput type="number" dir="ltr" value={form.registrationDeadlineDays} onChange={(e) => update("registrationDeadlineDays", Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <Card title={t.settings.subscriptionSettings} headerActions={<Wallet size={18} className="text-sky" />}>
          <div className="grid grid-cols-3 gap-4">
            <Field label={t.settings.monthlyFee}>
              <TextInput type="number" dir="ltr" value={form.monthlyFee} onChange={(e) => update("monthlyFee", Number(e.target.value))} />
            </Field>
            <Field label={t.settings.currency}>
              <Select value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label={t.settings.reminderDays}>
              <TextInput type="number" dir="ltr" value={form.paymentReminderDays} onChange={(e) => update("paymentReminderDays", Number(e.target.value))} />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}
