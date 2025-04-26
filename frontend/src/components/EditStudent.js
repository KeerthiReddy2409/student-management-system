import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: currentYear,
    isActive: true
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${id}`);
        const studentData = res.data;
        
        // Format date to YYYY-MM-DD for date input
        const formattedDob = studentData.dob ? new Date(studentData.dob).toISOString().split('T')[0] : '';
        
        setFormData({
          studentId: studentData.studentId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          dob: formattedDob,
          department: studentData.department,
          enrollmentYear: studentData.enrollmentYear,
          isActive: studentData.isActive
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student:', err);
        toast.error('Failed to fetch student data');
        navigate('/students');
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const { studentId, firstName, lastName, email, dob, department, enrollmentYear, isActive } = formData;

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, formData);
      toast.success('Student updated successfully');
      navigate('/students');
    } catch (err) {
      console.error('Error updating student:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update student';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-student">
      <h2>Edit Student</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={studentId}
            onChange={onChange}
            placeholder="e.g., CS12345"
            required
          />
          <small>Alphanumeric characters only</small>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChange}
              minLength="2"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChange}
              minLength="2"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={department}
            placeholder="e.g., Computer Science"
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Enrollment Year</label>
          <input
            type="number"
            name="enrollmentYear"
            value={enrollmentYear}
            min="2000"
            max={currentYear}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={isActive}
            onChange={onChange}
          />
          <label htmlFor="isActive">Active Student</label>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">Update Student</button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/students')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;