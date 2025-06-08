import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { isPWA } from '../utils/pwa';
import { isWebContainer, getAuthTimeout, shouldUseCachedSession } from '../utils/environment';
import { executeWithCircuitBreaker, getCircuitBreakerStatus } from '../utils/authCircuitBreaker';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-auth-token',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false // Disable auto session detection
  }
});

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  circuitBreakerStatus?: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<any>(null);
  const navigate = useNavigate();
  const [isPWAMode] = useState(isPWA());

  const clearAuthState = () => {
    console.log('[Auth] Clearing auth state');
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  // Enhanced cached session check with validation
  const getCachedSession = () => {
    try {
      const cachedSession = localStorage.getItem('sb-auth-token');
      if (cachedSession) {
        const parsed = JSON.parse(cachedSession);
        if (parsed && parsed.access_token && parsed.expires_at) {
          const expiresAt = new Date(parsed.expires_at * 1000);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();
          
          // Only use cached session if it has more than 5 minutes left
          if (timeUntilExpiry > 5 * 60 * 1000) {
            console.log('[Auth] Found valid cached session, expires in:', Math.round(timeUntilExpiry / 1000 / 60), 'minutes');
            return parsed;
          } else {
            console.log('[Auth] Cached session expires soon, removing');
            localStorage.removeItem('sb-auth-token');
          }
        }
      }
    } catch (error) {
      console.warn('[Auth] Error reading cached session:', error);
      localStorage.removeItem('sb-auth-token'); // Clean up corrupted cache
    }
    return null;
  };

  // Cache session for WebContainer environments
  const cacheSession = (session: any) => {
    if (shouldUseCachedSession() && session) {
      try {
        localStorage.setItem('sb-auth-token', JSON.stringify(session));
        console.log('[Auth] Session cached for WebContainer');
      } catch (error) {
        console.warn('[Auth] Failed to cache session:', error);
      }
    }
  };

  // Initialize authentication with circuit breaker protection
  const initializeAuth = async () => {
    const timeout = getAuthTimeout();
    console.log('[Auth] Initializing with timeout:', timeout + 'ms');
    
    // First check for cached session in WebContainer
    if (shouldUseCachedSession()) {
      const cachedSession = getCachedSession();
      if (cachedSession) {
        try {
          // Validate cached session with circuit breaker
          const cachedUser = await executeWithCircuitBreaker(
            () => supabase.auth.getUser(cachedSession.access_token),
            () => null, // Fallback to null if circuit breaker is open
            'cached session validation'
          );
          
          if (cachedUser?.data?.user && !cachedUser.error) {
            console.log('[Auth] Cached session validated successfully');
            return cachedSession;
          } else {
            console.log('[Auth] Cached session invalid, removing');
            localStorage.removeItem('sb-auth-token');
          }
        } catch (error) {
          console.warn('[Auth] Cached session validation failed:', error);
          localStorage.removeItem('sb-auth-token');
        }
      }
    }

    // Network request with circuit breaker protection
    try {
      const sessionResult = await executeWithCircuitBreaker(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log('[Auth] Aborting session request due to timeout');
            controller.abort();
          }, timeout);

          const sessionPromise = supabase.auth.getSession();
          
          // Race between the actual request and timeout
          const result = await Promise.race([
            sessionPromise,
            new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Session request timeout')), timeout - 100);
            })
          ]) as any;

          clearTimeout(timeoutId);
          return result;
        },
        () => null, // Fallback to null if circuit breaker is open
        'session retrieval'
      );
      
      if (sessionResult?.data?.session) {
        console.log('[Auth] Session retrieved successfully');
        cacheSession(sessionResult.data.session); // Cache for future use
        return sessionResult.data.session;
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('[Auth] Session request aborted');
        } else if (error.message.includes('timeout')) {
          console.warn('[Auth] Session request timed out');
        } else if (error.message.includes('circuit breaker')) {
          console.warn('[Auth] Circuit breaker prevented request');
        } else {
          console.warn('[Auth] Session request failed:', error.message);
        }
      }
      return null; // Graceful fallback
    }
  };

  const handleAuthChange = async (session: any) => {
    try {
      console.log('[Auth] Handling auth change, session exists:', !!session);
      
      if (!session?.user || !session?.access_token) {
        console.log('[Auth] No valid session, clearing state');
        clearAuthState();
        return;
      }

      console.log('[Auth] Getting current user...');
      
      // Use circuit breaker for user validation
      const userResult = await executeWithCircuitBreaker(
        () => supabase.auth.getUser(session.access_token),
        () => ({ data: { user: null }, error: new Error('Circuit breaker fallback') }),
        'user validation'
      );
      
      if (userResult.error || !userResult.data?.user) {
        console.error('[Auth] User error:', userResult.error);
        if (userResult.error?.message.includes('session_not_found')) {
          await supabase.auth.signOut();
        }
        clearAuthState();
        return;
      }

      console.log('[Auth] User authenticated successfully:', userResult.data.user.id);
      setUser(userResult.data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Cache the session for WebContainer
      cacheSession(session);
      
    } catch (error) {
      console.error('[Auth] Error in handleAuthChange:', error);
      clearAuthState();
    }
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        console.log('[Auth] Initializing authentication...');
        console.log('[Auth] Environment - WebContainer:', isWebContainer());
        
        const authTimeout = getAuthTimeout();
        console.log('[Auth] Using timeout:', authTimeout + 'ms');
        
        // Update circuit breaker status
        setCircuitBreakerStatus(getCircuitBreakerStatus());
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn(`[Auth] Initialization timeout after ${authTimeout}ms, clearing loading state`);
            setIsLoading(false);
            setIsAuthenticated(false);
            setUser(null);
          }
        }, authTimeout);

        const session = await initializeAuth();
        
        if (!mounted) {
          console.log('[Auth] Component unmounted, aborting init');
          return;
        }
        
        await handleAuthChange(session);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('[Auth] Init error:', error);
        if (mounted) {
          console.log('[Auth] Setting loading to false due to error');
          clearAuthState();
        }
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    initAuth();

    console.log('[Auth] Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('[Auth] State change event:', event);
        // Update circuit breaker status on auth state changes
        setCircuitBreakerStatus(getCircuitBreakerStatus());
        await handleAuthChange(session);
      }
    });

    return () => {
      console.log('[Auth] Cleaning up auth provider');
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [isPWAMode]);

  const login = async (token: string) => {
    try {
      console.log('[Auth] Logging in with token...');
      setIsLoading(true);
      
      // Use circuit breaker for login validation
      const userResult = await executeWithCircuitBreaker(
        () => supabase.auth.getUser(token),
        () => ({ data: { user: null }, error: new Error('Circuit breaker prevented login') }),
        'login validation'
      );
      
      if (userResult.error || !userResult.data?.user) {
        throw new Error('Invalid token or circuit breaker active');
      }

      console.log('[Auth] Login successful, setting user state');
      setUser(userResult.data.user);
      setIsAuthenticated(true);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('[Auth] Login error:', error);
      clearAuthState();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('[Auth] Logging out...');
    setIsLoading(true);
    try {
      // Use circuit breaker for logout
      await executeWithCircuitBreaker(
        () => supabase.auth.signOut(),
        () => Promise.resolve(), // Fallback to silent success
        'logout'
      );
      
      // Clear cached session
      localStorage.removeItem('sb-auth-token');
      clearAuthState();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Clear cached session even on error
      localStorage.removeItem('sb-auth-token');
      clearAuthState();
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      login, 
      logout, 
      circuitBreakerStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};