import React from 'react';
import NavBar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <NavBar />
      <main className="container mx-auto p-4 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
