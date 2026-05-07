import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../data");

export function loadRatings(): Map<number, Map<number, number>> { // завантаження матриці оцінок: для кожного користувача — карта {фільм -> оцінка}
  const matrix = new Map<number, Map<number, number>>();
  const lines = readFileSync(join(DATA_DIR, "ratings.csv"), "utf-8").split("\n");
  for (let i = 1; i < lines.length; i++) { // i=0 — заголовок
    const line = lines[i]?.trim();
    if (!line) continue;
    const parts = line.split(",");
    const u = parts[0], m = parts[1], r = parts[2];
    if (!u || !m || !r) continue;
    const userId = parseInt(u), movieId = parseInt(m), rating = parseFloat(r);
    if (!matrix.has(userId)) matrix.set(userId, new Map());
    matrix.get(userId)!.set(movieId, rating);
  }
  return matrix;
}

export function loadMovies(): Map<number, string> { // завантаження назв фільмів
  const movies = new Map<number, string>();
  const lines = readFileSync(join(DATA_DIR, "movies.csv"), "utf-8").split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    const firstComma = line.indexOf(",");
    const lastComma  = line.lastIndexOf(",");
    if (firstComma === lastComma) continue;
    const movieId = parseInt(line.substring(0, firstComma));
    let title = line.substring(firstComma + 1, lastComma);
    if (title.startsWith('"') && title.endsWith('"')) title = title.slice(1, -1); // назви з комами беруться в лапки
    movies.set(movieId, title);
  }
  return movies;
}

export function buildItemUsers( // інверсна матриця: для кожного фільму - карта користувачів, які його оцінювали
  matrix: Map<number, Map<number, number>>
): Map<number, Map<number, number>> {
  const itemUsers = new Map<number, Map<number, number>>();
  for (const [userId, ratings] of matrix) {
    for (const [movieId, rating] of ratings) {
      if (!itemUsers.has(movieId)) itemUsers.set(movieId, new Map());
      itemUsers.get(movieId)!.set(userId, rating);
    }
  }
  return itemUsers;
}
