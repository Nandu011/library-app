import { NavLink, Outlet } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={sidebarStyle}>
                <h2>📚 Library Admin</h2>

                <ul style={{ listStyle: "none", padding: 0}}>
                    <li><NavLink to="/admin">Dashboard</NavLink></li>
                    <li><NavLink to="/admin/users">Manage Users</NavLink></li>
                    <li><NavLink to="/admin/add-user">Add User</NavLink></li>
                    <li><NavLink to="/admin/books">Manage Books</NavLink></li>
                    <li><NavLink to="/admin/borrowed">Borrowed Books</NavLink></li>
                </ul>
            </aside>

            {/* Page content */}
            <main style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </main>
        </div>
    );
}



const sidebarStyle = {
    width: "220px",
    padding: "20px",
    background: "#f4f4f4",
};