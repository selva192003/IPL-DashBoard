# 🔧 FIX: Wrong Backend URL on Vercel

## Problem
Your application is trying to reach `ipl-backend-latest.onrender.com` which doesn't exist, causing a **net::ERR_FAILED** error.

The correct backend URL should be: **`https://ipl-dashboard-1-ff0d.onrender.com`**

## Solution

### Step 1: Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Look for your project: **ipl-dash-board-tau**
3. Click on it to open

### Step 2: Update Environment Variable
1. Click on **Settings** (top navigation)
2. Go to **Environment Variables** (left sidebar)
3. Look for `REACT_APP_BACKEND_URL`
4. Click the three dots (...) next to it
5. Click **Edit**

### Step 3: Correct the URL
**Replace:**
```
ipl-backend-latest.onrender.com/api/v1/players
```

**With:**
```
https://ipl-dashboard-1-ff0d.onrender.com
```

### Step 4: Save and Redeploy
1. Click **Save** 
2. Go to **Deployments** tab
3. Find the latest failed deployment
4. Click **Redeploy** button
5. Wait 2-3 minutes for rebuild to complete

### Step 5: Verify
1. Once deployment is done, go to https://ipl-dash-board-tau.vercel.app/players
2. Hard refresh browser: **Ctrl+Shift+R**
3. Players list should now load without errors

## Why This Error Happened

The environment variable `REACT_APP_BACKEND_URL` was manually set in Vercel with an incorrect URL. Even though we created:
- ✅ `frontend/src/config.js` with correct fallback
- ✅ `frontend/.env.production` with correct URL

The **Vercel environment variable takes priority** and was pointing to the wrong service.

## Double-Check

After fixing, verify the configuration by:

1. **Check Vercel Settings:**
   - Project Settings → Environment Variables
   - Confirm `REACT_APP_BACKEND_URL = https://ipl-dashboard-1-ff0d.onrender.com`

2. **Check Backend is Running:**
   ```bash
   curl https://ipl-dashboard-1-ff0d.onrender.com/api/v1/players
   ```
   Should return player data (not 401 or 404)

3. **Check Frontend Build Log:**
   - Vercel → Deployments → Click latest deployment → View Build Logs
   - Should see `REACT_APP_BACKEND_URL=https://ipl-dashboard-1-ff0d.onrender.com`

## Summary of URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://ipl-dash-board-tau.vercel.app |
| **Backend (API)** | https://ipl-dashboard-1-ff0d.onrender.com |
| **Vercel Env Var** | `REACT_APP_BACKEND_URL` |
| **Vercel Env Value** | `https://ipl-dashboard-1-ff0d.onrender.com` |

After completing these steps, the "Failed to load resource" error will be permanently fixed! ✅
