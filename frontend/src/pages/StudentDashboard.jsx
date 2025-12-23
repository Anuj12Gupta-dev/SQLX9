import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  });
  
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await studentAPI.getCurrentStudentProfile();
        setStudent(data);
        setFormData({
          name: data.name,
          email: data.email,
          course: data.course
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleEdit = () => {
    setEditing(true);
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course
    });
    setEditing(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedStudent = await studentAPI.updateStudent(student._id, formData);
      setStudent(updatedStudent);
      
      // Update user data in context
      updateUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
      
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
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
        <h1>Student Dashboard</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="card">
        <h2>My Profile</h2>
        
        {editing ? (
          <form onSubmit={handleSubmit}>
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
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Email:</strong> {student?.email}</p>
            <p><strong>Course:</strong> {student?.course}</p>
            <p><strong>Enrollment Date:</strong> {student?.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</p>
            <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;