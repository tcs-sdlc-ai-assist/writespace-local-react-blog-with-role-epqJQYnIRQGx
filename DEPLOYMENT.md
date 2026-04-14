# Deployment Guide — WriteSpace

## Overview

WriteSpace is a static single-page application (SPA) built with Vite and React. It requires no backend services or environment variables, making deployment straightforward.

---

## Build

### Build Command

```bash
npm run build
```

This runs `vite build`, which outputs optimized production assets to the `dist` directory.

### Output Directory

```
dist/
```

All static files (HTML, JS, CSS, assets) are emitted here.

---

## Vercel Deployment

### Option 1: Vercel Git Integration (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel auto-detects the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

Every push to the main branch will trigger an automatic production deployment. Pull requests will generate preview deployments.

### Option 2: Manual Deployment via Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Build the project locally:

   ```bash
   npm run build
   ```

3. Deploy:

   ```bash
   vercel --prod
   ```

   Follow the prompts to link your project. On subsequent deploys, the same command will push updates.

---

## SPA Rewrite Configuration

Since WriteSpace is a single-page application using client-side routing, all routes must resolve to `index.html`. The `vercel.json` file at the project root handles this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/editor`, `/about`) serves the SPA entry point instead of returning a 404.

---

## Environment Variables

**None required.**

WriteSpace runs entirely in the browser with no external API calls or secrets. If environment variables are added in the future, they must be prefixed with `VITE_` to be exposed to the client bundle (e.g., `VITE_API_URL`). These can be configured in:

- **Vercel Dashboard:** Project Settings → Environment Variables
- **Local development:** A `.env` file at the project root (never commit this file)

---

## CI/CD Notes

### Vercel Git Integration

- **Production deploys** are triggered automatically on pushes to the `main` branch.
- **Preview deploys** are created for every pull request, providing a unique URL for review.
- Build logs and deployment status are visible in the Vercel dashboard.

### Manual / Custom CI

If you prefer a custom CI pipeline (GitHub Actions, GitLab CI, etc.), use the following steps in your workflow:

```yaml
# Example GitHub Actions step
- name: Install dependencies
  run: npm install

- name: Build
  run: npm run build

- name: Deploy to Vercel
  run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

To obtain a Vercel token, go to **Vercel Dashboard → Settings → Tokens** and create a new token. Store it as a secret in your CI provider.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| 404 on page refresh | Ensure `vercel.json` contains the SPA rewrite rule shown above. |
| Build fails on Vercel | Confirm Node.js version compatibility. Add `"engines": { "node": ">=18" }` to `package.json` if needed. |
| Stale deployment | Clear the Vercel build cache: Project Settings → General → Build Cache → Clear. |
| Assets not loading | Verify `base` in `vite.config.js` is set to `"/"` (the default) or matches your deployment path. |