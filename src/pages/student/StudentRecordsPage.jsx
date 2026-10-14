import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Report Submission Modal State
  const [activeRecordForReport, setActiveRecordForReport] = useState(null);
  const [reportForm, setReportForm] = useState({
    weekNumber: 1,
    reportTitle: '',
    tasksCompleted: '',
    challengesFaced: '',
    plansForNextWeek: '',
    hoursWorked: 40
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  // View Reports Modal State
  const [selectedRecordForView, setSelectedRecordForView] = useState(null);
  const [recordReports, setRecordReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students/records');
      if (res.data.success && res.data.data) {
        setRecords(res.data.data.content || []);
      }
    } catch (err) {
      setError('Failed to fetch accepted internship records.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportModal = (record) => {
    setActiveRecordForReport(record);
    const nextWeek = (record.progressReportsCount || 0) + 1;
    setReportForm({
      weekNumber: nextWeek,
      reportTitle: `Week ${nextWeek} Learning & Milestone Summary`,
      tasksCompleted: '',
      challengesFaced: '',
      plansForNextWeek: '',
      hoursWorked: 40
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!activeRecordForReport) return;
    setSubmittingReport(true);
    setError(null);

    try {
      const res = await api.post(`/students/records/${activeRecordForReport.id}/reports`, reportForm);
      if (res.data.success) {
        setSuccess(`Week ${reportForm.weekNumber} progress report successfully submitted!`);
        setActiveRecordForReport(null);
        fetchRecords();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit progress report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleViewReports = async (record) => {
    setSelectedRecordForView(record);
    setLoadingReports(true);
    try {
      const res = await api.get(`/students/records/${record.id}/reports`);
      if (res.data.success) {
        setRecordReports(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  return (
    <DashboardLayout
      title="Internship Placement Records & Weekly Reports"
      subtitle="Submit periodic progress reports, review mentor feedback, and view completion evaluations."
    >
      <ErrorMessage message={error} onDismiss={() => setError(null)} />

      {success && (
        <div className="alert alert-success alert-dismissible fade show small rounded-3 mb-3 d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div className="flex-grow-1 fw-semibold">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {loading ? (
        <div className="p-5 text-center">
          <LoadingSpinner message="Loading internship records..." />
        </div>
      ) : records.length === 0 ? (
        <div className="ims-card p-5 text-center shadow-sm">
          <i className="bi bi-folder-x display-4 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-dark">No Active Placement Records</h5>
          <p className="text-muted small mb-0">
            Once a company accepts your application, an official internship enrollment record will appear here for progress reporting.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {records.map((record) => (
            <div key={record.id} className="ims-card p-4 shadow-sm">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-3 border-bottom gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-primary-subtle text-primary border small fw-semibold">
                      <i className="bi bi-building me-1"></i> {record.companyName}
                    </span>
                    <StatusBadge status={record.status} />
                  </div>
                  <h4 className="fw-bold text-dark mb-1">{record.internshipTitle}</h4>
                  <span className="text-muted small">
                    <i className="bi bi-calendar2-range me-1 text-primary"></i>
                    {record.startDate} to {record.endDate || 'Ongoing'}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={() => handleViewReports(record)}
                  >
                    <i className="bi bi-journal-text me-1"></i> View Reports ({record.progressReportsCount || 0})
                  </button>

                  {record.status === 'IN_PROGRESS' && (
                    <button
                      className="btn btn-ims-success btn-sm px-3 fw-semibold"
                      onClick={() => handleOpenReportModal(record)}
                    >
                      <i className="bi bi-plus-circle me-1"></i> Submit Weekly Report
                    </button>
                  )}
                </div>
              </div>

              {/* MENTOR DETAILS */}
              <div className="row g-3 small">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Assigned Industry Mentor</span>
                    <strong className="text-dark">{record.mentorName || 'Assigned Mentor'}</strong>
                    <div className="text-muted small">{record.mentorEmail || 'mentor@company.com'}</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Reports Submitted</span>
                    <strong className="text-dark fs-6">{record.progressReportsCount || 0} Weekly Log(s)</strong>
                    <div className="text-success small fw-medium">All logged on time</div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Evaluation Status</span>
                    <strong className="text-dark fs-6">
                      {record.evaluated ? (
                        <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> Evaluated & Graded</span>
                      ) : (
                        <span className="text-warning"><i className="bi bi-hourglass-split me-1"></i> In Progress</span>
                      )}
                    </strong>
                    <div className="text-muted small">{record.finalRemarks || 'Regular milestone tracking'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMIT PROGRESS REPORT MODAL */}
      {activeRecordForReport && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Submit Weekly Progress Report</h5>
                  <p className="text-muted small mb-0">{activeRecordForReport.internshipTitle} • {activeRecordForReport.companyName}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveRecordForReport(null)} disabled={submittingReport}></button>
              </div>

              <form onSubmit={handleReportSubmit}>
                <div className="modal-body py-3">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Week Number *</label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        className="form-control"
                        value={reportForm.weekNumber}
                        onChange={(e) => setReportForm({ ...reportForm, weekNumber: parseInt(e.target.value, 10) })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Report Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Backend API Development & Unit Testing"
                        value={reportForm.reportTitle}
                        onChange={(e) => setReportForm({ ...reportForm, reportTitle: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-semibold">Hours Worked</label>
                      <input
                        type="number"
                        className="form-control"
                        value={reportForm.hoursWorked}
                        onChange={(e) => setReportForm({ ...reportForm, hoursWorked: parseInt(e.target.value, 10) })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Tasks Completed During This Week *</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Detail specific features developed, bug fixes, architecture diagrams, or modules completed..."
                        value={reportForm.tasksCompleted}
                        onChange={(e) => setReportForm({ ...reportForm, tasksCompleted: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Technical Challenges Faced & Solutions</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="Encountered issues (e.g. CORS, token validation, database deadlocks) and how you resolved them..."
                        value={reportForm.challengesFaced}
                        onChange={(e) => setReportForm({ ...reportForm, challengesFaced: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Goals & Plans for Next Week</label>
                      <textarea
                        rows="2"
                        className="form-control"
                        placeholder="What features or modules are planned for next week's sprint..."
                        value={reportForm.plansForNextWeek}
                        onChange={(e) => setReportForm({ ...reportForm, plansForNextWeek: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-3" onClick={() => setActiveRecordForReport(null)} disabled={submittingReport}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-ims-success rounded-3 px-4 fw-semibold" disabled={submittingReport}>
                    {submittingReport ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting Report...
                      </>
                    ) : (
                      'Submit Report for Mentor Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW REPORTS MODAL */}
      {selectedRecordForView && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Weekly Progress Reports & Mentor Feedback</h5>
                  <p className="text-muted small mb-0">{selectedRecordForView.internshipTitle} • {selectedRecordForView.companyName}</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedRecordForView(null)}></button>
              </div>

              <div className="modal-body p-4">
                {loadingReports ? (
                  <LoadingSpinner message="Loading weekly logs..." />
                ) : recordReports.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    No progress reports submitted for this placement yet.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {recordReports.map((rep) => (
                      <div key={rep.id} className="p-3 bg-light rounded-3 border">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="badge bg-primary px-3 py-1 fw-bold">Week {rep.weekNumber}</span>
                          <span className="text-muted small">Submitted: {new Date(rep.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <h6 className="fw-bold text-dark mb-2">{rep.reportTitle}</h6>

                        <div className="small text-secondary mb-2">
                          <strong className="text-dark d-block">Tasks Completed:</strong>
                          <p className="mb-2" style={{ whiteSpace: 'pre-line' }}>{rep.tasksCompleted}</p>
                        </div>

                        {rep.challengesFaced && (
                          <div className="small text-secondary mb-2">
                            <strong className="text-dark d-block">Challenges & Solutions:</strong>
                            <p className="mb-2">{rep.challengesFaced}</p>
                          </div>
                        )}

                        {rep.plansForNextWeek && (
                          <div className="small text-secondary mb-2">
                            <strong className="text-dark d-block">Next Week Plan:</strong>
                            <p className="mb-2">{rep.plansForNextWeek}</p>
                          </div>
                        )}

                        {rep.feedback ? (
                          <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 mt-3">
                            <strong className="text-success small d-block mb-1">
                              <i className="bi bi-chat-quote-fill me-1"></i> Mentor Review Feedback:
                            </strong>
                            <p className="text-dark small mb-0">{rep.feedback}</p>
                          </div>
                        ) : (
                          <div className="badge bg-warning-subtle text-warning border mt-2 small">
                            <i className="bi bi-hourglass-split me-1"></i> Awaiting Mentor Feedback
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary btn-sm rounded-pill px-4" onClick={() => setSelectedRecordForView(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentRecordsPage;
