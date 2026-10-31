(() => {
  'use strict';
  const panel = document.querySelector('[data-scout]');
  if (!panel) return;
  const status = panel.querySelector('[data-scout-status]');
  const events = panel.querySelector('[data-scout-events]');
  const matches = panel.querySelector('[data-scout-matches]');
  const refresh = panel.querySelector('[data-scout-refresh]');
  const BASE = 'https://api.ftcscout.org/rest/v1';
  const KEY = 'wildcircuits:ftcscout:36611:2026:v1';
  const TTL = 15 * 60 * 1000;
  let running = false;
  const valid = value => value && Number.isInteger(value.events) && value.events >= 0 && Number.isInteger(value.matches) && value.matches >= 0 && Number.isFinite(value.updatedAt);
  function paint(value, cached) {
    events.textContent = String(value.events);
    matches.textContent = String(value.matches);
    const when = new Date(value.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    status.textContent = `${cached ? 'Saved FTC Scout response' : 'Updated from FTC Scout'} · ${when}`;
    panel.dataset.state = cached ? 'cached' : 'ready';
  }
  async function load(force = false) {
    if (running) return;
    if (!force) {
      try {
        const cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        if (valid(cached) && Date.now() >= cached.updatedAt && Date.now() - cached.updatedAt < TTL) { paint(cached, true); return; }
      } catch (_) { /* Browsers can disable storage for local files. */ }
    }
    running = true;
    refresh.disabled = true;
    panel.setAttribute('aria-busy', 'true');
    status.textContent = 'Checking FTC Scout for the 2026 season…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const endpoints = ['/teams/36611/events/2026', '/teams/36611/matches?season=2026'];
      const data = await Promise.all(endpoints.map(async endpoint => {
        const response = await fetch(BASE + endpoint, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('FTC Scout returned ' + response.status);
        const json = await response.json();
        if (!Array.isArray(json)) throw new Error('Unexpected FTC Scout response');
        return json;
      }));
      const value = { events: data[0].length, matches: data[1].length, updatedAt: Date.now() };
      paint(value, false);
      try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch (_) { /* Data remains visible without storage. */ }
    } catch (_) {
      panel.dataset.state = 'unavailable';
      status.textContent = 'FTC Scout’s live update is unavailable. The verified Holmdel results above remain available; you can retry or open FTC Scout directly.';
    } finally {
      clearTimeout(timeout);
      controller.abort();
      refresh.disabled = false;
      panel.removeAttribute('aria-busy');
      running = false;
    }
  }
  refresh.addEventListener('click', () => load(true));
  load();
})();
