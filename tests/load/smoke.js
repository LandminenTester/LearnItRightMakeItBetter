// k6-Smoke-Profil — Profile & Thresholds: docs/testing/05-quality-gates-performance.md §3.
// Ausführung: k6 run tests/load/smoke.js (BASE_URL via -e BASE_URL=…)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '5m',
  thresholds: {
    // NFR-001: Leselast p95 < 300 ms (Smoke prüft Regressionen, load-Profil den Nachweis)
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
  const home = http.get(`${BASE_URL}/`);
  check(home, { 'Startseite 200': (r) => r.status === 200 });

  const health = http.get(`${API_URL}/healthz`);
  check(health, { 'healthz 200': (r) => r.status === 200 });

  sleep(1);
}
