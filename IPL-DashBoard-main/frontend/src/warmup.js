// Warms the backend (Render cold start) as soon as the SPA loads.
// This does not eliminate cold starts entirely, but it makes the UI feel fast
// by waking the backend while the user is on the landing page.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, { timeoutMs = 8000, ...options } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function scheduleIdle(task) {
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => task(), { timeout: 2000 });
    return;
  }
  setTimeout(() => task(), 250);
}

export function startWarmup() {
  // Avoid spamming in dev StrictMode double-invocation.
  if (typeof window !== 'undefined') {
    if (window.__IPL_WARMUP_STARTED__) return;
    window.__IPL_WARMUP_STARTED__ = true;
  }

  scheduleIdle(async () => {
    // Step 1: wake backend quickly via a lightweight endpoint
    try {
      await fetchWithTimeout('/api/ping', {
        timeoutMs: 10000,
        cache: 'no-store',
        headers: { 'cache-control': 'no-cache' },
      });
    } catch {
      // If backend is asleep, this may fail/timeout; we still proceed to prefetch.
    }

    // Give the backend a tiny moment to finish boot if it just woke.
    await sleep(400);

    // Step 2: prefetch the pages that feel "slow" on first visit
    // (Ignore results; this is purely to keep the backend warm and JIT caches hot.)
    const prefetchUrls = ['/api/v1/team', '/api/v1/players', '/api/v1/iconic-match'];

    await Promise.all(
      prefetchUrls.map((url) =>
        fetchWithTimeout(url, {
          timeoutMs: 15000,
          cache: 'no-store',
          headers: { 'cache-control': 'no-cache' },
        }).catch(() => null)
      )
    );
  });
}
