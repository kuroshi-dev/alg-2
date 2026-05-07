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

console.log(`seed = ${seed1}`);
console.log("---\n");

console.log("Парк-Міллер:");
const pm = parkMillerGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${pm().toFixed(10)}`);
}

console.log("\nЛ'Екюер:");
const le = lecuyerGenerator(seed1, seed2);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${le().toFixed(10)}`);
}

console.log("\nЛКГ:");
const lcg = linearCongruentialGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${lcg().toFixed(10)}`);
}

console.log("\nBBS:");
const bbs = blumBlumShubGenerator(seed1);
for (let sampleIndex = 1; sampleIndex <= COUNT; sampleIndex++) {
  console.log(`  x${String(sampleIndex).padStart(2)} = ${bbs().toFixed(10)}`);
}
