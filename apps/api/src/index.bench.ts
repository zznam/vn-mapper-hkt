import { bench, describe } from 'vitest';
import request from 'supertest';
import { app } from './index';

describe('API Health Check Benchmark', () => {
  bench('GET /health', async () => {
    await request(app).get('/health');
  });
});
