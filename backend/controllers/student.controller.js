const Student = require('../models/Student');
const User = require('../models/User');

// Get all students (admin only)
const getAllStudents = async (req, res) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Calculate skip value
    const skip = (page - 1) * limit;
    
    // Get total count for pagination info
    const total = await Student.countDocuments();
    
    // Populate user data for each student with pagination
    const students = await Student.find()
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      students,
      pagination: {
        currentPage: page,
        totalPages,
        totalStudents: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students.' });
  }
};

// Get student by ID (admin only)
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find student and populate user data
    const student = await Student.findById(id).populate('user', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error while fetching student.' });
  }
};

// Create student (admin only)
const createStudent = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Check if user is already a student
      const existingStudent = await Student.findOne({ user: user._id });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists.' });
      }
      
      // If user exists but is not a student, we'll create a student record for them
      // But we won't change their role if they're an admin
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot create student record for admin user.' });
      }
    } else {
      // Create new user with student role
      user = new User({
        name,
        email,
        password,
        role: 'student'
      });
      
      await user.save();
    }
    
    // Create student record
    const student = new Student({
      user: user._id,
      course
    });
    
    await student.save();
    
    // Populate user data
    await student.populate('user', 'name email');
    
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error while creating student.' });
  }
};

// Update student (admin or student themselves)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course } = req.body;
    
    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    
    // Check permissions - admins can update any student, students can only update themselves
    if (req.user.role !== 'admin' && student.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }
    
    // Update user data if provided
    if (name || email) {
      const userUpdates = {};
      if (name) userUpdates.name = name;
      if (email) userUpdates.email = email;
      
      await User.findByIdAndUpdate(student.user, userUpdates, { new: true });
    }
    
    // Update student data if provided
    if (course) {
      student.course = course;
      await student.save();
    }
    
    // Populate and return updated student
    await student.populate('user', 'name email');
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error while updating student.' });
  }
};

// Delete student (admin only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Note: We're not deleting the user account as it might be used elsewhere
    // In a production app, you might want to mark the user as inactive instead

    // To delete user we can write this code : await User.findByIdAndDelete(student.user);
    
    // Delete student record
    await Student.findByIdAndDelete(id);
    
    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error while deleting student.' });
  }
};

// Get current student's profile (for student dashboard)
const getCurrentStudentProfile = async (req, res) => {
  try {
    // Find student record for the current user
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getCurrentStudentProfile
};