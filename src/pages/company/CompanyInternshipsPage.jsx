import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ErrorMessage from '../../components/common/ErrorMessage';

const CompanyInternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [internshipToDelete, setInternshipToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/internships?size=50&activeOnly=false');
      if (res.data.success && res.data.data) {
        setInternships(res.data.data.content || []);
      }
    } catch (err) {
      setError('Failed to fetch your internship postings.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosting = async (id) => {
    try {
      const res = await api.post(`/internships/${id}/close`);
      if (res.data.success) {
        setSuccess('Internship marked as CLOSED.');
        fetchMyInternships();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not close internship.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!internshipToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await api.delete(`/internships/${internshipToDelete.id}`);
      if (res.data.success) {
        setSuccess('Internship posting deleted.');
        setInternshipToDelete(null);
        fetchMyInternships();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete internship.');
      setInternshipToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Manage Internship Postings"
      subtitle="Create, edit, close, or review candidates for your published opportunities."
      actions={
        <Link to="/company/internships/new" className="btn btn-ims-primary btn-sm rounded-pill px-3 fw-semibold">
          <i className="bi bi-plus-circle me-1"></i> Post New Internship
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
          <div className="p-5 text-center">
            <LoadingSpinner message="Loading your postings..." />
          </div>
        ) : internships.length === 0 ? (
          <div className="p-5 text-center">
            <i className="bi bi-briefcase display-4 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold text-dark">No Postings Yet</h5>
            <p className="text-muted small mb-3">Create your first internship opportunity to start receiving candidate applications.</p>
            <Link to="/company/internships/new" className="btn btn-ims-primary btn-sm rounded-pill px-4">
              Post an Internship
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th className="ps-4">Job Title & Details</th>
                  <th>Mode / Stipend</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 py-3">
                      <strong className="text-dark d-block">{item.title}</strong>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt me-1"></i> {item.location || 'Remote'}
                        {' '}• {item.durationWeeks || 12} weeks
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-light text-primary border me-1">{item.workMode}</span>
                      <strong className="text-success small d-block mt-1">
                        {item.stipend ? `₹${Number(item.stipend).toLocaleString()}/mo` : 'Unpaid'}
                      </strong>
                    </td>

                    <td className="text-secondary small">
                      {item.deadline || 'Open'}
                    </td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td>
                      <Link to="/company/applicants" className="badge bg-primary text-white text-decoration-none px-2 py-1">
                        <i className="bi bi-people me-1"></i> {item.applicationsCount || 0} applicants
                      </Link>
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        <Link to={`/company/internships/${item.id}/edit`} className="btn btn-outline-secondary btn-sm px-2 py-1" title="Edit Posting">
                          <i className="bi bi-pencil"></i>
                        </Link>

                        {item.status !== 'CLOSED' && (
                          <button
                            className="btn btn-outline-warning btn-sm px-2 py-1"
                            title="Close Posting"
                            onClick={() => handleClosePosting(item.id)}
                          >
                            <i className="bi bi-lock"></i>
                          </button>
                        )}

                        <button
                          className="btn btn-outline-danger btn-sm px-2 py-1"
                          title="Delete Posting"
                          onClick={() => setInternshipToDelete(item)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!internshipToDelete}
        title="Delete Internship Posting?"
        message={`Are you sure you want to delete "${internshipToDelete?.title}"? All associated applicant submissions will also be removed.`}
        confirmText="Delete Posting"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setInternshipToDelete(null)}
      />
    </DashboardLayout>
  );
};

export default CompanyInternshipsPage;
