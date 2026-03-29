# Caching Implementation

## Overview
The site now implements multi-layer caching to ensure frames load instantly on subsequent visits.

## Caching Layers

### 1. Service Worker Cache (Browser)
- **File**: `service-worker.js`
- **What it caches**: All 250 animation frames (both desktop and mobile)
- **Cache duration**: Persistent until cache is cleared or service worker is updated
- **Benefits**: Works offline, instant loading on repeat visits

### 2. HTTP Cache Headers (Server)
- **Files**: `.htaccess` (Apache), `_headers` (Netlify/Vercel)
- **What it caches**: Images, CSS, JS files
- **Cache duration**: 1 year (immutable)
- **Benefits**: Browser automatically caches files, reduces server requests

## How It Works

### First Visit
1. User loads page
2. Service worker registers in background
3. Frames load sequentially (1-250)
4. Service worker caches each frame as it loads
5. Browser HTTP cache also stores frames

### Second Visit (Refresh)
1. Service worker intercepts frame requests
2. Returns cached frames instantly (no network request)
3. Page loads immediately with all frames ready

## Testing Cache

### Check if Service Worker is Active
Open DevTools → Application → Service Workers
- Should show "activated and running"

### Check Cached Frames
Open DevTools → Application → Cache Storage
- `hermanos-frames-v1`: Contains all frame images
- `hermanos-barber-v1`: Contains static assets

### Force Refresh (Clear Cache)
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or: DevTools → Application → Clear storage → Clear site data

## Deployment Notes

### Apache Servers
- `.htaccess` file sets cache headers automatically
- Requires `mod_headers` and `mod_expires` modules enabled

### Netlify/Vercel
- `_headers` file sets cache headers automatically
- No additional configuration needed

### Other Servers (Nginx, etc.)
Add these headers to your server config:

```nginx
location ~* \.(webp|jpg|jpeg|png|gif|svg)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.(css|js)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## Updating Frames

If you update frame images:
1. Increment version in `service-worker.js`:
   ```javascript
   const FRAME_CACHE_NAME = 'hermanos-frames-v2'; // Change v1 to v2
   ```
2. Deploy changes
3. Users will automatically get new frames on next visit

## Browser Support

Service Workers are supported in:
- Chrome 40+
- Firefox 44+
- Safari 11.1+
- Edge 17+

For older browsers, HTTP caching still works.
