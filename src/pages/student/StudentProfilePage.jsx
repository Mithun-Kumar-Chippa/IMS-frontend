import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    degree: '',
    department: '',
    graduationYear: 2026,
    gpa: '',
    skills: '',
    careerInterests: '',
    resumeUrl: '',
    resumeFileName: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students/me');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setFormData({
          fullName: d.fullName || '',
          email: d.email || '',
          phone: d.phone || '',
          collegeName: d.collegeName || '',
          degree: d.degree || '',
          department: d.department || '',
          graduationYear: d.graduationYear || 2026,
          gpa: d.gpa || '',
          skills: d.skills || '',
          careerInterests: d.careerInterests || '',
          resumeUrl: d.resumeUrl || '',
          resumeFileName: d.resumeFileName || ''
        });
      }
    } catch (err) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put('/students/me', {
        fullName: formData.fullName,
        phone: formData.phone,
        collegeName: formData.collegeName,
        degree: formData.degree,
        department: formData.department,
        graduationYear: parseInt(formData.graduationYear, 10),
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        skills: formData.skills,
        careerInterests: formData.careerInterests
      });

      if (res.data.success) {
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents are allowed for resume uploads.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const uploadPayload = new FormData();
    uploadPayload.append('file', selectedFile);

    try {
      const res = await api.post('/students/resume', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.data) {
        setFormData((prev) => ({
          ...prev,
          resumeUrl: res.data.data.resumeUrl,
          resumeFileName: res.data.data.resumeFileName
        }));
        setSelectedFile(null);
        setSuccess('Resume PDF uploaded and attached to your student profile!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Profile" subtitle="Manage your academic credentials and resume">
        <LoadingSpinner message="Loading profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Student Profile & Resume"
      subtitle="Keep your profile up to date to showcase your skills to prospective employers."
    >
      <div className="row g-4">
        {/* Left Column: Profile Form */}
        <div className="col-lg-8">
          <div className="ims-card p-4 shadow-sm mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Academic & Contact Information</h5>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            {success && (
              <div className="alert alert-success alert-dismissible fade show small rounded-3 mb-3 d-flex align-items-center" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div className="flex-grow-1 fw-semibold">{success}</div>
                <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address (Read Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">College / University</label>
                  <input
                    type="text"
                    name="collegeName"
                    className="form-control"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Degree Program</label>
                  <input
                    type="text"
                    name="degree"
                    className="form-control"
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Department / Major</label>
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    className="form-control"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">GPA / Cumulative Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    name="gpa"
                    className="form-control"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Key Technical Skills</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    placeholder="Java, Spring Boot, React, MySQL, Docker..."
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                  <div className="form-text small">Comma-separated list of programming languages and libraries</div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Career Interests</label>
                  <input
                    type="text"
                    name="careerInterests"
                    className="form-control"
                    placeholder="e.g. Backend Engineering, Full Stack Web Development"
                    value={formData.careerInterests}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-ims-primary px-4 fw-semibold" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Resume Upload */}
        <div className="col-lg-4">
          <div className="ims-card p-4 shadow-sm mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Resume Document</h5>

            {formData.resumeUrl ? (
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>
                  <div className="overflow-hidden">
                    <span className="fw-semibold text-dark text-truncate d-block small">
                      {formData.resumeFileName || 'Resume.pdf'}
                    </span>
                    <span className="badge bg-success-subtle text-success small">Verified Active</span>
                  </div>
                </div>

                <a
                  href={`http://localhost:8080${formData.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm w-100 mt-2"
                >
                  <i className="bi bi-download me-1"></i> Preview / Download PDF
                </a>
              </div>
            ) : (
              <div className="alert alert-warning small rounded-3 mb-3">
                <i className="bi bi-exclamation-triangle-fill me-1"></i> No resume uploaded yet. Upload a PDF below to apply for internships.
              </div>
            )}

            <form onSubmit={handleResumeUpload}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Upload New PDF Resume (Max 5MB)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className="form-control form-control-sm"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-ims-success btn-sm w-100 fw-semibold"
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading PDF...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up me-1"></i> Upload Resume
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="ims-card p-4 bg-subtle border-primary-subtle shadow-sm">
            <h6 className="fw-bold text-primary mb-2">💡 Resume Advice</h6>
            <p className="text-secondary small mb-0">
              Ensure your resume highlights relevant coursework and full-stack projects.
              Companies frequently shortlist students with verified project demos.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfilePage;
