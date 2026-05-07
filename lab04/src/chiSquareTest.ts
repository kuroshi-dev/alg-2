export interface ChiSquareResult {
  chiSquare:   number;
  degreesOfFreedom: number;
  passed:      boolean; // х² < критичне значення 95% (генератор не відхиляється)
}

const INTERVALS   = 100;
const SAMPLE_SIZE = 1_000_000;
// критичні значення х² для 99 ступенів свободи
export const CHI_CRITICAL_95 = 123.23; // рівень значущості 5%
export const CHI_CRITICAL_99 = 135.81; // рівень значущості 1%

export function uniformityTest(generator: () => number): ChiSquareResult {
  const buckets = new Int32Array(INTERVALS); // лічильники для кожного піддіапазону

  for (let sampleIndex = 0; sampleIndex < SAMPLE_SIZE; sampleIndex++) {
    const bucketIndex = Math.floor(generator() * INTERVALS);
    buckets[bucketIndex < INTERVALS ? bucketIndex : INTERVALS - 1]!++;
  }

  const expected = SAMPLE_SIZE / INTERVALS; // очікувана кількість у кожному піддіапазоні
  let chiSquare = 0;
  for (let intervalIndex = 0; intervalIndex < INTERVALS; intervalIndex++) {
    const diff = (buckets[intervalIndex]! - expected);
    chiSquare += (diff * diff) / expected;
  }

  return {
    chiSquare,
    degreesOfFreedom: INTERVALS - 1,
    passed: chiSquare < CHI_CRITICAL_99, // використовуємо суворіший поріг 1%
  };
}
