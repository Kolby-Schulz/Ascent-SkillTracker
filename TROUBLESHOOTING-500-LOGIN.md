# Troubleshooting: "Request failed with status code 500" on Login

If you see this error when trying to log in, the frontend cannot reach the backend API. Follow these steps in order.

---

## The Problem

- **Frontend** (port 3001) expects the backend at `localhost:5000`
- If the backend is on a different port (e.g. Docker on 5001) or not running, login fails with 500
- **Trust proxy:** When the dev server proxies requests, it sends `X-Forwarded-For`. The backend must have `trust proxy` enabled or rate limiting can throw 500 errors (this is now fixed in `app.js`)

---

## Quick Fix Checklist

### 1. Start Docker Desktop

- Open Docker Desktop from the Start menu
- Wait until the whale icon is stable (about 30 seconds)

### 2. Start MongoDB

```bash
docker start skill-roadmap-mongodb
```

Or, if that container doesn't exist:

```bash
docker run -d -p 27017:27017 --name skill-roadmap-mongodb mongo:7.0
```

### 3. Stop the Docker Backend (Important!)

The backend must run **locally** on port 5000, not in Docker on port 5001.

```bash
docker stop skill-roadmap-backend
```

### 4. Start the Backend Locally

Open a terminal and run:

```bash
cd "c:\Users\Dominic Pham\Documents\Hacklahoma 2026\Hacklahoma-2026\backend"
npm start
```

Wait for:

```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

Leave this terminal open.

### 5. Start the Frontend

Open a **second** terminal and run:

```bash
cd "c:\Users\Dominic Pham\Documents\Hacklahoma 2026\Hacklahoma-2026\frontend"
npm start
```

Wait for the browser to open at http://localhost:3001

---

## If Port 5000 Is Already in Use

Find and kill the process:

```bash
netstat -ano | findstr ":5000"
```

Note the PID (last number). Then:

```bash
taskkill /PID <PID> /F
```

Or with PowerShell:

```powershell
Stop-Process -Id <PID> -Force
```

---

## If Port 3001 Is Already in Use

```bash
netstat -ano | findstr ":3001"
taskkill /PID <PID> /F
```

Then run the frontend again.

---

## Fresh Start After Reboot (Full Order)

1. Start Docker Desktop (wait ~30 seconds)
2. `docker start skill-roadmap-mongodb`
3. `docker stop skill-roadmap-backend` (if it's running)
4. Terminal 1: `cd backend` → `npm start` (wait for "Server running...")
5. Terminal 2: `cd frontend` → `npm start`
6. Open http://localhost:3001 and log in

---

## Recommended: Use the Start Script

**Windows:**
```bash
scripts\start-local-dev.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/start-local-dev.sh
./scripts/start-local-dev.sh
```

This script stops the Docker backend, starts MongoDB, and runs the backend locally. Open a second terminal for the frontend.

---

## Key Rule

**Do NOT use `docker-compose up` for the backend on Windows.**

- Use Docker only for MongoDB
- Run the backend locally with `npm start` on port 5000
- This matches the frontend proxy and your teammates' setup
