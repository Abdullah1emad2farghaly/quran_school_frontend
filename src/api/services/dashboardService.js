import httpClient from "../httpClient";
import { mockRequest } from "../mockAdapter";
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_PARENTS,
  MOCK_GROUPS,
  MOCK_COMPETITIONS,
  MOCK_SUBSCRIPTIONS,
  MOCK_ACTIVITIES,
} from "../../mock/seedData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

export async function getDashboardSummary() {
  if (USE_MOCK) {
    return mockRequest(() => {
      const paid = MOCK_SUBSCRIPTIONS.filter((s) => s.status === "paid").length;
      const unpaid = MOCK_SUBSCRIPTIONS.filter((s) => s.status === "unpaid").length;

      // Build a 6-month enrollment trend from enrollDate.
      const monthLabels = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthLabels.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en", { month: "short" }) });
      }
      const enrollmentTrend = monthLabels.map(({ key, label }) => {
        const [y, m] = key.split("-").map(Number);
        const count = MOCK_STUDENTS.filter((s) => {
          const d = new Date(s.enrollDate);
          return d.getFullYear() === y && d.getMonth() === m;
        }).length;
        return { label, count: count || Math.round(4 + Math.random() * 10) };
      });

      return {
        data: {
          totalStudents: MOCK_STUDENTS.length,
          totalTeachers: MOCK_TEACHERS.length,
          totalParents: MOCK_PARENTS.length,
          totalGroups: MOCK_GROUPS.length,
          totalCompetitions: MOCK_COMPETITIONS.length,
          paidSubscriptions: paid,
          unpaidSubscriptions: unpaid,
          enrollmentTrend,
          activities: MOCK_ACTIVITIES,
        },
      };
    });
  }
  const { data } = await httpClient.get("/dashboard/summary");
  return data;
}
