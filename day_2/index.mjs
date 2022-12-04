import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

const resultPoints = {
  win: 6,
  tie: 3,
  lose: 0,
}

const figurePoints = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
}

function getTurn(p1, p2, part1) {
  const usePart = (r1, r2) => part1 ? r1 : r2

  if (p1 === 'A') {
    switch(p2) {
      case 'X': return usePart('tie', 'Z') 
      case 'Y': return usePart('win', 'X')
      case 'Z': return usePart('lose', 'Y')
    }
  }
  if (p1 === 'B') {
    switch(p2) {
      case 'X': return usePart('lose', 'X') 
      case 'Y': return usePart('tie', 'Y') 
      case 'Z': return usePart('win', 'Z') 
    }
  }
  if (p1 === 'C') {
    switch(p2) {
      case 'X': return usePart('win', 'Y') 
      case 'Y': return usePart('lose', 'Z') 
      case 'Z': return usePart('tie', 'X') 
    }
  }
}

// part 1
const scorePart1 = input.reduce((scoreAcc, turn) => {
  const [opponentTurn, playerTurn] = turn.split(' ')
  const turnResult = getTurn(opponentTurn, playerTurn, true)

  return scoreAcc + resultPoints[turnResult] + figurePoints[playerTurn]
}, 0)

console.log('scorePart1', scorePart1)

// part 2
const scorePart2 = input.reduce((scoreAcc, turn) => {
  const [opponentTurn, neededResult] = turn.split(' ')
  const playerTurn = getTurn(opponentTurn, neededResult, false)
  const turnResult = getTurn(opponentTurn, playerTurn, true)

  return scoreAcc + resultPoints[turnResult] + figurePoints[playerTurn]
}, 0)

console.log('scorePart2', scorePart2)