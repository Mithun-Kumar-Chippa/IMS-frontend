# Internship Management System

## Run locally

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

## Available commands

- `npm run build` creates a production build in `dist`.
- `npm run preview` serves the production build locally.
- `npm run lint` checks the frontend source.

## Deploy to Vercel

Import the frontend repository in Vercel. If deploying from the workspace repository instead, set the project root directory to `frontend`. Vercel should use `npm run build` as the build command and `dist` as the output directory.

The rewrite in `vercel.json` supports direct navigation to React routes. The frontend can be deployed before the backend, but API-backed features will not work until the backend is publicly available. Then set `VITE_API_BASE_URL` in the Vercel project settings to the backend API base URL, including `/api/v1`, and redeploy. Do not use `localhost` for this production variable.
