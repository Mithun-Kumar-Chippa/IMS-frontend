import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatWidget from '../components/common/ChatWidget';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-page">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default MainLayout;
