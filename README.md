# CampusLoop

CampusLoop is a React/Vite frontend with an Express, MongoDB, and Clerk backend.

## Run after extracting a ZIP

Install Node.js (npm is included), extract the project, and run this from the project root:

```bash
npm run dev
```

The first run installs frontend and backend packages automatically from the checked-in lockfiles. Later runs reuse them. The frontend starts at `http://localhost:5173`; when `backend/.env` exists, the backend starts at `http://localhost:5000` too.

## Configure private service credentials

The app uses private Clerk, MongoDB, and Groq credentials. They are intentionally excluded from GitHub and ZIP-safe project files.

1. Copy `frontend/.env.example` to `frontend/.env` and add your Clerk publishable key.
2. Copy `backend/.env.example` to `backend/.env` and add your MongoDB URI, Clerk keys, and Groq key.
3. Run `npm run dev` again.

Without the frontend Clerk key, the Vite server still starts and displays a setup message. The backend is skipped until `backend/.env` is present.

## Other commands

```bash
npm run build
npm run lint
```
