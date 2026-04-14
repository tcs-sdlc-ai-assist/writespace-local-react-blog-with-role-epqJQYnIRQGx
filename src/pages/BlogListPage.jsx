import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { getPosts } from '../utils/storage.js';
import { getAvatar } from '../components/Avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';

const borderColors = [
  'border-indigo-500',
  'border-purple-500',
  'border-pink-500',
  'border-blue-500',
  'border-teal-500',
  'border-orange-500',
  'border-emerald-500',
  'border-rose-500',
];

function truncateContent(content, maxLength = 100) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function BlogListPage() {
  const { session } = useSession();
  const navigate = useNavigate();

  const posts = getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
  );

  function canEdit(post) {
    if (!session) return false;
    if (session.role === 'admin') return true;
    const postAuthorId = post.authorId || post.userId;
    return postAuthorId === session.userId || post.author === session.username;
  }

  function handleEdit(e, postId) {
    e.stopPropagation();
    navigate(`/editor/${postId}`);
  }

  function handleCardClick(postId) {
    navigate(`/editor/${postId}`);
  }

  if (sortedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No posts yet</h2>
            <p className="text-gray-500 mb-6">
              It looks like there are no blog posts. Be the first to share something!
            </p>
            <Link
              to="/write"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Write your first post
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <Link
            to="/write"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            + New Post
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post, index) => {
            const borderColor = borderColors[index % borderColors.length];
            const authorName =
              post.authorDisplayName || post.authorName || post.author || 'Unknown';
            const postRole = post.role || 'user';

            return (
              <div
                key={post.id}
                onClick={() => handleCardClick(post.id)}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 ${borderColor} cursor-pointer relative group`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {post.title || 'Untitled'}
                    </h3>
                    {canEdit(post) && (
                      <button
                        onClick={(e) => handleEdit(e, post.id)}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label={`Edit post: ${post.title || 'Untitled'}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mt-2 mb-4 leading-relaxed">
                    {truncateContent(post.content)}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {getAvatar(postRole, 'sm')}
                      <span className="text-sm text-gray-700 font-medium">{authorName}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(post.date || post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}