function bfs() {
    const startTime = Date.now();
    IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRID_NODES[START_NODE_INDEX].node.key = 0;
    //Initialise the queue
    const queueStart = Date.now();
    GRID_QUEUE = new Queue();
    GRID_QUEUE.enqueue(GRID_NODES[START_NODE_INDEX].node);
    //GRID_QUEUE = [GRID_NODES[START_NODE_INDEX].node];
    QUEUE_TIMER = Date.now() - queueStart;
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(GRID_QUEUE.length() > 0) {
        let closestNode = GRID_QUEUE.dequeue();
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
    console.log("queue empty")
    IS_VISUALISING = false;
    return VISITED_ARRAY;
}

function graphBfs() {
    const startTime = Date.now();
    GRAPH_IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.key = 0;
    //Initialise the queue
    const queueStart = Date.now();
    const bfsQueue = getGraphQueue();
    QUEUE_TIMER = Date.now() - queueStart;
    //We loop as long as we have unvisited nodes
    while(bfsQueue.length > 0) {
        let closestNode = GRAPH_ADJACENCY_LIST.adjacencyList[bfsQueue.shift()].vertex.node;
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

function getGraphQueue() {
    var values = [];
    var queue = [GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.index];
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.object.isQueued = true;

    while (queue.length > 0) {
        const currentIndex = queue.shift();
        values.push(GRAPH_ADJACENCY_LIST.adjacencyList[currentIndex].vertex.node.index);
        const neighbourEdges = graphGetUnvisitedNeighbours(currentIndex);
        for (let i = 0; i < neighbourEdges.length; i++) {
            if(neighbourEdges[i].to.node.object.isQueued === false) {
                neighbourEdges[i].to.node.object.isQueued = true;
                queue.push(neighbourEdges[i].to.node.index);
            }
        }
    }
    return values;
}
