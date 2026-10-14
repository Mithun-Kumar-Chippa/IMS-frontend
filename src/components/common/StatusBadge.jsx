import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toString().toLowerCase();

  const getIcon = () => {
    switch (normalized) {
      case 'applied': return 'bi-send-fill';
      case 'under_review': return 'bi-hourglass-split';
      case 'shortlisted': return 'bi-star-fill';
      case 'accepted':
      case 'approved':
      case 'completed': return 'bi-check-circle-fill';
      case 'rejected': return 'bi-x-circle-fill';
      case 'withdrawn': return 'bi-arrow-counterclockwise';
      case 'pending_approval': return 'bi-clock-history';
      case 'closed': return 'bi-lock-fill';
      default: return 'bi-info-circle-fill';
    }
  };

  const getLabel = () => {
    return status.replace(/_/g, ' ');
  };

  return (
    <span className={`badge-status badge-status-${normalized}`}>
      <i className={`bi ${getIcon()}`}></i>
      <span>{getLabel()}</span>
    </span>
  );
};

export default StatusBadge;
