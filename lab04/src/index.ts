import {
  parkMillerGenerator,
  lecuyerGenerator,
  linearCongruentialGenerator,
  blumBlumShubGenerator,
} from "./generators.js";
import { uniformityTest, CHI_CRITICAL_99 } from "./chiSquareTest.js";

const now   = Date.now();
const seed1 = (now % 2147483562) + 1;
const seed2 = ((now + 12345) % 2147483398) + 1;

console.log(`seed = ${seed1}`);
console.log("---\n");

const generators: Array<{ name: string; gen: () => number }> = [
  { name: "Парк-Міллер",           gen: parkMillerGenerator(seed1) },
  { name: "Л'Екюер",               gen: lecuyerGenerator(seed1, seed2) },
  { name: "Лінійний конгруентний", gen: linearCongruentialGenerator(seed1) },
  { name: "Блюм-Блюм-Шуб",        gen: blumBlumShubGenerator(seed1) },
];

for (const { name, gen } of generators) {
  const result = uniformityTest(gen);
  const verdict = result.passed ? "[OK]" : "[FAIL]";
  console.log(`${name.padEnd(22)}  chi2 = ${result.chiSquare.toFixed(2).padStart(10)}  ${verdict}`);
}

console.log(`\nchi2_crit = ${CHI_CRITICAL_99}`);
