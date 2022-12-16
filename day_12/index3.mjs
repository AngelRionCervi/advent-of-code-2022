import rawInput from './input.mjs'

// setup
const input = rawInput

const grid = input.split('\n').map((row) => row.split(''))
const alphabet = 'abcdefghijklmnopqrstuvwxyz'

function renderPath(path, debug = false) {
    const gridRows = grid.map((row) => row.map((c) => (debug ? c : '.')))

    path.reverse().forEach(({ x, y }, index) => {
        const next = path[index + 1]
        if (next) {
            if (x !== next.x) {
                gridRows[y][x] = x > next.x ? '<' : '>'
            } else if (y !== next.y) {
                gridRows[y][x] = y > next.y ? '^' : '⌄'
            }
        }
    })

    const printableGrid = gridRows.map((row) => row.join('')).join('\n')
    console.log(printableGrid + '\n')
}

function getCharPosition(char) {
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i]
        const x = row.findIndex((c) => c === char)
        if (x !== -1) {
            return { y: i, x }
        }
    }
}

function getPath(endNode, start) {
    const path = []
    let curNode = endNode
    let index = 0
    while (curNode?.parent) {
        path.push({ x: curNode.x, y: curNode.y, char: curNode.char, index })
        curNode = curNode?.parent
        index++
    }
    path.push({ x: start.x, y: start.y, char: start.char, index: index + 1 })

    return path
}

function getDistance(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y)
}

function getNeighbors(node) {
    const nodeCharIndex = alphabet.indexOf(node.char)
    const right = { x: node.x + 1, y: node.y, char: grid[node.y]?.[node.x + 1] }
    const left = { x: node.x - 1, y: node.y, char: grid[node.y]?.[node.x - 1] }
    const top = { x: node.x, y: node.y - 1, char: grid[node.y - 1]?.[node.x] }
    const bottom = { x: node.x, y: node.y + 1, char: grid[node.y + 1]?.[node.x] }

    return [top, bottom, right, left].filter(({ char }) => {
        //return char
        if (!char) {
            return false
        }
        let charToCompare = char
        if (char === 'S') {
            charToCompare = 'a'
        } else if (char === 'E') {
            charToCompare = 'z'
        }
        if (charToCompare) {
            const neighbourCharIndex = alphabet.indexOf(charToCompare)
            const isUpOne = nodeCharIndex === neighbourCharIndex - 1
            const isDownOne = nodeCharIndex === neighbourCharIndex + 1
            const isFlat = nodeCharIndex === neighbourCharIndex

            return isFlat || isUpOne || isDownOne
        }

        return false
    })
}

function aStar(start, goal) {
    // Create an open and closed set to keep track of which nodes have been visited
    const openSet = new Set([start]);
    const closedSet = new Set();

    // Create a map to store the g-score (the distance from the start node to the current node)
    // and the f-score (the estimated total distance from the start node to the goal node through the current node)
    // for each node
    const gScore = new Map();
    const fScore = new Map();

    // Set the g-score and f-score for the start node to 0
    gScore.set(start, 0);
    fScore.set(start, getDistance(start, goal));

    // While there are still nodes in the open set...
    while (openSet.size > 0) {
        // Find the node in the open set with the lowest f-score
        let current = null;
        let lowestFScore = Infinity;
        for (const node of openSet) {
            if (fScore.get(node) < lowestFScore) {
                current = node;
                lowestFScore = fScore.get(node);
            }
        }

        // If the current node is the goal node, then we have found the shortest path
        if (current === goal) {
            return getPath(current, goal);
        }

        renderPath(getPath(current, start))

        // Remove the current node from the open set and add it to the closed set
        openSet.delete(current);
        closedSet.add(current);
        current.neighbors = getNeighbors(current)
        //console.log(current.neighbors)

        // For each neighbor of the current node...
        for (const neighbor of current.neighbors) {
            // If the neighbor is already in the closed set, then we have already processed it and can skip it
            if (closedSet.has(neighbor)) {
                continue;
            }


            // Calculate the tentative g-score for the neighbor, which is the g-score of the current node plus
            // the distance from the current node to the neighbor
            const tentativeGScore = gScore.get(current) + getDistance(current, neighbor);
            console.log(gScore.get(neighbor))

            // If the neighbor is not in the open set, or if the new g-score is better than the previous g-score,
            // then we need to update the g-score and f-score for the neighbor
            if (gScore.get(neighbor) === undefined || !openSet.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                //cameFrom.set(neighbor, current);
                //console.log(neighbor)
                neighbor.parent = current
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, gScore.get(neighbor) + getDistance(neighbor, goal));

                // If the neighbor is not already in the open set, add it to the open set
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }
}

const startCoord = getCharPosition('S')
const goalCoord = getCharPosition('E')
const start = { ...startCoord, char: 'S', neighbors: [], gScore: 0, fScore: getDistance(startCoord, goalCoord), hScore: getDistance(startCoord, goalCoord) }
const goal = { ...goalCoord, char: 'E', neighbors: [] }

const path = aStar(start, goal)

console.log('shit', path)