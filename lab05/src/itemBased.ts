import { pearson } from "./similarity.js";
import { mean } from "./userBased.js";
import type { Rec } from "./userBased.js";

const MIN_RATERS = 20; // мінімальна кількість оцінок фільму для надійної схожості

export function itemBasedRec( // рекомендації на основі схожості між фільмами
  matrix:    Map<number, Map<number, number>>,
  itemUsers: Map<number, Map<number, number>>,
  userId:    number,
  k:         number, // кількість схожих фільмів-сусідів
  n:         number  // кількість рекомендацій
): Rec[] {
  const userRatings = matrix.get(userId);
  if (!userRatings) return [];
  const userMean = mean(userRatings);

  // кандидати — фільми, яких цільовий не бачив, але їх переглядали ті ж користувачі
  const candidates = new Set<number>();
  for (const [ratedItem] of userRatings) {
    const raters = itemUsers.get(ratedItem);
    if (!raters) continue;
    for (const [uid] of raters) {
      for (const movieId of matrix.get(uid)!.keys()) {
        if (!userRatings.has(movieId)) candidates.add(movieId);
      }
    }
  }

  const preds: Rec[] = []; // передбачувані оцінки для кандидатів
  for (const candidateItem of candidates) {
    const candidateUsers = itemUsers.get(candidateItem);
    if (!candidateUsers || candidateUsers.size < MIN_RATERS) continue; // відкидаємо непопулярні

    const sims: [number, number][] = [];
    for (const [ratedItem] of userRatings) {
      const ratedUsers = itemUsers.get(ratedItem);
      if (!ratedUsers) continue;
      const sim = pearson(candidateUsers, ratedUsers, 10);
      if (sim > 0) sims.push([ratedItem, sim]);
    }
    sims.sort((a, b) => b[1]! - a[1]!);
    const neighbors = sims.slice(0, k);
    if (neighbors.length === 0) continue;

    let num = 0, den = 0;
    for (const [ratedItem, sim] of neighbors) {
      num += (userRatings.get(ratedItem)! - userMean) * sim;
      den += Math.abs(sim);
    }
    if (den === 0) continue;
    preds.push({ movieId: candidateItem, score: userMean + num / den });
  }

  preds.sort((a, b) => b.score - a.score);
  return preds.slice(0, n);
}
