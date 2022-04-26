let ANIMATION_GRID_COLS = 6;
let ANIMATION_GRID_ROWS = 6;
var ANIMATION_IS_DRAGGING_START = false;
var ANIMATION_IS_DRAGGING_FINISH = false;
var ANIMATION_IS_VISUALISING = false;
var ANIMATION_IS_VISUALISED = false;
var ANIMATION_IS_CLICKING = false;
var ANIMATION_START_NODE_INDEX = null;
var ANIMATION_FINISH_NODE_INDEX = null;
var ANIMATION_GRID_QUEUE = [];
var ANIMATION_DFS_FOUND = false;
var ANIMATION_VISITED_ARRAY = [];
var ANIMATION_CURRENT_ALGORITHM = undefined;
var ANIMATION_CURRENT_GRAPH = undefined;
var ANIMATION_CURRENT_SORT_CRITERIA = lessThan;
var ANIMATION_BLOCK_ARRAY = []


//Set up start node placement
const ANIMATION_INITIAL_START_NODE_INDEX = Math.floor(ANIMATION_GRID_ROWS/2)*ANIMATION_GRID_COLS + Math.floor(ANIMATION_GRID_COLS/4);
const ANIMATION_INITIAL_FINISH_NODE_INDEX = Math.floor(ANIMATION_GRID_ROWS/2)*ANIMATION_GRID_COLS + 3 * Math.floor(ANIMATION_GRID_COLS/4);

ANIMATION_START_NODE_INDEX = ANIMATION_INITIAL_START_NODE_INDEX;
ANIMATION_FINISH_NODE_INDEX = ANIMATION_INITIAL_FINISH_NODE_INDEX;

var ANIMATION_UNVISITED_HEAP = new BinaryHeap([], lessThanWithHeuristic);
for (let i = 0; i < 13; i++) {
    ANIMATION_BLOCK_ARRAY.push(document.getElementById(`anim-block-${i}`))
}
//Grid logic
const animationGrid = document.getElementById('animation-grid');
const animationFragment = document.createDocumentFragment();
let animationI = 0;
while (animationI<ANIMATION_GRID_COLS*ANIMATION_GRID_ROWS) {
    const div = document.createElement('div');
    const coordinate = animationI%ANIMATION_GRID_COLS + (Math.floor(animationI/ANIMATION_GRID_COLS) * ANIMATION_GRID_COLS)
    div.id = `node-${animationI}`;
    div.className = 'animation-node';
    div.style.color = 'black'
    div.node = new HeapNode(Infinity, {
        isFinish: coordinate === ANIMATION_FINISH_NODE_INDEX ? true : false,
        isStart: coordinate === ANIMATION_START_NODE_INDEX ? true : false,
        isVisited: false,
        isWall: false,
        weight: 1,
        coordinate: coordinate,
        isQueued: false
    });
    div.onmousedown = () => {
        animationHandleMouseDown(coordinate);
    }
    div.onmouseup = () => {
        animationHandleMouseUp(coordinate);
    }
    div.onmouseenter = () => {
        animationHandleMouseEnter(coordinate);
    };

    div.onmouseleave = () => {
        animationHandleMouseLeave(coordinate);
    }
    if(coordinate === ANIMATION_START_NODE_INDEX) {
        div.classList.add("node-start");
    }
    if(coordinate === ANIMATION_FINISH_NODE_INDEX) {
        div.classList.add("node-finish");
    }
    div.style.borderTop = GRID_BORDER_COLOR;
    div.style.borderLeft = GRID_BORDER_COLOR;
    if(coordinate >= ((ANIMATION_GRID_COLS*ANIMATION_GRID_ROWS) - ANIMATION_GRID_COLS)) {
        div.style.borderBottom = GRID_BORDER_COLOR;
    }
    if(coordinate%ANIMATION_GRID_COLS === ANIMATION_GRID_COLS-1) {
        div.style.borderRight = GRID_BORDER_COLOR;
    }
    animationFragment.append(div);
    animationI++;
}
animationGrid.style.gridTemplateColumns = `repeat(${ANIMATION_GRID_COLS}, 1fr)`;
animationGrid.append(animationFragment);

