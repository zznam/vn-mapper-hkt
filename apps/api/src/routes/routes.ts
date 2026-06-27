import { Router, Request, Response } from 'express';
import { MOCK_ROUTE } from '@vn-mapper/core/src/mock-data';

export const routesRouter = Router();

// ── GET /api/routes ────────────────────────────────────────────────────────
// Returns the primary alley route coordinates
routesRouter.get('/', (_req: Request, res: Response) => {
  res.json({ coordinates: MOCK_ROUTE });
});
