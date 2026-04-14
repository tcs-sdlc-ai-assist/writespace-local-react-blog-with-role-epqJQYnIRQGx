# WriteSpace

A modern writing platform built with React, featuring a clean and distraction-free environment for writers to create, manage, and organize their content.

## Features

- **User Authentication** — Register and login with local account management
- **Distraction-Free Writing** — Clean, minimal editor interface optimized for focus
- **Document Management** — Create, edit, delete, and organize your writing pieces
- **Auto-Save** — Content is automatically saved to localStorage as you write
- **Responsive Design** — Fully responsive UI that works on desktop, tablet, and mobile
- **Dark Mode Support** — Tailwind CSS dark mode utilities for comfortable writing at any hour
- **Client-Side Routing** — Seamless navigation with React Router v6

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18+** | UI library with hooks and functional components |
| **Vite** | Build tool and development server |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **React Router v6** | Client-side routing and navigation |
| **localStorage** | Client-side data persistence |
| **PropTypes** | Runtime prop type validation |

## Folder Structure

```
writespace/
├── public/
│   └── vite.svg
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── DocumentCard.jsx
│   │   └── Editor.jsx
│   ├── contexts/          # React context providers
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useLocalStorage.js
│   ├── pages/             # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditorPage.jsx
│   │   └── NotFound.jsx
│   ├── utils/             # Shared utility functions
│   │   └── storage.js
│   ├── App.jsx            # Root component with router
│   ├── main.jsx           # Entry point (renders App)
│   └── index.css          # Tailwind CSS directives
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
# Create an optimized production build
npm run build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
3. Click **"New Project"** and import your repository.
4. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**.

For client-side routing to work correctly, add a `vercel.json` file to the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Route Map

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `Home` | No | Landing page with app overview |
| `/login` | `Login` | No | User login form |
| `/register` | `Register` | No | User registration form |
| `/dashboard` | `Dashboard` | Yes | Document list and management |
| `/editor/:id` | `EditorPage` | Yes | Writing editor for a specific document |
| `/editor/new` | `EditorPage` | Yes | Create a new document |
| `*` | `NotFound` | No | 404 page for unmatched routes |

## localStorage Schema

All data is persisted in the browser's `localStorage` using the following keys:

### `writespace_users`

```json
[
  {
    "id": "uuid-string",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "plain-text-password",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `writespace_current_user`

```json
{
  "id": "uuid-string",
  "username": "johndoe",
  "email": "john@example.com"
}
```

### `writespace_documents`

```json
[
  {
    "id": "uuid-string",
    "userId": "uuid-string",
    "title": "My First Document",
    "content": "Document body text...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T12:00:00.000Z"
  }
]
```

## Known Limitations

- **Plain-Text Passwords** — User passwords are stored in plain text in localStorage. This is a client-side demo application and is **not suitable for production use** with real user credentials.
- **No Backend** — All data is stored in the browser's localStorage. Data is not synced across devices or browsers, and clearing browser data will permanently delete all content.
- **No Encryption** — Data stored in localStorage is not encrypted and can be accessed by any script running on the same origin.
- **Storage Limits** — localStorage is limited to approximately 5–10 MB depending on the browser. Large volumes of documents may exceed this limit.
- **Single Device** — Since there is no server, documents and accounts exist only in the browser where they were created.

## License

**Private** — All rights reserved. This project is not licensed for public use, distribution, or modification.