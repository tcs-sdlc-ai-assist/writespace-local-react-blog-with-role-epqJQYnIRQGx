import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { LatestPostsPreview } from '../components/LatestPostsPreview.jsx';

export default function LandingPage() {
  const { session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -left-16 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                WriteSpace
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-indigo-100 max-w-xl mx-auto lg:mx-0">
                A modern writing platform where ideas come to life. Create, share, and manage your blog posts in a clean, distraction-free environment.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                {session ? (
                  <Link
                    to="/blogs"
                    className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-indigo-700 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 text-center"
                  >
                    Go to Blogs
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-indigo-700 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 text-center"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white border-2 border-white/60 rounded-lg hover:bg-white/10 transition-all duration-200 text-center"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right: Floating Card Animation (CSS-only) */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-72 h-80 sm:w-80 sm:h-96">
                {/* Card 1 - Back */}
                <div
                  className="absolute top-8 left-4 w-64 sm:w-72 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20"
                  style={{
                    animation: 'floatSlow 6s ease-in-out infinite',
                  }}
                >
                  <div className="h-3 w-20 bg-white/30 rounded-full mb-3" />
                  <div className="h-2 w-full bg-white/20 rounded-full mb-2" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2" />
                  <div className="h-2 w-5/6 bg-white/20 rounded-full mb-2" />
                  <div className="h-2 w-2/3 bg-white/20 rounded-full" />
                </div>

                {/* Card 2 - Front */}
                <div
                  className="absolute top-0 left-0 w-64 sm:w-72 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/30"
                  style={{
                    animation: 'floatFast 4s ease-in-out infinite',
                  }}
                >
                  <div className="h-3 w-24 bg-white/40 rounded-full mb-4" />
                  <div className="h-2 w-full bg-white/25 rounded-full mb-2" />
                  <div className="h-2 w-5/6 bg-white/25 rounded-full mb-2" />
                  <div className="h-2 w-4/5 bg-white/25 rounded-full mb-2" />
                  <div className="h-2 w-3/4 bg-white/25 rounded-full mb-4" />
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-6 h-6 rounded-full bg-white/40" />
                    <div className="h-2 w-16 bg-white/30 rounded-full" />
                  </div>
                </div>

                {/* Card 3 - Small accent */}
                <div
                  className="absolute bottom-4 right-0 w-40 bg-white/15 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/20"
                  style={{
                    animation: 'floatMedium 5s ease-in-out infinite',
                  }}
                >
                  <div className="h-2 w-12 bg-white/30 rounded-full mb-2" />
                  <div className="h-2 w-full bg-white/20 rounded-full mb-1" />
                  <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS-only keyframes for floating animation */}
        <style>{`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
          }
          @keyframes floatFast {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-18px) rotate(-1deg); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to publish and manage your blog, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Role-Based Access */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl" role="img" aria-label="lock">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Role-Based Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Secure your platform with distinct admin and user roles. Control who can create, edit, and manage content with built-in permission levels.
              </p>
            </div>

            {/* Feature 2: Easy Blogging */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl" role="img" aria-label="pencil">✏️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Blogging
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Write and publish blog posts effortlessly with our clean, distraction-free editor. Focus on your words while we handle the rest.
              </p>
            </div>

            {/* Feature 3: Admin Dashboard */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 border border-pink-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl" role="img" aria-label="chart">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Admin Dashboard
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage users, moderate content, and view site-wide statistics from a powerful admin dashboard designed for full platform control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestPostsPreview />
        </div>
      </section>

      <Footer />
    </div>
  );
}