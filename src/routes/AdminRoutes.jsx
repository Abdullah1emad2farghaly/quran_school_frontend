import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppShell from "../components/admin/layout/AppShell";

import DashboardPage from "../pages/admin/dashboard/DashboardPage";

import StudentsListPage from "../pages/admin/students/StudentsListPage";
import StudentProfilePage from "../pages/admin/students/StudentProfilePage";

import ParentsListPage from "../pages/admin/parents/ParentsListPage";
import ParentProfilePage from "../pages/admin/parents/ParentProfilePage";

import TeachersListPage from "../pages/admin/teachers/TeachersListPage";
import TeacherProfilePage from "../pages/admin/teachers/TeacherProfilePage";

import GroupsListPage from "../pages/admin/groups/GroupsListPage";
import GroupDetailPage from "../pages/admin/groups/GroupDetailPage";

import AttendancePage from "../pages/admin/attendance/AttendancePage";
import MemorizationPage from "../pages/admin/memorization/MemorizationPage";

import CompetitionsListPage from "../pages/admin/competitions/CompetitionsListPage";
import CompetitionDetailPage from "../pages/admin/competitions/CompetitionDetailPage";

import SubscriptionsPage from "../pages/admin/subscriptions/SubscriptionsPage";

import CollectorsListPage from "../pages/admin/collectors/CollectorsListPage";
import CollectorProfilePage from "../pages/admin/collectors/CollectorProfilePage";

import UsersRolesPage from "../pages/admin/users/UsersRolesPage";
import SettingsPage from "../pages/admin/settings/SettingsPage";
import AdminLayout from '../layouts/AdminLayout';
import NotFoundPage from '../pages/NotFoundPage';
import AdminGuards from '../guards/AdminGuards'


export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminGuards />}>
                <Route path='/admin' element={<AppShell />}>
                    <Route index element={<DashboardPage />} />

                    <Route path="students" element={<StudentsListPage />} />
                    <Route path="students/:studentId" element={<StudentProfilePage />} />

                    <Route path="parents" element={<ParentsListPage />} />
                    <Route path="parents/:parentId" element={<ParentProfilePage />} />

                    <Route path="teachers" element={<TeachersListPage />} />
                    <Route path="teachers/:teacherId" element={<TeacherProfilePage />} />

                    <Route path="groups" element={<GroupsListPage />} />
                    <Route path="groups/:groupId" element={<GroupDetailPage />} />

                    <Route path="attendance" element={<AttendancePage />} />
                    <Route path="memorization" element={<MemorizationPage />} />

                    <Route path="competitions" element={<CompetitionsListPage />} />
                    <Route path="competitions/:competitionId" element={<CompetitionDetailPage />} />

                    <Route path="subscriptions" element={<SubscriptionsPage />} />

                    <Route path="collectors" element={<CollectorsListPage />} />
                    <Route path="collectors/:collectorId" element={<CollectorProfilePage />} />

                    <Route path="users" element={<UsersRolesPage />} />
                    <Route path="settings" element={<SettingsPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
