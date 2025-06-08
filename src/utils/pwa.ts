// PWA detection utility
export const isPWA = () => {
  if (typeof window === 'undefined') {
    console.log('[PWA] Running in SSR context');
    return false;
  }
  
  const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const displayModeFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  
  const isPWAMode = displayModeStandalone || displayModeFullscreen || iosStandalone;

  console.group('[PWA] Mode Detection');
  console.log('User Agent:', window.navigator.userAgent);
  console.log('Platform:', window.navigator.platform);
  console.log('Standalone mode:', displayModeStandalone);
  console.log('Fullscreen mode:', displayModeFullscreen);
  console.log('iOS standalone:', iosStandalone);
  console.log('Final PWA mode:', isPWAMode);
  console.log('Service Worker:', 'serviceWorker' in navigator ? 'Supported' : 'Not supported');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(registration => {
      console.log('Service Worker Registration:', registration ? {
        scope: registration.scope,
        active: !!registration.active,
        waiting: !!registration.waiting,
        installing: !!registration.installing
      } : 'None');
    });
  }
  console.groupEnd();

  return isPWAMode;
};

// Subscribe to PWA display mode changes
export const onPWADisplayModeChange = (callback: (isPWA: boolean) => void) => {
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  const fullscreenQuery = window.matchMedia('(display-mode: fullscreen)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handler);
  fullscreenQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
    fullscreenQuery.removeEventListener('change', handler);
  };
};

// PWA cache management
export const clearPWACache = async () => {
  if ('caches' in window) {
    try {
      const cacheKeys = await caches.keys();
      console.group('[PWA] Cache Clearing');
      console.log('Found caches:', cacheKeys);
      
      const results = await Promise.all(
        cacheKeys.map(async key => {
          try {
            const result = await caches.delete(key);
            console.log(`Cleared cache '${key}':`, result);
            return { key, success: result };
          } catch (error) {
            console.error(`Error clearing cache '${key}':`, error);
            return { key, success: false, error };
          }
        })
      );
      
      console.log('Cache clearing results:', results);
      console.groupEnd();
      return results.every(r => r.success);
    } catch (error) {
      console.error('[PWA] Error clearing cache:', error);
      return false;
    }
  }
  return false;
};

// Force service worker update
export const forceServiceWorkerUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('[PWA] Forcing service worker update');
        await registration.update();
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        return true;
      }
    } catch (error) {
      console.error('[PWA] Error forcing service worker update:', error);
    }
  }
  return false;
};

// Monitor service worker lifecycle
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.group('[PWA] Service Worker Message');
    console.log('Type:', event.data.type);
    console.log('Data:', event.data);
    console.groupEnd();
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] Service Worker controller changed - reloading page');
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener('error', (error) => {
    console.error('[PWA] Service Worker error:', error);
  });
}