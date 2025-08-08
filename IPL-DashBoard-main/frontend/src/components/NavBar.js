import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center text-white">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">IPL Dashboard</Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/teams" className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200">Teams</Link>
          </li>
          <li>
            <Link to="/players" className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200">Players</Link>
          </li>
          <li>
            <Link to="/head-to-head" className="text-lg font-medium text-gray-300 hover:text-white transition-colors duration-200">Head-to-Head</Link>
          </li>
          {/* Add a search bar here in a future step if desired */}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
