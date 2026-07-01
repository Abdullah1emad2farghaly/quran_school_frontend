// Deterministic-ish mock data generator. Produces a connected graph of
// students/teachers/parents/groups/competitions/etc. so the UI has
// realistic relationships to render (group rosters, teacher assignments,
// parent->children links, competition registrations, etc).

const ARABIC_MALE_FIRST = [
  "Ahmed", "Mohamed", "Omar", "Yusuf", "Khalid", "Hassan", "Ali", "Ibrahim",
  "Mahmoud", "Tariq", "Karim", "Zayd", "Bilal", "Anas", "Hamza", "Adam",
  "Yahya", "Saeed", "Rashid", "Faisal",
];
const ARABIC_FEMALE_FIRST = [
  "Fatima", "Aisha", "Maryam", "Khadija", "Zainab", "Layla", "Noor", "Sara",
  "Hana", "Amal", "Salma", "Rania", "Yasmin", "Dalia", "Mona", "Reem",
  "Lina", "Huda", "Asma", "Nadia",
];
const LAST_NAMES = [
  "Al-Sayed", "Hassan", "Mahmoud", "Ibrahim", "Abdullah", "El-Sherif",
  "Mostafa", "Saleh", "Farouk", "Nasser", "Othman", "Rashad", "Gaber",
  "Hamdy", "Younes", "Shawky", "Adel", "Fathy", "Kamel", "Aziz",
];

let _id = 1000;
const nextId = (prefix) => `${prefix}-${_id++}`;

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function fullName(seed, gender) {
  const first = gender === "female" ? pick(ARABIC_FEMALE_FIRST, seed) : pick(ARABIC_MALE_FIRST, seed);
  const last = pick(LAST_NAMES, seed + 7);
  return `${first} ${last}`;
}

function phone(seed) {
  return `+20 10${(1000000 + seed * 137) % 90000000 + 10000000}`.slice(0, 16);
}

function dateOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function dateFuture(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

const GROUP_NAMES = [
  "Al-Fatiha Circle", "Al-Baqarah Juniors", "Al-Imran Seniors", "Yaseen Circle",
  "Al-Kahf Memorizers", "Al-Mulk Group", "An-Naba Beginners", "Ar-Rahman Advanced",
  "Al-Waqi'ah Circle", "Tabarak Group",
];

const TRACK_NAMES = [
  "Five Parts (Juz')", "Ten Parts (Juz')", "Fifteen Parts (Juz')", "Full Quran (Hifz Kamil)",
  "Tajweed Excellence", "Young Reciters (Tilawah)",
];

const LEVELS = ["beginner", "intermediate", "advanced", "hafiz"];
const SURAHS = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Yaseen",
  "Al-Mulk", "Al-Kahf", "Ar-Rahman", "Al-Waqi'ah", "An-Naba", "Al-Qiyamah",
];
const GRADES = ["excellent", "veryGood", "good", "needsWork"];

// ---- Teachers ----
export const MOCK_TEACHERS = Array.from({ length: 14 }).map((_, i) => {
  const gender = i % 5 === 0 ? "female" : "male";
  const id = nextId("T");
  return {
    id,
    name: fullName(i + 1, gender),
    gender,
    phone: phone(i + 3),
    email: `teacher${i + 1}@noor-alhuda.edu`,
    specialization: pick(["Tajweed", "Hifz", "Qira'at", "Tafsir Basics"], i),
    qualification: pick(["Ijazah in Hafs", "Al-Azhar Graduate", "Ijazah in Ten Qira'at", "Diploma in Quranic Studies"], i + 2),
    experienceYears: 2 + (i % 12),
    status: i % 9 === 0 ? "inactive" : "active",
    joinDate: dateOffset(200 + i * 23),
    avatarSeed: i,
  };
});

// ---- Groups (with teacher assignment + schedule) ----
const DAY_KEYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
export const MOCK_GROUPS = GROUP_NAMES.map((name, i) => {
  const id = nextId("G");
  const teacher = MOCK_TEACHERS[i % MOCK_TEACHERS.length];
  const scheduleDayCount = 2 + (i % 2);
  const schedule = Array.from({ length: scheduleDayCount }).map((_, d) => ({
    id: nextId("SCH"),
    day: DAY_KEYS[(i * 2 + d) % 7],
    startTime: pick(["16:00", "17:00", "18:00", "15:30"], i + d),
    endTime: pick(["17:30", "18:30", "19:30", "17:00"], i + d + 1),
  }));
  return {
    id,
    name,
    level: LEVELS[i % LEVELS.length],
    capacity: 15 + (i % 4) * 5,
    teacherId: teacher.id,
    teacherName: teacher.name,
    status: i % 8 === 0 ? "inactive" : "active",
    schedule,
    createdDate: dateOffset(300 + i * 11),
  };
});

