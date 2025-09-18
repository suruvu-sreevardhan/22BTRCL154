import { v4 as uuidv4 } from "uuid";

let store = {};

function makeCode() {
  return uuidv4().substring(0, 6);
}

export function createShortUrl(target, ttl, code) {
  if (!target) throw new Error("Missing URL");

  if (!code) {
    code = makeCode();
  } else if (store[code]) {
    throw new Error("Code already exists");
  }

  const expiry = new Date(Date.now() + ttl * 60 * 1000);

  store[code] = {
    originalUrl: target,
    createdAt: new Date(),
    expiry,
    clicks: [],
  };

  return { shortcode: code, expiry };
}

export function getUrlByCode(code) {
  return store[code] || null;
}

export function registerClick(code, ref, ip) {
  if (store[code]) {
    store[code].clicks.push({
      time: new Date(),
      referrer: ref || "direct",
      ip,
    });
  }
}

export function fetchStats(code) {
  return store[code] || null;
}
