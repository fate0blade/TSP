import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">TicketHub</h3>
            <p className="footer-description">
              Your premier destination for event tickets and experiences.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Browse Events</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/help">Help Center</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">For Organizers</h4>
            <ul className="footer-links">
              <li><a href="/register">Create Account</a></li>
              <li><a href="/organizer-guide">Organizer Guide</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Info</h4>
            <p className="footer-contact">
              Email: support@tickethub.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Event Street, City, State 12345
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 TicketHub. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;