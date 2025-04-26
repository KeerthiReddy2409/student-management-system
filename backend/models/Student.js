const mongoose = require('mongoose');
const currentYear = new Date().getFullYear();

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, 'Student ID must be alphanumeric']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2, 'Last name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  enrollmentYear: {
    type: Number,
    required: [true, 'Enrollment year is required'],
    min: [2000, 'Enrollment year must be 2000 or later'],
    max: [currentYear, 'Enrollment year cannot be in the future']
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Student', StudentSchema);
