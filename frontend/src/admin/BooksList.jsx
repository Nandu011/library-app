import { useEffect, useState } from "react";
import API_URL, { getAuthHeaders } from "../services/api";

export default function BooksList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([null]);

    useEffect(() => {
        fetch(`${API_URL}/books`, {
            headers: getAuthHeaders().headers
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to load books");
            return res.json();

        })
        .then(data => {
            setBooks(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <h2>Loading books...</h2>;
    if (error) return <h2 style={{color: "red"}}>{error}</h2>

    return (
        <div>
            <h1>Manage Books</h1>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Shelf</th>
                        <th>Rating</th>
                        <th>Reviews</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.shelf_no}</td>
                            <td>{book.average_rating}</td>
                            <td>{book.review_count}</td>
                            <td>
                                <button style={btn}>+ Add Copy</button>
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
}

const btn = {
    padding: "6px 10px",
    cursor: "pointer"
}