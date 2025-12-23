const pool = require("../config/db");

// Get all borrowed books (Admin)
exports.getBorrowedBooks = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                bb.id,
                u.name AS user_name,
                b.title,
                bc.unique_code,
                bb.borrow_date,
                bb.due_date,
                bb.return_date,
                bb.returned
            FROM borrowed_books bb
            JOIN users u ON bb.user_id = u.id
            JOIN book_copies bc ON bb.book_copy_id = bc.id
            JOIN books b ON bc.book_id = b.id
            ORDER BY bb.borrow_date DESC`);

            res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to load borrowed books"});
    }
};

// Mark book as returned
exports.returnBook = async (req, res) => {
    const {id} = req.params;

    try {
        await pool.query(
            `
            UPDATE borrowed_books
            SET returned = true,
                return_date = CURRENT_TIMESTAMP
            WHERE id = $1`,
            [id]
        );

        res.json({message: "Book returned successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to return book"});
    }
};