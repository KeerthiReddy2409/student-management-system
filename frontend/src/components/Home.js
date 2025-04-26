import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Student Management System</h1>
      <p>A comprehensive platform for managing student records, enrollments, and academic information. Easily add, edit, view, and delete student data with our user-friendly interface.</p>
      
      <div className="buttons">
        <Link className="btn btn-primary" to="/students">
          View All Students
        </Link>
        <Link className="btn btn-success" to="/students/add">
          Add New Student
        </Link>
      </div>
    </div>
  );
};

export default Home;