import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Performance Monitor Component
 * Tracks and logs performance metrics for mobile web
 */
export function PerformanceMonitor() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Report Web Vitals
    const reportWebVitals = () => {
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              console.log('FID:', entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                console.log('CLS:', clsValue);
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance monitoring not fully supported:', error);
        }
      }

      // Navigation Timing
      if ('performance' in window && 'timing' in window.performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            const renderTime = timing.domComplete - timing.domLoading;

            console.log('Performance Metrics:', {
              loadTime: `${loadTime}ms`,
              domReadyTime: `${domReadyTime}ms`,
              renderTime: `${renderTime}ms`,
            });
          }, 0);
        });
      }
    };

    // Memory monitoring (if available)
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
          totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
          limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
        });
      }
    };

    // Network Information API
    const monitorNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        console.log('Network Info:', {
          effectiveType: connection.effectiveType,
          downlink: `${connection.downlink}Mbps`,
          rtt: `${connection.rtt}ms`,
          saveData: connection.saveData,
        });

        // Listen for network changes
        connection.addEventListener('change', () => {
          console.log('Network changed:', connection.effectiveType);
        });
      }
    };

    // Battery Status API
    const monitorBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          console.log('Battery Status:', {
            level: `${(battery.level * 100).toFixed(0)}%`,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          });
        } catch (error) {
          console.warn('Battery status not available');
        }
      }
    };

    // Device Memory
    if ('deviceMemory' in navigator) {
      console.log('Device Memory:', `${(navigator as any).deviceMemory}GB`);
    }

    // Hardware Concurrency (CPU cores)
    if ('hardwareConcurrency' in navigator) {
      console.log('CPU Cores:', navigator.hardwareConcurrency);
    }

    // Initialize monitoring
    reportWebVitals();
    monitorMemory();
    monitorNetwork();
    monitorBattery();

    // Periodic memory monitoring (every 30 seconds)
    const memoryInterval = setInterval(monitorMemory, 30000);

    // Cleanup
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null;
}

/**
 * Image Lazy Loading Hook
 * Implements intersection observer for lazy loading images
 */
export function useLazyImage(imageRef: React.RefObject<HTMLImageElement>) {
  useEffect(() => {
    if (Platform.OS !== 'web' || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [imageRef]);
}
