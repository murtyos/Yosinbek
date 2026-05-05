import { pool } from '../src/db/pool.js';

const players = [
  ['s1mple', 'Ukraine', '1997-10-02', null, 'AWPer', null, 'NAVI', 'active', 5, 'https://www.hltv.org/player/7998/s1mple'],
  ['ZywOo', 'France', '2000-11-09', null, 'AWPer', null, 'Vitality', 'active', 6, 'https://www.hltv.org/player/11893/zywoo'],
  ['karrigan', 'Denmark', '1990-04-14', null, 'Rifler', 'IGL', 'FaZe', 'active', 18, 'https://www.hltv.org/player/429/karrigan'],
  ['ropz', 'Estonia', '1999-12-22', null, 'Rifler', 'Anchor', 'FaZe', 'active', 7, 'https://www.hltv.org/player/11816/ropz'],
  ['NiKo', 'Bosnia and Herzegovina', '1997-02-16', null, 'Rifler', null, 'Falcons', 'active', 12, 'https://www.hltv.org/player/3741/niko'],
  ['device', 'Denmark', '1995-09-08', null, 'AWPer', null, 'Astralis', 'active', 19, 'https://www.hltv.org/player/7592/device'],
  ['apEX', 'France', '1993-02-22', null, 'Rifler', 'IGL', 'Vitality', 'active', 17, 'https://www.hltv.org/player/7322/apex'],
  ['frozen', 'Slovakia', '2002-07-18', null, 'Rifler', 'Anchor', 'FaZe', 'active', 4, 'https://www.hltv.org/player/15940/frozen']
];

async function run() {
  for (const p of players) {
    await pool.query(
      `INSERT INTO players (nickname, nationality, birth_date, age_estimate, main_role, sub_role, team, status, major_appearances, hltv_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (nickname) DO UPDATE SET
         nationality = EXCLUDED.nationality,
         birth_date = EXCLUDED.birth_date,
         age_estimate = EXCLUDED.age_estimate,
         main_role = EXCLUDED.main_role,
         sub_role = EXCLUDED.sub_role,
         team = EXCLUDED.team,
         status = EXCLUDED.status,
         major_appearances = EXCLUDED.major_appearances,
         hltv_url = EXCLUDED.hltv_url,
         last_updated = NOW()`,
      p
    );
  }

  await pool.end();
  console.log('Seed completed');
}

run().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
