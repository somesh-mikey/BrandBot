# BrandBot Frontend (React + Vite)

SPA for interacting with the BrandBot backend.

## Requirements
- Node.js 18+
- npm 9+

## Setup
```bash
# From D:\DimensionsCMS\brandbot-frontend
npm install
```

## Run
```bash
npm run dev
```
Then open the URL shown (typically http://127.0.0.1:5173 or http://localhost:5173).

## Environment
If the frontend needs to call the backend at a custom URL, create `.env` in `brandbot-frontend`:
```ini
VITE_API_BASE=http://127.0.0.1:8000
```
Use `import.meta.env.VITE_API_BASE` in code to reference it.

## Pairing with backend
Start the backend first (FastAPI on port 8000), then run the frontend dev server. The app should point to `http://127.0.0.1:8000` by default if using relative paths; otherwise set `VITE_API_BASE` above.

## Scripts
- `npm run dev` – Start Vite dev server with HMR
- `npm run build` – Production build
- `npm run preview` – Preview production build locally

## Troubleshooting
- CORS errors: ensure backend runs with CORS enabled (it is by default) and is reachable at the configured `VITE_API_BASE`.
- API 500 errors: check backend logs (Uvicorn) and confirm `OPENAI_API_KEY` is set in `brandbot-backend/.env`.
