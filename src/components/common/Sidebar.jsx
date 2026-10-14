import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isStudent = user.role === 'STUDENT';
  const isCompany = user.role === 'COMPANY';
  const isAdmin = user.role === 'ADMIN';

  return (
    <aside className="dashboard-sidebar">
      {/* Role Banner */}
      <div className="p-3 mb-3 rounded-3 bg-light border text-center">
        <div className="fw-bold text-dark small text-truncate">{user.fullName}</div>
        <span className={`badge mt-1 ${isAdmin ? 'bg-purple text-white' : isCompany ? 'bg-info text-dark' : 'bg-primary text-white'}`}>
          {user.role} PORTAL
        </span>
      </div>

      <nav className="d-flex flex-column gap-1">
        {/* STUDENT NAV */}
        {isStudent && (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2"></i> Overview
            </NavLink>
            <NavLink to="/internships" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-search"></i> Find Internships
            </NavLink>
            <NavLink to="/student/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-badge"></i> Profile & Resume
            </NavLink>
            <NavLink to="/student/applications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-file-earmark-check"></i> My Applications
            </NavLink>
            <NavLink to="/student/records" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-calendar-check"></i> Internships & Reports
            </NavLink>
          </>
        )}

        {/* COMPANY NAV */}
        {isCompany && (
          <>
            <NavLink to="/company/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
            <NavLink to="/company/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building"></i> Company Profile
            </NavLink>
            <NavLink to="/company/internships" end className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-briefcase"></i> Manage Postings
            </NavLink>
            <NavLink to="/company/internships/new" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-plus-circle"></i> Post New Internship
            </NavLink>
            <NavLink to="/company/applicants" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people"></i> Review Applicants
            </NavLink>
            <NavLink to="/company/records" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-clipboard2-data"></i> Interns & Evaluations
            </NavLink>
          </>
        )}

        {/* ADMIN NAV */}
        {isAdmin && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-speedometer2"></i> Admin Overview
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-people"></i> Manage Users
            </NavLink>
            <NavLink to="/admin/companies" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-shield-check"></i> Company Verifications
            </NavLink>
            <NavLink to="/admin/internships" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-check2-circle"></i> Internship Approvals
            </NavLink>
            <NavLink to="/admin/announcements" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-megaphone"></i> Announcements
            </NavLink>
            <NavLink to="/admin/audit-logs" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active-purple' : ''}`}>
              <i className="bi bi-journal-text"></i> Audit Logs
            </NavLink>
          </>
        )}

        <hr className="my-2 border-secondary-subtle" />

        <NavLink to="/notifications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-bell"></i> Notifications
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-robot"></i> AI Assistant
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
