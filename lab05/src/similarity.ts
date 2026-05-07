// кореляція Пірсона між двома векторами оцінок (формула 2)
export function pearson(
  a: Map<number, number>,
  b: Map<number, number>,
  minCommon = 2 // мінімальна кількість спільних елементів для надійної кореляції
): number {
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a];
  const common: number[] = [];
  for (const id of smaller.keys()) {
    if (larger.has(id)) common.push(id);
  }
  if (common.length < minCommon) return 0;

  const n = common.length;
  let sa = 0, sb = 0;
  for (const id of common) { sa += a.get(id)!; sb += b.get(id)!; }
  const ma = sa / n, mb = sb / n;

  let num = 0, da2 = 0, db2 = 0;
  for (const id of common) {
    const da = a.get(id)! - ma;
    const db = b.get(id)! - mb;
    num += da * db;
    da2 += da * da;
    db2 += db * db;
  }
  const den = Math.sqrt(da2 * db2);
  return den === 0 ? 0 : num / den;
}
