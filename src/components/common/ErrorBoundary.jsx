import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="ims-card p-5 mx-auto" style={{ maxWidth: '600px' }}>
            <i className="bi bi-exclamation-octagon text-danger display-3 mb-3"></i>
            <h3 className="fw-bold text-dark">Something went wrong</h3>
            <p className="text-muted mb-3">
              An unexpected error occurred while rendering this interface view.
            </p>
            {this.state.error && (
              <div className="alert alert-danger text-start small mb-4 py-2 px-3 overflow-auto" style={{ maxHeight: '180px' }}>
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}
            <button
              className="btn btn-ims-primary px-4"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
