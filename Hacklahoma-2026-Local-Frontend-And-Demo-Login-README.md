# Hacklahoma 2026: Local Frontend + Docker Backend & Demo Login

This document describes two setup changes made to the Hacklahoma 2026 project: (1) running the **frontend locally** with the **backend in Docker**, and (2) adding a **default-user / demo login** button that bypasses the real sign-in flow (and CORS) for demos.

---

## 1. Local Frontend + Docker Backend

### What we did

We split the stack so that:

- **Frontend** runs on your machine with `npm start` (Create React App dev server).
- **Backend and MongoDB** run in Docker via `docker-compose`.

The frontend at `http://localhost:3000` talks to the API at `http://localhost:5001/api/v1` on your host. Docker maps the backend’s internal port 5000 to host port 5001.

### Why

- **Hot reload** – Code and UI changes show up immediately without rebuilding a Docker image.
- **Faster iteration** – No need to run `docker-compose up --build` for frontend-only changes.
- **Same backend** – Auth and APIs behave the same; only where the frontend runs changes.

### Configuration

| Role        | Where it runs | URL / Port |
|------------|----------------|------------|
| Frontend   | Your machine   | `http://localhost:3000` |
| Backend API| Docker         | `http://localhost:5001` (host) → 5000 (container) |
| MongoDB    | Docker         | `localhost:27017` (internal use by backend) |

**Frontend**

- The app uses `REACT_APP_API_URL` for the API base URL.
- For local frontend + Docker backend, set in `frontend/.env`:
  ```env
  REACT_APP_API_URL=http://localhost:5001/api/v1
  ```
- If `frontend/.env` doesn’t exist, copy `frontend/.env.example` and set the same value. Restart `npm start` after changing `.env`.

**Backend (Docker)**

- So the browser (origin `http://localhost:3000`) can call the API, the backend must allow that origin in CORS.
- In `docker-compose.yml`, the `backend` service has:
  ```yaml
  environment:
    - CORS_ORIGIN=http://localhost:3000
  ```
- With this, login and other API calls from the local frontend work without CORS errors.

### How to run it

**Terminal 1 – Backend and MongoDB only**

From the project root:

- **Windows:** `scripts\start-backend-only.bat`
- **Linux/Mac:** `./scripts/start-backend-only.sh`

Or manually:

```bash
docker-compose up mongodb backend
```

Leave this running. The API will be at **http://localhost:5001**.

**Terminal 2 – Frontend locally**

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**. You can register and log in; requests go to the Docker backend.

### Stopping

- Frontend: **Ctrl+C** in the frontend terminal.
- Backend/MongoDB: **Ctrl+C** in the backend terminal, then (optional) `docker-compose down` to remove containers.

### Troubleshooting

- **Network error or login fails** – Ensure `docker-compose up mongodb backend` is running, and that `frontend/.env` has `REACT_APP_API_URL=http://localhost:5001/api/v1`. Restart the frontend after editing `.env`.
- **CORS errors** – Confirm `CORS_ORIGIN=http://localhost:3000` is set for the backend in `docker-compose.yml` and restart the backend containers.
- **Port in use** – Change `PORT` in `frontend/.env` (e.g. 3001) or the backend port mapping in `docker-compose.yml` if 3000 or 5001 are taken.

---

## 2. Login as Default User (Demo Button)

### What we did

We added a **demo login** that signs you in as a fixed “default” user **without calling the backend**. That avoids CORS and network issues during demos (e.g. when the backend isn’t running or isn’t reachable).

- A **button** on the Login page with the label: **DEMO BUTTON REMOVE BEFORE DEVPOST**.
- Clicking it runs **demo login**: it stores a special token and a default user in `localStorage` and in React state, then redirects to the dashboard. No API request is made.
- On later page loads, if that special token is present, the app restores the user from `localStorage` and **does not** call the backend’s “get me” endpoint, so CORS and auth errors are avoided.

### Why

- **Demo / judging** – You can show the app (including the dashboard) without relying on the live backend or dealing with CORS.
- **Offline / broken backend** – You can still “log in” and use the UI as the default user.

### How it works (technical)

- **AuthContext** defines a constant demo token (e.g. `demo-bypass-token`) and a default user object (e.g. `demouser`, `demo@example.com`, role `user`).
- **`loginAsDemoUser()`** in the context:
  - Saves that token and the default user to `localStorage` (same keys as real login).
  - Sets the auth state so the app treats the user as logged in.
- **Initial auth (e.g. on refresh):**
  - If the stored token is the demo token, the app **does not** call the backend; it only reads the user from `localStorage` and sets state. So no CORS or network call.
  - If the token is a real JWT, the app still calls the backend to validate and get the current user.
- The **Login page** has a second button that calls `loginAsDemoUser()` and then navigates to `/dashboard`. The button label is **DEMO BUTTON REMOVE BEFORE DEVPOST** so it’s obvious to remove before submission.

### Default user

The demo user typically looks like:

- **Username:** `demouser`
- **Email:** `demo@example.com`
- **Role:** `user`

(Exact fields are in `AuthContext.js`: `DEFAULT_DEMO_USER` and related logic.)

### Important: remove before Devpost

- The button and the demo-login flow are for **demo/judging only**.
- **Before submitting to Devpost**, remove:
  - The demo button from the Login page.
  - The demo token constant, `loginAsDemoUser()`, and the “if demo token, skip API” branch in `AuthContext.js`.
  - Any CSS or comments that reference “DEMO BUTTON REMOVE BEFORE DEVPOST”.

Search the repo for “DEMO BUTTON REMOVE BEFORE DEVPOST” and “demo-bypass” to find all related code.

---

## Summary

| Topic | Purpose |
|-------|--------|
| **Local frontend + Docker backend** | Run frontend on your machine with hot reload; backend and MongoDB in Docker; frontend uses `REACT_APP_API_URL=http://localhost:5001/api/v1` and backend uses `CORS_ORIGIN=http://localhost:3000`. |
| **Demo / default-user login** | One-click “login” as a fixed user with no API call, to avoid CORS and show the app during demos; must be removed before Devpost submission. |

Both the local-frontend setup and the demo-login behavior are documented in the project (e.g. `LOCAL_DEV.md` and comments in `AuthContext.js` and the Login page).
