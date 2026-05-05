# CS2 Player Guess Game

Full-stack MVP inspired by Wordle/Loldle.

## Stack
- Frontend: Next.js + Tailwind
- Backend: Express
- Database: PostgreSQL

## Run
1. `npm install`
2. Create DB and run migration: `psql "$DATABASE_URL" -f backend/migrations/001_init.sql`
3. Seed: `npm run seed -w backend`
4. Start both: `npm run dev`

## API
- `GET /players/search?q=`
- `GET /game/daily`
- `POST /game/guess` with `{ nickname }` or `{ player_id }`

## Notes
- Age is calculated dynamically from `birth_date`, fallback `age_estimate`.
- Lazy update triggers if `last_updated` is older than 7 days.
