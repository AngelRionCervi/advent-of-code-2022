import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function parseInputLine(line) {
  const [direction, steps] = line.split(' ')
  return {
    direction,
    steps: parseInt(steps),
  }
}

function getUniqPositions(positions) {
  return positions.reduce((acc, pos) => {
    if (!acc.some((accPos) => accPos.x === pos.x && accPos.y === pos.y)) {
      acc = [...acc, pos]
    }
    return acc
  }, [])
}

function getNewHeadPos(direction, curHeadPos) {
  const newHeadPos = { ...curHeadPos }
  switch (direction) {
    case 'U':
      newHeadPos.y++
      break
    case 'D':
      newHeadPos.y--
      break
    case 'R':
      newHeadPos.x++
      break
    case 'L':
      newHeadPos.x--
      break
  }

  return newHeadPos
}

function getNewTailPos(curHeadPos, curTailPos) {
  const newTailPos = { ...curTailPos }
  let xSpace = curHeadPos.x - curTailPos.x
  let ySpace = curHeadPos.y - curTailPos.y

  if (xSpace === 2) {
    newTailPos.x++
  } else if (xSpace === -2) {
    newTailPos.x--
  }

  if (ySpace === 2) {
    newTailPos.y++
  } else if (ySpace === -2) {
    newTailPos.y--
  }

  if (Math.abs(xSpace) === 2 && Math.abs(ySpace) !== 2 && curHeadPos.y !== curTailPos.y) {
    newTailPos.y = curHeadPos.y
  } else if (Math.abs(ySpace) === 2 && Math.abs(xSpace) !== 2 && curHeadPos.x !== curTailPos.x) {
    newTailPos.x = curHeadPos.x
  }

  return newTailPos
}

function processSimulation(ropeSegments) {
  if (ropeSegments < 1) return

  const headPosList = [{ x: 0, y: 0 }]
  const tailsPosList = []

  for (let i = 0; i < ropeSegments; i++) {
    tailsPosList.push([{ x: 0, y: 0 }])
  }

  let curHeadPos = headPosList[0]
  const curTailsPos = tailsPosList.map((segment) => segment[0])

  input.forEach((line) => {
    const { direction, steps } = parseInputLine(line)

    for (let i = 0; i < steps; i++) {
      const newHeadPos = getNewHeadPos(direction, curHeadPos)
      headPosList.push(newHeadPos)
      curHeadPos = newHeadPos
      for (let j = 0; j < curTailsPos.length; j++) {
        const previousSegment = j === 0 ? curHeadPos : curTailsPos[j - 1]
        const newTailPos = getNewTailPos(previousSegment, curTailsPos[j])
        tailsPosList[j].push(newTailPos)
        curTailsPos[j] = newTailPos
      }
    }
  })

  return {
    headPosList,
    tailsPosList,
  }
}

// part 1
const simulation1Segment = processSimulation(1)
const uniqTailsPosSum1Segment = getUniqPositions(simulation1Segment.tailsPosList.at(-1)).length

console.log('uniqTailsPosSum1Segment', uniqTailsPosSum1Segment)

// part 2
const simulation9Segments = processSimulation(9)
const uniqTailsPosSum9Segments = getUniqPositions(simulation9Segments.tailsPosList.at(-1)).length

console.log('uniqTailsPosSum9Segments', uniqTailsPosSum9Segments)
