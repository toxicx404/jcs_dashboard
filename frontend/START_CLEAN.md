# How to Start Frontend Cleanly

## Step 1: Stop All Running Instances

**Option A: Kill all Node processes**
```powershell
Get-Process node | Stop-Process -Force
```

**Option B: Kill specific ports**
```powershell
# Find processes on ports 3000, 3001, 3002
netstat -ano | findstr ":3000 :3001 :3002"

# Kill each PID (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

## Step 2: Verify Ports are Free
```powershell
netstat -ano | findstr ":3000"
# Should return nothing if port is free
```

## Step 3: Start Backend First
```bash
cd backend
npm start
```
Wait for: "Server running on port 5000"

## Step 4: Start Frontend (Single Instance)
```bash
cd frontend
npm run dev
```

Should show:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 5: Open Browser
- Go to: http://localhost:3000
- Open DevTools (F12)
- Check Console for errors
- Check Network tab for failed requests

## Troubleshooting White Screen

### Check Browser Console (F12)
Look for:
1. **Red errors** → JavaScript/React errors
2. **Failed network requests** → Backend not running
3. **404 errors** → Missing files

### Common Fixes

**If you see "Failed to fetch" or CORS errors:**
- Backend not running → Start backend first
- Backend on wrong port → Check backend/.env has PORT=5000

**If you see React errors:**
- Missing dependencies → Run `npm install` in frontend
- Syntax errors → Check console for file names

**If page is completely blank:**
- Check if HTML loads → View page source (Ctrl+U)
- Check if JavaScript loads → Network tab → filter JS files
- Clear browser cache → Ctrl+Shift+Delete

## Port Configuration

Port is now configured in:
1. `frontend/.env` → `VITE_PORT=3000`
2. `frontend/vite.config.ts` → Uses env variable
3. `frontend/package.json` → `"dev": "vite --port 3000"`

All three should match!

