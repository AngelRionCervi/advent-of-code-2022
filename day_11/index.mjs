import rawInput from './input.mjs'

// setup
const input = rawInput.split('\n\n')

let monkeys = []
let modeFactor = null

function get2MostActiveMonkeyProd() {
  const [mostActiveMonkey1SumPart2, mostActiveMonkey2SumPart2] = monkeys
    .sort((a, b) => b.inspectedItemsSum - a.inspectedItemsSum)
    .map((monkey) => monkey.inspectedItemsSum)

  return mostActiveMonkey1SumPart2 * mostActiveMonkey2SumPart2
}

class Monkey {
  inspectedItemsSum = 0
  itemsToRemoveIndex = []

  constructor(rawMonkeyBlock) {
    Object.assign(this, this.parseRawMonkeyBlock(rawMonkeyBlock))
  }

  parseRawMonkeyBlock(rawMonkeyBlock) {
    const [idLine, itemsLine, operationLine, testLine, testTrueLine, testFalseLine] = rawMonkeyBlock.split('\n')

    return {
      id: parseInt(idLine.match(/\d+/)[0]),
      items: itemsLine
        .split(': ')[1]
        .split(', ')
        .map((n) => parseInt(n)),
      operation: operationLine.split('new = old ')[1].split(' '),
      test: parseInt(testLine.split('divisible ')[1].split(' ')[1]),
      testTrue: parseInt(testTrueLine.split('monkey ')[1]),
      testFalse: parseInt(testFalseLine.split('monkey ')[1]),
    }
  }

  processItems(part2) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i]
      const [opLeft, opRight] = this.operation
      const opNumber = opRight === 'old' ? item : parseInt(opRight)
      if (opLeft === '*') {
        item *= opNumber
      } else if (opLeft === '+') {
        item += opNumber
      }
      if (part2) {
        console.log('item 1', item)
        item %= modeFactor
        console.log('item 2', item)
      } else {
        item = Math.floor(item / 3)
      }

      this.inspectedItemsSum++
      this.throwItemTo(item, item % this.test === 0 ? this.testTrue : this.testFalse)
      this.itemsToRemoveIndex.push(i)
    }
    this.removeItems()
  }

  throwItemTo(item, monkeyId) {
    const targetMonkey = monkeys.find((monkey) => monkey.id === monkeyId)
    targetMonkey.receiveItem(item)
  }

  receiveItem(item) {
    this.items.push(item)
  }

  removeItems() {
    this.items = this.items.filter((_, index) => !this.itemsToRemoveIndex.includes(index))
    this.itemsToRemoveIndex = []
  }

  printMonkeyBlock() {
    console.log(this)
  }
}

function setupMonkeys(part2) {
  monkeys = []
  const rounds = part2 ? 10000 : 20

  input.forEach((rawMonkeyBlock) => {
    monkeys.push(new Monkey(rawMonkeyBlock))
  })

  if (part2) {
    // smallest number that can be dividev by all the monkeys divisors (test)
    modeFactor = monkeys.reduce((acc, monkey) => acc * monkey.test, 1)
  }

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
      monkey.processItems(part2)
    })
  }
}

// part 1
setupMonkeys(false)
const monkeyBusinessScorePart1 = get2MostActiveMonkeyProd()

console.log('monkeyBusinessScorePart1', monkeyBusinessScorePart1)

// part 2
setupMonkeys(true)
const monkeyBusinessScorePart2 = get2MostActiveMonkeyProd()

console.log('monkeyBusinessScorePart2', monkeyBusinessScorePart2)
