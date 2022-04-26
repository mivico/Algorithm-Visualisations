//Dijkstra logic
function dijkstra() {
    const startTime = Date.now();
    IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRID_NODES[START_NODE_INDEX].node.key = 0;
    //Initialise the min-heap
    initialiseGridHeap();
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(UNVISITED_HEAP.length() > 0) {
        let closestNode = UNVISITED_HEAP.removeRoot();
        if(closestNode.key === Infinity) {
            ALGORITHM_TIMER = Date.now() - startTime;
            IS_VISUALISING = false;
            return VISITED_ARRAY;
        } 
        //The continue keyword ends one iteration of the loop. Essentially, if the closest node is a wall, we start again with a smaller array since we have shifted the array
        if(closestNode.object.isWall === true) {
            itr++;
            continue;
        } 
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            ALGORITHM_TIMER = Date.now() - startTime;
            IS_VISUALISING = false;
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
                VISITED_COUNTER = VISITED_COUNTER + 1;
                updateInfo();
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
                    VISITED_COUNTER = VISITED_COUNTER + 1;
                    updateInfo();
                }
            }, 5 * itr);
        }
        if(closestNode.object.coordinate === FINISH_NODE_INDEX) {
            ALGORITHM_TIMER = Date.now() - startTime;
            return VISITED_ARRAY;
        }
        itr++;
    }
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

function initialiseGridHeap() {
    UNVISITED_HEAP = new BinaryHeap([], CURRENT_SORT_CRITERIA);

    for (let i = 0; i < GRID_NODES.length; i++) {
        UNVISITED_HEAP.insert(GRID_NODES[i].node);
    }
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
                        IS_VISUALISING = false;
                        IS_VISUALISED = true;
                    }
                }
            }, 20 * i)
        }
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