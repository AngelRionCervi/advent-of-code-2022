import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function getParsedCommand(line) {
  const [instr, arg] = line.split(' ')

  return {
    instr,
    arg: arg ? parseInt(arg) : null,
  }
}

function sumSignalStrengths(cycles, stack) {
  const targetedStacks = stack.filter((_, index) => cycles.map((cycle) => cycle - 1).includes(index))

  return targetedStacks.reduce((acc, { x, index }) => acc + x * index, 0)
}

function createStack() {
  const stack = []
  let xSum = 1

  input.forEach((line) => {
    const { instr, arg } = getParsedCommand(line)
    if (instr === 'noop') {
      stack.push({ instr, x: xSum, index: stack.length + 1 })
    }

    if (instr === 'addx') {
      for (let i = 0; i < 2; i++) {
        stack.push({ instr, x: xSum, index: stack.length + 1 })
      }
      xSum += arg
    }
  })

  return stack
}

// part 1
const cyclesToCheck = [20, 60, 100, 140, 180, 220]
const stackPart1 = createStack()

const sumSignalStrenghts = sumSignalStrengths(cyclesToCheck, stackPart1)

console.log('sumSignalStrenghts', sumSignalStrenghts)

// part 2
const crt = []
let spriteX = 1

const stackPart2 = createStack()

function renderCycle(stackItem, index) {
  if (index % 40 === 0) {
    crt.push([])
  }

  const currentRow = crt.at(-1)
  spriteX = stackItem.x
  if (spriteX === currentRow.length || spriteX === currentRow.length - 1 || spriteX === currentRow.length + 1) {
    currentRow.push('#')
  } else {
    currentRow.push('.')
  }
}

stackPart2.forEach((stackItem, index) => {
  renderCycle(stackItem, index)
})

const readableCrt = crt.map((line) => line.join(''))

console.log('readableCrt', readableCrt)
