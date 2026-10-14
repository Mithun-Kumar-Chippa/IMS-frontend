import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="ims-footer border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <span className="fw-bold text-primary">Internship Management System</span>
              <span className="badge bg-light text-secondary border">Academic Edition</span>
            </div>
            <p className="text-muted small mb-0">
              Full-Stack Application with React, Java Spring Boot 3, and MySQL 8.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 text-secondary small">
              <Link to="/internships" className="text-decoration-none text-muted">Browse Internships</Link>
              <Link to="/chat" className="text-decoration-none text-muted">AI Assistant</Link>
              <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                Swagger API Docs <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
            <p className="text-muted small mt-1 mb-0">
              © {new Date().getFullYear()} IMS Project. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
