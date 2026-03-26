type RateLimitEntry = {
  count: number;
  lastReset: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // 5 requests per window

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // If window expired, reset
  if (now - entry.lastReset > WINDOW_SIZE) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // If exceeded
  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  // Otherwise increment
  entry.count += 1;
  rateLimitMap.set(ip, entry);

  return true;
}
