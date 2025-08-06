import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="bg-gray-800 p-4 shadow-md flex justify-center items-center">
            <ul className="flex space-x-6">
                <li>
                    <Link to="/" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">Home</Link> {/* NEW: Home Link */}
                </li>
                <li>
                    <Link to="/teams" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">IPL Teams</Link>
                </li>
                <li>
                    <Link to="/players" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">IPL Players</Link>
                </li>
                <li>
                    <Link to="/head-to-head" className="text-white hover:text-indigo-300 text-lg font-medium transition-colors duration-200">Head-to-Head</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
