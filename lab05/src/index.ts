import { loadRatings, loadMovies, buildItemUsers } from "./dataLoader.js";
import { userBasedRec, mean } from "./userBased.js";
import { itemBasedRec } from "./itemBased.js";

const USER_ID     = 1;
const K           = 10; // кількість найближчих сусідів
const TOP_N       = 5;  // кількість рекомендацій

const matrix    = loadRatings();
const movies    = loadMovies();
const itemUsers = buildItemUsers(matrix);

const totalRatings  = [...matrix.values()].reduce((s, m) => s + m.size, 0);
const userRatings   = matrix.get(USER_ID)!;
const userMean      = mean(userRatings);

console.log(`датасет: ${matrix.size} користувачів, ${itemUsers.size} фільмів, ${totalRatings} оцінок`);
console.log(`користувач ${USER_ID}: ${userRatings.size} оцінок, середнє = ${userMean.toFixed(2)}`);
console.log("---\n");

function printRecommendations(title: string, recommendations: { movieId: number; score: number }[]): void {
  console.log(`${title}:`);
  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i]!;
    const movieTitle = movies.get(rec.movieId) ?? `фільм ${rec.movieId}`;
    console.log(`  ${String(i + 1).padStart(2)}. ${movieTitle.padEnd(50)}  прогноз = ${rec.score.toFixed(2)}`);
  }
}

const ubRec = userBasedRec(matrix, USER_ID, K, TOP_N);
printRecommendations(`КФ за схожістю користувачів (k=${K}, top=${TOP_N})`, ubRec);

console.log();

const ibRec = itemBasedRec(matrix, itemUsers, USER_ID, K, TOP_N);
printRecommendations(`КФ за схожістю об'єктів (k=${K}, top=${TOP_N})`, ibRec);
