import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_USERS } from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _users = [...MOCK_USERS];

export async function listUsers({ page = 1, pageSize = 10, search = "", role, status } = {}) {
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_users, { page, pageSize, search, searchFields: ["name", "email"], filters: { role, status } })
    );
  }
  const { data } = await httpClient.get("/users", { params: { page, pageSize, search, role, status } });
  return data;
}

export async function createUser(payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const newUser = { id: generateId("U"), status: "active", lastLogin: null, ...payload };
      _users = [newUser, ..._users];
      return { data: newUser };
    });
  }
  const { data } = await httpClient.post("/users", payload);
  return data;
}

export async function updateUser(id, payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _users = _users.map((u) => (u.id === id ? { ...u, ...payload } : u));
      return { data: _users.find((u) => u.id === id) };
    });
  }
  const { data } = await httpClient.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _users = _users.filter((u) => u.id !== id);
      return { data: { id } };
    });
  }
  const { data } = await httpClient.delete(`/users/${id}`);
  return data;
}
