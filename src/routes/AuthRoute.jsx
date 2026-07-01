import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from "../pages/LoginPage"

export default function AuthRoute() {
    return (
        <Routes>
            <Route path='/login' element={<AuthLayout />}>
                <Route index element={<LoginPage/>}/>
            </Route>
        </Routes>
    )
}
