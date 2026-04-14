import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BlogListPage from './BlogListPage.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let mockSession = null;

vi.mock('../context/SessionContext.jsx', () => ({
  useSession: () => ({
    session: mockSession,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  SessionProvider: ({ children }) => children,
}));

let mockPosts = [];

vi.mock('../utils/storage.js', () => ({
  getPosts: () => mockPosts,
  getUsers: () => [],
  getSession: () => mockSession,
  saveSession: vi.fn(),
  clearSession: vi.fn(),
  savePost: vi.fn(),
  deletePost: vi.fn(),
  saveUser: vi.fn(),
  deleteUser: vi.fn(),
}));

function renderBlogListPage() {
  return render(
    <MemoryRouter initialEntries={['/blogs']}>
      <BlogListPage />
    </MemoryRouter>
  );
}

describe('BlogListPage', () => {
  beforeEach(() => {
    mockSession = {
      userId: 'user-1',
      username: 'alice',
      role: 'user',
      displayName: 'Alice',
    };
    mockPosts = [];
    mockNavigate.mockReset();
  });

  describe('empty state', () => {
    it('renders empty state when there are no posts', () => {
      mockPosts = [];
      renderBlogListPage();

      expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
      expect(screen.getByText(/be the first to share something/i)).toBeInTheDocument();
    });

    it('renders a link to write the first post in empty state', () => {
      mockPosts = [];
      renderBlogListPage();

      const writeLink = screen.getByRole('link', { name: /write your first post/i });
      expect(writeLink).toBeInTheDocument();
      expect(writeLink).toHaveAttribute('href', '/write');
    });
  });

  describe('rendering blog cards', () => {
    it('renders all blog post cards', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: 'First Post',
          content: 'Content of the first post',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
        {
          id: 'post-2',
          title: 'Second Post',
          content: 'Content of the second post',
          author: 'bob',
          authorId: 'user-2',
          authorDisplayName: 'Bob',
          role: 'user',
          date: '2024-06-02T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders the page heading', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: 'A Post',
          content: 'Some content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByRole('heading', { name: /all posts/i })).toBeInTheDocument();
    });

    it('renders a new post link', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: 'A Post',
          content: 'Some content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const newPostLink = screen.getByRole('link', { name: /\+ new post/i });
      expect(newPostLink).toBeInTheDocument();
      expect(newPostLink).toHaveAttribute('href', '/write');
    });

    it('renders author display name on cards', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: 'Test Post',
          content: 'Content here',
          author: 'bob',
          authorId: 'user-2',
          authorDisplayName: 'Bob Smith',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    it('renders truncated content for long posts', () => {
      const longContent = 'A'.repeat(200);
      mockPosts = [
        {
          id: 'post-1',
          title: 'Long Post',
          content: longContent,
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const displayedContent = screen.getByText(/A+…/);
      expect(displayedContent).toBeInTheDocument();
    });

    it('renders "Untitled" for posts without a title', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: '',
          content: 'Some content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByText('Untitled')).toBeInTheDocument();
    });

    it('renders formatted dates on cards', () => {
      mockPosts = [
        {
          id: 'post-1',
          title: 'Dated Post',
          content: 'Content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-15T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });
  });

  describe('sorting newest first', () => {
    it('displays posts sorted by date newest first', () => {
      mockPosts = [
        {
          id: 'post-old',
          title: 'Old Post',
          content: 'Old content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'post-new',
          title: 'New Post',
          content: 'New content',
          author: 'bob',
          authorId: 'user-2',
          authorDisplayName: 'Bob',
          role: 'user',
          date: '2024-12-01T00:00:00.000Z',
        },
        {
          id: 'post-mid',
          title: 'Mid Post',
          content: 'Mid content',
          author: 'charlie',
          authorId: 'user-3',
          authorDisplayName: 'Charlie',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const headings = screen.getAllByRole('heading', { level: 3 });
      const titles = headings.map((h) => h.textContent);

      expect(titles.indexOf('New Post')).toBeLessThan(titles.indexOf('Mid Post'));
      expect(titles.indexOf('Mid Post')).toBeLessThan(titles.indexOf('Old Post'));
    });
  });

  describe('edit icon visibility based on ownership', () => {
    it('shows edit button for posts owned by the current user', () => {
      mockSession = {
        userId: 'user-1',
        username: 'alice',
        role: 'user',
        displayName: 'Alice',
      };
      mockPosts = [
        {
          id: 'post-1',
          title: 'My Post',
          content: 'My content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const editButton = screen.getByRole('button', { name: /edit post: my post/i });
      expect(editButton).toBeInTheDocument();
    });

    it('does not show edit button for posts not owned by the current user', () => {
      mockSession = {
        userId: 'user-1',
        username: 'alice',
        role: 'user',
        displayName: 'Alice',
      };
      mockPosts = [
        {
          id: 'post-2',
          title: 'Not My Post',
          content: 'Other content',
          author: 'bob',
          authorId: 'user-2',
          authorDisplayName: 'Bob',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const editButton = screen.queryByRole('button', { name: /edit post: not my post/i });
      expect(editButton).not.toBeInTheDocument();
    });

    it('shows edit button for all posts when user is admin', () => {
      mockSession = {
        userId: 'admin',
        username: 'admin',
        role: 'admin',
        displayName: 'Admin',
      };
      mockPosts = [
        {
          id: 'post-1',
          title: 'User Post',
          content: 'Content by user',
          author: 'bob',
          authorId: 'user-2',
          authorDisplayName: 'Bob',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
        {
          id: 'post-2',
          title: 'Another Post',
          content: 'Content by charlie',
          author: 'charlie',
          authorId: 'user-3',
          authorDisplayName: 'Charlie',
          role: 'user',
          date: '2024-06-02T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByRole('button', { name: /edit post: user post/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit post: another post/i })).toBeInTheDocument();
    });

    it('shows edit button when post author matches session username', () => {
      mockSession = {
        userId: 'user-99',
        username: 'charlie',
        role: 'user',
        displayName: 'Charlie',
      };
      mockPosts = [
        {
          id: 'post-1',
          title: 'Charlie Post',
          content: 'Content',
          author: 'charlie',
          authorId: 'user-3',
          authorDisplayName: 'Charlie',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      expect(screen.getByRole('button', { name: /edit post: charlie post/i })).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to editor when edit button is clicked', async () => {
      const user = userEvent.setup();
      mockSession = {
        userId: 'user-1',
        username: 'alice',
        role: 'user',
        displayName: 'Alice',
      };
      mockPosts = [
        {
          id: 'post-1',
          title: 'Editable Post',
          content: 'Content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const editButton = screen.getByRole('button', { name: /edit post: editable post/i });
      await user.click(editButton);

      expect(mockNavigate).toHaveBeenCalledWith('/editor/post-1');
    });

    it('navigates to editor when a card is clicked', async () => {
      const user = userEvent.setup();
      mockPosts = [
        {
          id: 'post-1',
          title: 'Clickable Post',
          content: 'Content',
          author: 'alice',
          authorId: 'user-1',
          authorDisplayName: 'Alice',
          role: 'user',
          date: '2024-06-01T00:00:00.000Z',
        },
      ];
      renderBlogListPage();

      const postTitle = screen.getByText('Clickable Post');
      await user.click(postTitle);

      expect(mockNavigate).toHaveBeenCalledWith('/editor/post-1');
    });
  });
});