import rawInput from './input.mjs'

// setup
const input = rawInput

const grid = input.split('\n').map((row) => row.split(''))
const alphabet = 'abcdefghijklmnopqrstuvwxyz'

function getCharPosition(char) {
  for (let i = 0; i < grid.length; i++) {
    const row = grid[i]
    const x = row.findIndex((c) => c === char)
    if (x !== -1) {
      return { y: i, x }
    }
  }
}

function getNextIndex(nodes) {
  const lowestFScore = nodes.sort((a, b) => a.fScore - b.fScore)[0].fScore
  const nextIndex = nodes.findIndex((node) => node.fScore === lowestFScore)

  return nextIndex
}

function getDistance(nodeCoord, goalCoord) {
  return Math.abs(nodeCoord.x - goalCoord.x) + Math.abs(nodeCoord.y - goalCoord.y)
}

function findNeighbours(node) {
  const nodeCharIndex = alphabet.indexOf(node.char)
  const right = { x: node.x + 1, y: node.y, char: grid[node.y]?.[node.x + 1] }
  const left = { x: node.x - 1, y: node.y, char: grid[node.y]?.[node.x - 1] }
  const top = { x: node.x, y: node.y - 1, char: grid[node.y - 1]?.[node.x] }
  const bottom = { x: node.x, y: node.y + 1, char: grid[node.y + 1]?.[node.x] }

  return [top, bottom, right, left].filter(({ char }) => {
    //return char
    let charToCompare = char
    if (char === 'S') {
      charToCompare = 'a'
    } else if (char === 'E') {
      charToCompare = 'z'
    }
    if (charToCompare) {
      const neighbourCharIndex = alphabet.indexOf(charToCompare)
      const isUpOne = nodeCharIndex === neighbourCharIndex - 1
      const isDownOne = nodeCharIndex === neighbourCharIndex + 1
      const isFlat = nodeCharIndex === neighbourCharIndex

      return isFlat || isUpOne || isDownOne
    }

    return false
  })
}

function getPath(endNode, start) {
  const path = []
  let curNode = endNode
  let index = 0
  while (curNode?.parent) {
    path.push({ x: curNode.x, y: curNode.y, char: curNode.char, index })
    curNode = curNode?.parent
    index++
  }
  path.push({ x: start.x, y: start.y, char: start.char, index: index + 1 })

  return path
}

function renderPath(path, debug = false) {
  const gridRows = grid.map((row) => row.map((c) => debug ? c : '.'))

  path.reverse().forEach(({ x, y }, index) => {
    const next = path[index + 1]
    if (next) {
      if (x !== next.x) {
        gridRows[y][x] = x > next.x ? '<' : '>'
      } else if (y !== next.y) {
        gridRows[y][x] = y > next.y ? '^' : '⌄'
      }
    }
  })

  const printableGrid = gridRows.map((row) => row.join('')).join('\n')
  console.log(printableGrid + '\n')
}

// part 1
const startCoord = getCharPosition('S')
const goalCoord = getCharPosition('E')
const start = { ...startCoord, char: 'S', neighbours: [], gScore: 0, fScore: getDistance(startCoord, goalCoord) }
const goal = { ...goalCoord, char: 'E', neighbours: [] }

const open = [start]
const closed = []

let endNode = null

while (open.length) {
  const next = open.splice(getNextIndex(open), 1)[0]

  // if (!open.length) {
  //   console.log('THE END', next)
  // }

  closed.push(next)

  // if (closed.some((node) => node.x === next.x && node.y === next.y)) {
  //   console.log('shit')
  //   renderPath(getPath(next, start))
  // }
  renderPath(getPath(next, start))

  if (next.x === goal.x && next.y === goal.y) {
    endNode = next
    break
  }

  next.neighbours = findNeighbours(next)//.filter((node) => !closed.some((closedNode) => node.x === closedNode.x && node.y === closedNode.y))

  for (const neighbour of next.neighbours) {
    neighbour.parent = next
    const newGScore = getDistance(neighbour, start)

    if (!neighbour.gScore || newGScore < neighbour.gScore) {
      neighbour.gScore = newGScore
      neighbour.fScore = newGScore + getDistance(neighbour, goal)

      if (!open.some((node) => node.x === neighbour.x && node.y === neighbour.y)) {
        open.push(neighbour)
      }
    }
  }
}

const path = getPath(endNode, start)
renderPath(path)
console.log(path.length - 1)
