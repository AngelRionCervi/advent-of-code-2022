import rawInput from './input.mjs'

// setup
const input = rawInput

function getProcessedCharCount(uniqCharsLength) {
  let processedCharCount = 0

  while ([...new Set(input.slice(processedCharCount, processedCharCount + uniqCharsLength))].length < uniqCharsLength) {
    processedCharCount++
  }

  processedCharCount += uniqCharsLength

  return processedCharCount
}

// part 1
console.log('processedCharCount4', getProcessedCharCount(4))

// part 2
console.log('processedCharCount14', getProcessedCharCount(14))
