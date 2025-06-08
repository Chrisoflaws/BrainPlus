// Circuit Breaker Pattern for Auth Operations
class AuthCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private readonly threshold = 3;
  private readonly resetTimeout = 30000; // 30s cooldown
  private readonly halfOpenRetryDelay = 5000; // 5s delay for half-open state
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(requestFn: () => Promise<T>, fallbackFn?: () => T): Promise<T> {
    console.log(`[CircuitBreaker] Executing request in ${this.state} state (failures: ${this.failures})`);

    if (this.isOpen()) {
      const error = new Error('Auth service unavailable (circuit breaker open)');
      console.warn('[CircuitBreaker] Request blocked - circuit breaker is open');
      
      if (fallbackFn) {
        console.log('[CircuitBreaker] Using fallback function');
        return fallbackFn();
      }
      
      throw error;
    }

    if (this.isHalfOpen()) {
      console.log('[CircuitBreaker] Circuit breaker in half-open state, allowing single test request');
    }

    try {
      const result = await requestFn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      
      if (fallbackFn) {
        console.log('[CircuitBreaker] Request failed, using fallback function');
        return fallbackFn();
      }
      
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.state === 'OPEN') {
      // Check if we should transition to half-open
      if (Date.now() - this.lastFailure >= this.resetTimeout) {
        console.log('[CircuitBreaker] Transitioning from OPEN to HALF_OPEN');
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  private isHalfOpen(): boolean {
    return this.state === 'HALF_OPEN';
  }

  private onSuccess(): void {
    console.log('[CircuitBreaker] Request succeeded');
    this.reset();
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    
    console.log(`[CircuitBreaker] Request failed (${this.failures}/${this.threshold})`);

    if (this.failures >= this.threshold) {
      console.warn('[CircuitBreaker] Threshold reached - opening circuit breaker');
      this.state = 'OPEN';
    }
  }

  private reset(): void {
    console.log('[CircuitBreaker] Resetting circuit breaker');
    this.failures = 0;
    this.state = 'CLOSED';
  }

  // Public methods for monitoring
  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }

  getTimeUntilReset(): number {
    if (this.state === 'OPEN') {
      const timeElapsed = Date.now() - this.lastFailure;
      return Math.max(0, this.resetTimeout - timeElapsed);
    }
    return 0;
  }

  // Manual reset (for admin/debugging purposes)
  forceReset(): void {
    console.log('[CircuitBreaker] Manual reset triggered');
    this.reset();
  }

  // Get status for debugging/monitoring
  getStatus() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure,
      timeUntilReset: this.getTimeUntilReset(),
      threshold: this.threshold,
      resetTimeout: this.resetTimeout
    };
  }
}

// Create singleton instance
export const authCircuitBreaker = new AuthCircuitBreaker();

// Helper function for auth operations with circuit breaker
export const executeWithCircuitBreaker = async <T>(
  operation: () => Promise<T>,
  fallback?: () => T,
  operationName = 'auth operation'
): Promise<T> => {
  console.log(`[CircuitBreaker] Executing ${operationName}`);
  
  try {
    return await authCircuitBreaker.execute(operation, fallback);
  } catch (error) {
    console.error(`[CircuitBreaker] ${operationName} failed:`, error);
    throw error;
  }
};

// Monitoring utilities
export const getCircuitBreakerStatus = () => {
  return authCircuitBreaker.getStatus();
};

export const resetCircuitBreaker = () => {
  authCircuitBreaker.forceReset();
};