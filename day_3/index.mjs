import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n')
const chars = 'abcdefghijklmnopqrstuvwxyz'
const lowerChars = chars.split('').map((char, index) => {
  return { char, priority: 1 + index }
})
const upperChars = lowerChars.map(({ char, priority }) => {
  return { char: char.toUpperCase(), priority: 26 + priority }
})
const charsList = [...lowerChars, ...upperChars]

// helper
function findCommonItem(sacks) {
  return sacks.reduce((acc, sack, index) => {
    const nextSack = sacks[index + 1]

    if (!nextSack) return acc

    const candidates = (acc.length ? acc : sack.split('')).reduce((itemAcc, item) => {
      if (nextSack.includes(item)) {
        return [...itemAcc, item]
      }

      return itemAcc
    }, [])

    return candidates
  }, [])[0]
}

// part 1
const prioritySum = input.reduce((acc, rucksack) => {
  const splitIndex = rucksack.length / 2
  const [sackA, sackB] = [rucksack.slice(0, splitIndex), rucksack.slice(splitIndex)]
  const commonItem = findCommonItem([sackA, sackB])
  const priority = charsList.find(({ char }) => char === commonItem).priority

  return acc + priority
}, 0)

console.log('prioritySum', prioritySum)

//part 2
const elvesGroups = new Array(input.length / 3).fill('').reduce(
  (acc) => {
    const newGroup = [input[acc.accIndex], input[acc.accIndex + 1], input[acc.accIndex + 2]]

    return { groups: [...acc.groups, newGroup], accIndex: acc.accIndex + 3 }
  },
  { groups: [], accIndex: 0 }
).groups

const groupsSum = elvesGroups.reduce((acc, group) => {
  const commonItem = findCommonItem(group)
  const priority = charsList.find(({ char }) => char === commonItem).priority

  return acc + priority
}, 0)

console.log('groupsSum', groupsSum)
