import httpClient from "../httpClient";
import { mockRequest, paginate } from "../mockAdapter";
import { MOCK_SUBSCRIPTIONS } from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _subscriptions = [...MOCK_SUBSCRIPTIONS];

export async function listSubscriptions({ page = 1, pageSize = 10, search = "", status, month, collectorId } = {}) {
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_subscriptions, {
        page,
        pageSize,
        search,
        searchFields: ["studentName"],
        filters: { status, month, collectorId },
      })
    );
  }
  const { data } = await httpClient.get("/subscriptions", { params: { page, pageSize, search, status, month, collectorId } });
  return data;
}

export async function markSubscriptionPaid(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _subscriptions = _subscriptions.map((s) =>
        s.id === id ? { ...s, status: "paid", paymentDate: new Date().toISOString().slice(0, 10) } : s
      );
      return { data: _subscriptions.find((s) => s.id === id) };
    });
  }
  const { data } = await httpClient.put(`/subscriptions/${id}/mark-paid`);
  return data;
}

export async function getSubscriptionReport() {
  if (USE_MOCK) {
    return mockRequest(() => {
      const totalCollected = _subscriptions.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
      const totalDue = _subscriptions.filter((s) => s.status === "unpaid").reduce((sum, s) => sum + s.amount, 0);
      const paidCount = _subscriptions.filter((s) => s.status === "paid").length;
      const unpaidCount = _subscriptions.filter((s) => s.status === "unpaid").length;
      const rate = paidCount + unpaidCount ? Math.round((paidCount / (paidCount + unpaidCount)) * 100) : 0;

      const byMonth = {};
      _subscriptions.forEach((s) => {
        const key = `${s.month} ${s.year}`;
        if (!byMonth[key]) byMonth[key] = { paid: 0, unpaid: 0 };
        byMonth[key][s.status] += 1;
      });

      return { data: { totalCollected, totalDue, paidCount, unpaidCount, rate, byMonth } };
    });
  }
  const { data } = await httpClient.get("/subscriptions/report");
  return data;
}
