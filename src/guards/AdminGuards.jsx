import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {

    const token = window.localStorage.getItem('token');
    const user = JSON.parse(window.localStorage.getItem('user'));
    const userRole = user?.role;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (userRole !== "Admin") {
        return <Navigate to="/teacher" replace />;
    }

    return <Outlet />;
}