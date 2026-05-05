import crypto from 'crypto';
import { calculateAge, getAllPlayers, getPlayerByIdOrNickname, lazyUpdatePlayer } from './playerService.js';

export async function getDailyTarget() {
  const players = await getAllPlayers();
  if (!players.length) throw new Error('No players available');

  const today = new Date().toISOString().slice(0, 10);
  const hash = crypto.createHash('sha256').update(`${process.env.DAILY_SALT ?? 'salt'}:${today}`).digest('hex');
  const index = parseInt(hash.slice(0, 8), 16) % players.length;
  return players[index];
}

export function compareGuess(guess, target) {
  const guessAge = calculateAge(guess);
  const targetAge = calculateAge(target);

  return {
    nationality: guess.nationality === target.nationality ? 'correct' : 'wrong',
    age: guessAge === targetAge ? 'correct' : guessAge < targetAge ? 'higher' : 'lower',
    main_role: guess.main_role === target.main_role ? 'correct' : 'wrong',
    sub_role: guess.sub_role === target.sub_role ? 'correct' : 'wrong',
    team: guess.team === target.team ? 'correct' : 'wrong',
    status: guess.status === target.status ? 'correct' : 'wrong',
    major_appearances:
      guess.major_appearances === target.major_appearances
        ? 'correct'
        : guess.major_appearances < target.major_appearances
          ? 'higher'
          : 'lower'
  };
}

export async function evaluateGuess(payload) {
  const target = await getDailyTarget();
  const rawGuess = await getPlayerByIdOrNickname(payload);
  if (!rawGuess) return { error: 'Player not found' };

  const guess = await lazyUpdatePlayer(rawGuess);
  const refreshedTarget = await lazyUpdatePlayer(target);

  return {
    guess: { id: guess.id, nickname: guess.nickname },
    targetHash: crypto.createHash('md5').update(String(refreshedTarget.id)).digest('hex'),
    isCorrect: guess.id === refreshedTarget.id,
    comparison: compareGuess(guess, refreshedTarget)
  };
}