// ---- Parents ----
export const MOCK_PARENTS = Array.from({ length: 40 }).map((_, i) => {
  const id = nextId("P");
  return {
    id,
    name: fullName(i + 50, i % 4 === 0 ? "female" : "male"),
    phone: phone(i + 100),
    email: `parent${i + 1}@example.com`,
    address: pick(["Nasr City, Cairo", "Maadi, Cairo", "6th of October City", "Heliopolis, Cairo", "Giza"], i),
    joinDate: dateOffset(400 + i * 5),
    status: "active",
  };
});

// ---- Students ----
export const MOCK_STUDENTS = Array.from({ length: 96 }).map((_, i) => {
  const id = nextId("S");
  const gender = i % 2 === 0 ? "male" : "female";
  const group = MOCK_GROUPS[i % MOCK_GROUPS.length];
  const parent = MOCK_PARENTS[i % MOCK_PARENTS.length];
  const age = 6 + (i % 13);
  const memorizedParts = Math.min(30, Math.max(0, Math.round((i % 30) + (i % 3))));
  return {
    id,
    name: fullName(i + 200, gender),
    gender,
    age,
    birthDate: dateOffset(age * 365 + (i % 300)),
    phone: i % 3 === 0 ? phone(i + 400) : "",
    guardianName: parent.name,
    parentId: parent.id,
    groupId: i % 11 === 0 ? null : group.id,
    groupName: i % 11 === 0 ? null : group.name,
    level: LEVELS[Math.min(3, Math.floor(memorizedParts / 8))],
    memorizedParts,
    enrollDate: dateOffset(20 + i * 4),
    status: i % 13 === 0 ? "inactive" : "active",
    subscriptionStatus: i % 3 === 0 ? "unpaid" : "paid",
  };
});

// fix bidirectional parent->children mapping
export const childrenByParent = {};
MOCK_STUDENTS.forEach((s) => {
  if (!childrenByParent[s.parentId]) childrenByParent[s.parentId] = [];
  childrenByParent[s.parentId].push(s.id);
});

export const groupsByTeacher = {};
MOCK_GROUPS.forEach((g) => {
  if (!groupsByTeacher[g.teacherId]) groupsByTeacher[g.teacherId] = [];
  groupsByTeacher[g.teacherId].push(g.id);
});

export const studentsByGroup = {};
MOCK_STUDENTS.forEach((s) => {
  if (!s.groupId) return;
  if (!studentsByGroup[s.groupId]) studentsByGroup[s.groupId] = [];
  studentsByGroup[s.groupId].push(s.id);
});

// ---- Attendance records (last 30 sessions per group, sparse) ----
export const MOCK_ATTENDANCE = [];
MOCK_GROUPS.forEach((g) => {
  const roster = studentsByGroup[g.id] || [];
  for (let session = 0; session < 12; session++) {
    const date = dateOffset(session * 4);
    roster.forEach((studentId, idx) => {
      const r = (idx + session) % 10;
      const status = r === 0 ? "absent" : r === 1 ? "late" : r === 2 ? "excused" : "present";
      MOCK_ATTENDANCE.push({
        id: nextId("ATT"),
        groupId: g.id,
        studentId,
        date,
        status,
      });
    });
  }
});

// ---- Memorization records ----
export const MOCK_MEMORIZATION = [];
MOCK_STUDENTS.forEach((s, i) => {
  const entries = 2 + (i % 4);
  for (let e = 0; e < entries; e++) {
    MOCK_MEMORIZATION.push({
      id: nextId("MEM"),
      studentId: s.id,
      studentName: s.name,
      groupId: s.groupId,
      surah: pick(SURAHS, i + e),
      fromAyah: 1 + (e % 5),
      toAyah: 10 + (e % 20),
      grade: pick(GRADES, i + e * 3),
      teacherNote: pick(
        [
          "Excellent tajweed application, very fluent recitation.",
          "Needs more practice on madd rules.",
          "Good progress this week, keep revising previous parts.",
          "Confident recitation, ready to move to next surah.",
          "Some hesitation in the middle verses, revise before next session.",
        ],
        i + e
      ),
      date: dateOffset(e * 7 + (i % 5)),
    });
  }
});

// ---- Competitions ----
export const MOCK_COMPETITIONS = Array.from({ length: 6 }).map((_, i) => {
  const id = nextId("COMP");
  const tracks = TRACK_NAMES.slice(0, 3 + (i % 3)).map((tn, ti) => ({
    id: nextId("TRK"),
    name: tn,
    requiredParts: [5, 10, 15, 30, 30, 3][ti] || 5,
    maxAge: [12, 14, 16, 18, 18, 10][ti] || 16,
  }));
  return {
    id,
    name: `${["Ramadan", "Annual", "Regional", "Spring", "Excellence", "Golden"][i]} Quran Competition ${2024 + (i % 3)}`,
    startDate: dateFuture(i * 20 - 40),
    endDate: dateFuture(i * 20 - 38),
    location: pick(["Main Hall, Noor Al-Huda Academy", "Cairo Conference Center", "Al-Azhar Auditorium"], i),
    status: i < 2 ? "completed" : i === 2 ? "ongoing" : "upcoming",
    tracks,
  };
});

