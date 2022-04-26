function dfs() {
    const startTime = Date.now();
    IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRID_NODES[START_NODE_INDEX].node.key = 0;
    //Initialise the stack
    const stackStart = Date.now();
    GRID_NODES[START_NODE_INDEX].node.object.isQueued = true;
    GRID_QUEUE = [GRID_NODES[START_NODE_INDEX].node];
    QUEUE_TIMER = Date.now() - stackStart;
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(GRID_QUEUE.length > 0) {
        let closestNode = GRID_QUEUE.pop();
        gridAddNeighboursToStack(closestNode);
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
    IS_VISUALISING = false;
    return VISITED_ARRAY;
}

async function recurseDfs(node) {
    if(DFS_FOUND === true) {
        IS_VISUALISED = true;
        IS_VISUALISING = false;
        return;
    }
    //Call first on the start node
    if(node.object.coordinate === FINISH_NODE_INDEX) {
        DFS_FOUND = true;
        return VISITED_ARRAY
    }
    
    const coordinate = node.object.coordinate;
    if (coordinate != START_NODE_INDEX) {
        node.object.isVisited = true
        GRID_NODES[node.object.coordinate].classList.add("node-visited");
    }
    VISITED_ARRAY.push(node);
    //If not on top row, push neighbour directly above
    if(coordinate >= GRID_COLS) {
        if(GRID_NODES[coordinate - GRID_COLS].node.object.isVisited === false && GRID_NODES[coordinate - GRID_COLS].node.object.isWall === false) {
            if(!IS_VISUALISED) {
                await sleep(1)
            }
            await recurseDfs(GRID_NODES[coordinate - GRID_COLS].node);
        }
    }
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%GRID_COLS != GRID_COLS-1) {
        if(GRID_NODES[coordinate + 1].node.object.isVisited === false && GRID_NODES[coordinate + 1].node.object.isWall === false) {
            if(!IS_VISUALISED) {
                await sleep(1)
            }
            await recurseDfs(GRID_NODES[coordinate + 1].node);
        }
    }
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%GRID_COLS != 0) {
        if(GRID_NODES[coordinate - 1].node.object.isVisited === false && GRID_NODES[coordinate - 1].node.object.isWall === false) {
            if(!IS_VISUALISED) {
                await sleep(1)
            }
            await recurseDfs(GRID_NODES[coordinate - 1].node);
        }
    }
    //If not on bottom row, push neighbour directly below
    if(coordinate < GRID_COLS*GRID_ROWS - GRID_COLS) {
        if(GRID_NODES[coordinate + GRID_COLS].node.object.isVisited === false && GRID_NODES[coordinate + GRID_COLS].node.object.isWall === false) {
            if(!IS_VISUALISED) {
                await sleep(1)
            }
            await recurseDfs(GRID_NODES[coordinate + GRID_COLS].node);
        }
    } 
}

function gridAddNeighboursToStack(node) {
    const neighbours = getUnvisitedNeighbours(node);
    for (let i = 0; i < neighbours.length; i++) {
        if(neighbours[i].object.isQueued === false) {
            neighbours[i].object.isQueued = true;
            if(neighbours[i].object.isWall === false) {
                GRID_QUEUE.push(neighbours[i]);
            }
        }
    }
}

