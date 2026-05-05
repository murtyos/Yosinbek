const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function searchPlayers(q) {
  const res = await fetch(`${API}/players/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function guessPlayer(payload) {
  const res = await fetch(`${API}/game/guess`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  return res.json();
}
