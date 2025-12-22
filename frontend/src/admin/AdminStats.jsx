import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from '../services/api';

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/admin/dashboard`, {
            method: "GET",
            headers: getAuthHeaders(),
        })
        .then(res => {
            if (!res.ok) throw new Error("Faild to load dashboard stats");
            return res.json();
        })
        .then(setStats)
        .catch(err => setError(err.message));
    }, []);

    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
    if (!stats) return <h2>Loading...</h2>;

    return (
        <>
            <h1>📊 Dashboard</h1>

            <div style={grid}>
                <Card title="Total Books" value={stats.total_books} />
                <Card title="Total Copies" value={stats.total_copies} />
                <Card title="Available copies" value={stats.available_copies} />
                <Card title="Borrowed copies" value={stats.borrowed_copies} />
                <Card title="Users" value={stats.total_users} />
                <Card title="Active Borrows" value={stats.active_borrows} />
                <Card title="Overdue" value={stats.overdue_books} danger/>
            </div>
        </>
    );
}

function Card({ title, value, danger }) {
    return (
        <div style={{
            padding: 20,
            background: danger ? "#ffe6e6" : "#eee",
            borderRadius: 8,
            textAlign: "center"
        }}>
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
};