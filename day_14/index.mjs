import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function getSmallestX(rockPaths) {
  return Math.min(...rockPaths.flat().map((coord) => coord.x))
}

function getGridSize(rockPaths, part2 = false) {
  const allX = rockPaths.flat().map((coord) => coord.x)
  const allY = rockPaths.flat().map((coord) => coord.y)
  const minX = Math.min(...allX)
  const maxX = Math.max(...allX)
  const maxY = Math.max(...allY)

  if (part2) {
    return { width: maxX, height: maxY + 2 }
  }

  return { width: maxX - minX, height: maxY }
}

function getRockPaths() {
  return input.map((rawPath) => {
    return rawPath.split(' -> ').map((rawCoord) => {
      const [x, y] = rawCoord.split(',').map((coord) => parseInt(coord))
      return { x: x, y }
    })
  })
}

function makeGrid(width, height, part2) {
  return new Array(height + 1).fill('').map(() => new Array(width + 1).fill('.'))
}

function printFrame(grid) {
  const frame = grid.map((row) => row.join('')).join('\n')

  console.log(frame)
}

function drawRocks(grid, rockPaths, smallestX, part2) {
  rockPaths.forEach((path) => {
    let pointerPos = null
    for (let i = 0; i < path.length; i++) {
      const current = { x: path[i].x - smallestX, y: path[i].y }

      if (i === 0) {
        pointerPos = current
      } else {
        const xOrY = current.x === pointerPos.x ? 'y' : 'x'
        const min = Math.min(pointerPos[xOrY], current[xOrY])
        const max = Math.max(pointerPos[xOrY], current[xOrY])

        for (let j = min; j < max + 1; j++) {
          if (xOrY === 'y') {
            grid[j][pointerPos.x] = '#'
          } else {
            grid[pointerPos.y][j] = '#'
          }
        }

        pointerPos = current
      }
    }
  })

  if (part2) {
    for (let i = 0; i < grid.at(-1).length; i++) {
      grid.at(-1)[i] = '#'
    }
  }
}

function getCellType(cell) {
  const map = {
    '.': false,
    '#': true,
    O: true,
  }

  return map?.[cell] ?? false
}

function getSandFloor(sand, grid) {
  const left = getCellType(grid[sand.y + 1]?.[sand.x - 1])
  const center = getCellType(grid[sand.y + 1]?.[sand.x])
  const right = getCellType(grid[sand.y + 1]?.[sand.x + 1])

  return { left, center, right }
}

function simulateSand(grid, smallestX, startSand = null) {
  const sand = startSand ?? { x: 500 - smallestX, y: 0 }

  while (true) {
    if (sand.y < 0 || sand.x < 0 || sand.y > grid.length - 1 || sand.x > grid[0].length - 1) {
      return false
    }
    const { left, center, right } = getSandFloor(sand, grid)

    if (!center) {
      sand.y++
    } else {
      if (center && left && right) {
        break
      } else {
        if (!left) {
          sand.x--
          sand.y++
          simulateSand(grid, smallestX, sand)
          break
        } else if (!right) {
          sand.x++
          sand.y++
          simulateSand(grid, smallestX, sand)
          break
        } else {
          break
        }
      }
    }
  }

  if (grid[sand.y]?.[sand.x]) {
    grid[sand.y][sand.x] = 'O'
  }

  return !grid[sand.y]?.[sand.x]
}

function simulateSandP2(grid, smallestX, startSand = null) {
  const sand = startSand ?? { x: 500 - (smallestX / 2), y: 0 }

  while (true) {
    const { left, center, right } = getSandFloor(sand, grid)

    if (!center) {
      sand.y++
    } else {
      if (center && left && right) {
        break
      } else {
        if (!left) {
          sand.x--
          sand.y++
          simulateSandP2(grid, smallestX, sand)
          break
        } else if (!right) {
          sand.x++
          sand.y++
          simulateSandP2(grid, smallestX, sand)
          break
        }
      }
    }
  }

  if (sand.y === 0) {
    return true
  }

  if (grid[sand.y]?.[sand.x]) {
    grid[sand.y][sand.x] = 'O'
  }
}

function part1() {
  const rockPaths = getRockPaths()
  const { width, height } = getGridSize(rockPaths)
  const grid = makeGrid(width, height)
  const smallestX = getSmallestX(rockPaths)
  drawRocks(grid, rockPaths, smallestX)

  let isSandInVoid = false
  let sandGrainCount = 0

  while (!isSandInVoid) {
    isSandInVoid = simulateSand(grid, smallestX)
    if (!isSandInVoid) {
      sandGrainCount++
    }
  }

  printFrame(grid)
  console.log('sandGrainCount', sandGrainCount)
}

function part2() {
  const rockPaths = getRockPaths()
  const { width, height } = getGridSize(rockPaths, true)
  const smallestX = getSmallestX(rockPaths)
  const grid = makeGrid(width, height)
  drawRocks(grid, rockPaths, smallestX / 2, true)

  let isSandOnTop = false
  let sandGrainCountP2 = 0

  while (!isSandOnTop) {
    isSandOnTop = simulateSandP2(grid, smallestX)
    sandGrainCountP2++
  }

  printFrame(grid)
  console.log('sandGrainCountP2', sandGrainCountP2)
}

part1()
part2()
