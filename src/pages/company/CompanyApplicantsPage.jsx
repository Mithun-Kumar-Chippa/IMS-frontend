import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CompanyApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cover Letter Modal
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  // Accept Candidate Modal
  const [appToAccept, setAppToAccept] = useState(null);
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [acceptingLoading, setAcceptingLoading] = useState(false);

  useEffect(() => {
    fetchApplicants(page, statusFilter);
  }, [page, statusFilter]);

  const fetchApplicants = async (pageNumber, status) => {
    setLoading(true);
    try {
      let url = `/companies/applicants?page=${pageNumber}&size=10`;
      if (status) url += `&status=${status}`;

      const res = await api.get(url);
      if (res.data.success && res.data.data) {
        setApplicants(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to fetch applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus, notes = '') => {
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        reviewerNotes: notes
      });

      if (res.data.success) {
        setSuccess(`Applicant marked as ${newStatus}`);
        fetchApplicants(page, statusFilter);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    if (!appToAccept) return;
    setAcceptingLoading(true);

    try {
      const res = await api.put(`/applications/${appToAccept.id}/status`, {
        status: 'ACCEPTED',
        reviewerNotes: 'Accepted for internship cohort.',
        mentorName: mentorName,
        mentorEmail: mentorEmail
      });

      if (res.data.success) {
        setSuccess(`Candidate ${appToAccept.studentName} accepted and official internship record generated!`);
        setAppToAccept(null);
        setMentorName('');
        setMentorEmail('');
        fetchApplicants(page, statusFilter);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept candidate.');
    } finally {
      setAcceptingLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Candidate Application Review"
      subtitle="Examine student resumes, shortlist contenders, and accept interns with mentor assignment."
    >
      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="alert alert-success alert-dismissible fade show small rounded-3 mb-3 d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1 fw-semibold">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* FILTER BUTTONS */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          className={`btn btn-sm rounded-pill px-3 ${statusFilter === '' ? 'btn-primary' : 'btn-light border'}`}
          onClick={() => { setStatusFilter(''); setPage(0); }}
        >
          All Applications
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 ${statusFilter === 'APPLIED' ? 'btn-primary' : 'btn-light border'}`}
          onClick={() => { setStatusFilter('APPLIED'); setPage(0); }}
        >
          Pending Review
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 ${statusFilter === 'SHORTLISTED' ? 'btn-primary' : 'btn-light border'}`}
          onClick={() => { setStatusFilter('SHORTLISTED'); setPage(0); }}
        >
          Shortlisted
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 ${statusFilter === 'ACCEPTED' ? 'btn-primary' : 'btn-light border'}`}
          onClick={() => { setStatusFilter('ACCEPTED'); setPage(0); }}
        >
          Accepted
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 ${statusFilter === 'REJECTED' ? 'btn-primary' : 'btn-light border'}`}
          onClick={() => { setStatusFilter('REJECTED'); setPage(0); }}
        >
          Rejected
        </button>
      </div>

      <div className="ims-card shadow-sm border-0 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <LoadingSpinner message="Loading candidate applications..." />
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-5 text-center text-muted small">
            <i className="bi bi-people display-4 text-muted mb-3 d-block"></i>
            No candidate applications found for the selected filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th className="ps-4">Candidate Name</th>
                  <th>Position Applied</th>
                  <th>College & Skills</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Candidate Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4 py-3">
                      <strong className="text-dark d-block">{app.studentName}</strong>
                      <span className="text-muted small">{app.studentEmail}</span>
                      {app.studentPhone && <div className="text-muted small">{app.studentPhone}</div>}
                    </td>

                    <td>
                      <span className="fw-semibold text-primary d-block">{app.internshipTitle}</span>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-decoration-none small"
                        onClick={() => setSelectedCoverLetter(app)}
                      >
                        <i className="bi bi-chat-left-text me-1"></i> Read Cover Letter
                      </button>
                    </td>

                    <td className="small" style={{ maxWidth: '220px' }}>
                      <div className="text-dark fw-medium">{app.studentCollege || 'University Student'}</div>
                      <div className="text-muted text-truncate" title={app.studentSkills}>{app.studentSkills || 'Not specified'}</div>
                    </td>

                    <td className="text-secondary small">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>

                    <td>
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex align-items-center justify-content-end gap-1">
                        {app.resumeUrl && (
                          <a
                            href={`http://localhost:8080${app.resumeUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-secondary btn-sm px-2 py-1"
                            title="Download PDF Resume"
                          >
                            <i className="bi bi-file-earmark-pdf"></i>
                          </a>
                        )}

                        {app.status !== 'SHORTLISTED' && app.status !== 'ACCEPTED' && (
                          <button
                            className="btn btn-outline-info btn-sm px-2 py-1"
                            title="Shortlist Candidate"
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED', 'Candidate shortlisted for technical round.')}
                          >
                            <i className="bi bi-star"></i>
                          </button>
                        )}

                        {app.status !== 'ACCEPTED' && (
                          <button
                            className="btn btn-outline-success btn-sm px-2 py-1"
                            title="Accept & Assign Mentor"
                            onClick={() => {
                              setAppToAccept(app);
                              setMentorName('Senior Staff Engineer');
                              setMentorEmail('mentor@company.com');
                            }}
                          >
                            <i className="bi bi-check2"></i> Accept
                          </button>
                        )}

                        {app.status !== 'REJECTED' && app.status !== 'ACCEPTED' && (
                          <button
                            className="btn btn-outline-danger btn-sm px-2 py-1"
                            title="Reject Candidate"
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED', 'Profile not aligned with current cohort requirements.')}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* COVER LETTER MODAL */}
      {selectedCoverLetter && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-dark">{selectedCoverLetter.studentName}</h5>
                  <p className="text-muted small mb-0">Cover Letter for {selectedCoverLetter.internshipTitle}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedCoverLetter(null)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-secondary small mb-0" style={{ whiteSpace: 'pre-line' }}>
                  {selectedCoverLetter.coverLetter || 'No cover letter provided.'}
                </p>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary btn-sm rounded-pill px-4" onClick={() => setSelectedCoverLetter(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCEPT CANDIDATE & ASSIGN MENTOR MODAL */}
      {appToAccept && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Accept Candidate & Assign Mentor</h5>
                  <p className="text-muted small mb-0">{appToAccept.studentName} • {appToAccept.internshipTitle}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setAppToAccept(null)} disabled={acceptingLoading}></button>
              </div>

              <form onSubmit={handleAcceptSubmit}>
                <div className="modal-body py-3">
                  <div className="alert alert-success border-0 small rounded-3 mb-3">
                    Accepting this applicant will automatically create an active <strong>Internship Record</strong> and enable weekly progress reporting for the student.
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Designated Mentor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Suresh Rao (Technical Lead)"
                      value={mentorName}
                      onChange={(e) => setMentorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Mentor Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="mentor@company.com"
                      value={mentorEmail}
                      onChange={(e) => setMentorEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setAppToAccept(null)} disabled={acceptingLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-ims-success rounded-3 px-4 fw-semibold" disabled={acceptingLoading}>
                    {acceptingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Accepting...
                      </>
                    ) : (
                      'Confirm Acceptance'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyApplicantsPage;
