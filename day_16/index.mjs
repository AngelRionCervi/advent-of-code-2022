import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function getInput() {
  return input.reduce((acc, rawLine) => {
    const [valve, tunnels] = rawLine.split('; ')
    const name = valve.match(/[A-Z]{2}/)[0]
    const rate = parseInt(valve.match(/\d+/)[0])
    const to = tunnels.match(/[A-Z]{2}/g)

    const valveObj = {
      name,
      rate,
      to,
    }
    return { ...acc, [name]: valveObj }
  }, {})
}

function getDistances(valves) {
  const distances = {}

  for (const valve of valves) {
    if (valve.name !== 'AA' && valve.rate === 0) {
      continue
    }

    distances[valve.name] = { [valve.name]: 0, AA: 0 }
    const visited = new Set([valve])

    const queue = [[0, valve]]

    while (queue.length) {
      const [distance, position] = queue.shift()
      for (const neighbor of position.to) {
        if (visited.has(neighbor)) {
          continue
        }
        visited.add(neighbor)
        const corrValve = valves.find((v) => v.name === neighbor)
        if (corrValve.rate) {
          distances[valve.name][neighbor] = distance + 1
        }
        queue.push([distance + 1, corrValve])
      }
    }

    delete distances[valve.name][valve.name]
    if (valve.name !== 'AA') {
      delete distances[valve.name]['AA']
    }
  }

  return distances
}

function dfs(time, valve, valves, openMap) {
  let maxVal = 0

  for (const neighbor in valve.distances) {
    if (openMap[neighbor]) {
      continue
    }
    const remTime = time - valve.distances[neighbor] - 1
    if (remTime <= 0) {
      continue
    }
    const newOpenMap = { ...openMap, [neighbor]: true }
    const dfsVal = dfs(remTime, valves[neighbor], valves, newOpenMap) + valves[neighbor].rate * remTime
    maxVal = Math.max(maxVal, dfsVal)
  }

  return maxVal
}

function dfsBitmask(time, valve, valves, indices, bitmask) {
  let maxVal = 0

  for (const neighbor in valve.distances) {
    const bit = 1 << indices[neighbor]
    if (bitmask & bit) {
      continue
    }
    const remTime = time - valve.distances[neighbor] - 1
    if (remTime <= 0) {
      continue
    }
    const dfsVal = dfsBitmask(remTime, valves[neighbor], valves, indices, bitmask | bit) + valves[neighbor].rate * remTime
    maxVal = Math.max(maxVal, dfsVal)
  }

  return maxVal
}

function part1() {
  const valves = getInput()
  const maxMinutes = 30
  const distances = getDistances(Object.values(valves))

  Object.entries(distances).forEach(([key, distances]) => {
    valves[key].distances = distances
  })

  const maxPressure = dfs(maxMinutes, valves['AA'], valves, {})

  console.log('maxPressure part 1', maxPressure)
}

function part2() {
  const valves = getInput()
  const maxMinutes = 26
  const distances = getDistances(Object.values(valves))
  const indices = {}

  Object.entries(distances).forEach(([key, distances]) => {
    valves[key].distances = distances
  })

  const noneEmpty = Object.values(valves).filter((v) => v.name !== 'AA' && v.rate > 0)
  noneEmpty.forEach(({ name }, i) => {
    indices[name] = i
  })
  const range = (1 << noneEmpty.length) - 1
  let maxPressure = 0

  for (let i = 0; i < range + 1; i++) {
    const dfsHuman = dfsBitmask(maxMinutes, valves['AA'], valves, indices, i)
    const dfsElephant = dfsBitmask(maxMinutes, valves['AA'], valves, indices, range ^ i)
    maxPressure = Math.max(maxPressure, dfsHuman + dfsElephant)
  }

  console.log('maxPressure part 2', maxPressure)
}

part1()
part2()
