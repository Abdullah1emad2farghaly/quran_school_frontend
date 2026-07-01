import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div>
            {/* <h1>Admin Panel</h1> */}

            {/* Sidebar / Navbar here */}

            <Outlet />
        </div>
    );
}