import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Withdraw Modal State
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  const fetchApplications = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/my?page=${pageNumber}&size=10`);
      if (res.data.success && res.data.data) {
        setApplications(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawConfirm = async () => {
    if (!selectedAppToWithdraw) return;
    setWithdrawLoading(true);
    setError(null);

    try {
      const res = await api.post(`/applications/${selectedAppToWithdraw.id}/withdraw`);
      if (res.data.success) {
        setSuccess('Application successfully withdrawn.');
        setSelectedAppToWithdraw(null);
        fetchApplications(page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not withdraw application.');
      setSelectedAppToWithdraw(null);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="My Internship Applications"
      subtitle="Track employer review progress and application status in real time."
      actions={
        <Link to="/internships" className="btn btn-ims-primary btn-sm rounded-pill px-3">
          <i className="bi bi-search me-1"></i> Apply to More Roles
        </Link>
      }
    >
      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="alert alert-success alert-dismissible fade show small rounded-3 mb-3 d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1 fw-semibold">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      <div className="ims-card shadow-sm border-0 overflow-hidden">
        {loading ? (
          <div className="p-5">
            <LoadingSpinner message="Loading your submitted applications..." />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-5 text-center">
            <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-dark">No Applications Found</h5>
            <p className="text-muted small mb-3">You have not submitted any applications yet.</p>
            <Link to="/internships" className="btn btn-ims-primary btn-sm rounded-pill px-4">
              Explore Available Internships
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th className="ps-4">Role & Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Employer Feedback / Mentor</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const canWithdraw = app.status === 'APPLIED' || app.status === 'UNDER_REVIEW';

                  return (
                    <tr key={app.id}>
                      <td className="ps-4 py-3">
                        <Link to={`/internships/${app.internshipId}`} className="fw-bold text-dark text-decoration-none d-block">
                          {app.internshipTitle}
                        </Link>
                        <span className="text-muted small">
                          <i className="bi bi-building me-1"></i> {app.companyName}
                        </span>
                      </td>

                      <td className="text-secondary small">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td>
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="small text-secondary" style={{ maxWidth: '280px' }}>
                        {app.status === 'ACCEPTED' && app.mentorName && (
                          <div className="text-success fw-semibold mb-1">
                            <i className="bi bi-person-check me-1"></i> Mentor: {app.mentorName}
                          </div>
                        )}
                        {app.reviewerNotes ? (
                          <span className="text-muted fst-italic">"{app.reviewerNotes}"</span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                      <td className="text-end pe-4">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <Link to={`/internships/${app.internshipId}`} className="btn btn-outline-secondary btn-sm px-2 py-1" title="View Posting">
                            <i className="bi bi-eye"></i>
                          </Link>

                          {canWithdraw && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm px-2 py-1"
                              title="Withdraw Application"
                              onClick={() => setSelectedAppToWithdraw(app)}
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!selectedAppToWithdraw}
        title="Withdraw Application?"
        message={`Are you sure you want to withdraw your application for "${selectedAppToWithdraw?.internshipTitle}" at ${selectedAppToWithdraw?.companyName}? This action cannot be undone.`}
        confirmText="Confirm Withdrawal"
        confirmVariant="danger"
        loading={withdrawLoading}
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setSelectedAppToWithdraw(null)}
      />
    </DashboardLayout>
  );
};

export default StudentApplicationsPage;
