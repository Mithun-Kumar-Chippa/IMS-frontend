import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const spinnerClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'p-3' : '';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 my-3 text-center">
      <div className={`spinner-border text-primary ${spinnerClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted fw-medium small mb-0">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
