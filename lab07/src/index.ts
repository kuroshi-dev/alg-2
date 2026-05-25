import { GeneticAlgorithm } from './ga';

type Variant = {
  func: (x: number) => number;
  xMin: number;
  xMax: number;
  description: string;
};

const variant: Variant = {
  func: x => Math.sqrt(x) * Math.sin(10 * x),
  xMin: 0,
  xMax: 5,
  description: 'x^(1/2)*sin(10*x)'
};

function parseArgs() {
  const argv = process.argv.slice(2);
  const bitsCount = Number(argv[0] ?? 18);
  const seedArg = argv[1];
  const seed = seedArg !== undefined ? Number(seedArg) : undefined;
  return { bits: bitsCount, seed };
}

async function main() {
  const args = parseArgs();

  const config = {
    popSize: 80,
    bits: args.bits,
    crossoverRate: 0.7,
    mutationRate: 0.01,
    generations: 400,
    xmin: variant.xMin,
    xmax: variant.xMax
  };

  const geneticAlg = args.seed !== undefined ? new GeneticAlgorithm(config, args.seed) : new GeneticAlgorithm(config);

  const resultMax = geneticAlg.run(variant.func); // maximize
  
  const resultMin = geneticAlg.run(x => -variant.func(x)); // minimize

  const bestMaximumX = resultMax.bestX;
  const bestMaximumY = variant.func(bestMaximumX);
  const bestMinimumX = resultMin.bestX;
  const bestMinimumY = variant.func(bestMinimumX);

  console.log(`Variant 4: ${variant.description} on [${variant.xMin}, ${variant.xMax}]`);
  console.log('Best maximum found: x =', bestMaximumX.toFixed(6), 'y =', bestMaximumY.toFixed(6));
  console.log('Best maximum fitness:', resultMax.bestFitness.toFixed(6));
  console.log('Best minimum found: x =', bestMinimumX.toFixed(6), 'y =', bestMinimumY.toFixed(6));
  console.log('Best minimum fitness (raw):', resultMin.bestFitness.toFixed(6));

}

main().catch(e => { console.error(e); process.exit(1); });
