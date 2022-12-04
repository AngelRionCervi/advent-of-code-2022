import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function getPair(rawPair) {
  return rawPair.split(',')
}

function getFullArea(area) {
  const [start, finish] = area.split('-').map((a) => parseInt(a))
  const fullArea = []
  for (let i = start; i <= finish; i++) {
    fullArea.push(i)
  }

  return fullArea
}

function isOneAreaIntoTheOther(area1, area2, useSome) {
  const method = useSome ? 'some' : 'every'
  const [area1Full, area2Full] = [getFullArea(area1), getFullArea(area2)]

  return area1Full[method]((a) => area2Full.includes(a)) || area2Full[method]((a) => area1Full.includes(a))
}

// part 1
const containedPairSum = input.reduce((acc, rawPair) => {
  const [area1, area2] = getPair(rawPair)
  const isContained = isOneAreaIntoTheOther(area1, area2)

  return acc + isContained
}, 0)

console.log('containedPairSum', containedPairSum)

// part 2
const overlappedPairSum = input.reduce((acc, rawPair) => {
  const [area1, area2] = getPair(rawPair)
  const isOverlapped = isOneAreaIntoTheOther(area1, area2, true)

  return acc + isOverlapped
}, 0)

console.log('overlappedPairSum', overlappedPairSum)
