import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddStudent = () => {
  const navigate = useNavigate();
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

  const { studentId, firstName, lastName, email, dob, department, enrollmentYear, isActive } = formData;

  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/students', formData);
      toast.success('Student added successfully');
      navigate('/students');
    } catch (err) {
      console.error('Error adding student:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add student';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="add-student">
      <h2>Add New Student</h2>
      
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
              placeholder="First name"
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
              placeholder="Last name"
              minLength="2"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="student@example.com"
            required
          />
        </div>
        
        <div className="form-row">
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
        </div>
        
        <div className="form-row">
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
          
          <div className="form-group">
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
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn btn-success">Add Student</button>
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

export default AddStudent;