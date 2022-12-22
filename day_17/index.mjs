import rawInput from './input.mjs'
import * as rockList from './rocks.mjs'

// setup
const input = rawInput.split('')

function printFrame(gameState) {
  const rocks = gameState.rocks

  const grid = new Array(gameState.height).fill(new Array(7).fill('.')).map((row, y, gridRef) => {
    const realY = gridRef.length - 1 - y
    return row.map((_, x) => {
      const isRock = rocks.some((rock) => rock.hitboxes.some((hit) => rock.position.x + hit.x === x && rock.position.y + hit.y === realY))
      return isRock ? '#' : '.'
    })
  })

  const printableGrid = grid.map((row) => row.join('')).join('\n') + '\n'

  console.log(printableGrid, gameState.rocks.length)
}

function part1() {
  const maxRocks = 5
  const gameState = { height: 4, rocks: [] }
  const rockNameList = ['HBar', 'Cross', 'BackL', 'VBar', 'Square']

  for (let i = 0; i < maxRocks; i++) {
    const rockIndex = i % rockNameList.length
    const initialRockPos = { x: 2, y: gameState.height }
    console.log('initialRockPos', initialRockPos)
    const newRock = new rockList[rockNameList[rockIndex]]({ ...initialRockPos }, input)
    
    newRock.fall(gameState)
    gameState.rocks.push(newRock)
    printFrame(gameState)
  }
}

part1()

// todo
// separate x and y collision detection