animationGrid.onmouseleave = () => {
    ANIMATION_IS_CLICKING = false;
}

const ANIMATION_GRID_NODES = document.querySelectorAll(".animation-node");


//Event handlers
function animationHandleMouseDown(coordinate) {
    const node = ANIMATION_GRID_NODES[coordinate];
    if (node.classList.contains("node-start")) {
        ANIMATION_IS_DRAGGING_START = true;
    } else if (node.classList.contains("node-finish")) {
        ANIMATION_IS_DRAGGING_FINISH = true
    } else {
        ANIMATION_IS_CLICKING = true
        /*
        if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
            if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                //revisualise(coordinate);
            } else {
                if(node.classList.contains("node-visited")) {
                    node.classList.remove("node-visited");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    //revisualise(coordinate);
                } else if(node.classList.contains("node-visited-revisualisation")) {
                    node.classList.remove("node-visited-revisualisation");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    //revisualise(coordinate);
                } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                //revisualise(coordinate);
                }
            }
        }
        */
    }
}

function animationHandleMouseUp(coordinate) {
    const node = ANIMATION_GRID_NODES[coordinate];
    ANIMATION_IS_CLICKING = false;
    if(ANIMATION_IS_DRAGGING_START) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        ANIMATION_IS_DRAGGING_START = false;
    }
    if(ANIMATION_IS_DRAGGING_FINISH) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        ANIMATION_IS_DRAGGING_FINISH = false;
    }
}

function animationHandleMouseEnter(coordinate) {
    const node = ANIMATION_GRID_NODES[coordinate];
    if(ANIMATION_IS_DRAGGING_START) {
        node.classList.add("node-start");
        ANIMATION_START_NODE_INDEX = coordinate;
        //revisualise(coordinate);
    } else if (ANIMATION_IS_DRAGGING_FINISH) {
        node.classList.add("node-finish");
        ANIMATION_FINISH_NODE_INDEX = coordinate;
     //revisualise(coordinate);
     
 } else if(ANIMATION_IS_CLICKING === true) {
     /*
         if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
             if(node.classList.contains("node-visited")) {
                node.classList.remove("node-visited");
                node.node.object.isVisited = false;
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                //revisualise(coordinate);
             } else if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                //revisualise(coordinate);
             } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                //revisualise(coordinate);
             }
         }
         */
     }
}

async function animationDrawWall(coordinate) {
    const node = ANIMATION_GRID_NODES[coordinate];
    await sleep(0.1)
    if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
        if(node.classList.contains("node-visited")) {
           node.classList.remove("node-visited");
           node.node.object.isVisited = false;
           node.classList.add("node-wall");
           node.node.object.isWall = true;
           //revisualise(coordinate);
        } else if(node.classList.contains("node-wall")) {
           node.classList.remove("node-wall");
           node.node.object.isWall = false;
           //revisualise(coordinate);
        } else {
           node.classList.add("node-wall");
           node.node.object.isWall = true;
           //revisualise(coordinate);
        }
    }
}

function animationHandleMouseLeave(coordinate) {
    const node = ANIMATION_GRID_NODES[coordinate];
    if (ANIMATION_IS_DRAGGING_START) {
        node.classList.remove("node-start");
    } else if (ANIMATION_IS_DRAGGING_FINISH) {
        node.classList.remove("node-finish");
    }
}

function animationInitialiseGridNodes() {
    ANIMATION_GRID_NODES.forEach((pathNode) => {
        const coordinate = pathNode.node.object.coordinate;
        pathNode.textContent = `inf`;
        pathNode.className = "node";
        if(coordinate === ANIMATION_START_NODE_INDEX) {
            pathNode.classList.add("node-start");
        }
        if(coordinate === ANIMATION_FINISH_NODE_INDEX) {
            pathNode.classList.add("node-finish");
        }
        pathNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === ANIMATION_FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === ANIMATION_START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: false,
            weight: 1,
            coordinate: coordinate,
            isQueued: false
        });
    })
}

