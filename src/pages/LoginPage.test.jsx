import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import { SessionProvider } from '../context/SessionContext.jsx';
import * as storage from '../utils/storage.js';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage(initialEntries = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SessionProvider>
        <LoginPage />
      </SessionProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  describe('rendering', () => {
    it('renders the login form with all fields', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders a link to the registration page', () => {
      renderLoginPage();

      const registerLink = screen.getByRole('link', { name: /create one/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('renders the subtitle text', () => {
      renderLoginPage();

      expect(screen.getByText(/sign in to your writespace account/i)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'testuser');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  describe('successful admin login', () => {
    it('logs in as admin with admin/admin credentials and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'admin');
      await user.type(screen.getByLabelText(/password/i), 'admin');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
      });

      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session.username).toBe('admin');
      expect(session.role).toBe('admin');
    });
  });

  describe('successful user login', () => {
    it('logs in as a registered user and navigates to /blogs', async () => {
      const testUser = {
        id: 'user-123',
        username: 'johndoe',
        displayName: 'John Doe',
        password: 'mypassword',
        role: 'user',
        createdDate: '2024-01-01T00:00:00.000Z',
      };
      storage.saveUser(testUser);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'johndoe');
      await user.type(screen.getByLabelText(/password/i), 'mypassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
      });

      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session.username).toBe('johndoe');
      expect(session.role).toBe('user');
      expect(session.displayName).toBe('John Doe');
    });
  });

  describe('failed login', () => {
    it('shows error for invalid credentials', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'nonexistent');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalledWith('/blogs', expect.anything());
    });

    it('shows error for correct username but wrong password', async () => {
      const testUser = {
        id: 'user-456',
        username: 'janedoe',
        displayName: 'Jane Doe',
        password: 'correctpass',
        role: 'user',
        createdDate: '2024-01-01T00:00:00.000Z',
      };
      storage.saveUser(testUser);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'janedoe');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  describe('redirect for authenticated users', () => {
    it('redirects admin users to /admin when already logged in', async () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
        loginAt: new Date().toISOString(),
      };
      storage.saveSession(adminSession);

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
      });
    });

    it('redirects regular users to /blogs when already logged in', async () => {
      const userSession = {
        userId: 'user-789',
        username: 'existinguser',
        role: 'user',
        displayName: 'Existing User',
        loginAt: new Date().toISOString(),
      };
      storage.saveSession(userSession);

      renderLoginPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
      });
    });
  });
});