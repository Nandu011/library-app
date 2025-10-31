const express = require("express");
const pool = require("../config/db");
const { verifyUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Borrow a book copy
router.post("/borrow", verifyUser, async (req, res) => {
  const { copy_id } = req.body;
  const userId = req.user.id;

  try {
    // check if book copy exists & not borrowed
    const copy = await pool.query(
      `SELECT * FROM book_copies WHERE id = $1 AND is_borrowed = false`,
      [copy_id]
    );

    if (copy.rows.length === 0) {
      return res.status(400).json({ message: "Book copy unavailable or doesn't exist" });
    }

    // mark copy as borrowed & log entry
    await pool.query(`UPDATE book_copies SET is_borrowed = true WHERE id = $1`, [copy_id]);

    const borrow = await pool.query(
      `INSERT INTO borrowed_books (user_id, copy_id) VALUES ($1, $2) RETURNING *`,
      [userId, copy_id]
    );

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow: borrow.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Return a book copy
router.put("/return/:id", verifyUser, async (req, res) => {
  const { id } = req.params; // borrow record id
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE borrowed_books 
       SET returned = true, return_date = NOW() 
       WHERE id = $1 AND user_id = $2 AND returned = false 
       RETURNING copy_id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found or already returned"
      });
    }

    const copyId = result.rows[0].copy_id;

    await pool.query(
      `UPDATE book_copies SET is_borrowed = false WHERE id = $1`,
      [copyId]
    );

    res.json({ message: "Book returned successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// View user's borrowed books
router.get("/mybooks", verifyUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const books = await pool.query(
      `SELECT bb.*, b.title, b.author, bc.unique_code 
       FROM borrowed_books bb
       JOIN book_copies bc ON bb.copy_id = bc.id
       JOIN books b ON bc.book_id = b.id
       WHERE bb.user_id = $1
       ORDER BY bb.borrowed_date DESC`,
      [userId]
    );

    res.json(books.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
