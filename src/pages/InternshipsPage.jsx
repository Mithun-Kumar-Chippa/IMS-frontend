import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InternshipsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || '');
  const [minStipend, setMinStipend] = useState(searchParams.get('minStipend') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));

  const [internships, setInternships] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, [searchParams]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const q = searchParams.get('keyword') || '';
      const loc = searchParams.get('location') || '';
      const mode = searchParams.get('workMode') || '';
      const stip = searchParams.get('minStipend') || '';
      const curPage = searchParams.get('page') || '0';

      let url = `/internships?page=${curPage}&size=9&activeOnly=true`;
      if (q) url += `&keyword=${encodeURIComponent(q)}`;
      if (loc) url += `&location=${encodeURIComponent(loc)}`;
      if (mode) url += `&workMode=${mode}`;
      if (stip) url += `&minStipend=${stip}`;

      const res = await api.get(url);
      if (res.data.success && res.data.data) {
        setInternships(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (workMode) params.workMode = workMode;
    if (minStipend) params.minStipend = minStipend;
    params.page = '0';
    setSearchParams(params);
    setPage(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setWorkMode('');
    setMinStipend('');
    setPage(0);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const currentParams = Object.fromEntries([...searchParams]);
    currentParams.page = newPage.toString();
    setSearchParams(currentParams);
    setPage(newPage);
  };

  return (
    <>
      <div className="bg-subtle border-bottom py-4 mb-4">
        <div className="container">
          <h1 className="fw-bold text-dark fs-2 mb-1">Explore Internship Opportunities</h1>
          <p className="text-muted small mb-0">
            Browse verified enterprise openings with transparent stipends, project descriptions, and mentor guidance.
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {/* FILTER BAR */}
        <div className="ims-card p-4 mb-4 shadow-sm border-0">
          <form onSubmit={handleFilterSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">Role or Keywords</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Java, React, DevOps..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">Location</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white"><i className="bi bi-geo-alt"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">Work Mode</label>
                <select
                  className="form-select form-select-sm"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                >
                  <option value="">All Modes</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ON_SITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold text-muted">Min Stipend (₹)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="e.g. 15000"
                  value={minStipend}
                  onChange={(e) => setMinStipend(e.target.value)}
                />
              </div>

              <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-ims-primary btn-sm flex-grow-1">
                  Filter
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleResetFilters} title="Reset">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RESULTS HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-3 text-muted small">
          <span>Found <strong className="text-dark">{totalElements}</strong> matching internships</span>
          <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
        </div>

        {/* INTERNSHIP GRID */}
        {loading ? (
          <LoadingSpinner message="Searching verified internships..." />
        ) : internships.length === 0 ? (
          <div className="ims-card p-5 text-center my-4">
            <i className="bi bi-search text-muted display-4 mb-3"></i>
            <h5 className="fw-bold text-dark">No internships found</h5>
            <p className="text-muted small mb-3">Try loosening your search filters or browse other popular keywords.</p>
            <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {internships.map((internship) => (
              <div key={internship.id} className="col-md-6 col-lg-4">
                <div className="ims-card ims-card-interactive h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <span className="badge bg-light text-primary border small fw-semibold">
                        <i className="bi bi-building me-1"></i> {internship.companyName}
                      </span>
                      <span className={`badge ${internship.workMode === 'REMOTE' ? 'bg-success-subtle text-success' : internship.workMode === 'HYBRID' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'} border`}>
                        {internship.workMode}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-2 text-truncate" title={internship.title}>
                      {internship.title}
                    </h5>

                    <p className="text-muted small mb-3" style={{ minHeight: '40px', maxHeight: '40px', overflow: 'hidden' }}>
                      {internship.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-light text-secondary border small">
                        <i className="bi bi-geo-alt me-1"></i> {internship.location || 'Remote'}
                      </span>
                      <span className="badge bg-light text-secondary border small">
                        <i className="bi bi-clock me-1"></i> {internship.durationWeeks || 12} weeks
                      </span>
                      <span className="badge bg-light text-secondary border small">
                        <i className="bi bi-calendar-event me-1"></i> Ends: {internship.deadline || 'Open'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <span className="text-muted d-block small" style={{ fontSize: '0.75rem' }}>Monthly Stipend</span>
                        <span className="fw-bold text-success fs-5">
                          {internship.stipend ? `₹${Number(internship.stipend).toLocaleString()}` : 'Unpaid'}
                        </span>
                      </div>
                      <span className="text-muted small">
                        <i className="bi bi-people me-1"></i> {internship.applicationsCount || 0} applicants
                      </span>
                    </div>

                    <Link to={`/internships/${internship.id}`} className="btn btn-ims-primary w-100 btn-sm fw-semibold">
                      View Role & Apply <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default InternshipsPage;
