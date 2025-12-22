# Backend Configuration - Permanent Solution

## Problem Solved
The application was experiencing intermittent "Failed to load players" errors because the backend URL configuration was not reliably available across all environments.

## Solution Implemented

### 1. Centralized Configuration (`frontend/src/config.js`)
Created a single source of truth for all API endpoints with intelligent environment detection:

```javascript
const getBackendUrl = () => {
  // Priority order:
  // 1. Environment variable from Vercel (REACT_APP_BACKEND_URL)
  // 2. Production backend URL (Render)
  // 3. Local development fallback
  
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://ipl-dashboard-1-ff0d.onrender.com';
  }
  
  return ''; // Local development uses proxy
};
```

### 2. Production Environment File (`.env.production`)
Added backup configuration that gets bundled with production builds:
```
REACT_APP_BACKEND_URL=https://ipl-dashboard-1-ff0d.onrender.com
```

### 3. Updated All Components
All API-consuming components now import from the centralized config:
- `PlayerList.js`
- `PlayerPage.js`
- `TeamList.js`
- `TeamPage.js`
- `SearchResultsPage.js`
- `HeadToHeadPage.js`

## How It Works

### Development Environment
- Uses `proxy` setting in `package.json` (http://localhost:8080)
- No hardcoded URLs needed

### Production Environment (Vercel)
The configuration works with **three layers of fallback**:

1. **Vercel Environment Variable** (if set in dashboard)
   - Variable name: `REACT_APP_BACKEND_URL`
   - Value: `https://ipl-dashboard-1-ff0d.onrender.com`

2. **Build-time Environment File** (`.env.production`)
   - Automatically bundled during `npm run build`
   - Ensures backend URL is always available

3. **Runtime Detection** (`config.js`)
   - Checks `NODE_ENV === 'production'`
   - Returns hardcoded Render URL as last resort

## Benefits

✅ **Reliable**: Works even if Vercel environment variables are not set  
✅ **Maintainable**: Single file to update if backend URL changes  
✅ **Flexible**: Supports multiple environments automatically  
✅ **Type-safe**: Centralized endpoints prevent typos  
✅ **No Cache Issues**: Configuration is determined at build time

## Testing

### Local Development
```bash
cd frontend
npm start
# Should proxy to http://localhost:8080
```

### Production Build
```bash
cd frontend
npm run build
# Check build output - should include backend URL
```

### Verify Configuration
Open browser console on deployed site:
```javascript
// In browser console on https://ipl-dash-board-tau.vercel.app
fetch('/static/js/main.*.js')
  .then(r => r.text())
  .then(t => console.log(t.includes('ipl-dashboard-1-ff0d.onrender.com') ? 'Backend URL configured ✓' : 'Backend URL missing ✗'))
```

## Updating Backend URL

If backend URL changes, update **one file**:

```javascript
// frontend/src/config.js
if (process.env.NODE_ENV === 'production') {
  return 'https://NEW-BACKEND-URL.com'; // <-- Change here
}
```

Also update `.env.production`:
```
REACT_APP_BACKEND_URL=https://NEW-BACKEND-URL.com
```

## Troubleshooting

### Still seeing CORS errors?
1. Check backend CORS configuration in `backend/src/main/java/com/ipl/ipl_dashboard/config/CorsConfig.java`
2. Ensure Vercel URL is in allowed origins
3. Clear browser cache (Ctrl+Shift+R)

### Backend URL not working?
1. Check if Render service is running
2. Test backend directly: `curl https://ipl-dashboard-1-ff0d.onrender.com/api/v1/players`
3. Check Render logs for errors

### Environment variable not picked up?
1. Redeploy on Vercel (Deployments → Redeploy)
2. Check Vercel environment variables in project settings
3. Ensure variable name is exactly `REACT_APP_BACKEND_URL` (case-sensitive)

## Files Modified

- ✅ `frontend/src/config.js` (NEW - centralized configuration)
- ✅ `frontend/.env.production` (NEW - production backup)
- ✅ `frontend/src/components/PlayerList.js`
- ✅ `frontend/src/components/PlayerPage.js`
- ✅ `frontend/src/components/TeamList.js`
- ✅ `frontend/src/components/TeamPage.js`
- ✅ `frontend/src/components/SearchResultsPage.js`
- ✅ `frontend/src/components/HeadToHeadPage.js`

## Deployment Status

- **Frontend**: https://ipl-dash-board-tau.vercel.app
- **Backend**: https://ipl-dashboard-1-ff0d.onrender.com
- **Status**: ✅ Permanently configured with triple-fallback system
