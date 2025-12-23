const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'sqlx9', {
    expiresIn: '7d'
  });
};

// SignUp user
const signup = async (req, res) => {
  try {
    const { name, email, password} = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role:'student' // Only student signup , admin through api only
    });
    
    // Save user to database
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data and token (excluding password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data and token (excluding password)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = {
  signup,
  login
};