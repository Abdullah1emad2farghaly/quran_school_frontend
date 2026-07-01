import React, { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, Wallet, TrendingUp, Download, Check } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import { subscriptionsApi } from "../../../api";
import { useDataTable } from "../../../hooks/useDataTable";
import { useToast } from "../../../context/ToastContext";
import { exportToCSV, formatCurrency } from "../../../utils/helpers";

import PageHeader from "../../../components/admin/common/PageHeader";
import SearchInput from "../../../components/admin/common/SearchInput";
import FilterPopover from "../../../components/admin/common/FilterPopover";
import Button from "../../../components/admin/common/Button";
import DataTable from "../../../components/admin/common/DataTable";
import { PaidBadge } from "../../../components/admin/common/Badge";
import Tabs from "../../../components/admin/common/Tabs";
import Card from "../../../components/admin/common/Card";
import StatCard from "../../../components/admin/common/StatCard";
import DonutChart from "../../../components/admin/charts/DonutChart";
import Avatar from "../../../components/admin/common/Avatar";

export default function SubscriptionsPage() {
  const { t, formatDate, formatNumber, lang } = useI18n();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("monthly");

  const fetcher = useCallback((params) => subscriptionsApi.listSubscriptions(params), []);
  const dt = useDataTable(fetcher, { pageSize: 10 });

  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  const loadReport = useCallback(() => {
    setReportLoading(true);
    subscriptionsApi.getSubscriptionReport().then((res) => setReport(res.data)).finally(() => setReportLoading(false));
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  const filterDefs = [
    { key: "status", label: t.common.status, options: [
      { value: "paid", label: t.common.paid },
      { value: "unpaid", label: t.common.unpaid },
    ] },
  ];

  const handleMarkPaid = async (sub) => {
    try {
      await subscriptionsApi.markSubscriptionPaid(sub.id);
      toast.success(t.common.saved);
      dt.refresh();
      loadReport();
    } catch (err) {
      toast.error(err.message || t.common.somethingWrong);
    }
  };

  const handleExport = () => {
    exportToCSV("subscriptions", dt.rows, [
      { key: "studentName", label: t.common.name },
      { key: "month", label: t.subscriptions.month },
      { key: "amount", label: t.subscriptions.amount },
      { key: "status", label: t.common.status },
      { key: "paymentDate", label: t.subscriptions.paymentDate },
      { key: "collectorName", label: t.subscriptions.collector },
    ]);
    toast.success(t.common.export);
  };

  const columns = [
    {
      key: "studentName",
      label: t.common.name,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.studentName} size="sm" />
          <span className="font-semibold text-ink">{row.studentName}</span>
        </div>
      ),
    },
    { key: "month", label: t.subscriptions.month, render: (row) => <span className="nums-ltr text-ink-soft font-medium">{row.month} {row.year}</span> },
    { key: "amount", label: t.subscriptions.amount, render: (row) => <span className="font-semibold text-ink tabular nums-ltr">{formatCurrency(row.amount, "EGP", lang)}</span> },
    { key: "collectorName", label: t.subscriptions.collector, render: (row) => <span className="text-ink-soft">{row.collectorName}</span> },
    { key: "status", label: t.common.status, render: (row) => <PaidBadge status={row.status} t={t} /> },
    {
      key: "actions",
      label: t.common.actions,
      render: (row) =>
        row.status === "unpaid" ? (
          <Button size="sm" variant="secondary" icon={Check} onClick={() => handleMarkPaid(row)}>
            {t.subscriptions.markPaid}
          </Button>
        ) : (
          <span className="text-[12px] text-ink-faint nums-ltr">{formatDate(row.paymentDate)}</span>
        ),
    },
  ];

  const tabs = [
    { key: "monthly", label: t.subscriptions.tabs.monthly },
    { key: "reports", label: t.subscriptions.tabs.reports },
  ];

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={t.subscriptions.title}
        subtitle={t.subscriptions.subtitle}
        actions={activeTab === "monthly" && <Button variant="secondary" icon={Download} onClick={handleExport}>{t.common.export}</Button>}
      />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-5">
        {activeTab === "monthly" && (
          <>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <SearchInput value={dt.search} onChange={dt.setSearch} placeholder={t.topbar.searchPlaceholder} className="flex-1 min-w-[240px]" />
              <FilterPopover filters={filterDefs} values={dt.filters} onChange={dt.updateFilter} onApply={dt.refresh} onReset={dt.resetFilters} activeCount={dt.activeFilterCount} />
            </div>
            <DataTable columns={columns} rows={dt.rows} loading={dt.loading} pagination={dt.pagination} onPageChange={dt.setPage} />
          </>
        )}

        {activeTab === "reports" && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <StatCard
                label={t.subscriptions.totalCollected}
                value={report ? formatCurrency(report.totalCollected, "EGP", lang) : "—"}
                icon={Wallet}
                tone="primary"
                loading={reportLoading}
              />
              <StatCard
                label={t.subscriptions.totalDue}
                value={report ? formatCurrency(report.totalDue, "EGP", lang) : "—"}
                icon={CircleDollarSign}
                tone="rose"
                loading={reportLoading}
              />
              <StatCard
                label={t.subscriptions.collectionRate}
                value={report ? `${formatNumber(report.rate)}%` : "—"}
                icon={TrendingUp}
                tone="gold"
                loading={reportLoading}
              />
            </div>

            <Card title={t.dashboard.subBreakdown}>
              {reportLoading || !report ? (
                <div className="h-44 skeleton-surface animate-shimmer rounded-xl" />
              ) : (
                <div className="flex items-center gap-8 flex-wrap">
                  <DonutChart
                    data={[
                      { name: t.common.paid, value: report.paidCount },
                      { name: t.common.unpaid, value: report.unpaidCount },
                    ]}
                    colors={["#0d6e5e", "#b5483f"]}
                    centerValue={formatNumber(report.paidCount + report.unpaidCount)}
                    centerLabel={t.subscriptions.monthly}
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-ink-soft">{t.common.paid}</span>
                      <span className="text-sm font-bold text-ink tabular">{formatNumber(report.paidCount)}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-rose shrink-0" />
                      <span className="text-sm text-ink-soft">{t.common.unpaid}</span>
                      <span className="text-sm font-bold text-ink tabular">{formatNumber(report.unpaidCount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
