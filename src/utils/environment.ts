// Environment detection utility
export const isWebContainer = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for StackBlitz/WebContainer indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname;
  
  const webContainerIndicators = [
    'stackblitz',
    'webcontainer',
    'local-credentialless',
    'bolt.new'
  ];
  
  const isWebContainerEnv = webContainerIndicators.some(indicator => 
    userAgent.includes(indicator) || hostname.includes(indicator)
  );
  
  console.log('[Environment] Detection:', {
    userAgent,
    hostname,
    isWebContainer: isWebContainerEnv
  });
  
  return isWebContainerEnv;
};

// Get appropriate timeout based on environment
export const getAuthTimeout = () => {
  const baseTimeout = 3000; // 3 seconds for normal environments
  const webContainerTimeout = 15000; // 15 seconds for WebContainer
  
  return isWebContainer() ? webContainerTimeout : baseTimeout;
};

// Get appropriate loading screen timeout (should be longer than auth timeout)
export const getLoadingTimeout = () => {
  const authTimeout = getAuthTimeout();
  return authTimeout + 5000; // Add 5 seconds buffer
};

// Check if we should use cached session first
export const shouldUseCachedSession = () => {
  return isWebContainer(); // Use cached session in WebContainer for faster loading
};