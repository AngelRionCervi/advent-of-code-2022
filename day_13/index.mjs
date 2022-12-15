import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n\n')

const parsedInput = input.map((arrPair) => arrPair.split('\n').map((a) => JSON.parse(a)))

function zip(arr1, arr2) {
  const len = Math.max(arr1.length, arr2.length)
  const zipArr = []
  for (let i = 0; i < len; i++) {
    zipArr.push([arr1[i], arr2[i]])
  }

  return zipArr
}

function deepArrCompare(arr1, arr2) {
  for (const [left, right] of zip(arr1, arr2)) {
    if (left === undefined) {
      return true
    } else if (right === undefined) {
      return false
    }

    if (typeof left === 'number' && typeof right === 'number') {
      if (left === right) {
        continue
      } else {
        return left < right
      }
    }

    const deepComp = deepArrCompare([left].flat(), [right].flat())
    if (deepComp === true || deepComp === false) {
      return deepComp
    }
  }
}

// part 1
const correctPairsIndexSum = parsedInput.reduce((acc, arrPair, index) => {
  const result = deepArrCompare(arrPair[0], arrPair[1])
  if (result) {
    acc += index + 1
  }

  return acc
}, 0)

console.log('correctPairsSum', correctPairsIndexSum)

// part 2
const dividerPackets = [[[2]], [[6]]]
const flatInput = parsedInput.flat()
flatInput.push(...dividerPackets)

const sortedCompare = flatInput.sort((a, b) => deepArrCompare(a, b) ? -1 : 1)
const parsedSortedCompare = sortedCompare.map((arr) => `${JSON.stringify(arr)}`)
const [dividerIndex1, dividerIndex2] =  [parsedSortedCompare.indexOf('[[2]]'), parsedSortedCompare.indexOf('[[6]]')]
const decoderKey = (dividerIndex1 + 1) * (dividerIndex2 + 1)

console.log('decoderKey', decoderKey)
