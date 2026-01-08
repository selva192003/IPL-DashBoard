# IPL Dashboard

Full-stack IPL Dashboard application.

## Tech Stack
- Frontend: React (Create React App) + Tailwind
- Backend: Spring Boot (Java 17)
- Hosting (typical): Frontend on Vercel, Backend on Render

## Project Structure
- `IPL-DashBoard-main/frontend` — React app
- `IPL-DashBoard-main/backend` — Spring Boot API

## Run Locally

### Backend
From `IPL-DashBoard-main/backend`:

- Windows:
  - `./mvnw.cmd spring-boot:run`
- macOS/Linux:
  - `./mvnw spring-boot:run`

Backend runs at `http://localhost:8080`.

Health endpoint:
- `GET /api/ping`

### Frontend
From `IPL-DashBoard-main/frontend`:

- `npm install`
- `npm start`

Frontend runs at `http://localhost:3000`.

The frontend is configured to call the backend via:
- Relative routes like `/api/v1/...` (recommended for Vercel via rewrites)
- Optional override: `REACT_APP_API_URL` (prefix for API calls)

## Deployment Notes

### Vercel (Frontend)
This repo includes `vercel.json` rewrites that proxy `/api/...` to the backend.

### Render (Backend) Cold Start
Render free instances can go idle, causing a “cold start” delay on the first API request.

This app mitigates that by:
- Warming the backend on initial frontend load (`/api/ping` + prefetch a few endpoints)
- Optional Vercel Cron calling `/api/warmup` every 10 minutes

If you use a different backend URL than the default in the repo, set this in Vercel:
- `BACKEND_ORIGIN` = `https://<your-render-app>.onrender.com`

## Scripts
From `IPL-DashBoard-main/frontend`:
- `npm test` — run tests
- `npm run build` — production build
