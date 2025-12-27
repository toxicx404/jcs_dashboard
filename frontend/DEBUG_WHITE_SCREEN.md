# White Screen Debugging Guide

## ✅ What I've Added

I've added comprehensive console logging throughout the app to help identify where it's failing:

1. **index.tsx** - Logs when React starts, root element found, and rendering
2. **App.tsx** - Logs when App component renders
3. **JCSContext.tsx** - Logs provider initialization and data fetching
4. **AppContent** - Logs user state and routing decisions
5. **LandingPage** - Logs when landing page renders
6. **index.html** - Added fallback content and debug script

## 🔍 How to Debug

### Step 1: Open Browser Console
1. Go to `http://localhost:8000`
2. Press **F12** to open DevTools
3. Click **Console** tab

### Step 2: Check Console Output

You should see logs in this order:
```
📄 HTML loaded
🔍 Root element: <div id="root">...</div>
🌐 Window location: http://localhost:8000/
🚀 Frontend starting...
React version: 19.x.x
✅ Root element found: <div id="root">...</div>
📦 Creating React root...
🎨 Rendering App component...
📱 App component rendering...
🔧 JCSProvider initializing...
📊 Initial state: {departments: 0, events: 0, currentUser: null, isLoading: true}
🔄 Starting data fetch...
📡 Fetching departments and events...
✅ Data fetched: {departments: X, events: Y}
🏁 Data fetch complete, setting isLoading to false
🎯 AppContent rendering...
👤 Current user state: {currentUser: null, isLoading: false}
⏳ Showing loading state... OR 🚪 No user logged in, showing LandingPage
🏠 LandingPage component rendering...
```

### Step 3: Identify Where It Stops

**If logs stop at a certain point:**
- That's where the error is happening
- Check for red error messages after the last log

**Common stopping points:**

#### Stops at "Frontend starting..."
- React not loading → Check if `node_modules` exists
- Run: `cd frontend && npm install`

#### Stops at "Rendering App component..."
- App component has an error → Check for import errors
- Look for red errors in console

#### Stops at "JCSProvider initializing..."
- Context provider error → Check JCSContext.tsx imports
- Check if `api.ts` is working

#### Stops at "Starting data fetch..."
- API connection issue → Check if backend is running
- Check Network tab for failed requests

#### Stops at "Fetching departments and events..."
- Backend not responding → Start backend: `cd backend && npm start`
- Check CORS settings in backend

### Step 4: Check Network Tab

1. Open **Network** tab in DevTools
2. Refresh page (F5)
3. Look for:
   - **Red/failed requests** → Backend connection issue
   - **404 errors** → Missing files
   - **CORS errors** → Backend CORS configuration

### Step 5: Check Elements Tab

1. Open **Elements** tab (or **Inspector**)
2. Look for `<div id="root">`
3. Check if it has content:
   - **Empty** → React not rendering
   - **Has content** → CSS might be hiding it

## 🐛 Common Issues & Fixes

### Issue 1: No Console Logs at All
**Problem:** JavaScript not loading
**Fix:**
- Check Network tab → Look for `index.tsx` or `main.js`
- Verify Vite is serving files correctly
- Check browser console for script loading errors

### Issue 2: Logs Stop at Data Fetch
**Problem:** Backend not running or CORS issue
**Fix:**
```bash
# Start backend
cd backend
npm start

# Verify backend is running
curl http://localhost:5000
# Should return: "JCS Dashboard API is running."
```

### Issue 3: React Error in Console
**Problem:** Component error preventing render
**Fix:**
- Check the error message
- Look for file name and line number
- Fix the error in that file

### Issue 4: White Screen but Console Shows Success
**Problem:** CSS not loading or Tailwind issue
**Fix:**
- Check if Tailwind CDN loaded (Network tab)
- Check Elements tab → See if content exists but is invisible
- Try adding inline styles to test

## 📋 Quick Checklist

- [ ] Browser console open (F12)
- [ ] Console shows logs (not empty)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 8000
- [ ] Network tab shows successful requests
- [ ] No red errors in console
- [ ] Root element exists in Elements tab

## 🆘 Still White Screen?

1. **Copy all console logs** and share them
2. **Take screenshot** of console errors
3. **Check Network tab** → Screenshot of failed requests
4. **Verify backend** → `curl http://localhost:5000/api/departments`

The logs will tell us exactly where the app is failing!

