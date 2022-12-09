import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')

function getCommand(rawLine) {
  const instruction = rawLine.split(' ')[1]
  const args = rawLine.split(' ')[2]

  return {
    instruction,
    args,
  }
}

function getData(rawLine) {
  const [part1, name] = rawLine.split(' ')
  const isDir = part1 === 'dir'

  return {
    isDir,
    size: !isDir ? part1 : null,
    name,
  }
}

function getLine(rawLine) {
  const type = rawLine.startsWith('$') ? 'command' : 'data'
  const command = type === 'command' ? getCommand(rawLine) : null
  const data = type === 'data' ? getData(rawLine) : null

  return {
    type,
    command,
    data,
  }
}

let currentPath = '/'
const directoriesMap = {}

input.forEach((rawLine) => {
  const { type, command, data } = getLine(rawLine)

  if (type === 'command') {
    if (command.instruction === 'cd') {
      if (!['..', '/'].includes(command.args)) {
        currentPath = `${currentPath}${currentPath === '/' ? '' : '/'}${command.args}`
      } else {
        if (command.args === '..') {
          const pathArr = currentPath.split('/')
          pathArr.pop()
          currentPath = pathArr.join('/')
        } else if (command.args === '/') {
          currentPath = '/'
        }
      }
    }
  } else if (type === 'data') {
    if (data.isDir) {
      directoriesMap[currentPath] = {
        ...directoriesMap[currentPath],
        children: [...(directoriesMap[currentPath]?.children ?? []), data.name],
      }
    } else {
      directoriesMap[currentPath] = { ...directoriesMap[currentPath], [data.name]: parseInt(data.size) }
    }
  }
})

function getDirSize(path) {
  const dir = directoriesMap[path]
  let size = Object.values(dir)
    .filter((value) => typeof value === 'number')
    .reduce((acc, val) => acc + val, 0)
  if (dir?.children) {
    dir.children.forEach((childDirName) => {
      size += getDirSize(`${path}${path === '/' ? '' : '/'}${childDirName}`)
    })
  }
  return size
}

// part 1
const inBoundDirSums = Object.keys(directoriesMap).reduce((acc, path) => {
  const dirSize = getDirSize(path)
  return acc + (dirSize <= 100000 ? dirSize : 0)
}, 0)

console.log('inBoundDirSums', inBoundDirSums)

// part 2
const directoriesSizes = Object.keys(directoriesMap).reduce((acc, path) => {
  const dirSize = getDirSize(path)
  return { ...acc, [path]: dirSize }
}, 0)

const totalUsedSpace = directoriesSizes['/']

const dirToRemoveSize = Object.values(directoriesSizes).reduce((acc, size) => {
  if ((70000000 - totalUsedSpace + size >= 30000000) && size < acc) {
    return size
  }

  return acc
}, Infinity)

console.log('dirToRemoveSize', dirToRemoveSize)
