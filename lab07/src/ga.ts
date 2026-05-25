type Config = {
  popSize: number;
  bits: number;
  crossoverRate: number;
  mutationRate: number;
  generations: number;
  xmin: number;
  xmax: number;
};

export class GeneticAlgorithm {
  cfg: Config;
  rng: () => number;

  constructor(cfg: Config, rngOrSeed: (() => number) | number = Math.random) {

    if (cfg.bits <= 0) throw new Error('bits must be > 0');
    if (cfg.popSize <= 0) throw new Error('popSize must be > 0');
    if (cfg.generations <= 0) throw new Error('generations must be > 0');
    if (cfg.xmin >= cfg.xmax) throw new Error('xmin must be < xmax');
    this.cfg = cfg;
    if (typeof rngOrSeed === 'number') {
      let state = Math.floor(rngOrSeed) || 1;
      this.rng = () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return (state & 0xffffffff) / 0x100000000;
      };
    } else {
      this.rng = rngOrSeed;
    }
  }

  randChrom(): string { // generate random binary string of length = bits
    const bitsCount = this.cfg.bits;
    let chromStr = "";
    for (let index = 0; index < bitsCount; index++) {
      chromStr += this.rng() < 0.5 ? '0' : '1';
    }
    return chromStr;
  }

  decode(chrom: string): number { // decode binary string to real value in [xmin, xmax]
    const integerValue = parseInt(chrom, 2);
    const maxValue = Math.pow(2, chrom.length) - 1;
    const realValue = this.cfg.xmin + (integerValue / maxValue) * (this.cfg.xmax - this.cfg.xmin);
    return realValue;
  }

  crossover(a: string, b: string): [string, string] { // one-point crossover
    if (this.rng() > this.cfg.crossoverRate) return [a, b];
    const cutPoint = 1 + Math.floor(this.rng() * (a.length - 1));
    const childA = a.slice(0, cutPoint) + b.slice(cutPoint);
    const childB = b.slice(0, cutPoint) + a.slice(cutPoint);
    return [childA, childB];
  }

  mutate(chrom: string): string {
    let mutated = '';
    for (let index = 0; index < chrom.length; index++) {
      if (this.rng() < this.cfg.mutationRate) mutated += chrom[index] === '0' ? '1' : '0'; // flip bit
      else mutated += chrom[index];
    }
    return mutated;
  }

  select(pop: string[], fitness: number[]): string {
    const minFitness = Math.min(...fitness);
    const shiftedFitness = fitness.map(f => f - minFitness + 1e-12);
    const totalShifted = shiftedFitness.reduce((accumulator, value) => accumulator + value, 0); // sum of shifted fitness values
    if (totalShifted <= 0) return pop[Math.floor(this.rng() * pop.length)];
    const randValue = this.rng() * totalShifted;
    let accumulated = 0;
    for (let index = 0; index < pop.length; index++) {
      accumulated += shiftedFitness[index];
      if (randValue <= accumulated) return pop[index];
    }
    return pop[pop.length - 1];
  }

  run(fitnessFn: (x: number) => number): {bestChrom: string; bestX: number; bestFitness: number} { // main loop of the genetic algorithm
    const config = this.cfg;
    // init population
    let population: string[] = [];
    for (let index = 0; index < config.popSize; index++) population.push(this.randChrom());

    let bestChromosome = population[0];
    let bestFitness = -Infinity;

    for (let generation = 0; generation < config.generations; generation++) {
      const decodedXs = population.map(chrom => this.decode(chrom));
      const fitnessValues = decodedXs.map(value => fitnessFn(value));
      for (let index = 0; index < population.length; index++) { // track best solution
        if (fitnessValues[index] > bestFitness) {
          bestFitness = fitnessValues[index];
          bestChromosome = population[index];
        }
      }

      const nextPopulation: string[] = [];
      while (nextPopulation.length < config.popSize) {
        const parent1 = this.select(population, fitnessValues);
        const parent2 = this.select(population, fitnessValues);
        let [child1, child2] = this.crossover(parent1, parent2);
        child1 = this.mutate(child1);
        child2 = this.mutate(child2);
        nextPopulation.push(child1);
        if (nextPopulation.length < config.popSize) nextPopulation.push(child2); // ensure population size is maintained
      }
      population = nextPopulation;
    }

    const bestX = this.decode(bestChromosome);
    return {bestChrom: bestChromosome, bestX, bestFitness};
  }
}
