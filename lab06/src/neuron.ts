export type Activation = 'linear' | 'threshold' | 'sigmoid'

export class Neuron {
  weights:     number[]
  bias:        number
  activation:  Activation
  threshold:   number

  constructor(weights: number[], bias = 0, activation: Activation = 'threshold', threshold = 0.5) {
    this.weights    = weights
    this.bias       = bias
    this.activation = activation
    this.threshold  = threshold
  }

  activateLinear(s: number): number {
    return s >= 1 ? 1 : 0
  }

  activateThreshold(s: number): number {
    return s >= this.threshold ? 1 : 0
  }

  activateSigmoid(s: number): number {
    return 1 / (1 + Math.exp(-s))
  }

  output(inputs: number[]): number {
    const s = this.weights.reduce((acc, w, i) => acc + w * (inputs[i] ?? 0), 0) + this.bias
    if (this.activation === 'linear')    return this.activateLinear(s)
    if (this.activation === 'threshold') return this.activateThreshold(s)
    return this.activateSigmoid(s)
  }
}


export class Network { // Проста багатошарова мережа з одним прихованим шаром.
  hidden: Neuron[]
  out:    Neuron

  constructor(hidden: Neuron[], out: Neuron) {
    this.hidden = hidden
    this.out    = out
  }

  run(inputs: number[]): number {
    const hOut = this.hidden.map((h) => h.output(inputs))
    return this.out.output(hOut)
  }
}
