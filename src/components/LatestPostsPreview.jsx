import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { useSession } from '../context/SessionContext.jsx';
import { getAvatar } from './Avatar.jsx';

export function LatestPostsPreview() {
  const { session } = useSession();
  const navigate = useNavigate();

  const posts = getPosts();

  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
    .slice(0, 3);

  function truncateContent(content, maxLength = 120) {
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

  function handleCardClick(post) {
    if (session) {
      navigate(`/editor/${post.id}`);
    } else {
      navigate('/login');
    }
  }

  if (sortedPosts.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest Posts</h2>
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500 text-lg">No posts yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Latest Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleCardClick(post)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title || 'Untitled'}
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {truncateContent(post.content)}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {getAvatar(post.role || 'user', 'sm')}
                <span className="text-sm text-gray-700 font-medium">
                  {post.authorDisplayName || post.authorName || post.author || 'Unknown'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(post.date || post.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}