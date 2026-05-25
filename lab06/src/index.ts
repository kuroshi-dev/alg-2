import { Neuron, Network } from './neuron'
import { trainSeries, predictWith } from './timeSeries'

function demoLogic(): void {
  console.log('Logic functions demo:')
  const and = new Neuron([1, 1], 0, 'threshold', 1.5)   // AND
  const or  = new Neuron([1, 1], 0, 'threshold', 0.5)   // OR
  const not = new Neuron([-1.5], 0, 'threshold', -1)    // NOT

  const inputs2: number[][] = [[0, 0], [0, 1], [1, 0], [1, 1]]
  console.log('AND:')
  for (const x of inputs2) console.log(x, '->', and.output(x))

  console.log('OR:')
  for (const x of inputs2) console.log(x, '->', or.output(x))

  console.log('NOT:')
  console.log([0], '->', not.output([0]))
  console.log([1], '->', not.output([1]))

  
  const h1  = new Neuron([1, -1], 0, 'threshold', 0.5)
  const h2  = new Neuron([-1, 1], 0, 'threshold', 0.5)
  const out = new Neuron([1, 1], 0, 'threshold', 0.5)
  const xor = new Network([h1, h2], out) // XOR network 

  console.log('XOR:')
  for (const x of inputs2) console.log(x, '->', xor.run(x))
}


function demoTimeSeries(): void { // навчання нейрону
  console.log('\nTime series forecasting (variant 4)')
  const series: number[] = [0.13, 5.97, 0.57, 4.02, 0.31, 5.55, 0.15, 4.54, 0.65, 4.34, 1.54, 4.7, 0.58, 5.83, 0.03]

  const result = trainSeries(series, { eta: 0.01, maxEpochs: 20000, tol: 1e-6 })
  console.log('Trained weights:', result.weights.map((v) => v.toFixed(4)), 'bias:', result.bias?.toFixed(4))
 
  const x14_in: number[] = [series[10], series[11], series[12]]
  const pred14: number    = predictWith(result.weights, result.bias, x14_in)
  console.log('Predict x14 (expected', series[13], ') =>', pred14.toFixed(4))  // Передбачення x14

  const x15_in: number[] = [series[11], series[12], series[13]]
  const pred15: number   = predictWith(result.weights, result.bias, x15_in)
  console.log('Predict x15 (expected', series[14], ') =>', pred15.toFixed(4)) // Передбачення x15
}

demoLogic()
demoTimeSeries()
