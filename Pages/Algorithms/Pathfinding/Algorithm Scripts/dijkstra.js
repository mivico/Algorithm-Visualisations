//Dijkstra logic
function dijkstra() {
    IS_VISUALISING = true;
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
