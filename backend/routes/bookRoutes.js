const express = require('express');
const pool = require('../config/db');
const { verifyAdmin, verifyUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Add a new book (admin only)
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) =>{
    const { title, author, synopsis, shelf_no } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newBook = await pool.query(
            ` INSERT INTO books (title, author, synopsis, image_url, shelf_no) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, author, synopsis, image_url, shelf_no]
        );
        res.status(201).json({message: 'Book added successfully', book: newBook.rows[0]});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

//Add a copy to existing book.
router.post('/:bookId/add-copy', verifyAdmin, async (req,res) => {
    const {bookId} = req.params;
    const {unique_code} = req.body;

    try{
        const book = await pool.query('SELECT id FROM books WHERE id = $1', [bookId]);
        if (book.rows.length === 0) return res.status(404).json({ message: "Book not found" });

        const copy = await pool.query(
            'INSERT INTO book_copies (book_id, unique_code) VALUES ($1, $2) RETURNING *',
            [bookId, unique_code]
        );

        res.status(201).json({message: "Copy added", copy: copy.rows[0]});

    } catch (err) {
        res.status(500).json({message: "Server error"});
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await pool.query(`
            SELECT b.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
            COUNT(r.id) AS review_count
            FROM books b
            LEFT JOIN reviews r ON b.id = r.book_id
            GROUP BY b.id
            ORDER BY b.id;
            `);
            res.json(books.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

// Get single book details
router.get('/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const bookResult = await pool.query(
            `SELECT b.*, COALESCE(AVG(r.rating), 0)::NUMERIC(2,1) AS average_rating,
            COUNT(r.id) AS review_count
            FROM books b
            LEFT JOIN reviews r ON b.id = r.book_id
            WHERE b.id = $1
            GROUP BY b.id`, [id] 
        );
        if (bookResult.rows.length === 0 ) return res.status(404).json({message: "Book not found"});
        

        //Get all reviews
        const reviewResult = await pool.query(`
            SELECT r.*, u.name AS reviewer_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.book_id = $1
            ORDER BY r.created_at DESC;
            `, [id]);
            const book = bookResult.rows[0];
            book.reviews = reviewResult.rows;

            res.json(book);
    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
});

// Add reviews
router.post('/:id/review', verifyUser, async (req, res) => {
    const {id} = req.params;
    const {rating, comment} = req.body;
    const userId = req.user.id;

    try {
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
            }
        const exists = await pool.query(
            'SELECT id FROM reviews WHERE user_id = $1 AND book_id = $2',
            [userId, id]
            );
            if (exists.rows.length > 0) {
            return res.status(400).json({ message: 'You already reviewed this book' });
            }

        await pool.query(
            'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($1, $2, $3, $4)',
            [userId, id, rating, comment]
        );
        res.status(201).json({message: 'New review added'});
    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
});

// View all reviews
router.get('/:id/reviews', async (req, res) => {
    const {id} = req.params;
    try {
        const reviews = await pool.query(
            `SELECT r.*, u.name FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.book_id = $1
            ORDER BY r.created_at DESC`, [id]
        );
        res.json(reviews.rows);

    } catch (err) {
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;