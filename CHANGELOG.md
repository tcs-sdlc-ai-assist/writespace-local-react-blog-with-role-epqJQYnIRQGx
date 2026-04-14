# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

- **Public Landing Page**: Welcome page with featured blog posts visible to all visitors without authentication.
- **Login & Registration**: User authentication system with login and registration forms including input validation and error feedback.
- **Role-Based Access Control**: Three distinct user roles (admin, author, reader) with route protection and conditional UI rendering based on permissions.
- **Blog CRUD Operations**: Full create, read, update, and delete functionality for blog posts with a rich text editor, supporting title, content, author attribution, and timestamps.
- **Admin Dashboard**: Dedicated dashboard for admin users featuring site-wide statistics, user management controls, and content moderation tools.
- **User Management**: Admin ability to view all registered users, assign roles, and remove accounts from the platform.
- **localStorage Persistence**: Client-side data persistence using browser localStorage for user sessions, blog posts, and application state across page reloads.
- **Responsive Tailwind CSS UI**: Fully responsive user interface built with Tailwind CSS utility classes, optimized for mobile, tablet, and desktop viewports.
- **Vercel SPA Deployment**: Production-ready single-page application configuration with Vercel deployment support including proper SPA routing via `vercel.json` rewrites.