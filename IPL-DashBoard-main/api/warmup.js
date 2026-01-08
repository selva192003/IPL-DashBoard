// Vercel Serverless Function
// Keeps the Render backend warm via Vercel Cron.

module.exports = async (req, res) => {
  const backendOrigin = (process.env.BACKEND_ORIGIN || 'https://ipl-dashboard-1-ff0d.onrender.com').replace(/\/$/, '');
  const url = `${backendOrigin}/api/ping`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'user-agent': 'vercel-warmup',
        'cache-control': 'no-cache',
      },
    }).finally(() => clearTimeout(timeoutId));

    const text = await resp.text().catch(() => '');

    if (!resp.ok) {
      res.status(502).json({ ok: false, url, status: resp.status, body: text.slice(0, 300) });
      return;
    }

    res.status(200).json({ ok: true, url, status: resp.status, body: text.slice(0, 300) });
  } catch (err) {
    res.status(504).json({ ok: false, url, error: String(err && err.message ? err.message : err) });
  }
};
