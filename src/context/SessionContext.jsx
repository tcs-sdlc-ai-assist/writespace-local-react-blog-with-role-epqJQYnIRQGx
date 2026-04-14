import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getSession, saveSession, clearSession } from '../utils/storage.js';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const login = useCallback((sessionData) => {
    saveSession(sessionData);
    setSession(sessionData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = {
    session,
    login,
    logout,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access session context.
 * Must be used within a SessionProvider.
 * @returns {{ session: object|null, login: function, logout: function }}
 */
export function useSession() {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}