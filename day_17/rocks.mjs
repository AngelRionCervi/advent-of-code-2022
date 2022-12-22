class Rock {
  position = null
  jetPattern = null

  constructor(position, jetPattern) {
    this.position = position
    this.jetPattern = jetPattern
  }

  checkCollisions(rocks, newPos) {
    let collisions = { xCol: false, yCol: false }

    if (newPos.x < 0 || newPos.x + this.width - 1 > 7) {
      collisions.xCol = true
    }
    if (newPos.y < 0) {
      collisions.yCol = true
    }
    if (collisions.xCol || collisions.yCol) {
      return collisions
    }

    for (const rock of rocks) {
      collisions = this.checkCollision(rock, newPos)
    }

    return collisions
  }

  checkCollision(rock, newPos) {
    const collisions = { xCol: false, yCol: false }

    console.log(newPos)

    for (const rockHit of rock.hitboxes) {
      for (const thisHit of this.hitboxes) {
        if (newPos.x + thisHit.x === rock.position.x + rockHit.x && newPos.y + thisHit.y !== rock.position.y + rockHit.y) {
          //console.log(newPos, thisHit, rock.position, rockHit, newPos.x + thisHit.x === rock.position.x + rockHit.x)
          collisions.xCol = true
        }
        if (newPos.y + thisHit.y === rock.position.y + rockHit.y) {
          if (newPos.x + thisHit.x === rock.position.x + rockHit.x) {
            collisions.yCol = true
          }
        }
      }
    }

    return collisions
  }

  processJet(pattern, rocks) {
    const newPos = { ...this.position }
    if (pattern === '<') {
      newPos.x--
    } else if (pattern === '>') {
      newPos.x++
    }

    const { xCol } = this.checkCollisions(rocks, newPos)

    console.log({ xCol }, pattern)

    if (!xCol) {
      this.position = newPos
    }
  }

  fallOne(rocks) {
    const newPos = { ...this.position }
    newPos.y--

    const { yCol } = this.checkCollisions(rocks, newPos)

    if (!yCol) {
      this.position = newPos
    }

    return yCol
  }

  fall(gameState) {
    const rocks = gameState.rocks

    let jetIndex = 0

    for (;;) {
      const jetPattern = this.jetPattern[jetIndex % this.jetPattern.length]
      //this.processJet(jetPattern, rocks)
      const isStopped = this.fallOne(rocks)

      if (isStopped) {
        const newHeight = this.position.y + this.height + 4
        gameState.height = newHeight > gameState.height ? newHeight : gameState.height
        return
      }

      jetIndex++
    }
  }
}

export class HBar extends Rock {
  constructor(position, jetPattern) {
    super(position, jetPattern)
  }

  shape = '@@@@'
  width = 4
  height = 1

  hitboxes = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ]
}

export class VBar extends Rock {
  constructor(position, jetPattern) {
    super(position, jetPattern)
  }

  shape = `@
  @
  @
  @`
  width = 1
  height = 4

  hitboxes = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ]
}

export class Cross extends Rock {
  constructor(position, jetPattern) {
    super(position, jetPattern)
  }

  shape = ` @ 
  @@@
   @ `
  width = 3
  height = 3

  hitboxes = [
    { x: 1, y: 2 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ]
}

export class BackL extends Rock {
  constructor(position, jetPattern) {
    super(position, jetPattern)
  }

  shape = ` @
   @
 @@@`

  width = 3
  height = 3

  hitboxes = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
  ]
}

export class Square extends Rock {
  constructor(position, jetPattern) {
    super(position, jetPattern)
  }

  shape = `@@
  @@`

  width = 2
  height = 2

  hitboxes = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ]
}
