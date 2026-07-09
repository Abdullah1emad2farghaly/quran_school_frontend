import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_TEACHERS, MOCK_GROUPS } from "../../mock/seedData";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _teachers = [...MOCK_TEACHERS];

export async function listTeachers({ page = 1, pageSize = 10, search = "", status } = {}) {
  let res;
  try{
    res = await api.get("/teachers");
    _teachers = res.data.data
  }catch(error){
    throw error.response?.data
  }

  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_teachers, {
        page,
        pageSize,
        search,
        searchFields: ["name", "phone"],
        filters: { status },
      })
    );
  }
  const { data } = await httpClient.get("/teachers", { params: { page, pageSize, search, status } });
  return data;
}

export async function getTeacher(id) {
  try{
    const res = await api.get(`/teachers/${id}`);
    // console.log(res.data.data)
    return res.data.data
  }catch(error){
    throw error.response?.data
  }
}

export async function createTeacher(payload) {
  try{
    const res = await api.post("/users", payload);

    return res.data.data
  }catch(error){
    throw error.response?.data
  }
}

export async function updateTeacher(id, payload) {
  try{
    const res = await api.patch(`/users/${id}`, payload);
    return res.data.data
  }catch(error){
    // console.log(error.response?.data)
    throw error.response?.data
  }
}

export async function deleteTeacher(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _teachers = _teachers.filter((t) => t.id !== id);
      return { data: { id } };
    });
  }
  const { data } = await httpClient.delete(`/teachers/${id}`);
  return data;
}

export async function getTeacherGroups(teacherId) {
  if (USE_MOCK) {
    return mockRequest(() => ({ data: MOCK_GROUPS.filter((g) => g.teacherId === teacherId) }));
  }
  const { data } = await httpClient.get(`/teachers/${teacherId}/groups`);
  return data;
}

export async function getMyGroups (){
  try {
    const res = await api.get("/teachers/my-groups")
    console.log(res.data.data)
    return res.data.data;
  }catch(error) {
    console.log(error.response?.data)
    throw error.response?.data
  }
}

export async function getTeacherStudents(teacherId) {


}

export async function getGroupStudents(groupId) {
  try {
    const res = await api.get(`/teachers/my-groups/${groupId}`)
    
    return res.data.data.data;
  }catch(error) {
    console.log(error?.response?.data)
    throw error?.response.data
  }
}

export async function createGroupAttendance(payload) {
  try {
    const res = await api.post(`/attendance`, payload)
    return res.data.data;
  }catch(error) {
    console.log(error?.response?.data)
    throw error?.response.data
  }
}