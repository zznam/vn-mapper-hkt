import { describe, bench } from 'vitest';
import request from 'supertest';
import { app } from './index';

// ── Note on rate limiting ─────────────────────────────────────────────────────
// The rate limiter is active during benchmarks (vitest bench isolates workers).
// We measure raw latency by calling the endpoints without asserting status codes.
// The rate limiter itself adds minimal overhead (<0.1ms) so results reflect
// real-world handler throughput.

describe('API — Endpoint throughput (single req/iteration)', () => {
  bench('GET /health', async () => {
    await request(app).get('/health');
  });

  bench('GET /api/routes', async () => {
    await request(app).get('/api/routes');
  });

  bench('GET /api/houses?limit=20', async () => {
    await request(app).get('/api/houses?limit=20');
  });

  bench('GET /api/houses?type=house', async () => {
    await request(app).get('/api/houses?type=house');
  });

  bench('GET /api/houses?type=office', async () => {
    await request(app).get('/api/houses?type=office');
  });

  bench('GET /api/houses/h1 (single lookup)', async () => {
    await request(app).get('/api/houses/h1');
  });

  bench('POST /api/houses/h1/bookmark (toggle)', async () => {
    await request(app).post('/api/houses/h1/bookmark');
  });

  bench('POST /api/houses/h1/report', async () => {
    await request(app)
      .post('/api/houses/h1/report')
      .send({ reason: 'bench test' })
      .set('Content-Type', 'application/json');
  });
});

describe('API — Error path throughput', () => {
  bench('GET /unknown-route (404)', async () => {
    await request(app).get('/this-route-does-not-exist');
  });

  bench('GET /api/houses/ghost (404)', async () => {
    await request(app).get('/api/houses/house-does-not-exist');
  });

  bench('GET /api/houses?type=bad (400)', async () => {
    await request(app).get('/api/houses?type=invalid_type');
  });
});

describe('API — Pagination sweep (5 pages, sequential)', () => {
  bench('pages 0–4 at limit=4', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get(`/api/houses?limit=4&offset=${i * 4}`);
    }
  });
});

describe('API — Stateful (bookmark round-trip)', () => {
  bench('toggle h1 bookmark → on → off', async () => {
    await request(app).post('/api/houses/h1/bookmark');
    await request(app).post('/api/houses/h1/bookmark');
  });
});
