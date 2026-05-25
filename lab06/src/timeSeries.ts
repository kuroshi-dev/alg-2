import { Neuron } from './neuron'

export interface TrainResult {
  weights: number[]
  bias:    number
  history: number[]
}

function sigmoidScaled(s: number): number {
  return (1 / (1 + Math.exp(-s))) * 10
}

function dSigmoidScaled(s: number): number {
  const ex    = Math.exp(-s)
  const denom = (1 + ex)
  return (ex / (denom * denom)) * 10
}

export function trainSeries(series: number[], opts?: { eta?: number; maxEpochs?: number; tol?: number }): TrainResult {
  const eta       = opts?.eta ?? 0.01 // Коефіцієнт навчання (learning rate)
  const maxEpochs = opts?.maxEpochs ?? 10000
  const tol       = opts?.tol ?? 1e-4

  const trainLen = 13
  if (series.length < 15) throw new Error('Series must have at least 15 numbers')

  const nExamples = trainLen - 3
  const inputs:  number[][] = Array.from({ length: nExamples }, (unusedValue, i) => [series[i], series[i + 1], series[i + 2]])
  const targets: number[]   = Array.from({ length: nExamples }, (unusedValue, i) => series[i + 3])

  let w: number[] = [1, 1, 1]
  let b: number   = 0
  let E0: number  = Infinity
  const history: number[] = []

  for (let epoch = 0; epoch < maxEpochs; epoch++) {
    let E: number = 0
    const deltaWSum: number[] = [0, 0, 0]
    let deltaBSum: number = 0

    for (let i = 0; i < inputs.length; i++) {
      const x: number[] = inputs[i]
      const S: number = w[0] * x[0] + w[1] * x[1] + w[2] * x[2] + b
      const Y: number = sigmoidScaled(S)
      const y: number = targets[i]
      const err: number = Y - y
      E += err * err

      const dYdS: number = dSigmoidScaled(S)
      for (let j = 0; j < 3; j++) {
        const grad: number = err * dYdS * x[j]
        deltaWSum[j] += -eta * grad
      }
      const gradB: number = err * dYdS * 1
      deltaBSum += -eta * gradB
    }

    for (let j = 0; j < 3; j++) w[j] += deltaWSum[j] / inputs.length
    b += deltaBSum / inputs.length

    history.push(E)
    if (Math.abs(E - E0) < tol) break
    E0 = E
  }

  return { weights: w, bias: b, history }
}

export function predictWith(weights: number[], bias: number, x: number[]): number {
  const s: number = weights[0] * x[0] + weights[1] * x[1] + weights[2] * x[2] + bias
  return sigmoidScaled(s)
}
