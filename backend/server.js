const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const { createAdmin } = require('./controllers/admin-signup-controller');

const app = express();

// Connect to database
connectDB();

// Initialize admin user if not exists
createAdmin();

// Middleware
app.use(cors({origin: process.env.FRONTEND_URL}));
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'SQLX9 Backend API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});