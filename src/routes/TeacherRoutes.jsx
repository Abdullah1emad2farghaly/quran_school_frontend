import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import AppShell from "../components/admin/layout/AppShell";

import { AppProvider } from '../context/AppContext';
import MainLayout from '../components/teacher/layout/MainLayout';
import Dashboard from '../pages/teacher/Dashboard';
import Groups from '../pages/teacher/Groups';
import GroupDetail from '../pages/teacher/GroupDetail';
import Students from '../pages/teacher/Students';
import Attendance from '../pages/teacher/Attendance';
import Memorization from '../pages/teacher/Memorization';
import Exams from '../pages/teacher/Exams';
import Results from '../pages/teacher/Results';
import Competitions from '../pages/teacher/Competitions';
import Notifications from '../pages/teacher/Notifications';
import Profile from '../pages/teacher/Profile';
import NotFoundPage from '../pages/NotFoundPage';


export default function TeacherRoutes() {
    return (
        <AppProvider>
            <Routes>
                <Route path='/teacher' element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="groups/:id" element={<GroupDetail />} />
                    <Route path="students" element={<Students />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="memorization" element={<Memorization />} />
                    <Route path="exams" element={<Exams />} />
                    <Route path="results" element={<Results />} />
                    <Route path="competitions" element={<Competitions />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="profile" element={<Profile />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </AppProvider>
    )
}
