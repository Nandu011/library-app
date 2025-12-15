import {Link} from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div>
            <hi>📚 Library Admin Panel</hi>

            <ul>
                <li><Link to="/admin/users">Manage Users</Link></li>
                <li><Link to="/admin/add-user">Add User</Link></li>
                <li><Link to="/admin/books">Manage Books</Link></li>
                <li><Link to="/admin/borrowed">Borrowed Books</Link></li>
            </ul>
        </div>
    );
}