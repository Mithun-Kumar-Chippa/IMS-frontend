import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPostings: 0,
    totalApplicants: 0,
    pendingReview: 0,
    acceptedApplicants: 0,
    activeInterns: 0
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [statsRes, appRes, profRes] = await Promise.all([
          api.get('/companies/dashboard-stats').catch(() => ({ data: { data: {} } })),
          api.get('/companies/applicants?size=5').catch(() => ({ data: { data: { content: [] } } })),
          api.get('/companies/me').catch(() => ({ data: { data: null } }))
        ]);

        if (statsRes.data?.data) setStats(statsRes.data.data);
        if (appRes.data?.data?.content) setRecentApplicants(appRes.data.data.content);
        if (profRes.data?.data) setProfile(profRes.data.data);
      } catch (err) {
        console.error('Error loading company dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Company Portal" subtitle="Loading employer overview...">
        <LoadingSpinner message="Loading company dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Corporate Portal: ${profile?.companyName || user?.fullName}`}
      subtitle="Manage your internship positions, evaluate university applicants, and guide active interns."
      actions={
        <div className="d-flex align-items-center gap-2">
          <Link to="/company/internships/new" className="btn btn-ims-primary btn-sm rounded-pill px-3 fw-semibold">
            <i className="bi bi-plus-circle me-1"></i> Post New Internship
          </Link>
        </div>
      }
    >
      {/* VERIFICATION NOTICE */}
      {!profile?.verified && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-shield-exclamation fs-3 text-warning"></i>
            <div>
              <h6 className="fw-bold mb-0 text-dark">Pending Corporate Verification</h6>
              <p className="text-secondary small mb-0">
                Your company profile is under administrative review. Once verified, your postings will be published immediately to students.
              </p>
            </div>
          </div>
          <Link to="/company/profile" className="btn btn-warning btn-sm rounded-pill px-3 fw-semibold">
            View Profile
          </Link>
        </div>
      )}

      {/* RECRUITMENT METRIC CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-primary">
            <span className="text-muted small fw-semibold d-block mb-1">Total Postings</span>
            <h3 className="fw-bold text-dark mb-0">{stats.totalPostings || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-info">
            <span className="text-muted small fw-semibold d-block mb-1">Total Applicants</span>
            <h3 className="fw-bold text-dark mb-0">{stats.totalApplicants || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-warning">
            <span className="text-muted small fw-semibold d-block mb-1">Awaiting Review</span>
            <h3 className="fw-bold text-dark mb-0">{stats.pendingReview || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-success">
            <span className="text-muted small fw-semibold d-block mb-1">Active Interns</span>
            <h3 className="fw-bold text-success mb-0">{stats.activeInterns || 0}</h3>
          </div>
        </div>
      </div>

      {/* RECENT APPLICANTS TABLE */}
      <div className="ims-card p-4 shadow-sm mb-4">
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <h5 className="fw-bold text-dark mb-0">Recent Candidate Applications</h5>
          <Link to="/company/applicants" className="small fw-semibold text-primary">
            View All Applicants <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-people display-5 d-block mb-2 text-secondary"></i>
            No candidate applications received yet for your active postings.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Student Candidate</th>
                  <th>College & Skills</th>
                  <th>Internship Position</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong className="text-dark d-block">{app.studentName}</strong>
                      <span className="text-muted">{app.studentEmail}</span>
                    </td>
                    <td>
                      <span className="d-block text-secondary">{app.studentCollege || 'University Student'}</span>
                      <span className="text-muted small">{app.studentSkills || 'Skills listed in resume'}</span>
                    </td>
                    <td className="fw-semibold text-primary">{app.internshipTitle}</td>
                    <td className="text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="text-end">
                      <Link to="/company/applicants" className="btn btn-outline-primary btn-sm px-3">
                        Review Candidate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
