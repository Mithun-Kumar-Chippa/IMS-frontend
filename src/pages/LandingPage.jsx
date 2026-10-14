import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInternships: 0,
    activeCompanies: 0,
    registeredStudents: 0,
    studentsPlaced: 0
  });
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [statsRes, intRes, annRes] = await Promise.all([
          api.get('/internships/stats').catch(() => ({ data: { data: {} } })),
          api.get('/internships?size=3&activeOnly=true').catch(() => ({ data: { data: { content: [] } } })),
          api.get('/announcements/public').catch(() => ({ data: { data: [] } }))
        ]);

        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
        if (intRes.data?.data?.content) {
          setFeaturedInternships(intRes.data.data.content);
        }
        if (annRes.data?.data) {
          setAnnouncements(annRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/internships?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/internships');
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-gradient py-5 py-lg-6">
        <div className="container py-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white border shadow-sm mb-3">
                <span className="badge bg-success rounded-pill px-2 py-1">2026 Drive</span>
                <span className="small text-muted fw-medium">Centralized Internship & Placement Platform</span>
              </div>
              <h1 className="display-4 fw-bold text-dark mb-3 lh-sm" style={{ letterSpacing: '-0.03em' }}>
                Launch Your Career with <span className="text-primary">Verified Internships</span>
              </h1>
              <p className="lead text-secondary mb-4 fs-6">
                Connect directly with top enterprise employers, track weekly learning progress,
                receive faculty mentor evaluations, and get instant guidance with our integrated AI assistant.
              </p>

              {/* SEARCH BAR */}
              <form onSubmit={handleSearch} className="ims-card p-2 p-md-3 mb-4 shadow-lg border-0">
                <div className="row g-2 align-items-center">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-0 text-muted">
                        <i className="bi bi-search fs-5"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none ps-0"
                        placeholder="Search by role, skills (e.g. Java, React, Cloud, DevOps)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-ims-primary w-100 py-2">
                      <i className="bi bi-arrow-right me-1"></i> Find Opportunities
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Tags */}
              <div className="d-flex flex-wrap align-items-center gap-2 text-muted small">
                <span className="fw-semibold text-secondary">Trending:</span>
                <Link to="/internships?keyword=Java" className="badge bg-white text-secondary border text-decoration-none py-1 px-2">Java Spring Boot</Link>
                <Link to="/internships?keyword=React" className="badge bg-white text-secondary border text-decoration-none py-1 px-2">React & Frontend</Link>
                <Link to="/internships?keyword=Cloud" className="badge bg-white text-secondary border text-decoration-none py-1 px-2">DevOps & Cloud</Link>
                <Link to="/internships?keyword=Remote" className="badge bg-white text-secondary border text-decoration-none py-1 px-2">Remote Roles</Link>
              </div>
            </div>

            {/* HERO STATS OVERVIEW */}
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="ims-card p-4 text-center stat-card-gradient h-100">
                    <div className="rounded-circle bg-primary-subtle text-primary p-3 d-inline-flex mb-3">
                      <i className="bi bi-briefcase-fill fs-3"></i>
                    </div>
                    <h2 className="fw-bold text-dark mb-0">{stats.totalInternships || '15+'}</h2>
                    <p className="text-muted small mb-0 fw-medium">Live Postings</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ims-card p-4 text-center stat-card-gradient h-100">
                    <div className="rounded-circle bg-success-subtle text-success p-3 d-inline-flex mb-3">
                      <i className="bi bi-building-check fs-3"></i>
                    </div>
                    <h2 className="fw-bold text-dark mb-0">{stats.activeCompanies || '8+'}</h2>
                    <p className="text-muted small mb-0 fw-medium">Verified Companies</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ims-card p-4 text-center stat-card-gradient h-100">
                    <div className="rounded-circle bg-info-subtle text-info p-3 d-inline-flex mb-3">
                      <i className="bi bi-people-fill fs-3"></i>
                    </div>
                    <h2 className="fw-bold text-dark mb-0">{stats.registeredStudents || '45+'}</h2>
                    <p className="text-muted small mb-0 fw-medium">Registered Students</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="ims-card p-4 text-center stat-card-gradient h-100">
                    <div className="rounded-circle bg-purple-subtle text-purple p-3 d-inline-flex mb-3">
                      <i className="bi bi-award-fill fs-3"></i>
                    </div>
                    <h2 className="fw-bold text-dark mb-0">{stats.studentsPlaced || '12+'}</h2>
                    <p className="text-muted small mb-0 fw-medium">Placed Interns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS TICKER */}
      {announcements.length > 0 && (
        <section className="bg-light border-bottom py-3">
          <div className="container">
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-primary px-3 py-2 text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-megaphone-fill me-1"></i> Notices
              </span>
              <div className="overflow-hidden flex-grow-1 text-truncate">
                <span className="fw-bold text-dark me-2">{announcements[0].title}:</span>
                <span className="text-secondary small">{announcements[0].content}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED INTERNSHIPS */}
      <section className="py-5">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-2">
            <div>
              <h2 className="fw-bold text-dark mb-1">Featured Opportunities</h2>
              <p className="text-muted small mb-0">Browse recently verified openings looking for students</p>
            </div>
            <Link to="/internships" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-semibold">
              View All Openings <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading live opportunities..." />
          ) : (
            <div className="row g-4">
              {featuredInternships.map((internship) => (
                <div key={internship.id} className="col-md-4">
                  <div className="ims-card ims-card-interactive h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <span className="badge bg-light text-primary border px-2 py-1 small">
                          <i className="bi bi-building me-1"></i> {internship.companyName}
                        </span>
                        <StatusBadge status={internship.status} />
                      </div>
                      <h5 className="fw-bold text-dark mb-2">{internship.title}</h5>
                      <p className="text-muted small mb-3 text-truncate-2" style={{ maxHeight: '42px', overflow: 'hidden' }}>
                        {internship.description}
                      </p>
                    </div>

                    <div className="pt-3 border-top mt-3">
                      <div className="d-flex align-items-center justify-content-between small text-secondary mb-3">
                        <span><i className="bi bi-geo-alt me-1 text-primary"></i> {internship.location}</span>
                        <span className="fw-bold text-success">
                          ₹{internship.stipend ? Number(internship.stipend).toLocaleString() : 'Unpaid'}/mo
                        </span>
                      </div>
                      <Link to={`/internships/${internship.id}`} className="btn btn-ims-primary w-100 btn-sm">
                        View Details & Apply
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WORKFLOW LIFECYCLE */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-3">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-light text-primary border px-3 py-1 mb-2">Lifecycle Management</span>
            <h2 className="fw-bold text-dark mb-2">How The Internship Portal Works</h2>
            <p className="text-muted">A structured end-to-end workflow connecting students, corporate recruiters, and college administrators.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="ims-card p-4 h-100">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
                  <span className="fs-5 fw-bold">1</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Profile & Resume</h5>
                <p className="text-muted small mb-0">Students upload academic credentials and PDF resumes. Companies complete verification profiles.</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="ims-card p-4 h-100">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
                  <span className="fs-5 fw-bold">2</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Browse & Apply</h5>
                <p className="text-muted small mb-0">Discover opportunities filtered by stipend, work mode, and skills. Submit cover letters with one click.</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="ims-card p-4 h-100">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
                  <span className="fs-5 fw-bold">3</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Recruiter Selection</h5>
                <p className="text-muted small mb-0">Companies review resumes, shortlist, and accept candidates while assigning designated industry mentors.</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="ims-card p-4 h-100">
                <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
                  <span className="fs-5 fw-bold">4</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">Reports & Grading</h5>
                <p className="text-muted small mb-0">Interns submit weekly progress reports. Mentors evaluate technical and soft skills for final course credit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE HIGHLIGHTS */}
      <section className="py-5">
        <div className="container py-3">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="ims-card p-4 h-100 border-start border-4 border-primary">
                <h4 className="fw-bold text-dark mb-3"><i className="bi bi-mortarboard text-primary me-2"></i> For Students</h4>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-4">
                  <li><i className="bi bi-check2 text-success me-2"></i> Search verified openings by skill & stipend</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Automated status tracking & withdrawal</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Submit weekly learning progress reports</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Instant guidance with AI Chatbot</li>
                </ul>
                <Link to="/register/student" className="btn btn-ims-primary btn-sm w-100">Register as Student</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="ims-card p-4 h-100 border-start border-4 border-info">
                <h4 className="fw-bold text-dark mb-3"><i className="bi bi-building text-info me-2"></i> For Companies</h4>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-4">
                  <li><i className="bi bi-check2 text-success me-2"></i> Publish and manage internship postings</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Review applicant student profiles & resumes</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Assign mentors and track intern cohorts</li>
                  <li><i className="bi bi-check2 text-success me-2"></i> Submit formal evaluations and feedback</li>
                </ul>
                <Link to="/register/company" className="btn btn-outline-primary btn-sm w-100">Register as Company</Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="ims-card p-4 h-100 border-start border-4 border-purple">
                <h4 className="fw-bold text-dark mb-3"><i className="bi bi-shield-check text-purple me-2"></i> For Administrators</h4>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-4">
                  <li><i className="bi bi-check2 text-purple me-2"></i> Verify recruiters & approve new postings</li>
                  <li><i className="bi bi-check2 text-purple me-2"></i> Comprehensive placement reporting</li>
                  <li><i className="bi bi-check2 text-purple me-2"></i> Publish college-wide announcements</li>
                  <li><i className="bi bi-check2 text-purple me-2"></i> Review complete system audit logs</li>
                </ul>
                <Link to="/login" className="btn btn-ims-purple btn-sm w-100">Admin Portal Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
