import React from 'react';

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3 shadow-sm border-danger" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
      <div className="flex-grow-1 small fw-medium">{message}</div>
      {onDismiss && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onDismiss}></button>
      )}
    </div>
  );
};

export default ErrorMessage;
