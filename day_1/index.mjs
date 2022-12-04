import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n\n')

function getElveCalories(caloriesChunk) {
  return caloriesChunk.split('\n').reduce((acc, calory) => {
    return acc + parseInt(calory)
  }, 0)
}

// part 1
const calories = input.reduce((acc, caloriesChunk) => {
  const elveCalories = getElveCalories(caloriesChunk)

  return [...acc, elveCalories]
}, [])

const fattestElve = calories.sort((a, b) => b - a)[0]

console.log('fattestElve', fattestElve)

// part 2
const top3FattestElves = calories.sort((a, b) => b - a).splice(0, 3)
const top3TotalCalories = top3FattestElves.reduce((acc, calory) => acc + calory, 0)

console.log('top3TotalCalories', top3TotalCalories)
