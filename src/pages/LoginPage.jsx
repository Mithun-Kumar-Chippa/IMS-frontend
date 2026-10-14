import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loggedUser = await login(email, password);
      const redirectPath = location.state?.from?.pathname || (
        loggedUser.role === 'ADMIN' ? '/admin/dashboard' :
        loggedUser.role === 'COMPANY' ? '/company/dashboard' :
        '/student/dashboard'
      );
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="ims-card p-4 p-md-5 shadow-lg border-0">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-lock-fill fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Account Login</h3>
                <p className="text-muted small">Sign in to access your role-specific portal</p>
              </div>

              <ErrorMessage message={error} onDismiss={() => setError(null)} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="e.g. student@ims.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-dark">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-ims-primary w-100 py-2 fw-semibold mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              {/* DEMO CREDENTIAL QUICK FILL */}
              <div className="mt-3 pt-3 border-top">
                <span className="small text-muted d-block mb-2 text-center fw-semibold">
                  ⚡ Demo Credentials (Evaluation Shortcut):
                </span>
                <div className="d-flex flex-wrap justify-content-center gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success rounded-pill px-2 py-0 small"
                    onClick={() => handleQuickFill('student@ims.edu', 'Student@123')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill px-2 py-0 small"
                    onClick={() => handleQuickFill('techcorp@example.com', 'Company@123')}
                  >
                    Company
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-0 small"
                    onClick={() => handleQuickFill('admin@ims.edu', 'Admin@12345')}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 pt-2 border-top small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register/student" className="fw-semibold text-primary">Register as Student</Link>
                {' '}or{' '}
                <Link to="/register/company" className="fw-semibold text-primary">Register Company</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
