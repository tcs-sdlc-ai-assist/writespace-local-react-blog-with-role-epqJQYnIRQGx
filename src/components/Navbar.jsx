import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Avatar } from './Avatar.jsx';

export function Navbar() {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 tracking-tight"
            onClick={closeMobile}
          >
            WriteSpace
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/blogs"
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium"
                >
                  Blogs
                </Link>
                {session.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/users"
                      className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Users
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2 ml-2">
                  <Avatar role={session.role === 'admin' ? 'admin' : 'user'} size="sm" />
                  <span className="text-sm font-medium text-gray-800">
                    {session.displayName || session.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {session ? (
              <>
                <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                  <Avatar role={session.role === 'admin' ? 'admin' : 'user'} size="md" />
                  <span className="text-sm font-medium text-gray-800">
                    {session.displayName || session.username}
                  </span>
                </div>
                <Link
                  to="/blogs"
                  onClick={closeMobile}
                  className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Blogs
                </Link>
                {session.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      onClick={closeMobile}
                      className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/users"
                      onClick={closeMobile}
                      className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      Users
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="block text-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}