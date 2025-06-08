import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

// Remove loading screen after app mount
const removeLoadingScreen = () => {
  const loadingScreen = document.getElementById('initial-load');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease';
    setTimeout(() => loadingScreen.remove(), 300);
  }
};

// Clean up service workers and caches in development
const cleanupDevelopmentCache = async () => {
  if (import.meta.env.DEV && 'serviceWorker' in navigator) {
    try {
      console.log('[Dev] Cleaning up service workers and caches...');
      
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('[Dev] Unregistering service worker:', registration.scope);
        await registration.unregister();
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          console.log('[Dev] Deleting cache:', cacheName);
          await caches.delete(cacheName);
        }
      }
      
      console.log('[Dev] Development cache cleanup complete');
    } catch (error) {
      console.warn('[Dev] Error during cache cleanup:', error);
    }
  }
};

// Show update notification to user
const showUpdateNotification = () => {
  // Create a subtle notification that doesn't interrupt the user experience
  const notification = document.createElement('div');
  notification.id = 'pwa-update-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
      <div>
        <div style="font-weight: 600; margin-bottom: 4px;">Update Available</div>
        <div style="opacity: 0.9; font-size: 12px;">Refreshing to latest version...</div>
      </div>
    </div>
  `;
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
};

// Register service worker with automatic updates
const updateSW = registerSW({
  immediate: !import.meta.env.DEV, // Only immediate in production
  onNeedRefresh() {
    console.log('[PWA] New content available, updating automatically...');
    
    // Show user-friendly notification
    showUpdateNotification();
    
    // Automatically update after a short delay to allow notification to show
    setTimeout(() => {
      updateSW(true);
    }, 1500);
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline');
    
    // Optional: Show offline ready notification
    if (!import.meta.env.DEV) {
      const offlineNotification = document.createElement('div');
      offlineNotification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 13px;
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
      `;
      offlineNotification.textContent = '✓ App ready for offline use';
      
      const offlineStyle = document.createElement('style');
      offlineStyle.textContent = `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(offlineStyle);
      
      document.body.appendChild(offlineNotification);
      
      setTimeout(() => {
        if (offlineNotification.parentNode) {
          offlineNotification.style.animation = 'slideUp 0.3s ease-out reverse';
          setTimeout(() => {
            if (offlineNotification.parentNode) {
              offlineNotification.remove();
            }
          }, 300);
        }
      }, 4000);
    }
  },
  onRegisteredSW(swUrl, r) {
    if (!import.meta.env.DEV) {
      console.log('[PWA] SW registered:', swUrl);
      
      // Set up periodic update checks (every 60 seconds)
      if (r) {
        setInterval(() => {
          console.log('[PWA] Checking for updates...');
          r.update();
        }, 60000);
        
        // Listen for controlling service worker changes
        r.addEventListener('controlling', () => {
          console.log('[PWA] New service worker is now controlling the page');
          window.location.reload();
        });
      }
    }
  },
  onRegisterError(error) {
    console.error('[PWA] SW registration error:', error);
  }
});

// Main app wrapper with cleanup
const AppWrapper = () => {
  useEffect(() => {
    cleanupDevelopmentCache();
    
    // Listen for service worker updates
    if ('serviceWorker' in navigator && !import.meta.env.DEV) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service worker controller changed - reloading page');
        window.location.reload();
      });
      
      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[PWA] Received message from service worker:', event.data);
        
        if (event.data && event.data.type === 'SKIP_WAITING') {
          console.log('[PWA] Service worker skip waiting message received');
          window.location.reload();
        }
      });
    }
  }, []);

  return <App />;
};

// Render app
root.render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);

// Remove loading screen after everything is ready
removeLoadingScreen();