export const MOCK_REGISTRATIONS = [];
MOCK_COMPETITIONS.forEach((c) => {
  const numReg = 8 + (c.tracks.length * 4);
  for (let r = 0; r < numReg; r++) {
    const student = MOCK_STUDENTS[(r * 7 + c.id.length) % MOCK_STUDENTS.length];
    const track = c.tracks[r % c.tracks.length];
    MOCK_REGISTRATIONS.push({
      id: nextId("REG"),
      competitionId: c.id,
      trackId: track.id,
      trackName: track.name,
      studentId: student.id,
      studentName: student.name,
      age: student.age,
      groupName: student.groupName,
      registeredDate: dateOffset(30 + r),
      score: c.status === "completed" ? Math.round(60 + ((r * 13) % 40)) : null,
    });
  }
});

// ---- Subscriptions ----
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLLECTOR_NAMES = ["Mahmoud Adel", "Sara Younes", "Khalid Fathy", "Reem Kamel"];
export const MOCK_COLLECTORS = COLLECTOR_NAMES.map((name, i) => ({
  id: nextId("COL"),
  name,
  phone: phone(i + 700),
  email: `collector${i + 1}@noor-alhuda.edu`,
  joinDate: dateOffset(250 + i * 30),
  status: "active",
  assignedStudentsCount: 18 + i * 6,
}));

export const MOCK_SUBSCRIPTIONS = [];
const now = new Date();
MOCK_STUDENTS.forEach((s, i) => {
  for (let m = 0; m < 3; m++) {
    const monthIdx = (now.getMonth() - m + 12) % 12;
    const paid = (i + m) % 3 !== 0;
    MOCK_SUBSCRIPTIONS.push({
      id: nextId("SUB"),
      studentId: s.id,
      studentName: s.name,
      groupName: s.groupName,
      month: MONTHS[monthIdx],
      year: now.getFullYear() - (now.getMonth() - m < 0 ? 1 : 0),
      amount: 150,
      status: paid ? "paid" : "unpaid",
      paymentDate: paid ? dateOffset(m * 30 + (i % 10)) : null,
      dueDate: dateOffset(m * 30 - 5),
      collectorId: MOCK_COLLECTORS[i % MOCK_COLLECTORS.length].id,
      collectorName: MOCK_COLLECTORS[i % MOCK_COLLECTORS.length].name,
    });
  }
});

// ---- Users & Roles ----
export const MOCK_USERS = [
  { id: nextId("U"), name: "Admin User", email: "admin@noor-alhuda.edu", role: "admin", status: "active", lastLogin: dateOffset(0) },
  ...MOCK_TEACHERS.slice(0, 6).map((t) => ({
    id: nextId("U"), name: t.name, email: t.email, role: "teacher", status: t.status, lastLogin: dateOffset(Math.floor(Math.random() * 10)),
  })),
  ...MOCK_PARENTS.slice(0, 6).map((p) => ({
    id: nextId("U"), name: p.name, email: p.email, role: "parent", status: "active", lastLogin: dateOffset(Math.floor(Math.random() * 20)),
  })),
  ...MOCK_COLLECTORS.map((c) => ({
    id: nextId("U"), name: c.name, email: c.email, role: "collector", status: "active", lastLogin: dateOffset(Math.floor(Math.random() * 5)),
  })),
];

// ---- Recent activity feed ----
export const MOCK_ACTIVITIES = [
  { id: 1, type: "student_added", actor: "Admin User", target: MOCK_STUDENTS[0]?.name, time: dateOffset(0) },
  { id: 2, type: "payment_received", actor: MOCK_COLLECTORS[0].name, target: MOCK_STUDENTS[3]?.name, time: dateOffset(0) },
  { id: 3, type: "memorization_recorded", actor: MOCK_TEACHERS[1].name, target: MOCK_STUDENTS[5]?.name, time: dateOffset(1) },
  { id: 4, type: "group_created", actor: "Admin User", target: MOCK_GROUPS[2]?.name, time: dateOffset(1) },
  { id: 5, type: "attendance_marked", actor: MOCK_TEACHERS[3].name, target: MOCK_GROUPS[1]?.name, time: dateOffset(2) },
  { id: 6, type: "competition_registered", actor: "Admin User", target: MOCK_STUDENTS[8]?.name, time: dateOffset(2) },
  { id: 7, type: "student_added", actor: "Admin User", target: MOCK_STUDENTS[10]?.name, time: dateOffset(3) },
  { id: 8, type: "payment_overdue", actor: "System", target: MOCK_STUDENTS[12]?.name, time: dateOffset(3) },
];

// ---- Settings ----
export const MOCK_SETTINGS = {
  schoolName: "Noor Al-Huda Quran Academy",
  schoolPhone: "+20 100 123 4567",
  schoolEmail: "info@noor-alhuda.edu",
  schoolAddress: "14 Al-Salam Street, Nasr City, Cairo, Egypt",
  competitionDefaultMaxAge: 18,
  registrationDeadlineDays: 14,
  monthlyFee: 150,
  currency: "EGP",
  paymentReminderDays: 5,
};

export const _idCounterRef = { get: () => _id, next: nextId };
