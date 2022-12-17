import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function zip(arr1, arr2) {
  const len = Math.max(arr1.length, arr2.length)
  const zipArr = []
  for (let i = 0; i < len; i++) {
    zipArr.push([arr1[i], arr2[i]])
  }

  return zipArr
}

function getInput() {
  return input.reduce(
    (acc, rawLine) => {
      const coords = rawLine.match(/-?\d*\.{0,1}\d+/g).map((coord) => parseInt(coord))
      return { ...acc, sensors: [...acc.sensors, { x: coords[0], y: coords[1] }], beacons: [...acc.beacons, { x: coords[2], y: coords[3] }] }
    },
    { sensors: [], beacons: [] }
  )
}


function correctForDevice(widths, devices, y, count) {
  const xs = widths.map(({ x }) => x)
  const maxX = Math.max(...xs)
  const minX = Math.min(...xs)

  devices.forEach((beacon) => {
    if (beacon.x >= minX && beacon.x <= maxX && beacon.y === y) {
      count--
    }
  })

  return count
}

function getUniqDevice(beacons) {
  return beacons.reduce((acc, { x, y }) => {
    if (!acc.some((b) => b.x === x && b.y === y)) {
      return [...acc, { x, y }]
    }

    return acc
  }, [])
}

function getSensorWidthAtY(sensor, y) {
  const toY = Math.abs(y - sensor.y)
  const width = (sensor.reach - toY) * 2 + 1

  return { width, x: sensor.x - (width - 1) / 2 }
}

function getSensorReach(sensor, beacon) {
  return Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
}

function countRange(widths) {
  const smallestX = Math.abs(Math.min(...widths.map(({ x }) => x)))
  const sortedX = widths.sort((a, b) => a.x - b.x).map(({ x, width }) => ({ x: x + smallestX, width }))

  let count = 0
  let prevItem = null
  for (let i = 0; i < sortedX.length; i++) {
    const item = sortedX[i]

    if (!prevItem) {
      count += item.width
    } else if (prevItem.x + prevItem.width < item.x + item.width) {
      if (item.x > prevItem.x + prevItem.width) {
        count += item.width
      } else {
        count += item.x - count + item.width
      }
    }

    if (prevItem && item.x + item.width < prevItem.x + prevItem.width) {
      continue
    }

    prevItem = item
  }

  return count
}

function findEmptyStep(widths) {
  const smallestX = Math.abs(Math.min(...widths.map(({ x }) => x)))
  const sortedX = widths.sort((a, b) => a.x - b.x).map(({ x, width }) => ({ x: x + smallestX, width }))

  let count = 0
  let prevItem = null
  for (let i = 0; i < sortedX.length; i++) {
    const item = sortedX[i]

    if (!prevItem) {
      count += item.width
    } else if (prevItem.x + prevItem.width < item.x + item.width) {
      if (item.x > prevItem.x + prevItem.width) {
        const stopX = count - smallestX
        if (stopX > 0) {
          return count - smallestX
        }
      } else {
        count += item.x - count + item.width
      }
    }

    if (prevItem && item.x + item.width < prevItem.x + prevItem.width) {
      continue
    }

    prevItem = item
  }

  return false
}

function part1() {
  const { sensors, beacons } = getInput()
  const widths = []
  const yToCheck = 2000000

  zip(sensors, beacons).forEach(([sensor, beacon]) => {
    sensor.reach = getSensorReach(sensor, beacon)
    const sensorWidth = getSensorWidthAtY(sensor, yToCheck)
    if (sensorWidth.width > 0) {
      widths.push(sensorWidth)
    }
  })

  const count = countRange(widths)
  const countWithNoBeacons = correctForDevice(widths, getUniqDevice(beacons), yToCheck, count)
  const countWithNoSensors = correctForDevice(widths, getUniqDevice(sensors), yToCheck, countWithNoBeacons)

  console.log('countWithNoSensors', countWithNoSensors)
}

function part2() {
  const { sensors, beacons } = getInput()
  const coordLimit = 4000000
  let tuningFreq = null

  for (let y = 0; y < coordLimit; y++) {
    const widths = []

    zip(sensors, beacons).forEach(([sensor, beacon]) => {
      sensor.reach = getSensorReach(sensor, beacon)
      const sensorWidth = getSensorWidthAtY(sensor, y)
      if (sensorWidth.width > 0) {
        widths.push(sensorWidth)
      }
    })

    const stopX = findEmptyStep(widths)
    if (stopX) {
      tuningFreq = stopX * coordLimit + y
      break
    }
  }

  console.log('tuningFreq', tuningFreq)
}

part1()
part2()
