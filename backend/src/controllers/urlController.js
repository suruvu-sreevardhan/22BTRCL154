import { Log } from "../../../logging-middleware/index.js";
import {
  createShortUrl,
  getUrlByCode,
  registerClick,
  fetchStats,
} from "../services/urlService.js";

const HOST = "http://localhost";
const PORT = 4000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

export async function createUrlHandler(req, res) {
  try {
    const { url, validity = 30, shortcode } = req.body;
    const { shortcode: finalCode, expiry } = createShortUrl(url, validity, shortcode);

    await Log("backend", "info", "controller", `New shortcode: ${finalCode}`, AUTH_TOKEN);

    res.status(201).json({
      shortLink: `${HOST}:${PORT}/${finalCode}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    await Log("backend", "error", "controller", err.message, AUTH_TOKEN);
    res.status(400).json({ error: err.message });
  }
}

export async function redirectHandler(req, res) {
  const { shortcode } = req.params;
  const record = getUrlByCode(shortcode);

  if (!record) {
    await Log("backend", "error", "controller", "Shortcode not found", AUTH_TOKEN);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  if (new Date() > record.expiry) {
    await Log("backend", "warn", "controller", "Shortcode expired", AUTH_TOKEN);
    return res.status(410).json({ error: "Link expired" });
  }

  registerClick(shortcode, req.get("referer"), req.ip);
  await Log("backend", "info", "controller", `Redirected via ${shortcode}`, AUTH_TOKEN);

  res.redirect(record.originalUrl);
}

export async function statsHandler(req, res) {
  const { shortcode } = req.params;
  const record = fetchStats(shortcode);

  if (!record) {
    await Log("backend", "error", "controller", "Stats requested for missing code", AUTH_TOKEN);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clicks: record.clicks,
  });
}
