import express from 'express';
import cors from 'cors';
import playersRouter from './routes/players.js';
import gameRouter from './routes/game.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/players', playersRouter);
app.use('/game', gameRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
