import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from "../pages/LoginPage"
import AuthGuard from '../guards/AuthGuard'

export default function AuthRoute() {
    return (
        <Routes>
            <Route element={<AuthGuard />}>
                <Route path='/' element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
