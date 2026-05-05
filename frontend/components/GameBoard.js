'use client';
import { useEffect, useMemo, useState } from 'react';
import { guessPlayer, searchPlayers } from '../lib/api';

const MAX_ATTEMPTS = 7;
const fields = ['nationality', 'age', 'main_role', 'sub_role', 'team', 'status', 'major_appearances'];

export default function GameBoard() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query) return setResults([]);
      setResults(await searchPlayers(query));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const saved = localStorage.getItem('cs2-guess-progress');
    if (saved) setGuesses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cs2-guess-progress', JSON.stringify(guesses));
  }, [guesses]);

  const isOver = useMemo(() => guesses.some((g) => g.isCorrect) || guesses.length >= MAX_ATTEMPTS, [guesses]);

  async function submit(nickname) {
    if (isOver) return;
    const data = await guessPlayer({ nickname });
    if (data.error) return setMsg(data.error);
    setGuesses((prev) => [...prev, data]);
    setQuery('');
    setResults([]);
    if (data.isCorrect) setMsg('Correct!');
  }

  const pill = (v) => v === 'correct' ? 'bg-green-600' : v === 'wrong' ? 'bg-red-600' : 'bg-amber-600';

  return <div className="max-w-4xl mx-auto p-4 space-y-4">
    <h1 className="text-3xl font-bold">CS2 Player Guess Game</h1>
    <p className="text-slate-300">Guess the pro player in 7 attempts.</p>
    <div className="relative">
      <input disabled={isOver} value={query} onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded bg-slate-800 px-3 py-2" placeholder="Type nickname..." />
      {results.length > 0 && <ul className="absolute z-10 w-full bg-slate-900 border border-slate-700 rounded mt-1">
        {results.map((p) => <li key={p.id}>
          <button className="w-full text-left px-3 py-2 hover:bg-slate-800" onClick={() => submit(p.nickname)}>{p.nickname}</button>
        </li>)}
      </ul>}
    </div>
    {msg && <p className="text-cyan-300">{msg}</p>}
    <div className="space-y-2">
      {guesses.map((g, idx) => <div key={idx} className="bg-slate-900 border border-slate-700 rounded p-3">
        <div className="font-semibold mb-2">{g.guess.nickname}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {fields.map((f) => <div key={f} className={`rounded px-2 py-1 text-sm ${pill(g.comparison[f])}`}>{f}: {g.comparison[f]}</div>)}
        </div>
      </div>)}
    </div>
  </div>;
}
