import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Register
            </Link>
          </nav>
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}