import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_MEMORIZATION, MOCK_STUDENTS } from "../../mock/seedData";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _records = [...MOCK_MEMORIZATION];

export async function listMemorizationRecords({ page = 1, pageSize = 10, search = "", studentId, grade } = {}) {
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(
        [..._records].sort((a, b) => (a.date < b.date ? 1 : -1)),
        { page, pageSize, search, searchFields: ["studentName", "surah"], filters: { studentId, grade } }
      )
    );
  }
  const { data } = await httpClient.get("/memorization", { params: { page, pageSize, search, studentId, grade } });
  return data;
}

export async function getStudentMemorizationHistory(id) {
  try{
    const res = await api.get(`/students/${id}/memorization`);
    return res.data.data.data;
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function getStudentProgress(studentId) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const student = MOCK_STUDENTS.find((s) => s.id === studentId);
      const records = _records.filter((r) => r.studentId === studentId);
      const gradeCounts = records.reduce((acc, r) => {
        acc[r.grade] = (acc[r.grade] || 0) + 1;
        return acc;
      }, {});
      return {
        data: {
          memorizedParts: student?.memorizedParts ?? 0,
          totalParts: 30,
          recordsCount: records.length,
          gradeCounts,
        },
      };
    });
  }
  const { data } = await httpClient.get(`/students/${studentId}/progress`);
  return data;
}

export async function createMemorizationRecord(payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const student = MOCK_STUDENTS.find((s) => s.id === payload.studentId);
      const newRecord = {
        id: generateId("MEM"),
        date: new Date().toISOString().slice(0, 10),
        studentName: student?.name,
        groupId: student?.groupId,
        ...payload,
      };
      _records = [newRecord, ..._records];
      return { data: newRecord };
    });
  }
  const { data } = await httpClient.post("/memorization", payload);
  return data;
}

export async function getMemorizationReport({ groupId } = {}) {
  if (USE_MOCK) {
    return mockRequest(() => {
      let records = [..._records];
      if (groupId) records = records.filter((r) => r.groupId === groupId);
      const gradeDistribution = records.reduce((acc, r) => {
        acc[r.grade] = (acc[r.grade] || 0) + 1;
        return acc;
      }, {});
      return { data: { totalRecords: records.length, gradeDistribution } };
    });
  }
  const { data } = await httpClient.get("/memorization/report", { params: { groupId } });
  return data;
}


export const createMemorizationAssignment = async (groupId, payload) => {
  try {
    const res = await api.post(`memorization/assignments/${groupId}`, payload);
    return res.data;
  }catch(error){
    console.log(error.response.data)
    throw error.response ? error.response.data : error;
  }
};

export const createRevisionAssignment = async (groupId, payload) => {
  try {
    const res = await api.post(`memorization/assignments/${groupId}`, payload);
    return res.data;
  }catch(error){
    console.log(error.response.data)
    throw error.response ? error.response.data : error;
  }
};

// export const getAssignments = async (sessionId) => {
//   try {
//     const res = await api.get(`memorization/assignments/${sessionId}`);
//     return res.data.data;
//   }catch(error){
//     throw error.response ? error.response.data : error;
//   }
// };