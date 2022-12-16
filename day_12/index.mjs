import rawInput from './input.mjs'

// setup
const input = rawInput

function getInput() {
  return input.split('\n').reduce(
    (acc, row, y) => {
      const parsedRow = row.split('').map((char, x) => {
        if (char === 'S') {
          acc.start = { x, y }
          return 0
        } else if (char === 'E') {
          acc.end = { x, y }
          return 25
        }

        return char.charCodeAt(0) - 'a'.charCodeAt(0)
      })

      return { ...acc, grid: [...acc.grid, parsedRow] }
    },
    { grid: [], start: null, end: null }
  )
}

function getAllPoints(targetAlt, grid) {
  return grid.reduce((acc, row, y) => {
    const rowRes = row.reduce((rowAcc, alt, x) => {
      if (alt === targetAlt) {
        return [...rowAcc, { x, y }]
      }
      return rowAcc
    }, [])
    return [...acc, ...rowRes]
  }, [])
}

function getNeighbors(x, y, grid) {
  const neighbors = []

  if (y + 1 < grid.length && grid[y + 1][x] <= grid[y][x] + 1) {
    neighbors.push(pointToInt(x, y + 1))
  }
  if (y - 1 >= 0 && grid[y - 1][x] <= grid[y][x] + 1) {
    neighbors.push(pointToInt(x, y - 1))
  }
  if (x + 1 < grid[y].length && grid[y][x + 1] <= grid[y][x] + 1) {
    neighbors.push(pointToInt(x + 1, y))
  }
  if (x - 1 >= 0 && grid[y][x - 1] <= grid[y][x] + 1) {
    neighbors.push(pointToInt(x - 1, y))
  }

  return neighbors
}

function pointToInt(x, y) {
  return y * 1000 + x
}

function intToPoint(int) {
  return {
    y: Math.floor(int / 1000),
    x: int % 1000,
  }
}

function dijkstraDist(grid, start, end) {
  const dist = {}
  const queue = []

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const id = pointToInt(x, y)
      dist[id] = Infinity
      queue.push(id)
    }
  }

  dist[pointToInt(start.x, start.y)] = 0

  while (queue.length) {
    let current = null

    for (const next of queue) {
      if (current === null || dist[next] < dist[current]) {
        current = next
      }
    }

    if (current === pointToInt(end.x, end.y)) {
      break
    }

    queue.splice(
      queue.findIndex((x) => x === current),
      1
    )

    const point = intToPoint(current)
    const neighbors = getNeighbors(point.x, point.y, grid)

    for (const neighbor of neighbors) {
      if (queue.includes(neighbor)) {
        const alt = dist[current] + 1

        if (alt < dist[neighbor]) {
          dist[neighbor] = alt
        }
      }
    }
  }

  return dist
}

function part1() {
  const { grid, start, end } = getInput()
  const data = dijkstraDist(grid, start, end)
  const distance = data[pointToInt(end.x, end.y)]

  console.log('distance', distance)
}

// unga bunga
function part2() {
  const { grid, end } = getInput()
  const allAPoints = getAllPoints(0, grid)
  const data = allAPoints.map((aPoint) => dijkstraDist(grid, aPoint, end)[pointToInt(end.x, end.y)])
  const smallestDistance = data.sort((a, b) => a - b)[0]

  console.log('smallestDistance', smallestDistance)
}

part1()
part2()
