import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
