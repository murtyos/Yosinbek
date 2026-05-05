import { Router } from 'express';
import { searchPlayers } from '../services/playerService.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (!q) return res.json([]);
    const result = await searchPlayers(q);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
