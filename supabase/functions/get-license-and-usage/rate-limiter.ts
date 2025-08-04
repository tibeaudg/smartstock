interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getClientKey(req: Request): string {
    // Use IP address as client identifier
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of Object.entries(this.store)) {
      if (now > data.resetTime) {
        delete this.store[key];
      }
    }
  }

  isRateLimited(req: Request): boolean {
    this.cleanup();
    
    const clientKey = this.getClientKey(req);
    const now = Date.now();
    
    if (!this.store[clientKey]) {
      this.store[clientKey] = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
      return false;
    }

    const clientData = this.store[clientKey];
    
    if (now > clientData.resetTime) {
      // Reset window
      clientData.count = 1;
      clientData.resetTime = now + this.config.windowMs;
      return false;
    }

    if (clientData.count >= this.config.maxRequests) {
      return true;
    }

    clientData.count++;
    return false;
  }

  getRemainingRequests(req: Request): number {
    const clientKey = this.getClientKey(req);
    const clientData = this.store[clientKey];
    
    if (!clientData) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - clientData.count);
  }

  getResetTime(req: Request): number {
    const clientKey = this.getClientKey(req);
    const clientData = this.store[clientKey];
    
    return clientData ? clientData.resetTime : Date.now();
  }
}

// Create rate limiter instance
const rateLimiter = new RateLimiter({
  maxRequests: 100, // 100 requests per window
  windowMs: 15 * 60 * 1000 // 15 minutes
});

export { rateLimiter }; 