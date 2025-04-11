const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  deleteNote,
  updateNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

// All note routes are protected with authMiddleware
router.get('/', authMiddleware, getNotes);
router.post('/', authMiddleware, createNote);
router.delete('/:id', authMiddleware, deleteNote);
router.put('/:id', authMiddleware, updateNote);

module.exports = router;
