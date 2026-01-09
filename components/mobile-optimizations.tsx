import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Mobile Web Optimizations Component
 * Adds various mobile-specific optimizations for better UX
 */
export function MobileOptimizations() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Prevent pull-to-refresh on iOS/Chrome
    const preventPullToRefresh = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        // Only prevent if at the top
        const touch = e.touches[0];
        if (touch && touch.clientY > 0) {
          e.preventDefault();
        }
      }
    };

    // Prevent pinch-to-zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add fast click handling (remove 300ms delay)
    const addFastClick = () => {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      
      // Replace existing viewport meta or add new one
      const existingMeta = document.querySelector('meta[name="viewport"]');
      if (existingMeta) {
        existingMeta.setAttribute('content', meta.content);
      } else {
        document.head.appendChild(meta);
      }
    };

    // Disable text selection on UI elements (for better native feel)
    const addTextSelectionStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        /* Prevent text selection on buttons and interactive elements */
        button, .touchable, [role="button"], [role="tab"] {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Smooth scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Disable text size adjust on orientation change */
        html {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        /* Improve touch targets */
        a, button, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Better scrollbar on mobile */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        /* Safe area handling for notched devices */
        body {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
        
        /* iOS style momentum scrolling */
        .scroll-container {
          -webkit-overflow-scrolling: touch;
          overflow-y: auto;
        }
        
        /* Prevent iOS Safari bounce effect */
        body {
          overscroll-behavior-y: none;
        }
        
        /* Better focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid #4A90D9;
          outline-offset: 2px;
        }
        
        /* Haptic feedback simulation */
        @media (prefers-reduced-motion: no-preference) {
          button:active, .touchable:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Add iOS standalone mode detection and styling
    const addStandaloneModeStyles = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      
      if (isStandalone) {
        document.body.classList.add('standalone-mode');
        
        const style = document.createElement('style');
        style.textContent = `
          .standalone-mode {
            /* Add status bar height for iOS */
            padding-top: max(env(safe-area-inset-top), 20px);
          }
        `;
        document.head.appendChild(style);
      }
    };

    // Register service worker for PWA
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, show update prompt
                  console.log('New content available! Please refresh.');
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Add theme color meta tag
    const addThemeColor = () => {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#4A90D9';
      
      // Support for dark mode
      const metaDark = document.createElement('meta');
      metaDark.name = 'theme-color';
      metaDark.media = '(prefers-color-scheme: dark)';
      metaDark.content = '#1C1C1E';
      
      document.head.appendChild(meta);
      document.head.appendChild(metaDark);
    };

    // Add Apple-specific meta tags
    const addAppleMeta = () => {
      // Web app capable
      const capable = document.createElement('meta');
      capable.name = 'apple-mobile-web-app-capable';
      capable.content = 'yes';
      
      // Status bar style
      const statusBar = document.createElement('meta');
      statusBar.name = 'apple-mobile-web-app-status-bar-style';
      statusBar.content = 'black-translucent';
      
      // App title
      const title = document.createElement('meta');
      title.name = 'apple-mobile-web-app-title';
      title.content = '오늘건강';
      
      document.head.appendChild(capable);
      document.head.appendChild(statusBar);
      document.head.appendChild(title);
    };

    // Initialize all optimizations
    addFastClick();
    addTextSelectionStyles();
    addStandaloneModeStyles();
    addThemeColor();
    addAppleMeta();
    registerServiceWorker();

    // Add event listeners
    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    document.addEventListener('touchmove', preventPinchZoom, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchmove', preventPinchZoom);
    };
  }, []);

  return null;
}