//Dijkstra logic
function animationDijkstra() {
    ANIMATION_IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    ANIMATION_GRID_NODES[ANIMATION_START_NODE_INDEX].node.key = 0;
    //Initialise the min-heap
    animationInitialiseGridHeap();
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(ANIMATION_UNVISITED_HEAP.length() > 0) {
        let closestNode = ANIMATION_UNVISITED_HEAP.removeRoot();
        if(closestNode.key === Infinity) {
            ANIMATION_IS_VISUALISING = false;
            return ANIMATION_VISITED_ARRAY;
        } 
        //The continue keyword ends one iteration of the loop. Essentially, if the closest node is a wall, we start again with a smaller array since we have shifted the array
        if(closestNode.object.isWall === true) {
            itr++;
            continue;
        } 
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            ANIMATION_IS_VISUALISING = false;
            return ANIMATION_VISITED_ARRAY;
        } 
        animationUpdateUnvisitedNeighbours(closestNode);
        ANIMATION_VISITED_ARRAY.push(closestNode);
        if(ANIMATION_IS_VISUALISED) {
            closestNode.object.isVisited = true;
            if(closestNode.object.coordinate === ANIMATION_FINISH_NODE_INDEX) {
                animationAnimateShortestPath();
            }
            if(!ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.contains("node-start") && !ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.contains("node-finish")) {
                ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.add("node-visited-revisualisation");
                ANIMATION_GRID_NODES[closestNode.object.coordinate].node.object.isVisited = true;
                animationUpdateVisitedCounter();
            }
        } else {
            setTimeout(() => {
                closestNode.object.isVisited = true;
                if(closestNode.object.coordinate === ANIMATION_FINISH_NODE_INDEX) {
                    animationAnimateShortestPath();
                }
                if(!ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.contains("node-start") && !ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.contains("node-finish")) {
                    ANIMATION_GRID_NODES[closestNode.object.coordinate].classList.add("node-visited");
                    ANIMATION_GRID_NODES[closestNode.object.coordinate].node.object.isVisited = true;
                }
            }, 5 * itr);
        }
        if(closestNode.object.coordinate === ANIMATION_FINISH_NODE_INDEX) {
            return ANIMATION_VISITED_ARRAY;
        }
        itr++;
    }
}

async function animationUpdateUnvisitedNeighbours(node) {
    const unvisitedNeighbours = animationGetUnvisitedNeighbours(node);
    for (const neighbour of unvisitedNeighbours) {
        //Update only if new distance is less than known distance
        highlightBlock(4)
        await sleep(500)
        unHighlightBlock(4)
        markAsVisited(neighbour.object.coordinate)

        if(neighbour.key > node.key + neighbour.object.weight) {
            highlightBlock(5)
            await sleep(500)
            var replacement = new HeapNode(node.key + neighbour.object.weight, {
                isFinish: neighbour.object.isFinish,
                isStart: neighbour.object.isStart,
                isVisited: neighbour.object.isVisited,
                isWall: neighbour.object.isWall,
                coordinate: neighbour.object.coordinate,
                weight: neighbour.object.weight
            });
            unHighlightBlock(5)
            highlightBlock(6)
            await sleep(500)
            replacement.previousNode = node;
            ANIMATION_UNVISITED_HEAP.replace(neighbour, replacement);
            ANIMATION_GRID_NODES[neighbour.object.coordinate].node.key = replacement.key;
            ANIMATION_GRID_NODES[neighbour.object.coordinate].node.previousNode = node;
            changeKey(neighbour.object.coordinate, node.key + neighbour.object.weight)
            unHighlightBlock(6)
        }
    }
}

function animationGetUnvisitedNeighbours(node) {
    const neighbours = []
    const coordinate = node.object.coordinate;

    //If not on first row, push neighbour directly above
    if(coordinate >= ANIMATION_GRID_COLS) {
        if(ANIMATION_GRID_NODES[coordinate - ANIMATION_GRID_COLS].node.object.isVisited === false) {
            neighbours.push(ANIMATION_GRID_NODES[coordinate - ANIMATION_GRID_COLS].node);
        }
    }
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%ANIMATION_GRID_COLS != ANIMATION_GRID_COLS-1) {
        if(ANIMATION_GRID_NODES[coordinate + 1].node.object.isVisited === false) {
            neighbours.push(ANIMATION_GRID_NODES[coordinate + 1].node);
        }
    }
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%ANIMATION_GRID_COLS != 0) {
        if(ANIMATION_GRID_NODES[coordinate - 1].node.object.isVisited === false) {
            neighbours.push(ANIMATION_GRID_NODES[coordinate - 1].node);
        }
    }
    //If not on bottom row, push neighbour directly below
    if(coordinate < ANIMATION_GRID_COLS*ANIMATION_GRID_ROWS - ANIMATION_GRID_COLS) {
        if(ANIMATION_GRID_NODES[coordinate + ANIMATION_GRID_COLS].node.object.isVisited === false) {
            neighbours.push(ANIMATION_GRID_NODES[coordinate + ANIMATION_GRID_COLS].node);
        }
    } 
    return neighbours;
}

