import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_PARENTS, MOCK_STUDENTS } from "../../mock/seedData";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _parents = [...MOCK_PARENTS];

export async function listParents({ page = 1, pageSize = 10, search = "", status } = {}) {
  try {
    const res = await api.get("/parents");
    _parents = res.data.data.data.parents;
    // console.log(_parents)
  }catch(error) {
    throw error.response || error?.response.data || error;
  }
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_parents, {
        page,
        pageSize,
        search,
        searchFields: ["name", "phone"],
        filters: { status },
      })
    );
  }
  const { data } = await httpClient.get("/parents", { params: { page, pageSize, search, status } });
  return data;
}

export async function getParent(id) {
  try{
    const res = await api.get(`/parents/${id}`)
    return res.data.data.data.parent;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function createParent(payload) {
  try{
    const res = await api.post("/users", payload)
    return res.data;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function updateParent(id, payload) {
  try{
    const res = await api.patch(`/users/${id}`, payload)
    return res.data.data.data.user;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function deleteParent(id) {
  try{
    const res = await api.delete(`/users/${id}`)
    console.log(res.data)
    return res.data;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function getParentChildren(parentId) {
  try{
    const res = await api.get(`/parents/${parentId}/children`)
    return res.data.data.data.children;
  }catch(error){
    console.log(error.response ? error.response.data : error)
    throw error.response ? error.response.data : error;
  }
}
