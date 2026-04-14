import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { getPosts, deletePost } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { getAvatar } from '../components/Avatar.jsx';

export default function ReadBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  function canEditDelete() {
    if (!session || !post) return false;
    if (session.role === 'admin') return true;
    if (post.authorId === session.userId) return true;
    if (post.author === session.username) return true;
    return false;
  }

  function handleDelete() {
    if (!post) return;
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (confirmed) {
      deletePost(post.id);
      navigate('/blogs', { replace: true });
    }
  }

  function handleEdit() {
    if (!post) return;
    navigate(`/editor/${post.id}`);
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Post not found</h1>
            <p className="text-gray-500 mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const authorName = post.authorDisplayName || post.authorName || post.author || 'Unknown';
  const postDate = post.date || post.createdAt || post.updatedAt;
  const role = post.role || 'user';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </Link>

        <article className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title || 'Untitled'}
          </h1>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            {getAvatar(role, 'md')}
            <div>
              <p className="text-sm font-semibold text-gray-800">{authorName}</p>
              {postDate && (
                <p className="text-xs text-gray-400">{formatDate(postDate)}</p>
              )}
            </div>
          </div>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content || ''}
          </div>

          {canEditDelete() && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleEdit}
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}