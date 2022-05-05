function graphFirstSearch() {
    const startTime = Date.now();
    GRAPH_IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.key = 0;
    GRAPH_QUEUE.enqueue(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node);

    //We loop as long as we have unvisited nodes
    while(GRAPH_QUEUE.length() > 0) {
        let closestNode = GRAPH_QUEUE.dequeue();
        //console.log(closestNode.index)
        graphAddNeighboursToQueue(closestNode);
        graphFSUpdateUnvisitedNeighbours(closestNode);
        
        GRAPH_VISITED_ARRAY.push(closestNode);
        closestNode.object.isVisited = true;
        if(closestNode.index === GRAPH_FINISH_NODE_INDEX) {
            GRAPH_ALGORITHM_TIMER = Date.now() - startTime;
            visualiseGraphDijkstra();
            return;
        }
    }
    GRAPH_IS_VISUALISING = false;
}

function graphFSUpdateUnvisitedNeighbours(node) {
    const unvisitedNeighbourEdges = graphGetUnvisitedNeighbours(node.index);
    const vertex = GRAPH_ADJACENCY_LIST.adjacencyList[node.index].vertex;
    for (let i = 0; i < unvisitedNeighbourEdges.length; i++) {
        const edge = unvisitedNeighbourEdges[i];
        //Update only if new distance is less than known distance
        if(edge.to.node.key > vertex.node.key + edge.weight) {
            const newKey = vertex.node.key + edge.weight;
            edge.to.node.previousVertex = vertex;
            edge.to.node.key = newKey;
        }
    }
}

function graphAddNeighboursToQueue(node) {
    const neighbourEdges = graphGetUnvisitedNeighbours(node.index);
    for (let i = 0; i < neighbourEdges.length; i++) {
        const edge = neighbourEdges[i];
        if(edge.to.node.object.isQueued === false) {
            edge.to.node.object.isQueued = true;
            GRAPH_QUEUE.enqueue(edge.to.node);
        }
    }
}