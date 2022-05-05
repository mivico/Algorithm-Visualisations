
function gridfirstSearch() {
    const startTime = Date.now();
    IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRID_NODES[START_NODE_INDEX].node.key = 0;

    GRID_QUEUE.enqueue(GRID_NODES[START_NODE_INDEX].node);
    
    //We loop as long as we have unvisited nodes
    let itr = 0;
    let closestIndex = 0;
    while(GRID_QUEUE.length() > 0) {
        let closestNode = GRID_QUEUE.dequeue();
        closestIndex = closestNode.object.coordinate;
        gridAddNeighboursToQueue(closestNode);
        updateUnvisitedNeighbours(closestNode);
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
    IS_VISUALISED = true;
    return VISITED_ARRAY;
}

function gridAddNeighboursToQueue(node) {
    const neighbours = getUnvisitedNeighbours(node);
    for (let i = 0; i < neighbours.length; i++) {
        if(neighbours[i].object.isQueued === false) {
            neighbours[i].object.isQueued = true;
            if(neighbours[i].object.isWall === false) {
                GRID_QUEUE.enqueue(neighbours[i]);
            }
        }
    }
}

