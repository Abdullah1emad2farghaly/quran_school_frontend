

import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_STUDENTS, MOCK_GROUPS } from "../../mock/seedData";
import axios from "axios";
import { useEffect, useState } from "react";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

// In-memory mutable store for the mock session.
let _students = [...MOCK_STUDENTS];

export async function listStudents({ page = 1, pageSize = 10, search = "", groupId, status, gender } = {}) {
  // const [_students, setStudents] = useState([]);
  
  if (USE_MOCK) {
    let res;
    try{
      res = await api.get("/students")
    }catch(error) {
      throw error.response ? error.response.data : error;
    }
  
  
    // console.log(res);
    return mockRequest(() =>
      paginate(res.data.data.data.students, {
        page,
        pageSize,
        search,
        searchFields: ["studentName", "guardianName", "phone"],
        filters: { groupId, status, gender },
      })
    );
  }

  // const { data } = await axios.get("/students", { params: { page, pageSize, search, groupId, status, gender } });
  // console.log(data);
  // return data;
}

export async function getStudent(id) {
  try {
    const res = await api.get(`/students/${id}`)
    return res.data.data.data.student;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function createStudent(payload) {
  try{
    const res = await api.post("/students", payload)
  }catch(error) {
    throw error.response ? error.response.data : error;
  }
}

export async function updateStudent(id, payload) {
  console.log(id, payload)
  try {
    const res = await api.patch(`/students/${id}`, payload)
    return res.data;
  }catch(error) {
    throw error.response ? error.response.data : error;
  }
}

export async function deleteStudent(id) {
  try {
    const res = await api.delete(`/students/${id}`)
    return res.data;
  }catch(error) {
    throw error.response ? error.response.data : error;
  }
}

export async function assignStudentToGroup(studentId, groupId) {
  try {
    const res = await api.patch(`/students/${studentId}/assign-to-group`, { groupId })
    return res.data;
  }catch(error) {
    throw error.response ? error.response.data : error;
  }
}

export async function removeStudentFromGroup(studentId) {
  try {
    const res = await api.patch(`/students/${studentId}/remove-from-group`)
    return res.data;
  }catch(error) {
    throw error.response ? error.response.data : error;
  }
}

export async function getStudentsByGroup(groupId) {
  if (USE_MOCK) {
    return mockRequest(() => ({ data: _students.filter((s) => s.groupId === groupId) }));
  }
  const { data } = await httpClient.get(`/groups/${groupId}/students`);
  return data;
}
