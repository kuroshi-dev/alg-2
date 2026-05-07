export function parkMillerGenerator(seed: number): () => number {
  const multiplier = 16807;   // 7^5 — найменше примітивне кореневе число для модуля 2^31-1
  const modulus = 2147483647; // 2^31 - 1
  const quotient = 127773;    // m div a  (= floor(2147483647 / 16807))
  const remainder = 2836;     // m mod a

  let state = seed;

  return (): number => {
    const high = Math.floor(state / quotient);
    const low = state % quotient;
    let candidate = multiplier * low - remainder * high;
    if (candidate < 0) candidate += modulus;
    state = candidate;
    return state / modulus; // нормалізація до (0, 1)
  };
}

export function lecuyerGenerator(seed1: number, seed2: number): () => number { // Комбінований генератор Лек'є (1996) — два незалежні генератори Парка-Міллера з різними параметрами
  const m1 = 2147483563, a1 = 40014, q1 = 53668, r1 = 12211;
  const m2 = 2147483399, a2 = 40692, q2 = 52774, r2 = 3791;

  let s1 = seed1;
  let s2 = seed2;

  return (): number => {
    const k1 = Math.floor(s1 / q1);
    s1 = a1 * (s1 - k1 * q1) - k1 * r1;
    if (s1 < 0) s1 += m1;

    const k2 = Math.floor(s2 / q2);
    s2 = a2 * (s2 - k2 * q2) - k2 * r2;
    if (s2 < 0) s2 += m2;

    const diff = s1 - s2;
    return (diff > 0 ? diff : diff + m1) / m1;
  };
}

export function linearCongruentialGenerator(seed: number): () => number { // Лінійний конгруентний генератор (LCG) — простий, але з поганими статистичними властивостями
  const multiplier = 1664525;
  const increment = 1013904223;

  let state = seed >>> 0; // початкове значення як беззнакове 32-біт

  return (): number => {
    state = (multiplier * state + increment) >>> 0; // mod 2^32
    return state / 4294967296;
  };
}

export function blumBlumShubGenerator(seed: number): () => number { // Генератор Блума-Блума-Шаба 
  const primeP = 383;        // 383 mod 4 = 3 ✓
  const primeQ = 503;        // 503 mod 4 = 3 ✓
  const modulus = primeP * primeQ;      // 192649

  let state = seed % modulus;
  if (state < 2) state = 2; 

  return (): number => {
    let bits = 0;
    for (let bitIndex = 0; bitIndex < 32; bitIndex++) {
      state = (state * state) % modulus;
      bits = (bits << 1) | (state & 1); // молодший біт (біт парності)
    }
    return (bits >>> 0) / 4294967296;
  };
}
