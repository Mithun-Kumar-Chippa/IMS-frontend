import React from 'react';

const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(0, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation" className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-sm shadow-sm">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <i className="bi bi-chevron-left"></i> Previous
          </button>
        </li>

        {startPage > 0 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(0)}>1</button>
            </li>
            {startPage > 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          </>
        )}

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>
              {p + 1}
            </button>
          </li>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(totalPages - 1)}>{totalPages}</button>
            </li>
          </>
        )}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
