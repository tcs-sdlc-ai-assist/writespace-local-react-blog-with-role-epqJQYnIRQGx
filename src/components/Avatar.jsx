import React from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

const gradientClasses = {
  admin: 'bg-gradient-to-br from-violet-500 to-purple-600',
  user: 'bg-gradient-to-br from-indigo-500 to-blue-600',
};

const emojiMap = {
  admin: '👑',
  user: '📖',
};

export function Avatar({ role = 'user', size = 'md' }) {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const gradient = gradientClasses[role] || gradientClasses.user;
  const emoji = emojiMap[role] || emojiMap.user;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${gradient} ${sizeClass} shadow-md`}
      role="img"
      aria-label={`${role} avatar`}
    >
      <span className="leading-none">{emoji}</span>
    </span>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

/**
 * Returns a styled avatar JSX element based on the user role.
 * @param {'admin'|'user'} role - The role of the user.
 * @param {'sm'|'md'|'lg'} [size='md'] - The size of the avatar.
 * @returns {React.ReactElement} Styled avatar JSX element.
 */
export function getAvatar(role, size = 'md') {
  return <Avatar role={role} size={size} />;
}