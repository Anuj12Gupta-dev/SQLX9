// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Auth API calls
export const authAPI = {
  // Signup a new user
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    
    return data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  }
};

// Student API calls
export const studentAPI = {
  // Get all students (admin only)
  getAllStudents: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/students?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch students');
    }
    
    return data;
  },
  
  // Get student by ID (admin only)
  getStudentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch student');
    }
    
    return data;
  },
  
  // Create a new student (admin only)
  createStudent: async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create student');
    }
    
    return data;
  },
  
  // Update student (admin or student themselves)
  updateStudent: async (id, studentData) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update student');
    }
    
    return data;
  },
  
  // Delete student (admin only)
  deleteStudent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete student');
    }
    
    return data;
  },
  
  // Get current student's profile
  getCurrentStudentProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/students/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    
    return data;
  }
};