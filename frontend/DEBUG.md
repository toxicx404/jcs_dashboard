# Frontend Debugging Guide

## White Screen Issue - Troubleshooting Steps

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors:
- Red errors indicate JavaScript/React issues
- Network errors indicate API connection problems

### 2. Check if Backend is Running
The frontend needs the backend API to be running:
```bash
cd backend
npm start
```
Backend should be running on `http://localhost:5000`

### 3. Check Network Tab
In DevTools → Network tab:
- Look for failed requests to `http://localhost:5000/api/*`
- If requests fail, backend might not be running or CORS issue

### 4. Common Issues

#### API Connection Failed
**Symptom:** Console shows "Failed to fetch" or CORS errors
**Solution:** 
- Make sure backend is running on port 5000
- Check `backend/src/app.ts` has CORS enabled
- Verify `frontend/services/api.ts` has correct API_URL

#### React Rendering Error
**Symptom:** Console shows React errors
**Solution:**
- Check if all components are imported correctly
- Verify all dependencies are installed: `cd frontend && npm install`

#### Missing Environment Variables
**Symptom:** API calls fail silently
**Solution:**
- Check if `frontend/.env` exists (optional, API_URL is hardcoded)

### 5. Quick Fixes

**Clear browser cache:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**Restart dev server:**
```bash
cd frontend
# Stop current server (Ctrl+C)
npm run dev
```

**Reinstall dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 6. Verify Setup

1. **Backend running?**
   ```bash
   curl http://localhost:5000
   # Should return: "JCS Dashboard API is running."
   ```

2. **Frontend running?**
   ```bash
   curl http://localhost:3000
   # Should return HTML
   ```

3. **API endpoints working?**
   ```bash
   curl http://localhost:5000/api/departments
   # Should return JSON array (may be empty)
   ```

### 7. Expected Behavior

When everything works:
- Landing page should show login form
- No errors in console
- Network tab shows successful API calls
- Page renders with Tailwind CSS styling

### 8. Still White Screen?

1. Open browser console (F12)
2. Check for any red errors
3. Share the error message for further debugging
4. Check if `http://localhost:3000` loads at all (even blank page means server is running)

