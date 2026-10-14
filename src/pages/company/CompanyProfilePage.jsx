import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CompanyProfilePage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    verified: false,
    verificationNotes: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/companies/me');
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setFormData({
          companyName: d.companyName || '',
          fullName: d.fullName || '',
          email: d.email || '',
          phone: d.phone || '',
          industry: d.industry || '',
          location: d.location || '',
          website: d.website || '',
          description: d.description || '',
          verified: d.verified || false,
          verificationNotes: d.verificationNotes || ''
        });
      }
    } catch (err) {
      setError('Failed to load company profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.put('/companies/me', formData);
      if (res.data.success) {
        setSuccess('Company profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Company Profile" subtitle="Manage your corporate information">
        <LoadingSpinner message="Loading profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Company Profile & Verification"
      subtitle="Complete your profile to build credibility with student candidates."
    >
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="ims-card p-4 shadow-sm mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Organization Information</h5>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            {success && (
              <div className="alert alert-success alert-dismissible fade show small rounded-3 mb-3 d-flex align-items-center" role="alert">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div className="flex-grow-1 fw-semibold">{success}</div>
                <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-control"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Industry Sector</label>
                  <input
                    type="text"
                    name="industry"
                    className="form-control"
                    placeholder="e.g. Cloud Infrastructure, AI, IT"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Official Website</label>
                  <input
                    type="url"
                    name="website"
                    className="form-control"
                    placeholder="https://company.example.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Office Location / Headquarters</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Bengaluru, India"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Primary Contact / Recruiter Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Work Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Company Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    placeholder="Describe your organization, mission, and internship culture..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn-ims-primary px-4 fw-semibold" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Profile...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="col-lg-4">
          <div className="ims-card p-4 shadow-sm mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Verification Status</h5>

            {formData.verified ? (
              <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 text-center mb-3">
                <i className="bi bi-patch-check-fill text-success display-4 mb-2 d-block"></i>
                <h6 className="fw-bold text-success mb-1">Verified Corporate Partner</h6>
                <p className="text-muted small mb-0">Your organization has been vetted by the college placement office.</p>
              </div>
            ) : (
              <div className="p-3 bg-warning-subtle border border-warning-subtle rounded-3 text-center mb-3">
                <i className="bi bi-clock-history text-warning display-4 mb-2 d-block"></i>
                <h6 className="fw-bold text-warning mb-1">Verification Pending</h6>
                <p className="text-muted small mb-0">
                  {formData.verificationNotes || 'Awaiting administrator verification. Our team verifies registered organizations within 24 hours.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfilePage;
