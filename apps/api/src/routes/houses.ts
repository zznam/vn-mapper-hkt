import { Router, Request, Response } from 'express';
import { MOCK_HOUSES, ELocationType, IHouse } from '@vn-mapper/core/src/mock-data';

export const housesRouter = Router();

// In-memory mutable state derived from the shared mock data
let houses: IHouse[] = MOCK_HOUSES.map((h) => ({ ...h }));

// ── GET /api/houses ────────────────────────────────────────────────────────
// Optional query params:
//   type=house|office    filter by location type
//   limit=N              max results (default 50, max 100)
//   offset=N             pagination offset (default 0)
housesRouter.get('/', (req: Request, res: Response) => {
  const { type, limit: limitStr, offset: offsetStr } = req.query;

  let results = [...houses];

  if (type !== undefined) {
    const validTypes: string[] = [ELocationType.House, ELocationType.Office];
    if (!validTypes.includes(type as string)) {
      res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      return;
    }
    results = results.filter((h) => h.type === type);
  }

  const offset = Math.max(0, parseInt(offsetStr as string, 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(limitStr as string, 10) || 50));

  const paginated = results.slice(offset, offset + limit);

  res.json({
    total: results.length,
    offset,
    limit,
    items: paginated,
  });
});

// ── GET /api/houses/:id ────────────────────────────────────────────────────
housesRouter.get('/:id', (req: Request, res: Response) => {
  const house = houses.find((h) => h.id === req.params.id);
  if (!house) {
    res.status(404).json({ error: `House with id '${req.params.id}' not found` });
    return;
  }
  res.json(house);
});

// ── POST /api/houses/:id/bookmark ─────────────────────────────────────────
// Toggles the isBookmarked flag on the in-memory store
housesRouter.post('/:id/bookmark', (req: Request, res: Response) => {
  const index = houses.findIndex((h) => h.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: `House with id '${req.params.id}' not found` });
    return;
  }

  houses[index] = { ...houses[index], isBookmarked: !houses[index].isBookmarked };

  res.json({ id: req.params.id, isBookmarked: houses[index].isBookmarked });
});

// ── POST /api/houses/:id/report ───────────────────────────────────────────
// Accepts a user report about incorrect house data
housesRouter.post('/:id/report', (req: Request, res: Response) => {
  const house = houses.find((h) => h.id === req.params.id);
  if (!house) {
    res.status(404).json({ error: `House with id '${req.params.id}' not found` });
    return;
  }

  const { reason } = req.body as { reason?: string };
  if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
    res.status(400).json({ error: 'Report must include a non-empty "reason" string' });
    return;
  }

  // In production this would persist to a DB / send to a queue
  console.log(`[REPORT] house=${req.params.id} reason="${reason.trim()}"`);

  res.status(202).json({ accepted: true, message: 'Cảm ơn đóng góp của bạn!' });
});

/** Reset the in-memory store — used in tests only */
export function resetHousesStore(): void {
  houses = MOCK_HOUSES.map((h) => ({ ...h }));
}
