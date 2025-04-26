import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('studentId');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    enrollmentYearMin: '',
    enrollmentYearMax: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Apply filters whenever students, searchTerm or filters change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [students, searchTerm, filters, sortField, sortDirection]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('https://student-management-system-backend-g9lw.onrender.com/api/students');
      setStudents(res.data);
      setFilteredStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        toast.error('Failed to delete student');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const applyFiltersAndSearch = () => {
    let result = [...students];
    
    // Apply search term across multiple fields
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(student => (
        (student.firstName && student.firstName.toLowerCase().includes(search)) ||
        (student.lastName && student.lastName.toLowerCase().includes(search)) ||
        (student.email && student.email.toLowerCase().includes(search)) ||
        (student.studentId && student.studentId.toLowerCase().includes(search)) ||
        (student.department && student.department.toLowerCase().includes(search))
      ));
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      result = result.filter(student => student.isActive === isActive);
    }
    
    // Apply department filter
    if (filters.department !== 'all') {
      result = result.filter(student => student.department === filters.department);
    }
    
    // Apply enrollment year range filter
    if (filters.enrollmentYearMin) {
      result = result.filter(student => 
        parseInt(student.enrollmentYear) >= parseInt(filters.enrollmentYearMin)
      );
    }
    
    if (filters.enrollmentYearMax) {
      result = result.filter(student => 
        parseInt(student.enrollmentYear) <= parseInt(filters.enrollmentYearMax)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'enrollmentYear') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    setFilteredStudents(result);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      department: 'all',
      enrollmentYearMin: '',
      enrollmentYearMax: '',
    });
  };

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  if (loading) {
    return <div className="loading">Loading student data...</div>;
  }
  
  // Get unique departments for filter dropdown
  const departments = ['all', ...new Set(students
    .filter(s => s.department) // Filter out any undefined departments
    .map(s => s.department))];
  
  return (
    <div className="student-list">
      <h2>Student Records</h2>
      
      <div className="list-header">
        <p>Total Students: <strong>{students.length}</strong></p>
        <Link to="/students/add" className="btn btn-success">Add New Student</Link>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, ID, email or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
        </button>
      </div>
      
      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="advanced-filters-panel">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Department:</label>
            <select 
              name="department" 
              value={filters.department} 
              onChange={handleFilterChange}
              className="form-select"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Enrollment Year:</label>
            <div className="year-range">
              <input
                type="number"
                name="enrollmentYearMin"
                placeholder="From"
                value={filters.enrollmentYearMin}
                onChange={handleFilterChange}
                className="form-control"
              />
              <span>to</span>
              <input
                type="number"
                name="enrollmentYearMax"
                placeholder="To"
                value={filters.enrollmentYearMax}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
          </div>
          
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Results Count */}
      <div className="results-info">
        Showing {filteredStudents.length} of {students.length} students
      </div>
      
      {/* Sort Controls */}
      <div className="sort-controls">
        <span><strong>Sort By: </strong></span>
        <button 
          className={`sort-btn ${sortField === 'studentId' ? 'active' : ''}`} 
          onClick={() => handleSort('studentId')}
        >
          Student ID {getSortIcon('studentId')}
        </button>
        <button 
          className={`sort-btn ${sortField === 'enrollmentYear' ? 'active' : ''}`} 
          onClick={() => handleSort('enrollmentYear')}
        >
          Enrollment Year {getSortIcon('enrollmentYear')}
        </button>
        <button 
          className={`sort-btn ${sortField === 'isActive' ? 'active' : ''}`} 
          onClick={() => handleSort('isActive')}
        >
          Status {getSortIcon('isActive')}
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="no-students">
          <p>No student records found matching your search criteria.</p>
          <button className="btn btn-primary" onClick={resetFilters}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('studentId')} className="sortable-header">
                  Student ID {getSortIcon('studentId')}
                </th>
                <th onClick={() => handleSort('firstName')}>
                  Name {getSortIcon('firstName')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {getSortIcon('email')}
                </th>
                <th onClick={() => handleSort('department')}>
                  Department {getSortIcon('department')}
                </th>
                <th onClick={() => handleSort('enrollmentYear')} className="sortable-header">
                  Enrollment {getSortIcon('enrollmentYear')}
                </th>
                <th onClick={() => handleSort('isActive')} className="sortable-header">
                  Status {getSortIcon('isActive')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.enrollmentYear}</td>
                  <td>
                    <span className={`status-badge ${student.isActive ? 'status-active' : 'status-inactive'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* <Link to={`/students/view/${student._id}`} className="btn btn-sm btn-info">View</Link> */}
                      <Link to={`/students/edit/${student._id}`} className="btn btn-sm btn-primary">Edit</Link>
                      <button onClick={() => handleDelete(student._id)} className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
