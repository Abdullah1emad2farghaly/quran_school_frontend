import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_COLLECTORS, MOCK_SUBSCRIPTIONS } from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _collectors = [...MOCK_COLLECTORS];

export async function listCollectors({ page = 1, pageSize = 10, search = "" } = {}) {
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_collectors, { page, pageSize, search, searchFields: ["name", "phone", "email"] })
    );
  }
  const { data } = await httpClient.get("/collectors", { params: { page, pageSize, search } });
  return data;
}

export async function getCollector(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const c = _collectors.find((x) => x.id === id);
      if (!c) throw new Error("Collector not found");
      return { data: c };
    });
  }
  const { data } = await httpClient.get(`/collectors/${id}`);
  return data;
}

export async function createCollector(payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const newCollector = { id: generateId("COL"), status: "active", assignedStudentsCount: 0, joinDate: new Date().toISOString().slice(0, 10), ...payload };
      _collectors = [newCollector, ..._collectors];
      return { data: newCollector };
    });
  }
  const { data } = await httpClient.post("/collectors", payload);
  return data;
}

export async function updateCollector(id, payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _collectors = _collectors.map((c) => (c.id === id ? { ...c, ...payload } : c));
      return { data: _collectors.find((c) => c.id === id) };
    });
  }
  const { data } = await httpClient.put(`/collectors/${id}`, payload);
  return data;
}

export async function deleteCollector(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _collectors = _collectors.filter((c) => c.id !== id);
      return { data: { id } };
    });
  }
  const { data } = await httpClient.delete(`/collectors/${id}`);
  return data;
}

export async function getCollectorStatistics(collectorId) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.collectorId === collectorId);
      const collected = subs.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
      const pending = subs.filter((s) => s.status === "unpaid").reduce((sum, s) => sum + s.amount, 0);
      return {
        data: {
          totalCollected: collected,
          totalPending: pending,
          studentsHandled: new Set(subs.map((s) => s.studentId)).size,
          history: subs.slice(0, 20),
        },
      };
    });
  }
  const { data } = await httpClient.get(`/collectors/${collectorId}/statistics`);
  return data;
}
