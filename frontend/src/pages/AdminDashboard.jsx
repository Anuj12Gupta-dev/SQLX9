import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    course: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Fetch students with pagination
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentAPI.getAllStudents(pagination.currentPage, pagination.limit);
        setStudents(data.students);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [pagination.currentPage]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    }
  };
  
  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };
  
  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };
  
  const handlePageInputChange = (e) => {
    const page = parseInt(e.target.value) || 1;
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        // Refresh the student list to update pagination
        const data = await studentAPI.getAllStudents(pagination.currentPage, pagination.limit);
        setStudents(data.students);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  const handleAddStudent = async (e) => {
    e.preventDefault();
    console.log(formData)
    
    try {
      const newStudent = await studentAPI.createStudent(formData);
      // Refresh the student list to update pagination
      const data = await studentAPI.getAllStudents(pagination.currentPage, pagination.limit);
      setStudents(data.students);
      setPagination(data.pagination);
      setFormData({ name: '', email: '', password: '', course: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleEditStudent = async (e) => {
    e.preventDefault();
    
    try {
      const updatedStudent = await studentAPI.updateStudent(editingStudentId, formData);
      
      // Update the student in the state
      setStudents(students.map(student => 
        student._id === editingStudentId ? updatedStudent : student
      ));
      
      // Reset form and close edit form
      setFormData({ name: '', email: '', password: '', course: '' });
      setShowEditForm(false);
      setEditingStudentId(null);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const startEditStudent = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      password: '', // Don't pre-fill password for security
      course: student.course
    });
    setEditingStudentId(student._id);
    setShowEditForm(true);
  };
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  if (loading) {
    return <div className="container">Loading...</div>;
  }
  
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Students</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>
        
        {showAddForm && (
          <form onSubmit={handleAddStudent} className="card" style={{ marginBottom: '20px' }}>
            <h3>Add New Student</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={onChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Add Student</button>
          </form>
        )}
        
        {showEditForm && (
          <form onSubmit={handleEditStudent} className="card" style={{ marginBottom: '20px' }}>
            <h3>Edit Student</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={onChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Update Student</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setShowEditForm(false);
                setEditingStudentId(null);
                setFormData({ name: '', email: '', password: '', course: '' });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        )}
        
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.user.name}</td>
                    <td>{student.user.email}</td>
                    <td>{student.course}</td>
                    <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => startEditStudent(student)}
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={goToPrevPage}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              
              <input
                type="number"
                min="1"
                max={pagination.totalPages}
                value={pagination.currentPage}
                onChange={handlePageInputChange}
                style={{ width: '60px', textAlign: 'center' }}
              />
              
              <button 
                className="btn btn-secondary" 
                onClick={goToNextPage}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <small>Total Students: {pagination.totalStudents}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;