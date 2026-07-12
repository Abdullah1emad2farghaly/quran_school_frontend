import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_GROUPS, MOCK_TEACHERS, MOCK_STUDENTS } from "../../mock/seedData";
import api from "./api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _groups = [...MOCK_GROUPS];

export async function listGroups({ page = 1, pageSize = 10, search = "", status, level } = {}) {
  try {
    const res = await api.get("/groups")
    _groups = res.data.data.groups;
  } catch (error) {
    console.log(error)
  }
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_groups, {
        page,
        pageSize,
        search,
        searchFields: ["groupName", "teacherName"],
        filters: { status, level },
      })
    );
  }
  const { data } = await httpClient.get("/groups", { params: { page, pageSize, search, status, level } });
  return data;
}

export async function getAllGroupsLite() {
  // Unpaginated lightweight list, useful for select dropdowns.
  if (USE_MOCK) {
    return mockRequest(() => ({ data: _groups.map((g) => ({ id: g.id, name: g.name })) }), { latency: 150 });
  }
  const { data } = await httpClient.get("/groups/lite");
  return data;
}

export async function getGroup(id) {
  let res;
  try {
    res = await api.get(`/groups/${id}`)
    console.log(res.data.data.data.group)
  } catch (error) {
    console.log(error.response?.data)
    throw error.response?.data;
  }
  if (USE_MOCK) {
    return mockRequest(() => {
      // const group = _groups.find((g) => g.id === id);
      // if (!group) throw new Error("Group not found");
      return { data: res.data.data.data.group };
    });
  }
  const { data } = await httpClient.get(`/groups/${id}`);
  return data;
}

export async function createGroup({name, capacity, teacherId}) {
  const payload = {
    name,
    maxStudents: capacity,
    teacherId
  }
  try {
    const res = await api.post("/groups", payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function updateGroup(id, {name, capacity, teacherId}) {
  const payload = {
    name,
    maxStudents: capacity,
    teacherId
  }
  try {
    const res = await api.patch(`/groups/${id}`, payload);
    return res.data.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function deleteGroup(id) {
  try {
    const res = await api.delete(`/groups/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function assignTeacherToGroup(groupId, teacherId) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const teacher = MOCK_TEACHERS.find((t) => t.id === teacherId);
      _groups = _groups.map((g) => (g.id === groupId ? { ...g, teacherId, teacherName: teacher?.name ?? null } : g));
      return { data: _groups.find((g) => g.id === groupId) };
    });
  }
  const { data } = await httpClient.post(`/groups/${groupId}/assign-teacher`, { teacherId });
  return data;
}

/* ---------------- Schedule sub-resource ---------------- */
const days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
const s = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
export async function addScheduleDay(groupId, { day, startTime, endTime }) {
  const idx = s.indexOf(day)
  const body = {
    groupId: groupId,
    dayOfWeek: days[idx],
    startTime: `${startTime}:00`,
    endTime: `${endTime}:00`,
  };

  try {
    const res = await api.post("/group-schedules", body);
    return res.data.data;
  } catch (error) {
    throw error.response?.data;
  }
}
export async function updateScheduleDay(scheduleId, { day, startTime, endTime, groupId }) {
  const data = {
    groupId,
    dayOfWeek: !days.includes(day) ? days[s.indexOf(day)]: day,
    startTime: startTime.split(":").length === 3 ? startTime : `${startTime}:00`,
    endTime: endTime.split(":").length === 3 ? endTime : `${endTime}:00`
  }
  let res
  try {
    res = await api.put(`/group-schedules/${scheduleId}`, data);

    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}

export async function deleteScheduleDay(scheduleId) {
  try {
    const res = await api.delete(`/group-schedules/${scheduleId}`);
    return res.data;

  } catch (error) {
    throw error.response?.data;
  }
}
