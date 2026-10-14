import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const PostInternshipPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    workMode: 'HYBRID',
    stipend: 20000,
    durationWeeks: 12,
    deadline: '',
    maxPositions: 2,
    description: '',
    responsibilities: '',
    requirements: ''
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchExistingInternship();
    }
  }, [id]);

  const fetchExistingInternship = async () => {
    try {
      const res = await api.get(`/internships/${id}`);
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setFormData({
          title: d.title || '',
          department: d.department || '',
          location: d.location || '',
          workMode: d.workMode || 'HYBRID',
          stipend: d.stipend || 0,
          durationWeeks: d.durationWeeks || 12,
          deadline: d.deadline || '',
          maxPositions: d.maxPositions || 1,
          description: d.description || '',
          responsibilities: d.responsibilities || '',
          requirements: d.requirements || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch existing posting details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      stipend: parseFloat(formData.stipend),
      durationWeeks: parseInt(formData.durationWeeks, 10),
      maxPositions: parseInt(formData.maxPositions, 10)
    };

    try {
      if (isEditing) {
        await api.put(`/internships/${id}`, payload);
      } else {
        await api.post('/internships', payload);
      }
      navigate('/company/internships');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save internship posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading Posting" subtitle="Fetching details...">
        <LoadingSpinner message="Loading opportunity details..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEditing ? 'Edit Internship Posting' : 'Publish New Internship Opportunity'}
      subtitle="Define role requirements, compensation, and application deadlines."
      actions={
        <Link to="/company/internships" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Cancel
        </Link>
      }
    >
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="ims-card p-4 p-md-5 shadow-sm">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            <form onSubmit={handleSubmit}>
              <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">1. Basic Opportunity Details</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold">Internship Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Full Stack Java Developer Intern"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Department / Team</label>
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    placeholder="e.g. Software Engineering"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Work Mode *</label>
                  <select
                    name="workMode"
                    className="form-select"
                    value={formData.workMode}
                    onChange={handleChange}
                    required
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-site</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Location / Office *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Bengaluru / Remote"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Monthly Stipend (₹) *</label>
                  <input
                    type="number"
                    name="stipend"
                    className="form-control"
                    value={formData.stipend}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Duration (Weeks) *</label>
                  <input
                    type="number"
                    name="durationWeeks"
                    className="form-control"
                    value={formData.durationWeeks}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Number of Openings</label>
                  <input
                    type="number"
                    min="1"
                    name="maxPositions"
                    className="form-control"
                    value={formData.maxPositions}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">2. Scope, Responsibilities & Skills</h6>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Role Description *</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    placeholder="Detailed explanation of the project, team mission, and learning opportunities..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Key Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    rows="3"
                    className="form-control"
                    placeholder="Day-to-day coding, sprint meetings, REST API development..."
                    value={formData.responsibilities}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Technical Qualifications & Requirements</label>
                  <textarea
                    name="requirements"
                    rows="3"
                    className="form-control"
                    placeholder="Required skills: Java 21, Spring Boot, React, MySQL, version control..."
                    value={formData.requirements}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <Link to="/company/internships" className="btn btn-light rounded-3 px-4">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-ims-primary rounded-3 px-5 fw-semibold" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Opportunity...
                    </>
                  ) : isEditing ? (
                    'Update Internship'
                  ) : (
                    'Publish Internship'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostInternshipPage;
