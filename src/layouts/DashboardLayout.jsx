import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import ChatWidget from '../components/common/ChatWidget';

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar />
      <div className="dashboard-layout flex-grow-1">
        <Sidebar />
        <main className="dashboard-content">
          {(title || actions) && (
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 mb-4 border-bottom gap-3">
              <div>
                {title && <h2 className="fw-bold mb-1 text-dark fs-3">{title}</h2>}
                {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
              </div>
              {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default DashboardLayout;
