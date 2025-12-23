# SQLX9 Student Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing students with role-based access control.

## 📋 Project Overview

This application provides a complete student management system with two user roles:
- **Admin**: Can view all students, add new students, and delete students
- **Student**: Can view and update their own profile information

The system features JWT-based authentication, password hashing with bcrypt, and a clean, responsive UI.

## 🛠️ Tech Stack

- **Frontend**: React.js with Context API for state management
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing
- **Styling**: Pure CSS (no external libraries)
- **Routing**: React Router v6

## ✨ Features

### Authentication
- User signup and login with email/password
- Role-based access control (admin/student)
- Secure password storage with bcrypt
- JWT token management

### Admin Dashboard
- View all students in a clean table UI
- Add new students with name, email, password, and course
- Delete students

### Student Dashboard
- View personal profile information
- Update name, email, and course

### Security
- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- Protected API endpoints

## 📁 Folder Structure

```
root/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components (Login, Signup, Dashboards)
│   │   ├── context/             # React Context for state management
│   │   ├── services/            # API service functions
│   │   ├── App.jsx              # Main application component
│   │   └── main.jsx             # Application entry point
│   └── package.json
│
├── backend/
│   ├── controllers/             # Request handlers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Custom middleware
│   ├── config/                  # Configuration files
│   ├── server.js                # Server entry point
│   └── package.json
│
└── README.md
```

## 🌐 Backend API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register a new student user | Public |
| POST | `/api/auth/login` | Login user and get JWT token | Public |
| POST | `/api/auth/admin-signup` | Create admin user (initial setup only) | Public |

### Student Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students/profile` | Get current student's profile | Private (Students only) |
| GET | `/api/students` | Get all students | Private (Admin only) |
| GET | `/api/students/:id` | Get student by ID | Private (Admin only) |
| POST | `/api/students` | Create a new student | Private (Admin only) |
| PUT | `/api/students/:id` | Update student | Private (Admin or student themselves) |
| DELETE | `/api/students/:id` | Delete student | Private (Admin only) |

## 🖥️ Frontend Components

### Pages
- **Login.jsx**: User authentication page
- **Signup.jsx**: User registration page
- **AdminDashboard.jsx**: Admin dashboard for managing students
- **StudentDashboard.jsx**: Student dashboard for viewing and updating profile

### Components
- **ProtectedRoute.jsx**: Route protection based on user role

### Context
- **AuthContext.jsx**: Global authentication state management

### Services
- **api.js**: API service functions for backend communication

## ▶️ How to Run

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sqlx9
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variable:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the URL shown in the terminal)

## 👥 User Roles and Flows

### Admin Flow
1. Sign up or log in with admin credentials
2. Redirected to admin dashboard
3. View all students in a table
4. Add new students using the "Add Student" form
5. Delete students using the delete button

### Student Flow
1. Sign up or log in with student credentials
2. Redirected to student dashboard
3. View personal profile information
4. Edit profile information using the "Edit Profile" button
5. Save changes or cancel editing

## 🔐 Default Credentials

### Admin Credentials
- **Email**: admin@example.com
- **Password**: Admin@123

### Your Provided Credentials
- **Email**: anujguptaj123@gmail.com
- **Password**: anuj@123

## 🏗️ Architecture

### Backend Architecture
- **Models**: User.js and Student.js define the database schemas
- **Controllers**: Handle the business logic for authentication and student management
- **Routes**: Define the API endpoints
- **Middleware**: Authentication and authorization middleware
- **Config**: Database connection configuration

### Frontend Architecture
- **Context API**: Manages global authentication state
- **React Router**: Handles client-side routing
- **Protected Routes**: Ensures only authorized users access specific pages
- **API Service**: Centralized API calls to the backend

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for admin and student roles
- **Input Validation**: Server-side validation for all user inputs
- **Protected Routes**: Frontend and backend route protection

## 🧠 Assumptions Made

1. MongoDB is installed locally or a cloud MongoDB instance is available
2. Default ports are available (5173 for frontend, 5000 for backend)
3. Users understand how to set environment variables
4. Admin users are created automatically on server startup if none exists
5. Students can only update their own profile information

## 🔮 Future Improvements

1. **Pagination**: Implement pagination for the admin student list view
2. **Change Password**: Add functionality for users to change their passwords
3. **Email Verification**: Implement email verification during signup
4. **Forgot Password**: Add password recovery functionality
5. **Input Validation**: Add more comprehensive client-side and server-side validation
6. **Error Handling**: Improve error messages and handling throughout the application
7. **Testing**: Add unit and integration tests for both frontend and backend
8. **UI Enhancements**: Improve the user interface with better styling and responsiveness
9. **Search/Filter**: Add search and filtering capabilities for the student list
10. **Audit Logs**: Implement logging for admin actions

## 📝 Notes

- The application uses localStorage for storing JWT tokens and user information
- Passwords are hashed using bcrypt before being stored in the database
- Role-based access control is implemented both on the frontend (route protection) and backend (middleware)
- API calls are made directly from the frontend to the backend
- The application follows RESTful API design principles

## ⚠️ Security Considerations

In a production environment, consider implementing:
- HTTPS encryption
- Rate limiting
- Input sanitization
- More robust authentication (e.g., OAuth, refresh tokens)
- Proper error handling without exposing sensitive information
- Environment-specific configuration management