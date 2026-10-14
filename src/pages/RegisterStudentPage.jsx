import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

const RegisterStudentPage = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    degree: 'B.Tech',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    gpa: '',
    skills: '',
    careerInterests: ''
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
      await registerStudent({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        collegeName: formData.collegeName,
        degree: formData.degree,
        department: formData.department,
        graduationYear: parseInt(formData.graduationYear, 10),
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        skills: formData.skills,
        careerInterests: formData.careerInterests
      });

      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
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
                <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-mortarboard-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Student Registration</h3>
                <p className="text-muted small">Create your student account to apply for internships and track weekly progress</p>
              </div>

              <ErrorMessage message={error} onDismiss={() => setError(null)} />

              <form onSubmit={handleSubmit}>
                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">1. Personal & Account Information</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="student@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+91 9876543210"
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

                <h6 className="fw-bold text-primary mb-3 pb-2 border-bottom">2. Academic Credentials</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">College / University Name</label>
                    <input
                      type="text"
                      name="collegeName"
                      className="form-control"
                      placeholder="e.g. National Institute of Technology"
                      value={formData.collegeName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Degree Program</label>
                    <input
                      type="text"
                      name="degree"
                      className="form-control"
                      placeholder="e.g. B.Tech / B.E. / M.Sc"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Department / Major</label>
                    <input
                      type="text"
                      name="department"
                      className="form-control"
                      placeholder="e.g. Computer Science"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Graduation Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      className="form-control"
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">GPA / Percentage</label>
                    <input
                      type="number"
                      step="0.01"
                      name="gpa"
                      className="form-control"
                      placeholder="e.g. 3.85 or 8.5"
                      value={formData.gpa}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Technical Skills</label>
                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      placeholder="e.g. Java, Spring Boot, React, MySQL, Python, Docker"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Career Interests</label>
                    <input
                      type="text"
                      name="careerInterests"
                      className="form-control"
                      placeholder="e.g. Full Stack Development, Cloud Engineering, Artificial Intelligence"
                      value={formData.careerInterests}
                      onChange={handleChange}
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
                      Creating Student Account...
                    </>
                  ) : (
                    'Register as Student'
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top small text-muted">
                Already registered?{' '}
                <Link to="/login" className="fw-semibold text-primary">Sign in here</Link>
                {' '}• Representing a Company?{' '}
                <Link to="/register/company" className="fw-semibold text-primary">Register Company</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterStudentPage;
