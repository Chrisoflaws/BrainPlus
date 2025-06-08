import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoadingTimeout, isWebContainer } from '../utils/environment';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [showSlowConnectionWarning, setShowSlowConnectionWarning] = useState(false);

  const loadingTimeout = getLoadingTimeout();
  const isWebContainerEnv = isWebContainer();

  useEffect(() => {
    console.log('[LoadingScreen] Initializing with timeout:', loadingTimeout + 'ms');
    console.log('[LoadingScreen] WebContainer environment:', isWebContainerEnv);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stop at 90% to prevent completion before auth resolves
        }
        // Slower progress in WebContainer to account for longer loading times
        const increment = isWebContainerEnv ? Math.random() * 8 : Math.random() * 15;
        return Math.min(prev + increment, 90);
      });
    }, isWebContainerEnv ? 300 : 200);

    // Show slow connection warning after half the timeout
    const slowConnectionTimer = setTimeout(() => {
      setShowSlowConnectionWarning(true);
    }, loadingTimeout / 2);

    // Show timeout message after full timeout
    const timeoutTimer = setTimeout(() => {
      console.warn('[LoadingScreen] Timeout reached, showing timeout options');
      setShowTimeoutMessage(true);
      clearInterval(progressInterval);
    }, loadingTimeout);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slowConnectionTimer);
      clearTimeout(timeoutTimer);
    };
  }, [loadingTimeout, isWebContainerEnv]);

  const handleRetry = () => {
    console.log('[LoadingScreen] User requested retry');
    window.location.reload();
  };

  const handleContinueAsGuest = () => {
    console.log('[LoadingScreen] User chose to continue as guest');
    navigate('/home', { replace: true });
  };

  const handleGoToLogin = () => {
    console.log('[LoadingScreen] User chose to go to login');
    navigate('/login', { replace: true });
  };

  if (showTimeoutMessage) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <img 
              src="/images/second-brain-logo.png" 
              alt="Second Brain AI Logo"
              className="w-24 h-24 mx-auto mb-6 opacity-75"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-white">
            Connection Taking Longer Than Expected
          </h2>
          
          <p className="text-gray-400 mb-8">
            {isWebContainerEnv 
              ? "WebContainer environments can be slower to initialize. You can retry or continue browsing."
              : "The connection is taking longer than usual. Please try one of the options below."
            }
          </p>

          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
            >
              🔄 Retry Connection
            </button>
            
            <button
              onClick={handleGoToLogin}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              🔐 Go to Login
            </button>
            
            <button
              onClick={handleContinueAsGuest}
              className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
            >
              👤 Continue as Guest
            </button>
          </div>

          {isWebContainerEnv && (
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <p className="text-blue-300 text-sm">
                <strong>WebContainer Note:</strong> This environment may require additional time to initialize network connections.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="/images/second-brain-logo.png" 
            alt="Second Brain AI Logo"
            className="w-32 h-32 mx-auto animate-pulse"
          />
        </div>
        
        <div className="relative mb-4">
          <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-4">
          {showSlowConnectionWarning ? 'Still connecting...' : 'Loading Second Brain...'}
        </p>
        
        <p className="text-gray-500 text-xs mt-2">
          {Math.round(progress)}%
        </p>

        {showSlowConnectionWarning && (
          <div className="mt-4 space-y-2">
            <p className="text-yellow-400 text-xs">
              {isWebContainerEnv 
                ? "WebContainer initialization in progress..."
                : "Connection is slower than usual..."
              }
            </p>
            <button 
              onClick={handleContinueAsGuest} 
              className="text-blue-400 hover:text-blue-300 underline text-xs transition-colors"
            >
              Continue to site →
            </button>
          </div>
        )}

        {isWebContainerEnv && progress > 50 && (
          <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg max-w-xs mx-auto">
            <p className="text-gray-400 text-xs">
              WebContainer environments may take up to {Math.round(loadingTimeout / 1000)} seconds to initialize
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;