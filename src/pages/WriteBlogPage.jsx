import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from '../context/SessionContext.jsx';
import { getPosts, savePost } from '../utils/storage.js';
import { Navbar } from '../components/Navbar.jsx';

export default function WriteBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      setError('Post not found.');
      setLoading(false);
      return;
    }

    const isOwner =
      session.role === 'admin' ||
      post.author === session.username ||
      post.authorId === session.userId;

    if (!isOwner) {
      setError('You do not have permission to edit this post.');
      setLoading(false);
      return;
    }

    setTitle(post.title || '');
    setContent(post.content || '');
    setLoading(false);
  }, [id, isEditMode, session]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Title must be 200 characters or fewer.');
      return;
    }

    if (!trimmedContent) {
      setError('Content is required.');
      return;
    }

    const now = new Date().toISOString();

    if (isEditMode) {
      const posts = getPosts();
      const existingPost = posts.find((p) => p.id === id);

      if (!existingPost) {
        setError('Post not found.');
        return;
      }

      const isOwner =
        session.role === 'admin' ||
        existingPost.author === session.username ||
        existingPost.authorId === session.userId;

      if (!isOwner) {
        setError('You do not have permission to edit this post.');
        return;
      }

      const updatedPost = {
        ...existingPost,
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: now,
      };

      savePost(updatedPost);
      navigate(`/blog/${id}`, { replace: true });
    } else {
      const postId = uuidv4();

      const newPost = {
        id: postId,
        title: trimmedTitle,
        content: trimmedContent,
        author: session.username,
        authorId: session.userId,
        authorDisplayName: session.displayName || session.username,
        authorName: session.displayName || session.username,
        role: session.role || 'user',
        date: now,
        createdAt: now,
        updatedAt: now,
      };

      savePost(newPost);
      navigate(`/blog/${postId}`, { replace: true });
    }
  }

  function handleCancel() {
    if (isEditMode && id) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Post' : 'Write New Post'}
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  maxLength={200}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {title.length}/200
                </p>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here..."
                  rows={12}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {content.length} characters
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  {isEditMode ? 'Update Post' : 'Publish Post'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}