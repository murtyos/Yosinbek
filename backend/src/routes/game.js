import { Router } from 'express';
import crypto from 'crypto';
import { getDailyTarget, evaluateGuess } from '../services/gameService.js';

const router = Router();

router.get('/daily', async (_req, res, next) => {
  try {
    const target = await getDailyTarget();
    res.json({
      dailyKey: new Date().toISOString().slice(0, 10),
      targetHash: crypto.createHash('md5').update(String(target.id)).digest('hex')
    });
  } catch (e) {
    next(e);
  }
});

router.post('/guess', async (req, res, next) => {
  try {
    const payload = { id: req.body.player_id, nickname: req.body.nickname };
    const result = await evaluateGuess(payload);
    if (result.error) return res.status(404).json(result);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
