# White Screen Debugging Guide

## Current Issue
- Multiple Vite instances running on ports 3000, 3001, 3002
- White screen on all instances
- Port not properly configured

## Fix Steps

### 1. Stop All Running Instances
```powershell
# Kill all Node processes (be careful!)
Get-Process node | Stop-Process -Force

# Or kill specific ports:
netstat -ano | findstr ":3000"
# Note the PID and kill it:
taskkill /PID <PID> /F
```

### 2. Clear Browser Cache
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Hard refresh: Ctrl+Shift+R

### 3. Check Browser Console
Open DevTools (F12) → Console tab
Look for:
- Red errors (JavaScript errors)
- Failed network requests
- React errors

### 4. Verify Backend is Running
```bash
cd backend
npm start
```
Should show: "Server running on port 5000"

### 5. Start Frontend Cleanly
```bash
cd frontend
npm run dev
```
Should show: "Local: http://localhost:3000/"

### 6. Common White Screen Causes

#### A. React Error
**Check:** Browser console for React errors
**Fix:** Check component imports and syntax

#### B. API Connection Failed
**Check:** Network tab → Failed requests to localhost:5000
**Fix:** Ensure backend is running

#### C. Missing Dependencies
**Check:** Console shows "Cannot find module"
**Fix:** Run `npm install` in frontend folder

#### D. Port Conflict
**Check:** Multiple vite instances running
**Fix:** Kill all and restart single instance

### 7. Debug Checklist
- [ ] Only ONE vite instance running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] No errors in browser console
- [ ] Network requests succeed
- [ ] Browser cache cleared

