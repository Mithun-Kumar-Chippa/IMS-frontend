import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// ─── Public Pages ─────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterStudentPage from './pages/RegisterStudentPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import InternshipsPage from './pages/InternshipsPage';
import InternshipDetailPage from './pages/InternshipDetailPage';

// ─── Student Pages ────────────────────────────────────────
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentRecordsPage from './pages/student/StudentRecordsPage';

// ─── Company Pages ────────────────────────────────────────
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import CompanyInternshipsPage from './pages/company/CompanyInternshipsPage';
import PostInternshipPage from './pages/company/PostInternshipPage';
import CompanyApplicantsPage from './pages/company/CompanyApplicantsPage';
import CompanyRecordsPage from './pages/company/CompanyRecordsPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// ─── Role-Based Home Redirect ─────────────────────────────
const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;

  switch (user?.role) {
    case 'STUDENT':
      return <Navigate to="/student/dashboard" replace />;
    case 'COMPANY':
      return <Navigate to="/company/dashboard" replace />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
            {/* ─── Public Routes ───────────────────────── */}
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
            <Route path="/register/student" element={<MainLayout><RegisterStudentPage /></MainLayout>} />
            <Route path="/register/company" element={<MainLayout><RegisterCompanyPage /></MainLayout>} />
            <Route path="/internships" element={<MainLayout><InternshipsPage /></MainLayout>} />
            <Route path="/internships/:id" element={<MainLayout><InternshipDetailPage /></MainLayout>} />

            {/* ─── Home Redirect ───────────────────────── */}
            <Route path="/home" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />

            {/* ─── Student Routes ──────────────────────── */}
            <Route path="/student/dashboard" element={
              <RoleBasedRoute role="STUDENT">
                <StudentDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/student/profile" element={
              <RoleBasedRoute role="STUDENT">
                <StudentProfilePage />
              </RoleBasedRoute>
            } />
            <Route path="/student/applications" element={
              <RoleBasedRoute role="STUDENT">
                <StudentApplicationsPage />
              </RoleBasedRoute>
            } />
            <Route path="/student/records" element={
              <RoleBasedRoute role="STUDENT">
                <StudentRecordsPage />
              </RoleBasedRoute>
            } />

            {/* ─── Company Routes ──────────────────────── */}
            <Route path="/company/dashboard" element={
              <RoleBasedRoute role="COMPANY">
                <CompanyDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/company/profile" element={
              <RoleBasedRoute role="COMPANY">
                <CompanyProfilePage />
              </RoleBasedRoute>
            } />
            <Route path="/company/internships" element={
              <RoleBasedRoute role="COMPANY">
                <CompanyInternshipsPage />
              </RoleBasedRoute>
            } />
            <Route path="/company/post-internship" element={
              <RoleBasedRoute role="COMPANY">
                <PostInternshipPage />
              </RoleBasedRoute>
            } />
            <Route path="/company/applicants" element={
              <RoleBasedRoute role="COMPANY">
                <CompanyApplicantsPage />
              </RoleBasedRoute>
            } />
            <Route path="/company/records" element={
              <RoleBasedRoute role="COMPANY">
                <CompanyRecordsPage />
              </RoleBasedRoute>
            } />

            {/* ─── Catch All ──────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </ErrorBoundary>
);
}

export default App;
