import {
  parkMillerGenerator,
  lecuyerGenerator,
  linearCongruentialGenerator,
  blumBlumShubGenerator,
} from "./generators.js";

const COUNT = 10;
const now   = Date.now();

const seed1 = (now % 2147483562) + 1;
const seed2 = ((now + 12345) % 2147483398) + 1;

console.log(`Seed 1: ${seed1}`);
console.log(`Seed 2: ${seed2} (для Л'Екюера)\n`);

console.log("=== Мінімальний генератор Парка-Міллера ===");
console.log("  Формула: I(j+1) = 16807 * I(j) mod 2147483647");
console.log("  Метод: Шраж (Schrage) — без переповнення\n");
const pm = parkMillerGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${pm().toFixed(10)}`); // 10 знаків після коми для кращого вигляду
}

console.log("\n=== Алгоритм Л'Екюера ===");
console.log("  Комбінує дві послідовності Парка-Міллера (m1=2147483563, m2=2147483399)\n");
const le = lecuyerGenerator(seed1, seed2);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${le().toFixed(10)}`);
}

console.log("\n=== Лінійний конгруентний метод ===");
console.log("  Формула: xn = (1664525 * x_{n-1} + 1013904223) mod 2^32\n");
const lcg = linearCongruentialGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${lcg().toFixed(10)}`);
}

console.log("\n=== Алгоритм Блюма-Блюма-Шуба ===");
console.log("  p=383, q=503 (p ≡ q ≡ 3 mod 4),  pq=192649");
console.log("  xn = x_{n-1}^2 mod pq,  bit = xn mod 2  (32 біти → 1 число)\n");
const bbs = blumBlumShubGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${bbs().toFixed(10)}`);
}
