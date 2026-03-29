# Testing Cache Implementation

## Server Running
Server is running at: http://localhost:8080

## How to Test Caching

### First Visit (Fresh Load)
1. Open http://localhost:8080 in your browser
2. Open DevTools (F12) → Network tab
3. Check "Disable cache" is OFF
4. Refresh the page (Cmd+R / Ctrl+R)
5. You should see all 250 frames loading from server
6. Wait for all frames to load

### Second Visit (Cached Load)
1. Keep DevTools → Network tab open
2. Refresh the page again (Cmd+R / Ctrl+R)
3. Look at the "Size" column in Network tab
4. Frames should show "(ServiceWorker)" or "(from ServiceWorker)" or "0 B"
5. Load should be instant - no waiting

### Verify Service Worker
1. Open DevTools → Application tab
2. Click "Service Workers" in left sidebar
3. Should show service worker as "activated and running"
4. Click "Cache Storage" in left sidebar
5. Should see two caches:
   - `hermanos-frames-v1` (contains all frame images)
   - `hermanos-barber-v1` (contains static assets)

### Clear Cache (For Testing)
1. DevTools → Application → Clear storage
2. Click "Clear site data" button
3. Or use hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Service workers require HTTPS or localhost
- Make sure you're accessing via http://localhost:8080 (not file://)

### Frames Still Loading from Network
- Wait for first complete load (all 250 frames)
- Service worker caches frames as they load
- Second refresh should use cache

### Cache Not Working
- Check if "Disable cache" is checked in DevTools (uncheck it)
- Verify service worker is active in Application tab
- Try closing all tabs and reopening

## Expected Behavior

### First Load
- Loading indicator shows "Chargement 0%" → "Chargement 100%"
- Takes time to load all 250 frames
- Service worker caches each frame as it loads

### Subsequent Loads
- Loading indicator briefly shows then disappears
- Frames load instantly from cache
- No network requests for frames
- Page is interactive immediately

## Notes
- Console logs have been removed for production
- Service worker works offline after first load
- Cache persists across browser sessions
- Updating frames requires incrementing cache version in service-worker.js
