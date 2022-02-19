let GRID_COLS = 80;
let GRID_ROWS = 31;
const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)"
var IS_DRAGGING_START = false;
var IS_DRAGGING_FINISH = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var START_NODE_INDEX = null;
var FINISH_NODE_INDEX = null;
var VISITED_ARRAY = [];
var CURRENT_ALGORITHM = undefined;
var CURRENT_SORT_CRITERIA = undefined;

//Set up start node placement
const INITIAL_START_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + Math.floor(GRID_COLS/4);
const INITIAL_FINISH_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + 3 * Math.floor(GRID_COLS/4);

START_NODE_INDEX = INITIAL_START_NODE_INDEX;
FINISH_NODE_INDEX = INITIAL_FINISH_NODE_INDEX;

var UNVISITED_HEAP = new BinaryHeap([], lessThanWithHeuristic);

//Grid logic
const grid = document.getElementById('pathfinding-grid');
const fragment = document.createDocumentFragment();
let i = 0;
while (i<GRID_COLS*GRID_ROWS) {
    const div = document.createElement('div');
    const coordinate = i%GRID_COLS + (Math.floor(i/GRID_COLS) * GRID_COLS)
    div.id = `node-${i}`;
    div.className = 'node';
    //div.textContent = `${i}`;
    div.node = new HeapNode(Infinity, {
        isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
        isStart: coordinate === START_NODE_INDEX ? true : false,
        isVisited: false,
        isWall: false,
        weight: 1,
        coordinate: coordinate
    });
    div.onmousedown = () => {
        handleMouseDown(coordinate);
    }
    div.onmouseup = () => {
        handleMouseUp(coordinate);
    }
    div.onmouseenter = () => {
        handleMouseEnter(coordinate);
    };

    div.onmouseleave = () => {
        handleMouseLeave(coordinate);
    }
    if(coordinate === START_NODE_INDEX) {
        div.classList.add("node-start");
    }
    if(coordinate === FINISH_NODE_INDEX) {
        div.classList.add("node-finish");
    }
    div.style.borderTop = BORDER_COLOR;
    div.style.borderLeft = BORDER_COLOR;
    if(coordinate >= ((GRID_COLS*GRID_ROWS) - GRID_COLS)) {
        div.style.borderBottom = BORDER_COLOR;
    }
    if(coordinate%GRID_COLS === GRID_COLS-1) {
        div.style.borderRight = BORDER_COLOR;
    }
    fragment.append(div);
    i++;
}
grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
grid.append(fragment);

grid.onmouseleave = () => {
    IS_CLICKING = false;
}

const GRID_NODES = document.querySelectorAll(".node");
//Reset button logic
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    reset();
});

function reset() {
    START_NODE_INDEX = INITIAL_START_NODE_INDEX;
    FINISH_NODE_INDEX = INITIAL_FINISH_NODE_INDEX;
    IS_VISUALISED = false;
    initialiseGridNodes();
}

function resetForRevisualisation() {
    GRID_NODES.forEach((pathNode) => {
        const coordinate = pathNode.node.object.coordinate
        if(pathNode.classList.contains("node-visited")) {
            pathNode.classList.remove("node-visited");
        }
        if(pathNode.classList.contains("node-visited-revisualisation")) {
            pathNode.classList.remove("node-visited-revisualisation");
        }
        if(pathNode.classList.contains("node-shortest-path")) {
            pathNode.classList.remove("node-shortest-path");
        }
        if(pathNode.classList.contains("node-shortest-path-revisualisation")) {
            pathNode.classList.remove("node-shortest-path-revisualisation");
        }
        pathNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: pathNode.node.object.isWall,
            weight: pathNode.node.object.weight,
            coordinate: coordinate
        });
    })
}

//Event handlers
function handleMouseDown(coordinate) {
    const node = GRID_NODES[coordinate];
    if (node.classList.contains("node-start")) {
        IS_DRAGGING_START = true;
    } else if (node.classList.contains("node-finish")) {
        IS_DRAGGING_FINISH = true
    } else {
        IS_CLICKING = true
        if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
            if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                revisualise(coordinate);
            } else {
                if(node.classList.contains("node-visited")) {
                    node.classList.remove("node-visited");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    revisualise(coordinate);
                } else if(node.classList.contains("node-visited-revisualisation")) {
                    node.classList.remove("node-visited-revisualisation");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    revisualise(coordinate);
                } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise(coordinate);
                }
            }
        }
    }
}

function handleMouseUp(coordinate) {
    const node = GRID_NODES[coordinate];
    IS_CLICKING = false;
    if(IS_DRAGGING_START) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        node.node.isWall = false;
        IS_DRAGGING_START = false;
    }
    if(IS_DRAGGING_FINISH) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        node.node.isWall = false;
        IS_DRAGGING_FINISH = false;
    }
}

function handleMouseEnter(coordinate) {
    const node = GRID_NODES[coordinate];
    if(IS_DRAGGING_START) {
        node.classList.add("node-start");
         START_NODE_INDEX = coordinate;
        revisualise(coordinate);
    } else if (IS_DRAGGING_FINISH) {
        node.classList.add("node-finish");
     FINISH_NODE_INDEX = coordinate;
     revisualise(coordinate);
     
 } else if(IS_CLICKING === true) {
         if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
             if(node.classList.contains("node-visited")) {
                node.classList.remove("node-visited");
                node.node.object.isVisited = false;
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise(coordinate);
             } else if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                revisualise(coordinate);
             } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise(coordinate);
             }
         }
     }
}

function handleMouseLeave(coordinate) {
    const node = GRID_NODES[coordinate];
    if (IS_DRAGGING_START) {
        node.classList.remove("node-start");
    } else if (IS_DRAGGING_FINISH) {
        node.classList.remove("node-finish");
    }
}

