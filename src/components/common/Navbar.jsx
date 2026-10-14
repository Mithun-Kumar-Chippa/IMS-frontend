import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      api.get('/notifications/unread-count')
        .then((res) => {
          if (isMounted && res.data.success) {
            setUnreadCount(res.data.data.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'COMPANY') return '/company/dashboard';
    if (user.role === 'STUDENT') return '/student/dashboard';
    return '/';
  };

  return (
    <nav className="navbar navbar-expand-lg ims-navbar sticky-top border-bottom py-2 shadow-sm">
      <div className="container-fluid px-lg-4">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-mortarboard-fill fs-5"></i>
          </div>
          <div>
            <span className="fw-bold fs-5 navbar-title" style={{ letterSpacing: '-0.02em' }}>IMS</span>
            <span className="badge bg-primary-subtle text-primary border ms-2 small">Portal</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMainContent"
          aria-controls="navbarMainContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarMainContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/">
                <i className="bi bi-house-door me-1 text-primary"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/internships">
                <i className="bi bi-briefcase me-1 text-primary"></i> Internships
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3" to="/chat">
                <i className="bi bi-robot me-1 text-primary"></i> AI Assistant
              </Link>
            </li>
          </ul>

          {/* Right Action Area */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              className="btn btn-theme-toggle btn-sm rounded-circle p-2 mx-1"
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              <i className={`bi ${isDark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'} fs-5`}></i>
            </button>

            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>

                {/* Notifications Bell */}
                <Link to="/notifications" className="btn btn-theme-toggle btn-sm position-relative rounded-circle p-2 mx-1" title="Notifications">
                  <i className="bi bi-bell fs-5"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                      {unreadCount}
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="dropdown">
                  <button
                    className="btn btn-theme-user btn-sm rounded-pill d-flex align-items-center gap-2 ps-2 pe-3 dropdown-toggle border"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="fw-semibold small d-none d-md-inline user-name-label">{user?.fullName}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border rounded-3 mt-2 ims-dropdown-menu" aria-labelledby="userDropdown">
                    <li className="px-3 py-2 border-bottom">
                      <div className="fw-bold small user-name-label">{user?.fullName}</div>
                      <div className="text-muted small">{user?.email}</div>
                      <span className={`badge mt-1 ${user?.role === 'ADMIN' ? 'bg-purple text-white' : user?.role === 'COMPANY' ? 'bg-info text-dark' : 'bg-success text-white'}`}>
                        {user?.role}
                      </span>
                    </li>

                    <li>
                      <Link className="dropdown-item py-2 small" to={getDashboardPath()}>
                        <i className="bi bi-grid me-2 text-primary"></i> Dashboard
                      </Link>
                    </li>

                    {user?.role === 'STUDENT' && (
                      <li>
                        <Link className="dropdown-item py-2 small" to="/student/profile">
                          <i className="bi bi-person me-2 text-primary"></i> My Profile & Resume
                        </Link>
                      </li>
                    )}

                    {user?.role === 'COMPANY' && (
                      <li>
                        <Link className="dropdown-item py-2 small" to="/company/profile">
                          <i className="bi bi-building me-2 text-primary"></i> Company Profile
                        </Link>
                      </li>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item py-2 small text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold">
                  Sign In
                </Link>

                <div className="dropdown">
                  <button
                    className="btn btn-ims-primary btn-sm rounded-pill px-3 fw-semibold dropdown-toggle"
                    type="button"
                    id="registerDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Register
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border rounded-3 mt-2 ims-dropdown-menu" aria-labelledby="registerDropdown">
                    <li>
                      <Link className="dropdown-item py-2 small" to="/register/student">
                        <i className="bi bi-mortarboard me-2 text-primary"></i> As Student
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2 small" to="/register/company">
                        <i className="bi bi-building me-2 text-primary"></i> As Company
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
