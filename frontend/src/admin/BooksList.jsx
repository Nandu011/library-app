import { useEffect, useState } from 'react';
import API_URL, { getAuthHeaders } from '../services/api';

export default function BooksList() {
    const [books, setBooks] =useState([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState(null);

    const [selectedBook, setSelectedBook] = useState(null);
    const [uniqueCode, setUniqueCode] = useState("");
    const [message, setMessage] = useState("");

    const loadBooks = () => {
        fetch(`${API_URL}/ books`)
        .then(res => res.json())
        .then(data => {
            setBooks(data);
            setLoading(false);
        })
        .catch(() => {
            setError("Failed to load books");
            setLoading(false);
        });

    };

    useEffect(() => {
        loadBooks();
    }, []);

    const addCopy = async () => {
        if (!uniqueCode.trim()) {
            return alert("Unique code required");
        }

        try {
            const res = await fetch(
                `${API_URL}/books/${selectedBook.id}/add-copy`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        ...getAuthHeaders().headers,
                    },
                    body:JSON.stringify({ unique_code: uniqueCode }),
                }
            );
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to add copy");
            }

            setMessage("Copy added successfully");
            setUniqueCode("");
            selectedBook(null);
            loadBooks();

        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <h2>Loading books...</h2>;
    if (error) return <h2 style={{color: "red"}}>{error}</h2>;

    return (
        <div>
            <h1>Manage Books</h1>

            {message && <p style={{color: "green"}}>{message}</p>}

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
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.shelf_no}</td>
                            <td>{book.average_rating}</td>
                            <td>{book.review_count}</td>
                            <td>
                                <button onClick={ () => setSelectedBook(book)}>
                                    Add Copy
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Copy Form */}

            {selectedBook && (
                <div style={formBox}>
                    <h3>Add copy for: {selectedBook.title}</h3>

                    <input
                        placeholder='"Unique Code'
                        value={uniqueCode}
                        onChange={ (e) => setUniqueCode(e.target.value) }
                    />

                    <div>
                        <button onClick={addCopy}>Save</button>
                        <button onClick={ () => setSelectedBook(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );

}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",

};

const formBox = {
    marginTop: 20,
    padding: 20,
    border: "1px solid #ccc",
    borderRadius:6,
}