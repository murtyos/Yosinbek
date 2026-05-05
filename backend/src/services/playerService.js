import { pool } from '../db/pool.js';

const STALE_DAYS = 7;

export function calculateAge(player) {
  if (player.birth_date) {
    const now = new Date();
    const birth = new Date(player.birth_date);
    let age = now.getUTCFullYear() - birth.getUTCFullYear();
    const m = now.getUTCMonth() - birth.getUTCMonth();
    if (m < 0 || (m === 0 && now.getUTCDate() < birth.getUTCDate())) age--;
    return age;
  }
  return player.age_estimate;
}

export async function searchPlayers(q) {
  const { rows } = await pool.query(
    `SELECT id, nickname FROM players
     WHERE nickname ILIKE $1 OR similarity(nickname, $2) > 0.25
     ORDER BY CASE WHEN nickname ILIKE $1 THEN 0 ELSE 1 END, nickname
     LIMIT 10`,
    [`${q}%`, q]
  );
  return rows;
}

export async function getPlayerByIdOrNickname({ id, nickname }) {
  const query = id
    ? { text: 'SELECT * FROM players WHERE id = $1', values: [id] }
    : { text: 'SELECT * FROM players WHERE lower(nickname) = lower($1)', values: [nickname] };
  const { rows } = await pool.query(query);
  return rows[0] ?? null;
}

export async function getAllPlayers() {
  const { rows } = await pool.query('SELECT * FROM players');
  return rows;
}

export async function lazyUpdatePlayer(player) {
  const lastUpdated = new Date(player.last_updated);
  const threshold = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);
  if (lastUpdated > threshold) return player;

  await new Promise((resolve) => setTimeout(resolve, 500));
  const refreshed = {
    ...player,
    team: player.team,
    status: player.status,
    major_appearances: player.major_appearances,
    last_updated: new Date().toISOString()
  };

  await pool.query(
    `UPDATE players SET team = $1, status = $2, major_appearances = $3, last_updated = NOW() WHERE id = $4`,
    [refreshed.team, refreshed.status, refreshed.major_appearances, player.id]
  );

  return refreshed;
}
