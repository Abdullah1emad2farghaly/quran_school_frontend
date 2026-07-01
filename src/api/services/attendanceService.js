import httpClient from "../httpClient";
import { mockRequest, generateId } from "../mockAdapter";
import { MOCK_ATTENDANCE, MOCK_STUDENTS, MOCK_GROUPS } from "../../mock/seedData";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _attendance = [...MOCK_ATTENDANCE];

export async function getDailyAttendance(groupId, date) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const roster = MOCK_STUDENTS.filter((s) => s.groupId === groupId);
      const existing = _attendance.filter((a) => a.groupId === groupId && a.date === date);
      const byStudent = Object.fromEntries(existing.map((a) => [a.studentId, a.status]));
      const data = roster.map((s) => ({
        studentId: s.id,
        studentName: s.name,
        status: byStudent[s.id] || "present",
      }));
      return { data };
    });
  }
  const { data } = await httpClient.get(`/attendance/daily`, { params: { groupId, date } });
  return data;
}

export async function saveDailyAttendance(groupId, date, records) {
  // records: [{ studentId, status }]
  if (USE_MOCK) {
    return mockRequest(() => {
      _attendance = _attendance.filter((a) => !(a.groupId === groupId && a.date === date));
      const newEntries = records.map((r) => ({ id: generateId("ATT"), groupId, date, ...r }));
      _attendance = [..._attendance, ...newEntries];
      return { data: newEntries };
    });
  }
  const { data } = await httpClient.post(`/attendance/daily`, { groupId, date, records });
  return data;
}

export async function getGroupAttendanceRecords(studentId) {
  try {
    const res = await api.get(`/students/${studentId}/attendance`)
    return res.data.data.data.attendance
  }catch(error){
    throw error.response ? error.response.data : error;
  }
}

export async function getAttendanceReport({ groupId, from, to } = {}) {
  if (USE_MOCK) {
    return mockRequest(() => {
      let records = [..._attendance];
      if (groupId) records = records.filter((r) => r.groupId === groupId);
      if (from) records = records.filter((r) => r.date >= from);
      if (to) records = records.filter((r) => r.date <= to);

      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const late = records.filter((r) => r.status === "late").length;
      const excused = records.filter((r) => r.status === "excused").length;

      const byStudent = {};
      records.forEach((r) => {
        if (!byStudent[r.studentId]) byStudent[r.studentId] = { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
        byStudent[r.studentId][r.status] += 1;
        byStudent[r.studentId].total += 1;
      });

      const studentRows = Object.entries(byStudent).map(([studentId, stats]) => {
        const student = MOCK_STUDENTS.find((s) => s.id === studentId);
        return {
          studentId,
          studentName: student?.name ?? studentId,
          groupName: student?.groupName ?? "—",
          ...stats,
          rate: stats.total ? Math.round((stats.present / stats.total) * 100) : 0,
        };
      });

      return {
        data: {
          summary: { total, present, absent, late, excused, rate: total ? Math.round((present / total) * 100) : 0 },
          studentRows,
        },
      };
    });
  }
  const { data } = await httpClient.get("/attendance/report", { params: { groupId, from, to } });
  return data;
}
