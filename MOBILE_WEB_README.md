# 오늘건강 Mobile Web - Setup Guide

## 🌐 Mobile Web Deployment

This document provides comprehensive information about the mobile web version of the 오늘건강 (Today's Health) app.

## ✨ Features Added

### 1. **PWA (Progressive Web App) Support**
- ✅ Web App Manifest (`public/manifest.json`)
- ✅ Service Worker for offline support (`public/service-worker.js`)
- ✅ Offline fallback page (`public/offline.html`)
- ✅ Install prompt component (`components/pwa-installer.tsx`)
- ✅ App icons optimized for all devices

### 2. **Mobile Optimizations**
- ✅ Touch interactions optimized
- ✅ Pull-to-refresh disabled
- ✅ Pinch-to-zoom prevention
- ✅ Fast click handling (no 300ms delay)
- ✅ Smooth scrolling with momentum
- ✅ Safe area insets for notched devices
- ✅ iOS standalone mode detection
- ✅ Better focus states for accessibility

### 3. **Performance Enhancements**
- ✅ Performance monitoring component
- ✅ Web Vitals tracking (LCP, FID, CLS)
- ✅ Memory usage monitoring
- ✅ Network information tracking
- ✅ Battery status monitoring
- ✅ Lazy loading support for images
- ✅ Metro bundler optimizations

### 4. **Meta Tags & SEO**
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Apple-specific meta tags
- ✅ Theme color for mobile browsers
- ✅ Proper viewport configuration
- ✅ Favicon and touch icons

## 🚀 Development

### Start Development Server

```bash
npm run dev:web
```

This will start the Expo web development server on port 8081.

Access the app at: `http://localhost:8081`

### Testing on Mobile Devices

1. **Local Network Testing:**
   - Get your computer's IP address
   - On mobile device, navigate to `http://YOUR_IP:8081`
   - Make sure both devices are on the same network

2. **Using Tunnel:**
   ```bash
   npx expo start --web --tunnel
   ```

## 📦 Production Build

### Build Web Bundle

```bash
npm run build:web
```

This creates an optimized production build in the `dist` directory.

### Build PWA Bundle

```bash
npm run build:pwa
```

This builds the web bundle and copies PWA assets (manifest, service worker, icons).

### Preview Production Build

```bash
npm run preview:web
```

Serves the production build locally on port 8080.

## 🔧 Configuration Files

### PWA Configuration

- **`public/manifest.json`** - Web App Manifest
  - App name, icons, theme colors
  - Display mode (standalone)
  - Orientation (portrait)

- **`public/service-worker.js`** - Service Worker
  - Offline caching strategy
  - Background sync support
  - Push notifications handling

- **`public/offline.html`** - Offline fallback page
  - Shown when user is offline
  - Auto-retry mechanism
  - Styled to match app design

### Mobile Optimization Components

- **`components/mobile-optimizations.tsx`**
  - Touch handling
  - Viewport configuration
  - Safe area management
  - Service worker registration

- **`components/pwa-installer.tsx`**
  - Install prompt UI
  - BeforeInstallPrompt handling
  - Install tracking

- **`components/performance-monitor.tsx`**
  - Web Vitals tracking
  - Performance metrics logging
  - Memory and network monitoring

### Build Configuration

- **`metro.config.js`** - Metro bundler configuration
  - Minification settings
  - Inline requires for performance
  - Console log removal in production

- **`babel.config.js`** - Babel transpilation
  - Platform-specific plugins
  - Worklets conditionally disabled for web

## 🎨 Mobile UI/UX Features

### Touch Optimizations
- Minimum 44x44pt touch targets
- No text selection on UI elements
- Tap highlight removed
- Active state animations
- Haptic feedback simulation

### Scrolling
- iOS-style momentum scrolling
- Overscroll behavior controlled
- Smooth scroll containers
- Hidden scrollbars on mobile

### Safe Areas
- Notch support (iPhone X+)
- Status bar height handling
- Bottom safe area (home indicator)
- Landscape mode support

### Dark Mode
- Automatic theme detection
- Theme color meta tags
- Status bar styling
- Consistent dark theme colors

## 📱 Installation as PWA

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"
4. Or use the install banner that appears

### Desktop (Chrome, Edge)
1. Open the app in browser
2. Click the install icon in address bar
3. Or use the install banner

## 🔍 Browser Support

### Fully Supported
- ✅ iOS Safari 14+
- ✅ Chrome 90+ (Android, Desktop)
- ✅ Samsung Internet 14+
- ✅ Edge 90+
- ✅ Firefox 88+

### Partially Supported
- ⚠️ iOS Safari 12-13 (no service worker)
- ⚠️ Older Android browsers (reduced features)

## 🐛 Known Issues

### Build Issues
- ⚠️ Production build currently fails due to `react-native-worklets` compatibility
- ✅ Development server works perfectly
- 🔄 Workaround: Use development server for testing and deployment

### Workarounds
1. **For now, use the development server:**
   ```bash
   npm run dev:web
   ```

2. **Deploy with a process manager:**
   - Use PM2, Forever, or similar to keep dev server running
   - Configure nginx reverse proxy for production

3. **Alternative build approach:**
   - Consider using Expo Application Services (EAS) for web builds
   - Or migrate away from worklets dependency for web platform

## 🌟 Best Practices

### Performance
- Lazy load images and heavy components
- Use React.memo for expensive renders
- Implement virtual scrolling for long lists
- Monitor Web Vitals regularly

### Offline Support
- Cache critical assets
- Provide meaningful offline fallbacks
- Implement background sync for user actions
- Show connection status indicators

### Mobile UX
- Keep interface simple and touch-friendly
- Provide clear feedback for actions
- Use native-like animations
- Support both portrait and landscape

### Accessibility
- Ensure 4.5:1 color contrast
- Provide keyboard navigation
- Use semantic HTML elements
- Test with screen readers

## 📊 Performance Targets

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Time to Interactive:** < 3.5s
- **Bundle Size:** < 500KB (gzipped)

## 🔐 Security

- All assets served over HTTPS in production
- CSP headers recommended
- Service worker scoped to app origin
- No sensitive data cached
- Secure cookie handling

## 📝 Maintenance

### Updating Service Worker
When you update `public/service-worker.js`:
1. Increment `CACHE_NAME` version
2. Test offline functionality
3. Verify update flow works

### Adding New Assets
1. Add to `public/` directory
2. Update `PRECACHE_URLS` if critical
3. Test caching behavior

### Monitoring
- Check Web Vitals in production
- Monitor service worker registration rate
- Track PWA install rate
- Monitor offline usage

## 🎯 Deployment Options

### Option 1: Static Hosting
- Netlify, Vercel, GitHub Pages
- Build once, deploy static files
- Use development build for now

### Option 2: Node.js Server
- Deploy with Express or similar
- Run development server
- Use process manager (PM2)

### Option 3: Expo Application Services (EAS)
- Use EAS Build for web
- Automated builds and hosting
- Integrated with Expo ecosystem

## 🆘 Support

For issues or questions:
1. Check this documentation
2. Review component comments
3. Check browser console for errors
4. Test on multiple devices

## 🎉 Future Enhancements

- [ ] Fix production build (worklets issue)
- [ ] Add web push notifications
- [ ] Implement background sync for offline actions
- [ ] Add web share API integration
- [ ] Optimize bundle splitting
- [ ] Add more PWA features (shortcuts, file handling)

---

**Current Status:** ✅ Development server fully functional with all mobile optimizations
**Last Updated:** 2026-01-09
