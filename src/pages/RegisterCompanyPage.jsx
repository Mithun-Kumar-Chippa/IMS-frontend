import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

const RegisterCompanyPage = () => {
  const { registerCompany } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: 'Software & Technology',
    website: '',
    location: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await registerCompany({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        companyName: formData.companyName,
        industry: formData.industry,
        website: formData.website,
        location: formData.location,
        description: formData.description
      });

      navigate('/company/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check company details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="ims-card p-4 p-md-5 shadow-lg border-0">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-info text-dark d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-building-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Company Partner Registration</h3>
                <p className="text-muted small">Register your organization to post internship listings and discover top university talent</p>
              </div>

              <div className="alert alert-info border-0 rounded-3 small mb-4 d-flex align-items-start gap-2">
                <i className="bi bi-info-circle-fill fs-5 mt-1"></i>
                <div>
                  <span className="fw-bold">Verification Note:</span> Registered corporate accounts undergo administrator verification to prevent spam postings and ensure student safety. You can access the dashboard immediately.
                </div>
              </div>

              <ErrorMessage message={error} onDismiss={() => setError(null)} />

              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">1. Organization Details</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      className="form-control"
                      placeholder="e.g. TechNova Solutions"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Industry / Sector</label>
                    <input
                      type="text"
                      name="industry"
                      className="form-control"
                      placeholder="e.g. Enterprise Software, Cloud, AI"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Headquarters / Location</label>
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
                    <label className="form-label small fw-semibold">Company Website</label>
                    <input
                      type="url"
                      name="website"
                      className="form-control"
                      placeholder="https://company.example.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Company Overview / Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      className="form-control"
                      placeholder="Brief summary of your organization and internship program..."
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">2. Authorized Recruiter / Contact Account</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Recruiter / HR Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Official Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="hr@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Contact Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+91 9876500000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6"></div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Password (min 6 chars) *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-ims-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering Organization...
                    </>
                  ) : (
                    'Complete Company Registration'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top small text-muted">
                Already registered?{' '}
                <Link to="/login" className="fw-semibold text-primary">Sign in here</Link>
                {' '}• Looking for internships as a Student?{' '}
                <Link to="/register/student" className="fw-semibold text-primary">Register as Student</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterCompanyPage;
