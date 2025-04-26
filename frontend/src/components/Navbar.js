import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Helper function to determine if link is active
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link className="nav-logo" to="/">Student Management System</Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link className={isActive('/')} to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive('/students')} to="/students">Students</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive('/students/add')} to="/students/add">Add Student</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;