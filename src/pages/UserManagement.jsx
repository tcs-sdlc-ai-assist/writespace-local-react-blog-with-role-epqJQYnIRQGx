import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from '../context/SessionContext.jsx';
import { getUsers, saveUser, deleteUser } from '../utils/storage.js';
import { Avatar } from '../components/Avatar.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export default function UserManagement() {
  const { session } = useSession();
  const [users, setUsers] = useState(() => getUsers());
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function refreshUsers() {
    setUsers(getUsers());
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedDisplayName || !trimmedUsername || !password) {
      setError('All fields are required.');
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError('Display name must be at least 2 characters.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setError('Username "admin" is reserved.');
      return;
    }

    const existingUsers = getUsers();
    const duplicate = existingUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (duplicate) {
      setError('Username is already taken.');
      return;
    }

    const newUser = {
      id: uuidv4(),
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      password: password,
      role: role,
      createdDate: new Date().toISOString(),
    };

    saveUser(newUser);
    refreshUsers();

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${trimmedUsername}" created successfully.`);
  }

  function handleDeleteUser(targetUsername) {
    if (targetUsername === 'admin') {
      return;
    }

    if (session && session.username === targetUsername) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${targetUsername}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    deleteUser(targetUsername);
    refreshUsers();
    setSuccess(`User "${targetUsername}" has been deleted.`);
    setError('');
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
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

  function isDeleteDisabled(targetUsername) {
    if (targetUsername === 'admin') return true;
    if (session && session.username === targetUsername) return true;
    return false;
  }

  function getDeleteTooltip(targetUsername) {
    if (targetUsername === 'admin') return 'Cannot delete the default admin account';
    if (session && session.username === targetUsername) return 'Cannot delete your own account';
    return 'Delete user';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users on the platform.</p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label
                htmlFor="create-displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <input
                id="create-displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="create-username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="create-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="create-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="create-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="create-role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="create-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              All Users ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500 text-lg">No registered users yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.username} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar
                              role={user.role === 'admin' ? 'admin' : 'user'}
                              size="md"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {user.displayName || user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{user.username}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {formatDate(user.createdDate || user.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteUser(user.username)}
                            disabled={isDeleteDisabled(user.username)}
                            title={getDeleteTooltip(user.username)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                              isDeleteDisabled(user.username)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                            }`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {users.map((user) => (
                  <div key={user.username} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          role={user.role === 'admin' ? 'admin' : 'user'}
                          size="md"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.displayName || user.username}
                          </p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Joined {formatDate(user.createdDate || user.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        disabled={isDeleteDisabled(user.username)}
                        title={getDeleteTooltip(user.username)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          isDeleteDisabled(user.username)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}