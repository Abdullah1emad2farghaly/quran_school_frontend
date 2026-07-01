import httpClient from "../httpClient";
import { mockRequest, paginate, generateId } from "../mockAdapter";
import { MOCK_COMPETITIONS, MOCK_REGISTRATIONS } from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

let _competitions = [...MOCK_COMPETITIONS];
let _registrations = [...MOCK_REGISTRATIONS];

export async function listCompetitions({ page = 1, pageSize = 10, search = "", status } = {}) {
  if (USE_MOCK) {
    return mockRequest(() =>
      paginate(_competitions, { page, pageSize, search, searchFields: ["name", "location"], filters: { status } })
    );
  }
  const { data } = await httpClient.get("/competitions", { params: { page, pageSize, search, status } });
  return data;
}

export async function getCompetition(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const c = _competitions.find((x) => x.id === id);
      if (!c) throw new Error("Competition not found");
      return { data: c };
    });
  }
  const { data } = await httpClient.get(`/competitions/${id}`);
  return data;
}

export async function createCompetition(payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const newComp = { id: generateId("COMP"), status: "upcoming", tracks: [], ...payload };
      _competitions = [newComp, ..._competitions];
      return { data: newComp };
    });
  }
  const { data } = await httpClient.post("/competitions", payload);
  return data;
}

export async function updateCompetition(id, payload) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _competitions = _competitions.map((c) => (c.id === id ? { ...c, ...payload } : c));
      return { data: _competitions.find((c) => c.id === id) };
    });
  }
  const { data } = await httpClient.put(`/competitions/${id}`, payload);
  return data;
}

export async function deleteCompetition(id) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _competitions = _competitions.filter((c) => c.id !== id);
      return { data: { id } };
    });
  }
  const { data } = await httpClient.delete(`/competitions/${id}`);
  return data;
}

/* ---------------- Tracks ---------------- */

export async function addTrack(competitionId, { name, requiredParts, maxAge }) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const track = { id: generateId("TRK"), name, requiredParts, maxAge };
      _competitions = _competitions.map((c) =>
        c.id === competitionId ? { ...c, tracks: [...(c.tracks || []), track] } : c
      );
      return { data: track };
    });
  }
  const { data } = await httpClient.post(`/competitions/${competitionId}/tracks`, { name, requiredParts, maxAge });
  return data;
}

export async function updateTrack(competitionId, trackId, { name, requiredParts, maxAge }) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _competitions = _competitions.map((c) =>
        c.id === competitionId
          ? { ...c, tracks: c.tracks.map((t) => (t.id === trackId ? { ...t, name, requiredParts, maxAge } : t)) }
          : c
      );
      return { data: { id: trackId, name, requiredParts, maxAge } };
    });
  }
  const { data } = await httpClient.put(`/competitions/${competitionId}/tracks/${trackId}`, { name, requiredParts, maxAge });
  return data;
}

export async function deleteTrack(competitionId, trackId) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _competitions = _competitions.map((c) =>
        c.id === competitionId ? { ...c, tracks: c.tracks.filter((t) => t.id !== trackId) } : c
      );
      return { data: { id: trackId } };
    });
  }
  const { data } = await httpClient.delete(`/competitions/${competitionId}/tracks/${trackId}`);
  return data;
}

/* ---------------- Registrations ---------------- */

export async function getRegistrations(competitionId, { trackId, ageCategory, page = 1, pageSize = 10 } = {}) {
  if (USE_MOCK) {
    return mockRequest(() => {
      let regs = _registrations.filter((r) => r.competitionId === competitionId);
      if (trackId && trackId !== "all") regs = regs.filter((r) => r.trackId === trackId);
      if (ageCategory && ageCategory !== "all") {
        const [min, max] = ageCategory.split("-").map(Number);
        regs = regs.filter((r) => r.age >= min && r.age <= max);
      }
      return paginate(regs, { page, pageSize });
    });
  }
  const { data } = await httpClient.get(`/competitions/${competitionId}/registrations`, { params: { trackId, ageCategory, page, pageSize } });
  return data;
}

export async function registerStudent(competitionId, { studentId, trackId }) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const comp = _competitions.find((c) => c.id === competitionId);
      const track = comp?.tracks.find((t) => t.id === trackId);
      const entry = {
        id: generateId("REG"),
        competitionId,
        trackId,
        trackName: track?.name,
        studentId,
        registeredDate: new Date().toISOString().slice(0, 10),
        score: null,
      };
      _registrations = [entry, ..._registrations];
      return { data: entry };
    });
  }
  const { data } = await httpClient.post(`/competitions/${competitionId}/registrations`, { studentId, trackId });
  return data;
}

/* ---------------- Results ---------------- */

export async function getResults(competitionId) {
  if (USE_MOCK) {
    return mockRequest(() => {
      const regs = _registrations
        .filter((r) => r.competitionId === competitionId && r.score !== null)
        .sort((a, b) => b.score - a.score)
        .map((r, idx) => ({ ...r, rank: idx + 1 }));
      const scores = regs.map((r) => r.score);
      const stats = {
        totalParticipants: _registrations.filter((r) => r.competitionId === competitionId).length,
        avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        topScore: scores.length ? Math.max(...scores) : 0,
      };
      return { data: { rankings: regs, stats } };
    });
  }
  const { data } = await httpClient.get(`/competitions/${competitionId}/results`);
  return data;
}

export async function updateScore(registrationId, score) {
  if (USE_MOCK) {
    return mockRequest(() => {
      _registrations = _registrations.map((r) => (r.id === registrationId ? { ...r, score } : r));
      return { data: _registrations.find((r) => r.id === registrationId) };
    });
  }
  const { data } = await httpClient.put(`/registrations/${registrationId}/score`, { score });
  return data;
}
