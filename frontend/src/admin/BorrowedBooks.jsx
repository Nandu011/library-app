import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";



export default function BorrowedBooks() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const loadBorrowedBooks = async () =>{
        try {
            const res =  await fetch(`${API_URL}/borrow`, {
               headers: {
                        "Content-Type" : "application/json",
                        ...getAuthHeaders(),
                    },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load borrowed books");
            }

            setRecords(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBorrowedBooks();

    }, []);

    const forceReturn = async (borroId) => {
        if (!window.confirm("Force return this book?")) return;

        try {
            const res = await fetch(
                `${API_URL}/borrow/admin/${borroId}`,
                {
                    method: "PUT",
                    ...getAuthHeaders(),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Return failed");

            }

            alert("Book returned");
            loadBorrowedBooks();
        } catch (err) {
            alert(err.message);

        }
    };

    if (loading) return <h2>Loading borrowed books...</h2>;
    if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

    return (
        <div>
            <h1>Borrowed Books</h1>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Copy Code</th>
                        <th>Borrowed</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map((r) => (
                        <tr key={r.id}>
                            <td>{r.user_name}</td>
                            <td>{r.title}</td>
                            <td>{r.unique_code}</td>
                            <td>{new Date(r.borrow_date).toLocaleDateString()}</td>
                            <td>{new Date(r.due_date).toLocaleDateString()}</td>
                            <td>
                                {r.returned ? (
                                    "Returned"
                                ) : (
                                    <span style={{color: "red"}}>Borrowed</span>
                                )}
                            </td>
                            <td>
                                {!r.returned && (
                                    <button onClick={() => forceReturn(r.id)}>
                                        Force Return
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
};