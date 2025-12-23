const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getCurrentStudentProfile
} = require('../controllers/student.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// @route   GET /api/students/profile
// @desc    Get current student's profile
// @access  Private (Students only)
router.get('/profile', getCurrentStudentProfile);

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Admin only)
router.get('/', authorizeAdmin, getAllStudents);

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private (Admin only)
router.get('/:id', authorizeAdmin, getStudentById);

// @route   POST /api/students
// @desc    Create a new student
// @access  Private (Admin only)
router.post('/', authorizeAdmin, createStudent);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin or student themselves)
router.put('/:id', updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin only)
router.delete('/:id', authorizeAdmin, deleteStudent);

module.exports = router;