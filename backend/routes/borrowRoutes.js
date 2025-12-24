const express = require('express');
const pool = require('../config/db');
const { verifyUser, verifyAdmin } = require('../middleware/authMiddleware');


const router = express.Router();


/**
 * Borrow a book copy
 * POST /api/borrow
 */
router.post('/', verifyUser, async (req, res) => {
  const { book_copy_id } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //  Check availability
    const copyResult = await client.query(
      'SELECT * FROM book_copies WHERE id = $1 AND is_available = true FOR UPDATE',
      [book_copy_id]
    );

    if (copyResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Book copy not available' });
    }

    //  Mark copy unavailable
    await client.query(
      'UPDATE book_copies SET is_available = false WHERE id = $1',
      [book_copy_id]
    );

    //  Insert borrow record
    const borrowResult = await client.query(
      `INSERT INTO borrowed_books (user_id, book_copy_id, due_date)
       VALUES ($1, $2, CURRENT_DATE + INTERVAL '14 days')
       RETURNING *`,
      [userId, book_copy_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow: borrowResult.rows[0],
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

/**
 * Return a book copy
 * PUT /api/borrow/:id
 */
router.put('/:id', verifyUser, async (req, res) => {
  const borrowId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const borrowResult = await client.query(
      `SELECT * FROM borrowed_books
       WHERE id = $1 AND user_id = $2 AND returned = false`,
      [borrowId, userId]
    );

    if (borrowResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    const bookCopyId = borrowResult.rows[0].book_copy_id;

    await client.query(
      `UPDATE borrowed_books
       SET returned = true, return_date = NOW()
       WHERE id = $1`,
      [borrowId]
    );

    await client.query(
      'UPDATE book_copies SET is_available = true WHERE id = $1',
      [bookCopyId]
    );

    await client.query('COMMIT');

    res.json({ message: 'Book returned successfully' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

/**
 * View logged-in user borrowed books
 * GET /api/borrow/my
 */
router.get('/my', verifyUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
        bb.id,
        bb.borrow_date,
        bb.due_date,
        bb.returned,
        b.title,
        b.author,
        bc.unique_code
      FROM borrowed_books bb
      JOIN book_copies bc ON bb.book_copy_id = bc.id
      JOIN books b ON bc.book_id = b.id
      WHERE bb.user_id = $1
      ORDER BY bb.borrow_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin - view all borrowed books
 * GET /api/borrow
 */
router.get('/', verifyAdmin, async (req, res) => {
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
});

/**
 * Admin - force return book
 * PUT /api/borrow/admin/:id
 */
router.put('/admin/:id', verifyAdmin, async (req, res) => {
  const borrowId = req.params.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const borrowResult = await client.query(
      `SELECT * FROM borrowed_books WHERE id = $1 AND returned = false`,
      [borrowId]
    );

    if (borrowResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({message: 'Borrow record not found'});
    }

    const bookCopyId = borrowResult.rows[0].book_copy_id;

    await client.query(
      `UPDATE borrowed_books
      SET returned = true, return_date = NOW()
      WHERE id = $1`, [borrowId]
    );

    await client.query(
      `UPDATE book_copies SET is_available = true WHERE id = $1`,
      [bookCopyId]
    );

    await client.query('COMMIT');

    res.json({message: "Book returned by admin"});

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({message: "Server error"});
  } finally {
    client.release();
  }
});


module.exports = router;
