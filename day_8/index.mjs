import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

const grid = input.map((row) => row.split(''))

function getTreeLines(x, y) {
  const rightTrees = grid[y].slice(x + 1, Infinity)
  const leftTrees = grid[y].slice(0, x).reverse()
  const bottomTrees = grid.map((row) => row[x]).slice(y + 1, Infinity)
  const topTrees = grid
    .map((row) => row[x])
    .slice(0, y)
    .reverse()

  return {
    rightTrees,
    leftTrees,
    bottomTrees,
    topTrees,
  }
}

// part 1
function isTreeVisible(x, y) {
  const { rightTrees, leftTrees, bottomTrees, topTrees } = getTreeLines(x, y)
  return [rightTrees, leftTrees, bottomTrees, topTrees].some((treeLine) => {
    return treeLine.every((tree) => tree < grid[y][x])
  })
}
const treesVisibleOutsideSum = grid.reduce((acc, row, y) => {
  let visibleTreesInRow = 0
  row.forEach((_, x) => {
    visibleTreesInRow += isTreeVisible(x, y)
  })

  return acc + visibleTreesInRow
}, 0)

console.log('treesVisibleOutsideSum', treesVisibleOutsideSum)

// part 2
function calcScenicScore(treeLines, targetTreeHeight) {
  const lineScores = Object.values(treeLines).reduce((acc, line) => {
    let score = 0
    for (let i = 0; i < line.length; i++) {
      if (targetTreeHeight > line[i]) {
        score++
      } else {
        score++
        break
      }
    }
    return [...acc, score]
  }, [])

  return lineScores.reduce((acc, score) => acc * score, 1)
}

const highestScenicScore = grid.reduce((acc, row, y) => {
  let rowHighestScenicScore = 0
  row.forEach((_, x) => {
    const treeLines = getTreeLines(x, y)
    const scenicScore = calcScenicScore(treeLines, grid[y][x])
    if (rowHighestScenicScore < scenicScore) {
      rowHighestScenicScore = scenicScore
    }
  })

  if (rowHighestScenicScore > acc) {
    return rowHighestScenicScore
  }

  return acc
}, 0)

console.log('highestScenicScore', highestScenicScore)
