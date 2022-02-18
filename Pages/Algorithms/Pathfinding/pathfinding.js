let GRID_COLS = 80;
let GRID_ROWS = 30;
const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)"
var IS_DRAGGING_START = false;
var IS_DRAGGING_FINISH = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var START_NODE_INDEX = null;
var FINISH_NODE_INDEX = null;
var VISITED_ARRAY = [];

//Set up start node placement
const INITIAL_START_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + Math.floor(GRID_COLS/4);
const INITIAL_FINISH_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + 3 * Math.floor(GRID_COLS/4);

START_NODE_INDEX = INITIAL_START_NODE_INDEX;
FINISH_NODE_INDEX = INITIAL_FINISH_NODE_INDEX;

var UNVISITED_HEAP = new BinaryHeap([], (lhs, rhs) => {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
});

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
GRID_NODES.forEach((dijkstraNode, nodeIndx) => {
    dijkstraNode.addEventListener("click", () => {
        /*
        if(IS_SELECTING_START === true) {
            dijkstraNode.classList.add("node-start");
            dijkstraNode.node.object.isStart = true;
            START_NODE_INDEX = nodeIndx;
            IS_SELECTING_START = false;
            IS_SELECTING_FINISH = true;
        } else if (IS_SELECTING_FINISH === true) {
            if(dijkstraNode.node.object.isStart === false) {
                dijkstraNode.classList.add("node-finish");
                dijkstraNode.node.object.isFinish = true;
                FINISH_NODE_INDEX = nodeIndx;
                IS_SELECTING_START = false;
                IS_SELECTING_FINISH = false;
            }
        } else 
        */
       /*
       if(dijkstraNode.classList.contains("node-wall")) {
            if(dijkstraNode.node.object.isStart === false && dijkstraNode.node.object.isFinish === false) {
                dijkstraNode.classList.remove("node-wall");
                dijkstraNode.node.object.isWall = false;
            }
        } else {
            if(dijkstraNode.node.object.isStart === false && dijkstraNode.node.object.isFinish === false) {
            dijkstraNode.classList.add("node-wall");
            dijkstraNode.node.object.isWall = true;
            }
        }
        */
    })
});

//Reset button logic
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    reset();
});

function reset() {
    START_NODE_INDEX = INITIAL_START_NODE_INDEX;
    FINISH_NODE_INDEX = INITIAL_FINISH_NODE_INDEX;
    IS_VISUALISED = false;
    GRID_NODES.forEach((dijkstraNode) => {
        const coordinate = dijkstraNode.node.object.coordinate
        dijkstraNode.className = "node";
        if(coordinate === START_NODE_INDEX) {
            dijkstraNode.classList.add("node-start");
        }
        if(coordinate === FINISH_NODE_INDEX) {
            dijkstraNode.classList.add("node-finish");
        }
        dijkstraNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: false,
            weight: 1,
            coordinate: coordinate
        });
    })
}

function resetForRevisualisation() {
    GRID_NODES.forEach((dijkstraNode) => {
        const coordinate = dijkstraNode.node.object.coordinate
        if(dijkstraNode.classList.contains("node-visited")) {
            dijkstraNode.classList.remove("node-visited");
        }
        if(dijkstraNode.classList.contains("node-visited-revisualisation")) {
            dijkstraNode.classList.remove("node-visited-revisualisation");
        }
        if(dijkstraNode.classList.contains("node-shortest-path")) {
            dijkstraNode.classList.remove("node-shortest-path");
        }
        if(dijkstraNode.classList.contains("node-shortest-path-revisualisation")) {
            dijkstraNode.classList.remove("node-shortest-path-revisualisation");
        }
        dijkstraNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: dijkstraNode.node.object.isWall,
            weight: dijkstraNode.node.object.weight,
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

const visualiseButton = document.getElementById("visualise-button");
visualiseButton.addEventListener("click", () => {
   dijkstra();
});

//Dijkstra logic
function dijkstra() {
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRID_NODES[START_NODE_INDEX].node.key = 0;
    //Initialise the min-heap
    initialiseHeap();
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(UNVISITED_HEAP.length() > 0) {
        let closestNode = UNVISITED_HEAP.removeRoot();
        if(closestNode.key === Infinity) {
            return VISITED_ARRAY;
        } 
        //The continue keyword ends one iteration of the loop. Essentially, if the closest node is a wall, we start again with a smaller array since we have shifted the array
        if(closestNode.object.isWall === true) {
            itr++;
            continue;
        } 
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            return VISITED_ARRAY;
        } 
        updateUnvisitedNeighbours(closestNode);
        VISITED_ARRAY.push(closestNode);
        if(IS_VISUALISED) {
            closestNode.object.isVisited = true;
            if(closestNode.object.coordinate === FINISH_NODE_INDEX) {
                animateShortestPath();
            }
            if(!GRID_NODES[closestNode.object.coordinate].classList.contains("node-start") && !GRID_NODES[closestNode.object.coordinate].classList.contains("node-finish")) {
                GRID_NODES[closestNode.object.coordinate].classList.add("node-visited-revisualisation");
                GRID_NODES[closestNode.object.coordinate].node.object.isVisited = true;
            }
        } else {
            setTimeout(() => {
                closestNode.object.isVisited = true;
                if(closestNode.object.coordinate === FINISH_NODE_INDEX) {
                    animateShortestPath();
                }
                if(!GRID_NODES[closestNode.object.coordinate].classList.contains("node-start") && !GRID_NODES[closestNode.object.coordinate].classList.contains("node-finish")) {
                    GRID_NODES[closestNode.object.coordinate].classList.add("node-visited");
                    GRID_NODES[closestNode.object.coordinate].node.object.isVisited = true;
                }
            }, 5 * itr);
        }
        if(closestNode.object.coordinate === FINISH_NODE_INDEX) {
            return VISITED_ARRAY;
        }
        itr++;
    }
}

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

function initialiseHeap() {
    UNVISITED_HEAP = new BinaryHeap([], (lhs, rhs) => {
        if(lhs.key < rhs.key) {
            return true;
        } else {
            return false;
        }
    });

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
                const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
                const coordinate = currentNode.object.coordinate;
                
                if(!GRID_NODES[coordinate].classList.contains("node-start") && !GRID_NODES[coordinate].classList.contains("node-finish")) {
                    GRID_NODES[coordinate].classList.add("node-shortest-path");
                }
                if(i == nodesInShortestPathOrder.length - 1) {
                    IS_VISUALISED = true;
                }
            }, 100 * i)
        }
    }
}

function revisualise(coordinate) {
    if(IS_VISUALISED) {
        resetForRevisualisation()
        dijkstra()
    }
}