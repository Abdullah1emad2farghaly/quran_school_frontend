import httpClient from "../httpClient";
import { mockRequest } from "../mockAdapter";
import { MOCK_SETTINGS } from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _settings = { ...MOCK_SETTINGS };

export async function getSettings() {
  if (USE_MOCK) {
    return mockRequest(() => ({ data: _settings }), { latency: 200 });
  }
  const { data } = await httpClient.get("/settings");
  return data;
}

export async function updateSettings(payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _settings = { ..._settings, ...payload };
      return { data: _settings };
    });
  }
  const { data } = await httpClient.put("/settings", payload);
  return data;
}
