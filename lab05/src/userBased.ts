import { pearson } from "./similarity.js";

export interface Rec {
  movieId: number;
  score:   number;
}

export function mean(ratings: Map<number, number>): number {
  let s = 0;
  for (const v of ratings.values()) s += v;
  return s / ratings.size;
}

export function userBasedRec(
  matrix:   Map<number, Map<number, number>>,
  userId:   number,
  k:        number, // кількість найближчих сусідів
  n:        number  // кількість рекомендацій
): Rec[] {
  const userRatings = matrix.get(userId);
  if (!userRatings) return [];
  const userMean = mean(userRatings);

  const sims: [number, number][] = [];
  for (const [uid, ratings] of matrix) {
    if (uid === userId) continue;
    const sim = pearson(userRatings, ratings);
    if (sim > 0) sims.push([uid, sim]);
  }
  sims.sort((a, b) => b[1]! - a[1]!);
  const neighbors = sims.slice(0, k);

  const nMean = new Map<number, number>(); // середні оцінки сусідів (передобчислено)
  for (const [uid] of neighbors) nMean.set(uid, mean(matrix.get(uid)!));

  const candidates = new Set<number>(); // фільми, які сусіди дивились, а цільовий — ні
  for (const [uid] of neighbors) {
    for (const movieId of matrix.get(uid)!.keys()) {
      if (!userRatings.has(movieId)) candidates.add(movieId);
    }
  }

  const preds: Rec[] = [];
  for (const movieId of candidates) {
    let num = 0, den = 0;
    for (const [uid, sim] of neighbors) {
      const nr = matrix.get(uid)!;
      if (!nr.has(movieId)) continue;
      num += (nr.get(movieId)! - nMean.get(uid)!) * sim;
      den += Math.abs(sim);
    }
    if (den === 0) continue;
    preds.push({ movieId, score: userMean + num / den });
  }

  preds.sort((a, b) => b.score - a.score);
  return preds.slice(0, n);
}
