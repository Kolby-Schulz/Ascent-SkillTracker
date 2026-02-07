# Local Frontend + Docker Backend

This setup lets you run the **frontend on your machine** (with hot reload) while the **backend and MongoDB run in Docker**. You can log in and use the app from `http://localhost:3000` with full API connectivity.

## Why use this?

- **Hot reload** – Frontend changes appear immediately without rebuilding Docker.
- **Faster iteration** – No need to rebuild the frontend container.
- **Same backend** – Backend and MongoDB run in Docker; auth and API work as normal.

## Prerequisites

- **Node.js** (v18+) and **npm** on your machine
- **Docker** and **Docker Compose** for backend + MongoDB

If you don’t have `frontend/.env`, copy `frontend/.env.example` to `frontend/.env` so the local frontend uses the Docker backend URL.

## Quick start

### 1. Start backend and MongoDB only (Docker)

From the project root (`Hacklahoma-2026`):

**Windows:**
```cmd
scripts\start-backend-only.bat
```

**Linux / Mac:**
```bash
./scripts/start-backend-only.sh
```

Or manually:
```bash
docker-compose up mongodb backend
```

Leave this terminal running. You should see MongoDB and the backend start; the API will be at **http://localhost:5001**.

### 2. Start the frontend locally

In a **second terminal**, from the project root:

```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**. You can **register and log in** from there; all requests go to the Docker backend at `http://localhost:5001/api/v1`.

## Configuration

| Item | Value | Notes |
|------|--------|--------|
| Frontend URL | http://localhost:3000 | Your browser |
| Backend API  | http://localhost:5001/api/v1 | Set in `frontend/.env` as `REACT_APP_API_URL` |
| CORS origin  | http://localhost:3000 | Set in Docker for backend so login works from localhost |

- **`frontend/.env`** – Must include `REACT_APP_API_URL=http://localhost:5001/api/v1` so the local frontend talks to the Docker backend.
- **Backend CORS** – `docker-compose.yml` sets `CORS_ORIGIN=http://localhost:3000` so the backend accepts requests from your local frontend (required for login and API calls).

## Troubleshooting

**"Network Error" or login fails**

- Backend must be running: `docker-compose up mongodb backend`.
- Check API: open http://localhost:5001/health (or your health endpoint) in the browser.
- Confirm `frontend/.env` has `REACT_APP_API_URL=http://localhost:5001/api/v1`. Restart `npm start` after changing `.env`.

**CORS errors in the browser**

- Backend in Docker must have `CORS_ORIGIN=http://localhost:3000` (already set in `docker-compose.yml` for this workflow).
- Restart backend after changing env: `docker-compose up mongodb backend`.

**Port 3000 or 5001 in use**

- Stop any other app using that port, or change `PORT` in `frontend/.env` (e.g. 3001) and/or the backend port mapping in `docker-compose.yml`.

## Stopping

- In the frontend terminal: **Ctrl+C**.
- In the backend terminal: **Ctrl+C**, then run `docker-compose down` if you want to stop MongoDB and backend containers.
