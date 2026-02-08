# Local Development Setup (Recommended)

**Use this setup to avoid login 500 errors and port conflicts.** This works on Windows, macOS, and Linux.

---

## Why This Setup?

- **Frontend** (port 3001) proxies API requests to `localhost:5000`
- **Backend** must run on port 5000
- **Docker backend** uses port 5001 → causes 500 errors
- **Solution:** Run backend and frontend locally; use Docker only for MongoDB

---

## One-Time Setup

```bash
# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## Every Time You Start (After Reboot)

**One command:** Run `scripts/start-all.bat` (Windows) or `./scripts/start-all.sh` (Mac/Linux) — starts MongoDB, backend, and frontend in one go.

Or follow the manual steps below:

### 1. Start Docker Desktop
- Open Docker Desktop, wait ~30 seconds until it's ready

### 2. Start MongoDB
```bash
docker start skill-roadmap-mongodb
```

(First time? Run: `docker run -d -p 27017:27017 --name skill-roadmap-mongodb mongo:7.0`)

### 3. Stop Docker Backend (if running)
```bash
docker stop skill-roadmap-backend
```

### 4. Start Backend (Terminal 1)
```bash
cd backend
npm start
```
Wait for: `Server running in development mode on port 5000` and `MongoDB Connected: localhost`

### 5. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Browser opens at http://localhost:3001

---

## Do NOT

- ❌ Run `docker-compose up` for full stack (backend will be on 5001, frontend expects 5000)
- ❌ Start the Docker backend container

## Do

- ✅ Use Docker only for MongoDB
- ✅ Run backend locally: `cd backend && npm start`
- ✅ Run frontend locally: `cd frontend && npm start`
- ✅ **Mac:** Double-click `scripts/start-all.command` for one-click start (opens backend + frontend in separate Terminal windows)

---

## If Something Goes Wrong

See [TROUBLESHOOTING-500-LOGIN.md](./TROUBLESHOOTING-500-LOGIN.md) for detailed fix steps.
