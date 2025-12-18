import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={sidebarStyle}>
                <h2>📚 Library Admin</h2>

                <ul style={{ listStyle: "none", padding: 0}}>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/admin/users">Manage Users</Link></li>
                    <li><Link to="/admin/add-user">Add User</Link></li>
                    <li><Link to="/admin/books">Manage Books</Link></li>
                    <li><Link to="/admin/borrowed">Borrowed Books</Link></li>
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