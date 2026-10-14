import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const InternshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  const fetchInternshipDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/internships/${id}`);
      if (res.data.success) {
        setInternship(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load internship details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError(null);

    try {
      const res = await api.post('/applications', {
        internshipId: parseInt(id, 10),
        coverLetter: coverLetter
      });

      if (res.data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setShowApplyModal(false);
          setApplySuccess(false);
          navigate('/student/applications');
        }, 1800);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner message="Loading internship opportunity..." />
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="container py-5 text-center">
        <div className="ims-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-exclamation-circle text-danger display-4 mb-3"></i>
          <h4 className="fw-bold">Internship Not Found</h4>
          <p className="text-muted small mb-4">{error || 'This internship posting may have expired or been removed.'}</p>
          <Link to="/internships" className="btn btn-ims-primary btn-sm px-4">
            Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-subtle border-bottom py-4 mb-4">
        <div className="container">
          <Link to="/internships" className="text-muted small text-decoration-none d-inline-flex align-items-center mb-2">
            <i className="bi bi-arrow-left me-1"></i> Back to Internships
          </Link>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-light text-primary border small fw-semibold">
                  <i className="bi bi-building me-1"></i> {internship.companyName}
                </span>
                <StatusBadge status={internship.status} />
              </div>
              <h1 className="fw-bold text-dark fs-2 mb-1">{internship.title}</h1>
              <p className="text-muted small mb-0">
                <i className="bi bi-geo-alt me-1 text-primary"></i> {internship.location || 'Remote'}
                {' '}• <i className="bi bi-tag me-1"></i> {internship.department || 'General Engineering'}
                {' '}• Posted {new Date(internship.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              {user?.role === 'STUDENT' ? (
                <button
                  className="btn btn-ims-success btn-lg px-4 fs-6 shadow-sm"
                  onClick={() => setShowApplyModal(true)}
                >
                  <i className="bi bi-send-check me-2"></i> Apply for this Role
                </button>
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn btn-ims-primary btn-lg px-4 fs-6">
                  Sign In to Apply
                </Link>
              ) : (
                <span className="badge bg-light text-secondary border p-2">
                  Signed in as {user.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Main Details */}
          <div className="col-lg-8">
            <div className="ims-card p-4 mb-4 shadow-sm">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Role Description</h5>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{internship.description}</p>

              {internship.responsibilities && (
                <>
                  <h5 className="fw-bold text-dark mt-4 mb-3 pb-2 border-bottom">Key Responsibilities</h5>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{internship.responsibilities}</p>
                </>
              )}

              {internship.requirements && (
                <>
                  <h5 className="fw-bold text-dark mt-4 mb-3 pb-2 border-bottom">Eligibility & Requirements</h5>
                  <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{internship.requirements}</p>
                </>
              )}
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="col-lg-4">
            <div className="ims-card p-4 shadow-sm mb-4">
              <h5 className="fw-bold text-dark mb-3">Overview</h5>
              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted"><i className="bi bi-cash-stack me-2 text-primary"></i> Monthly Stipend</span>
                  <span className="fw-bold text-success fs-6">
                    {internship.stipend ? `₹${Number(internship.stipend).toLocaleString()}` : 'Unpaid'}
                  </span>
                </div>
                <div className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted"><i className="bi bi-laptop me-2 text-primary"></i> Work Mode</span>
                  <span className="fw-semibold text-dark">{internship.workMode}</span>
                </div>
                <div className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted"><i className="bi bi-clock-history me-2 text-primary"></i> Duration</span>
                  <span className="fw-semibold text-dark">{internship.durationWeeks || 12} weeks</span>
                </div>
                <div className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted"><i className="bi bi-people me-2 text-primary"></i> Positions</span>
                  <span className="fw-semibold text-dark">{internship.maxPositions || 1} Openings</span>
                </div>
                <div className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted"><i className="bi bi-calendar2-x me-2 text-danger"></i> Deadline</span>
                  <span className="fw-bold text-dark">{internship.deadline || 'Rolling basis'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted"><i className="bi bi-file-earmark-person me-2 text-primary"></i> Total Applicants</span>
                  <span className="fw-semibold text-dark">{internship.applicationsCount || 0} students</span>
                </div>
              </div>

              {user?.role === 'STUDENT' && (
                <button
                  className="btn btn-ims-success w-100 mt-4 py-2 fw-semibold"
                  onClick={() => setShowApplyModal(true)}
                >
                  <i className="bi bi-send-check me-2"></i> Submit Application
                </button>
              )}
            </div>

            {/* AI Assistant Banner */}
            <div className="ims-card p-4 bg-subtle border-primary-subtle shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-robot fs-4 text-primary"></i>
                <h6 className="fw-bold text-dark mb-0">Have questions about this role?</h6>
              </div>
              <p className="text-muted small mb-3">
                Ask our embedded AI assistant about eligibility, cover letter preparation, and interview tips for this specific posting.
              </p>
              <Link to={`/chat`} className="btn btn-outline-primary btn-sm rounded-pill w-100">
                Ask AI Assistant <i className="bi bi-chat-dots ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION MODAL */}
      {showApplyModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Apply for {internship.title}</h5>
                  <p className="text-muted small mb-0">{internship.companyName}</p>
                </div>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowApplyModal(false)} disabled={applyLoading}></button>
              </div>

              <div className="modal-body py-4">
                <ErrorMessage message={applyError} onDismiss={() => setApplyError(null)} />

                {applySuccess ? (
                  <div className="alert alert-success border-0 rounded-3 text-center py-4">
                    <i className="bi bi-check-circle-fill display-4 text-success mb-2 d-block"></i>
                    <h5 className="fw-bold">Application Submitted Successfully!</h5>
                    <p className="text-muted small mb-0">The recruiter has been notified. Redirecting to your applications dashboard...</p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Cover Letter & Statement of Interest *</label>
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Explain why you are an ideal fit for this role, mentioning relevant academic projects, frameworks, and programming experience..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        required
                      ></textarea>
                      <div className="form-text small">
                        Tip: Highlight hands-on experience with Java, Spring Boot, React, or technologies requested in the posting.
                      </div>
                    </div>

                    <div className="alert alert-light border small rounded-3 d-flex align-items-center gap-2 mb-4">
                      <i className="bi bi-file-earmark-pdf-fill text-danger fs-4"></i>
                      <div>
                        <span className="fw-semibold text-dark">Profile Resume Attached</span>
                        <div className="text-muted">Your active resume saved in your Student Profile will be transmitted with this application.</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setShowApplyModal(false)} disabled={applyLoading}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-ims-success rounded-3 px-4 fw-semibold" disabled={applyLoading || !coverLetter.trim()}>
                        {applyLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          'Confirm & Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InternshipDetailPage;
