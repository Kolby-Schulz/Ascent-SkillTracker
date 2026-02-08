# Run Locally (without full Docker stack)

The 500 error on register/login usually means **MongoDB isn't running** or the **backend isn't running**.

## Step 1: Start MongoDB (Docker)
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

## Step 2: Start Backend
```powershell
cd backend
npm install
npm start
```
Wait until you see: `Server running in development mode on port 5000`

## Step 3: Start Frontend
```powershell
cd frontend
npm install
npm start
```

## Step 4: Open App
http://localhost:3000 (or 3001 if 3000 was in use)

---

**Backend .env** must have: `MONGO_URI=mongodb://localhost:27017/skill-roadmap`  
**Frontend** uses a proxy to `http://localhost:5000` (see package.json)
