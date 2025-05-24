import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderUserLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <li><Link to="/register" className="nav-link">Register</Link></li>
        </>
      );
    }

    const commonLinks = (
      <>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
        <li>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </li>
      </>
    );

    switch (user.role) {
      case 'admin':
        return (
          <>
            <li><Link to="/admin/events" className="nav-link">Manage Events</Link></li>
            <li><Link to="/admin/users" className="nav-link">Manage Users</Link></li>
            {commonLinks}
          </>
        );
      case 'organizer':
        return (
          <>
            <li><Link to="/my-events" className="nav-link">My Events</Link></li>
            <li><Link to="/my-events/new" className="nav-link">Create Event</Link></li>
            <li><Link to="/my-events/analytics" className="nav-link">Analytics</Link></li>
            {commonLinks}
          </>
        );
      case 'user':
        return (
          <>
            <li><Link to="/bookings" className="nav-link">My Bookings</Link></li>
            {commonLinks}
          </>
        );
      default:
        return commonLinks;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          TicketHub
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Events</Link></li>
            {renderUserLinks()}
          </ul>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {isAuthenticated && (
          <div className="user-info">
            <span className="user-welcome">
              Welcome, {user.name} ({user.role})
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;