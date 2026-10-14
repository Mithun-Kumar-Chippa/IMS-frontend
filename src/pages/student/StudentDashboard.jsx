import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, appRes, recRes] = await Promise.all([
          api.get('/students/me').catch(() => ({ data: { data: null } })),
          api.get('/applications/my?size=5').catch(() => ({ data: { data: { content: [] } } })),
          api.get('/students/records?size=5').catch(() => ({ data: { data: { content: [] } } }))
        ]);

        if (profRes.data?.data) setProfile(profRes.data.data);
        if (appRes.data?.data?.content) setApplications(appRes.data.data.content);
        if (recRes.data?.data?.content) setRecords(recRes.data.data.content);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Student Portal" subtitle="Welcome back!">
        <LoadingSpinner message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;
  const pendingCount = applications.filter((a) => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW' || a.status === 'SHORTLISTED').length;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.fullName || 'Student'}!`}
      subtitle="Track your internship applications, weekly progress reports, and mentor feedback."
      actions={
        <Link to="/internships" className="btn btn-ims-primary btn-sm rounded-pill px-3">
          <i className="bi bi-search me-1"></i> Browse Openings
        </Link>
      }
    >
      {/* PROFILE COMPLETION BANNER */}
      {(!profile?.resumeUrl || !profile?.skills) && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-exclamation-triangle-fill fs-3 text-warning"></i>
            <div>
              <h6 className="fw-bold mb-0 text-dark">Incomplete Profile Alert</h6>
              <p className="text-secondary small mb-0">Upload your PDF resume and list your programming skills to improve your selection chances.</p>
            </div>
          </div>
          <Link to="/student/profile" className="btn btn-warning btn-sm rounded-pill px-3 fw-semibold">
            Complete Profile
          </Link>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-primary">
            <span className="text-muted small fw-semibold d-block mb-1">Total Applied</span>
            <h3 className="fw-bold text-dark mb-0">{applications.length}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-warning">
            <span className="text-muted small fw-semibold d-block mb-1">Under Review</span>
            <h3 className="fw-bold text-dark mb-0">{pendingCount}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-success">
            <span className="text-muted small fw-semibold d-block mb-1">Offers Accepted</span>
            <h3 className="fw-bold text-success mb-0">{acceptedCount}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="ims-card p-4 h-100 border-start border-4 border-info">
            <span className="text-muted small fw-semibold d-block mb-1">Active Internships</span>
            <h3 className="fw-bold text-dark mb-0">{records.length}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* RECENT APPLICATIONS */}
        <div className="col-lg-8">
          <div className="ims-card p-4 shadow-sm mb-4">
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <h5 className="fw-bold text-dark mb-0">Recent Applications</h5>
              <Link to="/student/applications" className="small fw-semibold text-primary">
                View All <i className="bi bi-chevron-right"></i>
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-file-earmark-text display-5 d-block mb-2 text-secondary"></i>
                You haven't applied to any internships yet.{' '}
                <Link to="/internships" className="text-primary fw-semibold">Start exploring openings</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Internship Role</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="fw-semibold text-dark">{app.internshipTitle}</td>
                        <td className="text-secondary">{app.companyName}</td>
                        <td className="text-muted">{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE INTERNSHIPS & PROGRESS REPORTS SHORTCUT */}
        <div className="col-lg-4">
          <div className="ims-card p-4 shadow-sm mb-4">
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <h5 className="fw-bold text-dark mb-0">Active Placement</h5>
              <Link to="/student/records" className="small fw-semibold text-primary">
                Manage <i className="bi bi-chevron-right"></i>
              </Link>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-calendar-x display-6 d-block mb-2 text-secondary"></i>
                No active accepted placements yet. Apply to openings to get selected!
              </div>
            ) : (
              records.map((rec) => (
                <div key={rec.id} className="p-3 bg-subtle rounded-3 border border-primary-subtle mb-3">
                  <h6 className="fw-bold text-primary mb-1">{rec.internshipTitle}</h6>
                  <p className="text-muted small mb-2">{rec.companyName}</p>
                  <div className="small text-secondary mb-2">
                    <div><strong>Mentor:</strong> {rec.mentorName || 'Assigned Mentor'}</div>
                    <div><strong>Submitted Reports:</strong> {rec.progressReportsCount}</div>
                  </div>
                  <Link to="/student/records" className="btn btn-ims-primary btn-sm w-100 py-1">
                    Submit Weekly Report
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* AI HELP CARD */}
          <div className="ims-card p-4 bg-light border-0 shadow-sm text-center">
            <i className="bi bi-robot display-5 text-primary mb-2 d-block"></i>
            <h6 className="fw-bold text-dark">Need guidance?</h6>
            <p className="text-muted small mb-3">
              Ask the integrated IMS AI Assistant about interview questions, report formatting, or career tips.
            </p>
            <Link to="/chat" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              Launch Assistant
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
