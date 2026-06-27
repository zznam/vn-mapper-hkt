import request from 'supertest';
import { app } from './index';
import { resetHousesStore } from './routes/houses';

beforeEach(() => {
  resetHousesStore();
});

// ── Health check ──────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────

describe('Unknown routes', () => {
  it('returns 404 for an unknown GET route', async () => {
    const res = await request(app).get('/not-a-real-endpoint');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });

  it('returns 404 for an unknown POST route', async () => {
    const res = await request(app).post('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});

// ── GET /api/houses ───────────────────────────────────────────────────────────

describe('GET /api/houses', () => {
  it('returns a paginated list of all houses', async () => {
    const res = await request(app).get('/api/houses');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(20);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('each house has required fields', async () => {
    const res = await request(app).get('/api/houses');
    const houses = res.body.items as Array<Record<string, unknown>>;
    for (const house of houses) {
      expect(house).toHaveProperty('id');
      expect(house).toHaveProperty('type');
      expect(house).toHaveProperty('address');
      expect(house).toHaveProperty('coordinate');
      expect(house).toHaveProperty('imageUrl');
    }
  });

  it('filters by type=house', async () => {
    const res = await request(app).get('/api/houses?type=house');
    expect(res.status).toBe(200);
    const houses = res.body.items as Array<{ type: string }>;
    expect(houses.length).toBeGreaterThan(0);
    for (const house of houses) {
      expect(house.type).toBe('house');
    }
  });

  it('filters by type=office', async () => {
    const res = await request(app).get('/api/houses?type=office');
    expect(res.status).toBe(200);
    const offices = res.body.items as Array<{ type: string }>;
    expect(offices.length).toBeGreaterThan(0);
    for (const office of offices) {
      expect(office.type).toBe('office');
    }
  });

  it('returns 400 for an invalid type filter', async () => {
    const res = await request(app).get('/api/houses?type=invalid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('respects limit query param', async () => {
    const res = await request(app).get('/api/houses?limit=3');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeLessThanOrEqual(3);
  });

  it('respects offset query param', async () => {
    const allRes = await request(app).get('/api/houses?limit=100');
    const offsetRes = await request(app).get('/api/houses?limit=100&offset=5');
    expect(allRes.status).toBe(200);
    expect(offsetRes.status).toBe(200);
    // Items at position 0 in offset=5 should match position 5 in offset=0
    if (allRes.body.items.length > 5 && offsetRes.body.items.length > 0) {
      expect(offsetRes.body.items[0].id).toBe(allRes.body.items[5].id);
    }
  });

  it('caps limit at 100', async () => {
    const res = await request(app).get('/api/houses?limit=999');
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(100);
  });
});

// ── GET /api/houses/:id ───────────────────────────────────────────────────────

describe('GET /api/houses/:id', () => {
  it('returns a single house by id', async () => {
    const res = await request(app).get('/api/houses/h1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'h1');
    expect(res.body).toHaveProperty('address');
  });

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/houses/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ── POST /api/houses/:id/bookmark ────────────────────────────────────────────

describe('POST /api/houses/:id/bookmark', () => {
  it('toggles bookmark from false to true', async () => {
    // h1 starts as not bookmarked
    const res = await request(app).post('/api/houses/h1/bookmark');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'h1', isBookmarked: true });
  });

  it('toggles bookmark from true to false (double toggle)', async () => {
    await request(app).post('/api/houses/h1/bookmark'); // -> true
    const res = await request(app).post('/api/houses/h1/bookmark'); // -> false
    expect(res.status).toBe(200);
    expect(res.body.isBookmarked).toBe(false);
  });

  it('bookmark state is reflected in GET /api/houses/:id', async () => {
    await request(app).post('/api/houses/h1/bookmark');
    const res = await request(app).get('/api/houses/h1');
    expect(res.body.isBookmarked).toBe(true);
  });

  it('returns 404 for unknown house', async () => {
    const res = await request(app).post('/api/houses/ghost/bookmark');
    expect(res.status).toBe(404);
  });
});

// ── POST /api/houses/:id/report ───────────────────────────────────────────────

describe('POST /api/houses/:id/report', () => {
  it('accepts a valid report', async () => {
    const res = await request(app)
      .post('/api/houses/h1/report')
      .send({ reason: 'Địa chỉ ghi sai số nhà' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('accepted', true);
  });

  it('returns 400 when reason is missing', async () => {
    const res = await request(app)
      .post('/api/houses/h1/report')
      .send({})
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when reason is empty string', async () => {
    const res = await request(app)
      .post('/api/houses/h1/report')
      .send({ reason: '   ' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown house', async () => {
    const res = await request(app)
      .post('/api/houses/ghost/report')
      .send({ reason: 'test' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(404);
  });
});

// ── GET /api/routes ───────────────────────────────────────────────────────────

describe('GET /api/routes', () => {
  it('returns the route coordinate array', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('coordinates');
    expect(Array.isArray(res.body.coordinates)).toBe(true);
    expect(res.body.coordinates.length).toBeGreaterThan(0);

    const firstPoint = res.body.coordinates[0];
    expect(firstPoint).toHaveProperty('latitude');
    expect(firstPoint).toHaveProperty('longitude');
    expect(typeof firstPoint.latitude).toBe('number');
    expect(typeof firstPoint.longitude).toBe('number');
  });
});

// ── Legacy redirect ───────────────────────────────────────────────────────────

describe('GET /api/routes/mock (legacy)', () => {
  it('redirects 308 to /api/routes', async () => {
    const res = await request(app).get('/api/routes/mock');
    expect(res.status).toBe(308);
    expect(res.headers.location).toMatch('/api/routes');
  });
});

// ── Security headers ─────────────────────────────────────────────────────────

describe('Security headers (helmet)', () => {
  it('sets X-Content-Type-Options header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('sets X-Frame-Options header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});

// ── Rate limiting headers ─────────────────────────────────────────────────────

describe('Rate limit headers', () => {
  it('does NOT include rate-limit headers in test environment (limiter disabled)', async () => {
    const res = await request(app).get('/api/houses');
    // In test env NODE_ENV=test, rate limiter is skipped
    expect(res.headers['ratelimit-limit']).toBeUndefined();
    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
  });
});
