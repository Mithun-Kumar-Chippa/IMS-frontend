import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CompanyRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Review Progress Reports Modal
  const [activeRecordForReports, setActiveRecordForReports] = useState(null);
  const [reportsList, setReportsList] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [feedbackInputs, setFeedbackInputs] = useState({});

  // Formal Evaluation Modal
  const [activeRecordForEval, setActiveRecordForEval] = useState(null);
  const [evalForm, setEvalForm] = useState({
    technicalSkillRating: 5,
    softSkillRating: 5,
    punctualityRating: 5,
    overallRating: 5,
    recommendation: 'SUCCESSFULLY_COMPLETED',
    comments: ''
  });
  const [submittingEval, setSubmittingEval] = useState(false);

  useEffect(() => {
    fetchRecords(page);
  }, [page]);

  const fetchRecords = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await api.get(`/companies/records?page=${pageNumber}&size=10`);
      if (res.data.success && res.data.data) {
        setRecords(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to fetch intern records.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReports = async (rec) => {
    setActiveRecordForReports(rec);
    setLoadingReports(true);
    try {
      const res = await api.get(`/students/records/${rec.id}/reports`);
      if (res.data.success) {
        setReportsList(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleFeedbackSubmit = async (reportId) => {
    const feedbackText = feedbackInputs[reportId];
    if (!feedbackText || !feedbackText.trim()) return;

    try {
      const res = await api.post(`/companies/reports/${reportId}/feedback?feedback=${encodeURIComponent(feedbackText.trim())}`);
      if (res.data.success) {
        setSuccess('Mentor feedback saved and sent to student.');
        setFeedbackInputs({ ...feedbackInputs, [reportId]: '' });
        // Refresh reports list
        handleOpenReports(activeRecordForReports);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    }
  };

  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    if (!activeRecordForEval) return;
    setSubmittingEval(true);
    setError(null);

    try {
      const res = await api.post(`/companies/records/${activeRecordForEval.id}/evaluation`, evalForm);
      if (res.data.success) {
        setSuccess(`Formal evaluation completed for ${activeRecordForEval.studentName}. Internship marked as COMPLETED.`);
        setActiveRecordForEval(null);
        fetchRecords(page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmittingEval(false);
    }
  };

  return (
    <DashboardLayout
      title="Active Interns & Performance Evaluations"
      subtitle="Monitor enrolled student cohorts, review weekly milestone submissions, and submit formal course evaluations."
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
            <LoadingSpinner message="Loading intern records..." />
          </div>
        ) : records.length === 0 ? (
          <div className="p-5 text-center text-muted small">
            <i className="bi bi-folder2-open display-4 text-muted mb-3 d-block"></i>
            No active interns currently placed. Accept candidate applications to start an internship cohort.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-muted text-uppercase">
                <tr>
                  <th className="ps-4">Intern Name</th>
                  <th>Position</th>
                  <th>Mentor</th>
                  <th>Duration</th>
                  <th>Reports</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="ps-4 py-3">
                      <strong className="text-dark d-block">{rec.studentName}</strong>
                      <span className="text-muted small">{rec.studentEmail}</span>
                    </td>

                    <td className="fw-semibold text-primary">{rec.internshipTitle}</td>

                    <td className="small">
                      <div className="text-dark fw-medium">{rec.mentorName || 'Assigned Mentor'}</div>
                      <div className="text-muted">{rec.mentorEmail}</div>
                    </td>

                    <td className="text-secondary small">
                      {rec.startDate} to {rec.endDate || 'Ongoing'}
                    </td>

                    <td>
                      <span className="badge bg-light text-primary border px-2 py-1 small">
                        <i className="bi bi-journal-check me-1"></i> {rec.progressReportsCount || 0} Reports
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={rec.status} />
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm px-2 py-1"
                          onClick={() => handleOpenReports(rec)}
                          title="Review Progress Reports"
                        >
                          <i className="bi bi-chat-left-dots me-1"></i> Reports
                        </button>

                        {!rec.evaluated ? (
                          <button
                            className="btn btn-ims-success btn-sm px-2 py-1"
                            onClick={() => setActiveRecordForEval(rec)}
                            title="Submit Formal Evaluation"
                          >
                            <i className="bi bi-award me-1"></i> Evaluate
                          </button>
                        ) : (
                          <span className="badge bg-success-subtle text-success border small">
                            <i className="bi bi-check2-all me-1"></i> Graded
                          </span>
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

      {/* REVIEW PROGRESS REPORTS MODAL */}
      {activeRecordForReports && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Weekly Progress Reports</h5>
                  <p className="text-muted small mb-0">{activeRecordForReports.studentName} • {activeRecordForReports.internshipTitle}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveRecordForReports(null)}></button>
              </div>

              <div className="modal-body p-4">
                {loadingReports ? (
                  <LoadingSpinner message="Loading weekly logs..." />
                ) : reportsList.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    Student has not submitted any weekly progress reports yet.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reportsList.map((rep) => (
                      <div key={rep.id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="badge bg-primary px-3 py-1 fw-bold">Week {rep.weekNumber}</span>
                          <span className="text-muted small">Logged: {new Date(rep.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <h6 className="fw-bold text-dark mb-2">{rep.reportTitle}</h6>

                        <div className="small text-secondary mb-2">
                          <strong className="text-dark d-block">Tasks Completed:</strong>
                          <p className="mb-2" style={{ whiteSpace: 'pre-line' }}>{rep.tasksCompleted}</p>
                        </div>

                        {rep.challengesFaced && (
                          <div className="small text-secondary mb-2">
                            <strong className="text-dark d-block">Challenges:</strong>
                            <p className="mb-2">{rep.challengesFaced}</p>
                          </div>
                        )}

                        {rep.feedback ? (
                          <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 mt-2">
                            <strong className="text-success small d-block mb-1">
                              <i className="bi bi-chat-quote-fill me-1"></i> Recorded Feedback:
                            </strong>
                            <p className="text-dark small mb-0">{rep.feedback}</p>
                          </div>
                        ) : (
                          <div className="mt-3 pt-2 border-top">
                            <label className="form-label small fw-semibold text-dark">Provide Mentor Feedback:</label>
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Constructive guidance, code review remarks..."
                                value={feedbackInputs[rep.id] || ''}
                                onChange={(e) => setFeedbackInputs({ ...feedbackInputs, [rep.id]: e.target.value })}
                              />
                              <button
                                className="btn btn-ims-primary"
                                onClick={() => handleFeedbackSubmit(rep.id)}
                              >
                                Submit Feedback
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary btn-sm rounded-pill px-4" onClick={() => setActiveRecordForReports(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMAL EVALUATION MODAL */}
      {activeRecordForEval && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Final Internship Evaluation & Grading</h5>
                  <p className="text-muted small mb-0">{activeRecordForEval.studentName} • {activeRecordForEval.internshipTitle}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveRecordForEval(null)} disabled={submittingEval}></button>
              </div>

              <form onSubmit={handleEvalSubmit}>
                <div className="modal-body py-3">
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Technical Skills (1-5) *</label>
                      <select
                        className="form-select"
                        value={evalForm.technicalSkillRating}
                        onChange={(e) => setEvalForm({ ...evalForm, technicalSkillRating: parseInt(e.target.value, 10) })}
                      >
                        <option value="5">5 - Outstanding</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Satisfactory</option>
                        <option value="2">2 - Marginal</option>
                        <option value="1">1 - Unsatisfactory</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Soft Skills (1-5) *</label>
                      <select
                        className="form-select"
                        value={evalForm.softSkillRating}
                        onChange={(e) => setEvalForm({ ...evalForm, softSkillRating: parseInt(e.target.value, 10) })}
                      >
                        <option value="5">5 - Outstanding</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Satisfactory</option>
                        <option value="2">2 - Marginal</option>
                        <option value="1">1 - Unsatisfactory</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Punctuality (1-5) *</label>
                      <select
                        className="form-select"
                        value={evalForm.punctualityRating}
                        onChange={(e) => setEvalForm({ ...evalForm, punctualityRating: parseInt(e.target.value, 10) })}
                      >
                        <option value="5">5 - Outstanding</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Satisfactory</option>
                        <option value="2">2 - Marginal</option>
                        <option value="1">1 - Unsatisfactory</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Overall Rating (1-5) *</label>
                      <select
                        className="form-select"
                        value={evalForm.overallRating}
                        onChange={(e) => setEvalForm({ ...evalForm, overallRating: parseInt(e.target.value, 10) })}
                      >
                        <option value="5">5 - Outstanding</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Satisfactory</option>
                        <option value="2">2 - Marginal</option>
                        <option value="1">1 - Unsatisfactory</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Final Recommendation *</label>
                      <select
                        className="form-select"
                        value={evalForm.recommendation}
                        onChange={(e) => setEvalForm({ ...evalForm, recommendation: e.target.value })}
                      >
                        <option value="SUCCESSFULLY_COMPLETED">Successfully Completed Internship</option>
                        <option value="HIRED_FULL_TIME">Recommended for Full-Time Employment Offer</option>
                        <option value="EXTEND_INTERNSHIP">Recommended for Extension / Second Term</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Evaluation Comments & Feedback</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Comprehensive remarks regarding student's initiative, code quality, and teamwork..."
                        value={evalForm.comments}
                        onChange={(e) => setEvalForm({ ...evalForm, comments: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setActiveRecordForEval(null)} disabled={submittingEval}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-ims-success rounded-3 px-4 fw-semibold" disabled={submittingEval}>
                    {submittingEval ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Finalize & Complete Evaluation'
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

export default CompanyRecordsPage;