function animationInitialiseGridHeap() {
    ANIMATION_UNVISITED_HEAP = new BinaryHeap([], ANIMATION_CURRENT_SORT_CRITERIA);

    for (let i = 0; i < ANIMATION_GRID_NODES.length; i++) {
        ANIMATION_UNVISITED_HEAP.insert(ANIMATION_GRID_NODES[i].node);
    }
}

async function animationAnimateShortestPath() {
    const nodesInShortestPathOrder = await animationGetNodesInShortestPathOrder();
    highlightBlock(7);
    await sleep(500);
    unHighlightBlock(7);
    await sleep(500);
    highlightBlock(8);
    await sleep(500);
    unHighlightBlock(8);
    for(let i = 0; i < nodesInShortestPathOrder.length; i++) {
        highlightBlock(9);
        await sleep(500);
        unHighlightBlock(9)
        const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
        const coordinate = currentNode.object.coordinate;
        
        if(!ANIMATION_GRID_NODES[coordinate].classList.contains("node-start") && !ANIMATION_GRID_NODES[coordinate].classList.contains("node-finish")) {
            ANIMATION_GRID_NODES[coordinate].classList.remove("animated-node-visited");
            ANIMATION_GRID_NODES[coordinate].classList.add("node-shortest-path");
            highlightBlock(10);
            await sleep(500);
            unHighlightBlock(10)
        }
        highlightBlock(11);
        await sleep(500);
        unHighlightBlock(11)
        await sleep(200)
    }
}

async function animationGetNodesInShortestPathOrder() {
    const nodesInShortestPathOrder = [];
    let currentNode = ANIMATION_GRID_NODES[ANIMATION_FINISH_NODE_INDEX].node;
    while (currentNode != undefined) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

async function startAnimation() {
    while (true) {
        //Initialise
        highlightBlock(0);
        animationInitialiseGridNodes()
        await sleep(20)
        unHighlightBlock(0);

        //Set source distance to 0
        highlightBlock(1);
        changeKey(ANIMATION_START_NODE_INDEX, 0);
        await sleep(50)
        unHighlightBlock(1);

        //Initialise heap
        highlightBlock(2);
        animationInitialiseGridHeap();
        await sleep(200)
        unHighlightBlock(2);

        //While loop
        while(ANIMATION_UNVISITED_HEAP.length() > 0) {
            highlightBlock(3);
            let closestNode = ANIMATION_UNVISITED_HEAP.removeRoot();
            await sleep(200);
            unHighlightBlock(3);
            await animationUpdateUnvisitedNeighbours(closestNode);

            if(closestNode.object.coordinate === ANIMATION_FINISH_NODE_INDEX) {
                await animationAnimateShortestPath()
                await sleep(10000)
                break
            }
        }

    }
}

function changeKey(coordinate, key) {
    ANIMATION_GRID_NODES[coordinate].node.key = key;
    ANIMATION_GRID_NODES[coordinate].textContent = `${key}`;
}

function highlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.add("active-anim");
}

function unHighlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.remove("active-anim");
}

function markAsVisited(coordinate) {
    if(!ANIMATION_GRID_NODES[coordinate].classList.contains("node-start") && !ANIMATION_GRID_NODES[coordinate].classList.contains("node-finish")) {
        ANIMATION_GRID_NODES[coordinate].classList.add("animated-node-visited");
        ANIMATION_GRID_NODES[coordinate].node.object.isVisited = true;
    }
}

startAnimation()