import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';

vi.mock('../context/SessionContext.jsx', () => {
  let mockSession = null;
  return {
    useSession: () => ({
      session: mockSession,
      login: vi.fn(),
      logout: vi.fn(),
    }),
    __setMockSession: (session) => {
      mockSession = session;
    },
    SessionProvider: ({ children }) => children,
  };
});

import { __setMockSession } from '../context/SessionContext.jsx';

function renderWithRouter(ui, { initialEntries = ['/protected'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/protected" element={ui} />
        <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        <Route path="/blogs" element={<div data-testid="blogs-page">Blogs Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when user is not authenticated', () => {
    __setMockSession(null);

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and no role is required', () => {
    __setMockSession({
      userId: 'user-1',
      username: 'alice',
      role: 'user',
      displayName: 'Alice',
    });

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('renders children when user has the required role', () => {
    __setMockSession({
      userId: 'admin',
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
    });

    renderWithRouter(
      <ProtectedRoute role="admin">
        <div data-testid="admin-content">Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    expect(screen.queryByTestId('blogs-page')).not.toBeInTheDocument();
  });

  it('redirects to /blogs when user does not have the required admin role', () => {
    __setMockSession({
      userId: 'user-1',
      username: 'alice',
      role: 'user',
      displayName: 'Alice',
    });

    renderWithRouter(
      <ProtectedRoute role="admin">
        <div data-testid="admin-content">Admin Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });

  it('redirects to /blogs when an admin tries to access a user-only route', () => {
    __setMockSession({
      userId: 'admin',
      username: 'admin',
      role: 'admin',
      displayName: 'Admin',
    });

    renderWithRouter(
      <ProtectedRoute role="user">
        <div data-testid="user-content">User Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
    expect(screen.queryByTestId('user-content')).not.toBeInTheDocument();
  });
});