const dijkstraButton = document.getElementById("visualise-dijkstra");
dijkstraButton.addEventListener("click", () => {
    if(CURRENT_ALGORITHM === undefined) {
        CURRENT_ALGORITHM = dijkstra;
    }
    CURRENT_SORT_CRITERIA = lessThan;
    if (IS_VISUALISED) {
        resetForRevisualisation();
        IS_VISUALISED = false;
    }
   CURRENT_ALGORITHM();
});

const astarButton = document.getElementById("visualise-astar");
astarButton.addEventListener("click", () => {
    if(CURRENT_ALGORITHM === undefined) {
        CURRENT_ALGORITHM = dijkstra;
    }
    CURRENT_SORT_CRITERIA = lessThanWithHeuristic;
    if (IS_VISUALISED) {
        resetForRevisualisation();
        IS_VISUALISED = false;
    }
   CURRENT_ALGORITHM();
});


function getUnvisitedNeighbours(node) {
    const neighbours = []
    const coordinate = node.object.coordinate;

    //If not on first row, push neighbour directly above
    if(coordinate >= GRID_COLS) {
        if(GRID_NODES[coordinate - GRID_COLS].node.object.isVisited === false) {
            neighbours.push(GRID_NODES[coordinate - GRID_COLS].node);
        }
    }
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%GRID_COLS != GRID_COLS-1) {
        if(GRID_NODES[coordinate + 1].node.object.isVisited === false) {
            neighbours.push(GRID_NODES[coordinate + 1].node);
        }
    }
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%GRID_COLS != 0) {
        if(GRID_NODES[coordinate - 1].node.object.isVisited === false) {
            neighbours.push(GRID_NODES[coordinate - 1].node);
        }
    }
    //If not on bottom row, push neighbour directly below
    if(coordinate < GRID_COLS*GRID_ROWS - GRID_COLS) {
        if(GRID_NODES[coordinate + GRID_COLS].node.object.isVisited === false) {
            neighbours.push(GRID_NODES[coordinate + GRID_COLS].node);
        }
    } 
    return neighbours;
}

function updateUnvisitedNeighbours(node) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node);
    for (const neighbour of unvisitedNeighbours) {
        //Update only if new distance is less than known distance

        if(neighbour.key > node.key + neighbour.object.weight) {
            var replacement = new HeapNode(node.key + neighbour.object.weight, {
                isFinish: neighbour.object.isFinish,
                isStart: neighbour.object.isStart,
                isVisited: neighbour.object.isVisited,
                isWall: neighbour.object.isWall,
                coordinate: neighbour.object.coordinate,
                weight: neighbour.object.weight
            });
            replacement.previousNode = node;
            UNVISITED_HEAP.replace(neighbour, replacement);
            GRID_NODES[neighbour.object.coordinate].node.key = replacement.key;
            GRID_NODES[neighbour.object.coordinate].node.previousNode = node;
        }
    }
}

function initialiseGridNodes() {
    GRID_NODES.forEach((pathNode) => {
        const coordinate = pathNode.node.object.coordinate
        pathNode.className = "node";
        if(coordinate === START_NODE_INDEX) {
            pathNode.classList.add("node-start");
        }
        if(coordinate === FINISH_NODE_INDEX) {
            pathNode.classList.add("node-finish");
        }
        pathNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: false,
            weight: 1,
            coordinate: coordinate
        });
    })
}

function lessThanWithHeuristic(lhs, rhs) {
    if((lhs.key + calculateHeuristic(lhs.object.coordinate)) < (rhs.key + calculateHeuristic(rhs.object.coordinate))) {
        return true;
    } else {
        return false;
    }
}

function lessThan(lhs, rhs) {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
}

function greaterThan(lhs, rhs) {
    if(lhs.key > rhs.key) {
        return true;
    } else {
        return false;
    }
}

function calculateHeuristic(coordinate) {
    const xDisance = FINISH_NODE_INDEX%GRID_COLS - coordinate%GRID_COLS;
    const yDistance = Math.floor(FINISH_NODE_INDEX/GRID_COLS) - Math.floor(coordinate/GRID_COLS);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
};

function initialiseHeap() {
    UNVISITED_HEAP = new BinaryHeap([], CURRENT_SORT_CRITERIA);

    for (let i = 0; i < GRID_NODES.length; i++) {
        UNVISITED_HEAP.insert(GRID_NODES[i].node);
    }
}

function getNodesInShortestPathOrder() {
    const nodesInShortestPathOrder = [];
    let currentNode = GRID_NODES[FINISH_NODE_INDEX].node;
    while (currentNode != undefined) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

function animateShortestPath() {
    const nodesInShortestPathOrder = getNodesInShortestPathOrder();
    if(IS_VISUALISED) {
        for(let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
            const coordinate = currentNode.object.coordinate;
            
            if(!GRID_NODES[coordinate].classList.contains("node-start") && !GRID_NODES[coordinate].classList.contains("node-finish")) {
                GRID_NODES[coordinate].classList.add("node-shortest-path-revisualisation");
            }
        }
    } else {
        for(let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                if(!IS_VISUALISED) {
                    const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
                    const coordinate = currentNode.object.coordinate;
                    
                    if(!GRID_NODES[coordinate].classList.contains("node-start") && !GRID_NODES[coordinate].classList.contains("node-finish")) {
                        GRID_NODES[coordinate].classList.add("node-shortest-path");
                    }
                    if(i == nodesInShortestPathOrder.length - 1) {
                        IS_VISUALISED = true;
                    }
                }
            }, 20 * i)
        }
    }
}

function revisualise(coordinate) {
    if(IS_VISUALISED) {
        resetForRevisualisation()
        CURRENT_ALGORITHM();
    }
}