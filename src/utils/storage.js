/**
 * LocalStorage utility module for WriteSpace
 * Handles all CRUD operations for users, posts, and session data.
 *
 * @module storage
 */

const KEYS = {
  USERS: 'writespace_users',
  POSTS: 'writespace_posts',
  SESSION: 'writespace_session',
};

/**
 * Safely parse JSON from localStorage
 * @param {string} key - localStorage key
 * @param {*} fallback - fallback value if parse fails
 * @returns {*} parsed value or fallback
 */
function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`[WriteSpace] Failed to parse localStorage key "${key}":`, e);
    return fallback;
  }
}

/**
 * Safely stringify and set a value in localStorage
 * @param {string} key - localStorage key
 * @param {*} value - value to store
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[WriteSpace] Failed to write localStorage key "${key}":`, e);
  }
}

/**
 * Safely remove a key from localStorage
 * @param {string} key - localStorage key
 */
function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[WriteSpace] Failed to remove localStorage key "${key}":`, e);
  }
}

/**
 * Get all users from localStorage
 * @returns {Array<{username: string, displayName: string, password: string, role: string, createdDate: string}>}
 */
export function getUsers() {
  const users = safeParse(KEYS.USERS, []);
  return Array.isArray(users) ? users : [];
}

/**
 * Save a user to localStorage. If a user with the same username exists, update it.
 * @param {{username: string, displayName: string, password: string, role: string, createdDate: string}} user
 */
export function saveUser(user) {
  const users = getUsers();
  const existingIndex = users.findIndex((u) => u.username === user.username);
  if (existingIndex !== -1) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  safeSet(KEYS.USERS, users);
}

/**
 * Delete a user by username from localStorage
 * @param {string} username
 */
export function deleteUser(username) {
  const users = getUsers();
  const filtered = users.filter((u) => u.username !== username);
  safeSet(KEYS.USERS, filtered);
}

/**
 * Get all posts from localStorage
 * @returns {Array<{id: string, title: string, content: string, author: string, authorDisplayName: string, date: string}>}
 */
export function getPosts() {
  const posts = safeParse(KEYS.POSTS, []);
  return Array.isArray(posts) ? posts : [];
}

/**
 * Save a post to localStorage. If a post with the same id exists, update it.
 * @param {{id: string, title: string, content: string, author: string, authorDisplayName: string, date: string}} post
 */
export function savePost(post) {
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  if (existingIndex !== -1) {
    posts[existingIndex] = { ...posts[existingIndex], ...post };
  } else {
    posts.push(post);
  }
  safeSet(KEYS.POSTS, posts);
}

/**
 * Delete a post by id from localStorage
 * @param {string} id
 */
export function deletePost(id) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  safeSet(KEYS.POSTS, filtered);
}

/**
 * Get the current session from localStorage
 * @returns {{username: string, role: string, displayName: string} | null}
 */
export function getSession() {
  const session = safeParse(KEYS.SESSION, null);
  if (session && typeof session === 'object' && session.username) {
    return session;
  }
  return null;
}

/**
 * Save a session to localStorage
 * @param {{username: string, role: string, displayName: string}} session
 */
export function saveSession(session) {
  safeSet(KEYS.SESSION, session);
}

/**
 * Clear the current session from localStorage
 */
export function clearSession() {
  safeRemove(KEYS.SESSION);
}