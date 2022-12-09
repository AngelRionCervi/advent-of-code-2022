import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

const crates = [
  'RCH',
  'FSLHJB',
  'QTJHDMR',
  'JBZHRGS',
  'BCDTZFPR',
  'GCHT',
  'LWPBZVNS',
  'CGQJR',
  'SFPHRTDL',
]

function getMove(rawMove) {
  const numbers = rawMove.match(/\d+/g)
  return {
    quantity: parseInt(numbers[0]),
    from: parseInt(numbers[1]) - 1,
    to: parseInt(numbers[2]) - 1,
  }
}

function getReorganizedCrates(isCrateMover9001) {
  return input.reduce((acc, rawMove) => {
    const { quantity, from, to } = getMove(rawMove)
  
    const fromCrates = acc[from].split('')
    const movedCrates = [...fromCrates].splice(0, quantity)
    acc[from] = [...fromCrates].splice(quantity, fromCrates.length - 1).join('')
    acc[to] = [...(!isCrateMover9001 ? movedCrates.reverse() : movedCrates), ...acc[to]].join('')
  
    return acc
  }, [...crates])
}

// part 1
const topCrates = getReorganizedCrates(false).map((newCrates) => newCrates[0]).join('')

console.log('topCrates', topCrates)

// part 2
const topCrates9001 = getReorganizedCrates(true).map((newCrates) => newCrates[0]).join('')

console.log('topCrates9001', topCrates9001)
