import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsers,
  saveUser,
  deleteUser,
  getPosts,
  savePost,
  deletePost,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // --- getUsers ---

  describe('getUsers', () => {
    it('returns an empty array when no users exist', () => {
      expect(getUsers()).toEqual([]);
    });

    it('returns stored users', () => {
      const users = [
        { username: 'alice', displayName: 'Alice', password: 'pass', role: 'user', createdDate: '2024-01-01' },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));
      expect(getUsers()).toEqual(users);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{corrupted');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getUsers()).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('not-an-array'));
      expect(getUsers()).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.setItem('writespace_users', JSON.stringify(null));
      expect(getUsers()).toEqual([]);
    });
  });

  // --- saveUser ---

  describe('saveUser', () => {
    it('saves a new user', () => {
      const user = { username: 'bob', displayName: 'Bob', password: 'secret', role: 'user', createdDate: '2024-02-01' };
      saveUser(user);
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual(user);
    });

    it('updates an existing user by username', () => {
      const user = { username: 'bob', displayName: 'Bob', password: 'secret', role: 'user', createdDate: '2024-02-01' };
      saveUser(user);
      saveUser({ username: 'bob', displayName: 'Bobby', password: 'newsecret', role: 'admin', createdDate: '2024-02-01' });
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].displayName).toBe('Bobby');
      expect(users[0].password).toBe('newsecret');
      expect(users[0].role).toBe('admin');
    });

    it('appends multiple distinct users', () => {
      saveUser({ username: 'alice', displayName: 'Alice', password: 'a', role: 'user', createdDate: '2024-01-01' });
      saveUser({ username: 'bob', displayName: 'Bob', password: 'b', role: 'admin', createdDate: '2024-01-02' });
      expect(getUsers()).toHaveLength(2);
    });

    it('handles localStorage write failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const user = { username: 'fail', displayName: 'Fail', password: 'x', role: 'user', createdDate: '2024-01-01' };
      expect(() => saveUser(user)).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  // --- deleteUser ---

  describe('deleteUser', () => {
    it('deletes a user by username', () => {
      saveUser({ username: 'alice', displayName: 'Alice', password: 'a', role: 'user', createdDate: '2024-01-01' });
      saveUser({ username: 'bob', displayName: 'Bob', password: 'b', role: 'user', createdDate: '2024-01-02' });
      deleteUser('alice');
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('bob');
    });

    it('does nothing when deleting a non-existent user', () => {
      saveUser({ username: 'alice', displayName: 'Alice', password: 'a', role: 'user', createdDate: '2024-01-01' });
      deleteUser('nonexistent');
      expect(getUsers()).toHaveLength(1);
    });

    it('handles empty user list gracefully', () => {
      expect(() => deleteUser('nobody')).not.toThrow();
      expect(getUsers()).toEqual([]);
    });
  });

  // --- getPosts ---

  describe('getPosts', () => {
    it('returns an empty array when no posts exist', () => {
      expect(getPosts()).toEqual([]);
    });

    it('returns stored posts', () => {
      const posts = [
        { id: '1', title: 'Hello', content: 'World', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      expect(getPosts()).toEqual(posts);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', '!!!invalid');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getPosts()).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ not: 'array' }));
      expect(getPosts()).toEqual([]);
    });
  });

  // --- savePost ---

  describe('savePost', () => {
    it('saves a new post', () => {
      const post = { id: '1', title: 'Test', content: 'Body', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' };
      savePost(post);
      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0]).toEqual(post);
    });

    it('updates an existing post by id', () => {
      const post = { id: '1', title: 'Test', content: 'Body', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' };
      savePost(post);
      savePost({ id: '1', title: 'Updated', content: 'New Body', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-02' });
      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Updated');
      expect(posts[0].content).toBe('New Body');
      expect(posts[0].date).toBe('2024-01-02');
    });

    it('appends multiple distinct posts', () => {
      savePost({ id: '1', title: 'First', content: 'A', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' });
      savePost({ id: '2', title: 'Second', content: 'B', author: 'bob', authorDisplayName: 'Bob', date: '2024-01-02' });
      expect(getPosts()).toHaveLength(2);
    });

    it('handles localStorage write failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const post = { id: 'x', title: 'Fail', content: '', author: 'a', authorDisplayName: 'A', date: '2024-01-01' };
      expect(() => savePost(post)).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  // --- deletePost ---

  describe('deletePost', () => {
    it('deletes a post by id', () => {
      savePost({ id: '1', title: 'First', content: 'A', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' });
      savePost({ id: '2', title: 'Second', content: 'B', author: 'bob', authorDisplayName: 'Bob', date: '2024-01-02' });
      deletePost('1');
      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('2');
    });

    it('does nothing when deleting a non-existent post', () => {
      savePost({ id: '1', title: 'First', content: 'A', author: 'alice', authorDisplayName: 'Alice', date: '2024-01-01' });
      deletePost('nonexistent');
      expect(getPosts()).toHaveLength(1);
    });

    it('handles empty post list gracefully', () => {
      expect(() => deletePost('nothing')).not.toThrow();
      expect(getPosts()).toEqual([]);
    });
  });

  // --- getSession ---

  describe('getSession', () => {
    it('returns null when no session exists', () => {
      expect(getSession()).toBeNull();
    });

    it('returns the stored session', () => {
      const session = { username: 'alice', role: 'admin', displayName: 'Alice' };
      localStorage.setItem('writespace_session', JSON.stringify(session));
      expect(getSession()).toEqual(session);
    });

    it('returns null when session is corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{{bad json');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getSession()).toBeNull();
      consoleSpy.mockRestore();
    });

    it('returns null when session is a non-object value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just-a-string'));
      expect(getSession()).toBeNull();
    });

    it('returns null when session object has no username', () => {
      localStorage.setItem('writespace_session', JSON.stringify({ role: 'user' }));
      expect(getSession()).toBeNull();
    });

    it('returns null when session is null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));
      expect(getSession()).toBeNull();
    });
  });

  // --- saveSession ---

  describe('saveSession', () => {
    it('saves a session', () => {
      const session = { username: 'bob', role: 'user', displayName: 'Bob' };
      saveSession(session);
      expect(getSession()).toEqual(session);
    });

    it('overwrites a previous session', () => {
      saveSession({ username: 'alice', role: 'admin', displayName: 'Alice' });
      saveSession({ username: 'bob', role: 'user', displayName: 'Bob' });
      const session = getSession();
      expect(session.username).toBe('bob');
    });

    it('handles localStorage write failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveSession({ username: 'fail', role: 'user', displayName: 'Fail' })).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  // --- clearSession ---

  describe('clearSession', () => {
    it('clears the current session', () => {
      saveSession({ username: 'alice', role: 'admin', displayName: 'Alice' });
      clearSession();
      expect(getSession()).toBeNull();
    });

    it('does nothing when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
      expect(getSession()).toBeNull();
    });

    it('handles localStorage removeItem failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(() => clearSession()).not.toThrow();
      consoleSpy.mockRestore();
    });
  });
});