function getGridStack(node) {
    const coordinate = node.object.coordinate;
    if(node.object.isQueued === true) {
        return []
    }
    node.object.isQueued = true;
    var topNeighbours = [];
    //If not on first row, push neighbour directly above
    if(coordinate >= GRID_COLS) {
        if(GRID_NODES[coordinate - GRID_COLS].node.object.isQueued === false) {
            topNeighbours = getGridStack(GRID_NODES[coordinate - GRID_COLS].node);
        }
    }
    var rightNeighbours = [];
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%GRID_COLS != GRID_COLS-1) {
        if(GRID_NODES[coordinate + 1].node.object.isQueued === false) {
            rightNeighbours = getGridStack(GRID_NODES[coordinate + 1].node);
        }
    }
    var leftNeighbours = [];
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%GRID_COLS != 0) {
        if(GRID_NODES[coordinate - 1].node.object.isQueued === false) {
            leftNeighbours = getGridStack(GRID_NODES[coordinate - 1].node);
        }
    }
    var bottomNeighbours = [];
    //If not on bottom row, push neighbour directly below
    if(coordinate < GRID_COLS*GRID_ROWS - GRID_COLS) {
        if(GRID_NODES[coordinate + GRID_COLS].node.object.isQueued === false) {
            bottomNeighbours = getGridStack(GRID_NODES[coordinate + GRID_COLS].node);
        }
    } 
    

    return [node, ...topNeighbours, ...rightNeighbours, ...bottomNeighbours, ...leftNeighbours];
}

function graphDfs() {
    const startTime = Date.now();
    GRAPH_IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.key = 0;
    //Initialise the stack
    const stackStart = Date.now();
    const dfsStack = getGraphStack(GRAPH_START_NODE_INDEX);
    QUEUE_TIMER = Date.now() - stackStart;
    //We loop as long as we have unvisited nodes
    while(dfsStack.length > 0) {
        let closestNode = GRAPH_ADJACENCY_LIST.adjacencyList[dfsStack.shift()].vertex.node;
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            GRAPH_ALGORITHM_TIMER = Date.now() - startTime;
            visualiseGraphDijkstra();
            return GRAPH_VISITED_ARRAY;
        } 
        //We have the closest vertex. We need its index
        graphUpdateUnvisitedNeighbours(closestNode.index);
        GRAPH_VISITED_ARRAY.push(closestNode);
        closestNode.object.isVisited = true;
        GRAPH_ADJACENCY_LIST.adjacencyList[closestNode.index].vertex.node.object.isVisited = true;
        if(closestNode.index === GRAPH_FINISH_NODE_INDEX) {
            GRAPH_ALGORITHM_TIMER = Date.now() - startTime;
            visualiseGraphDijkstra();
            return GRAPH_VISITED_ARRAY;
        }
    }
}

function getGraphStack(index) {
    if (GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isQueued === true) {
        return []
    }
    GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isQueued = true;
    const neighbourEdges = graphGetUnvisitedNeighbours(index);

    var result = [GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.index]
    for (let i = 0; i < neighbourEdges.length; i++) {
        result.push(...getGraphStack(neighbourEdges[i].to.node.index));
    }

    return result;
}

function getGridStack(node) {
    const coordinate = node.object.coordinate;
    if(node.object.isQueued === true) {
        return []
    }
    node.object.isQueued = true;
    var topNeighbours = [];
    //If not on first row, push neighbour directly above
    if(coordinate >= GRID_COLS) {
        if(GRID_NODES[coordinate - GRID_COLS].node.object.isQueued === false) {
            topNeighbours = getGridStack(GRID_NODES[coordinate - GRID_COLS].node);
        }
    }
    var rightNeighbours = [];
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%GRID_COLS != GRID_COLS-1) {
        if(GRID_NODES[coordinate + 1].node.object.isQueued === false) {
            rightNeighbours = getGridStack(GRID_NODES[coordinate + 1].node);
        }
    }
    var leftNeighbours = [];
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%GRID_COLS != 0) {
        if(GRID_NODES[coordinate - 1].node.object.isQueued === false) {
            leftNeighbours = getGridStack(GRID_NODES[coordinate - 1].node);
        }
    }
    var bottomNeighbours = [];
    //If not on bottom row, push neighbour directly below
    if(coordinate < GRID_COLS*GRID_ROWS - GRID_COLS) {
        if(GRID_NODES[coordinate + GRID_COLS].node.object.isQueued === false) {
            bottomNeighbours = getGridStack(GRID_NODES[coordinate + GRID_COLS].node);
        }
    } 
    

    return [node, ...topNeighbours, ...rightNeighbours, ...bottomNeighbours, ...leftNeighbours];
}