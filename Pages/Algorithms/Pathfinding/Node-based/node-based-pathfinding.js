const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const canvasDiv = document.getElementById('canvas-holder');
const graphDijkstraButton = document.getElementById('graph-visualise-dijkstra');
const graphAstarButton = document.getElementById('graph-visualise-astar');
const graphResetButton = document.getElementById('graph-reset-button');
const graphBfsButton = document.getElementById("graph-visualise-bfs");
const graphDfsButton = document.getElementById("graph-visualise-dfs");
//const westminsterButton = document.getElementById('graph-westminster-button');

var printStatement = [];

var RENDER_IMAGE_SRC = undefined;

canvas.width = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;
canvas.style.backgroundColor = canvasDiv.style.backgroundColor;
canvas.style.borderRadius = canvasDiv.style.borderRadius;

var CANVAS_X_OFFSET = canvas.offsetLeft;
var CANVAS_Y_OFFSET = canvas.offsetTop;

var LEFT_BOUNDS = CANVAS_X_OFFSET;
var RIGHT_BOUNDS = canvas.width;
var TOP_BOUNDS = CANVAS_Y_OFFSET - window.scrollY;
var BOTTOM_BOUNDS = canvas.height;

var MOUSE_X = 0;
var MOUSE_Y = 0;
var GRAPH_IS_CLICKING = false;
var GRAPH_IS_SELECTING = false;
var GRAPH_EDGE_ARRAY = [];
var GRAPH_CURRENT_VERTEX_INDEX = undefined;
var SELECTED_NODES_INDEXES = []
var START_CLICK = 0;

var GRAPH_ADJACENCY_LIST = new AdjacencyList();
var GRAPH_UNVISITED_HEAP = new BinaryHeap([], graphLessThanWithHeuristic);

var NODE_RADIUS = canvas.width/300;

const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)";
var GRAPH_IS_VISUALISING = false;
var GRAPH_IS_VISUALISED = false;
var GRAPH_IS_CLICKING = false;
var GRAPH_START_NODE_INDEX = null;
var GRAPH_FINISH_NODE_INDEX = null;
var GRAPH_VISITED_ARRAY = [];
var GRAPH_NODES_IN_SHORTEST_PATH_ORDER = [];
var GRAPH_CURRENT_ALGORITHM = undefined;

var GRAPH_CURRENT_SORT_CRITERIA = graphLessThanWithHeuristic;

var GRAPH_IS_SELECTING_START = true;
var GRAPH_IS_SELECTING_FINISH = false;

window.onresize = () => {
    CANVAS_X_OFFSET = canvas.offsetLeft;
    CANVAS_Y_OFFSET = canvas.offsetTop;
    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;
    canvas.style.borderRadius = canvasDiv.style.borderRadius;

    LEFT_BOUNDS = CANVAS_X_OFFSET;
    RIGHT_BOUNDS = canvas.width;
    TOP_BOUNDS = CANVAS_Y_OFFSET - window.scrollY;
    BOTTOM_BOUNDS = canvas.height;

    NODE_RADIUS = canvas.width/300;
}



window.onmousemove = (e) => {
    CANVAS_X_OFFSET = canvas.offsetLeft;
    CANVAS_Y_OFFSET = canvas.offsetTop;

    if(GRAPH_IS_SELECTING) {
        if(e.x - CANVAS_X_OFFSET - NODE_RADIUS > 0 && e.x - CANVAS_X_OFFSET + NODE_RADIUS < canvas.width) {
            MOUSE_X = e.x - CANVAS_X_OFFSET;
        } else if (e.x - CANVAS_X_OFFSET - NODE_RADIUS < 0) {
            MOUSE_X = NODE_RADIUS;
        } else if (e.x - CANVAS_X_OFFSET + NODE_RADIUS > canvas.width) {
            MOUSE_X = canvas.width - NODE_RADIUS;
        }
        if(e.y - CANVAS_Y_OFFSET - NODE_RADIUS + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + NODE_RADIUS + window.scrollY  < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET + window.scrollY ;
        } else if(e.y - CANVAS_Y_OFFSET - NODE_RADIUS + window.scrollY < 0) {
            MOUSE_Y = NODE_RADIUS + window.scrollY ;
        } else if(e.y - CANVAS_Y_OFFSET + NODE_RADIUS + window.scrollY > canvas.height) {
            MOUSE_Y = canvas.height - NODE_RADIUS + window.scrollY;
        }
    } else {
        if(e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width) {
            MOUSE_X = e.x - CANVAS_X_OFFSET;
        }
        if(e.y - CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + window.scrollY < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET + window.scrollY ;
        }
    }

    if(GRAPH_CURRENT_VERTEX_INDEX != undefined) {
        canvasDiv.style.cursor = 'pointer'
    } else {
        canvasDiv.style.cursor = 'default'
    }
    

    if(GRAPH_IS_CLICKING && GRAPH_CURRENT_VERTEX_INDEX != undefined && GRAPH_IS_SELECTING) {
        //handleVertexMove();
    } else {
        updateCurrentVertexIndex();
    }
}

window.onmousedown = (e) => {
    GRAPH_IS_CLICKING = true;
    START_CLICK = Date.now();
    if(GRAPH_CURRENT_VERTEX_INDEX != undefined) {
        GRAPH_IS_SELECTING = true;
    }
}

window.ondblclick = (e) => {
    
}

window.onmouseup = (e) => {
    if(isInCavas(e)) {
        const clickDuration = Date.now() - START_CLICK;
        if(clickDuration < 200) {
           handleMouseClick(e);
        } else {
            handleMouseHold();
        }
    }
    GRAPH_IS_SELECTING = false;
    GRAPH_IS_CLICKING = false;
    START_CLICK = 0;
}

function isInCavas(e) {
    return e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width && e.y - CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + window.scrollY < canvas.height;
}

function handleVertexMove() {
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.originalx = MOUSE_X/canvas.width;
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.originaly = MOUSE_Y/canvas.height;
}

function createVertex() {
    //console.log('created vertex')
    const tempCircle = new Circle(MOUSE_X/canvas.width, MOUSE_Y/canvas.height);
    const tempNode = new HeapNode(Infinity, tempCircle);
    /*
    if (printStatement.length%2 === 0) {
        printStatement.push(`\n{x: ${MOUSE_X/canvas.width}, y: ${MOUSE_Y/canvas.height}}, `);
    } else {
        printStatement.push(`{x: ${MOUSE_X/canvas.width}, y: ${MOUSE_Y/canvas.height}},`);
    }
    */
    //console.log(`{x: ${MOUSE_X/canvas.width}, y: ${MOUSE_Y/canvas.height}}, `);
    tempNode.object.draw();
    tempNode.index = GRAPH_ADJACENCY_LIST.createVertex(tempNode).index;
}

function handleMouseClick(e) {
    /*
    console.log(GRAPH_ADJACENCY_LIST)
    if(GRAPH_CURRENT_VERTEX_INDEX != undefined) {
        console.log(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.key);
        GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.isSelected = !GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.isSelected;
        handleEdgeCreation(); 
    }
    if(!GRAPH_IS_SELECTING && GRAPH_CURRENT_VERTEX_INDEX == undefined) {
        createVertex();
    }
    */

    if(GRAPH_CURRENT_VERTEX_INDEX != undefined) {
        if(GRAPH_IS_SELECTING_FINISH) {
            GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.isFinish = true;
            GRAPH_FINISH_NODE_INDEX = GRAPH_CURRENT_VERTEX_INDEX
            GRAPH_IS_SELECTING_START = false;
            GRAPH_IS_SELECTING_FINISH = false;
        }
        if(GRAPH_IS_SELECTING_START) {
            GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.isStart = true;
            GRAPH_START_NODE_INDEX = GRAPH_CURRENT_VERTEX_INDEX
            GRAPH_IS_SELECTING_START = false;
            GRAPH_IS_SELECTING_FINISH = true;
        }
    }
}

function handleMouseHold() {
}

function updateCurrentVertexIndex() {
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(MOUSE_X < GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x + NODE_RADIUS && MOUSE_X > GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x - NODE_RADIUS &&
            MOUSE_Y < GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y + NODE_RADIUS && MOUSE_Y > GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y - NODE_RADIUS) {
                GRAPH_CURRENT_VERTEX_INDEX = i;
                return;
        }
    }
    GRAPH_CURRENT_VERTEX_INDEX = undefined;
}

function handleEdgeCreation() {
    //Mouse was just clicked. Handle the vertex creation pipeline

    //Bare in mind that the GRAPH_CURRENT_VERTEX_INDEX represents the index of the circle that was just clicked
    if(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_CURRENT_VERTEX_INDEX].vertex.node.object.isSelected) {
        //Node was just selected
        if (SELECTED_NODES_INDEXES.length == 0) {
            //No nodes in selected array so add this node
            SELECTED_NODES_INDEXES.push(GRAPH_CURRENT_VERTEX_INDEX);
        } else if (SELECTED_NODES_INDEXES.length == 1) {
            if(SELECTED_NODES_INDEXES[0] === GRAPH_CURRENT_VERTEX_INDEX) {
                SELECTED_NODES_INDEXES = [];
            } else {
                //2 different nodes have been selected
                SELECTED_NODES_INDEXES.push(GRAPH_CURRENT_VERTEX_INDEX);
                const distance = calculateDistance(GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node, GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node);
                const tempEdge = new Line(GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node, GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node, distance);
                tempEdge.draw()
                GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node.object.isSelected = false;
                GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node.object.isSelected = false;
                GRAPH_ADJACENCY_LIST.addDirectedEdge(GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex, GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex, distance, tempEdge);

                if (printStatement.length%2 === 0) {
                    printStatement.push(`\n{from: ${SELECTED_NODES_INDEXES[0]}, to: ${SELECTED_NODES_INDEXES[1]}, weight: 1}, `);
                } else {
                    printStatement.push(`{from: ${SELECTED_NODES_INDEXES[0]}, to: ${SELECTED_NODES_INDEXES[1]}, weight: 1},`);
                }
                
                SELECTED_NODES_INDEXES = [];
            }
           //GRAPH_START_NODE_INDEX = SELECTED_NODES_INDEXES[0];
           //GRAPH_FINISH_NODE_INDEX = SELECTED_NODES_INDEXES[1];
           //graphDijkstra()
        }
    } else {
        //Node was just deselected
        SELECTED_NODES_INDEXES = []
    }
}

graphDijkstraButton.addEventListener("click", () => {
    if (!GRAPH_IS_SELECTING_START && !GRAPH_IS_SELECTING_FINISH) {
        GRAPH_CURRENT_ALGORITHM = graphDijkstra
        GRAPH_CURRENT_SORT_CRITERIA = graphLessThan;
        if(GRAPH_IS_VISUALISED) {
            graphResetForRevisualisation();
        }
        GRAPH_CURRENT_ALGORITHM();
        updateGraphExplanation();
        updateGraphInfo();
    } else {
        alert('Please select start and target nodes');
    }
});

graphAstarButton.addEventListener("click", () => {
    
    if (!GRAPH_IS_SELECTING_START && !GRAPH_IS_SELECTING_FINISH) {
        GRAPH_CURRENT_ALGORITHM = graphDijkstra
        GRAPH_CURRENT_SORT_CRITERIA = graphLessThanWithHeuristic;
        if(GRAPH_IS_VISUALISED) {
            graphResetForRevisualisation();
        }
        GRAPH_CURRENT_ALGORITHM();
        updateGraphExplanation();
        updateGraphInfo();
    } else {
        alert('Please select start and target nodes');
    }
});

graphDfsButton.addEventListener("click", () => {

    if (!GRAPH_IS_SELECTING_START && !GRAPH_IS_SELECTING_FINISH) {
        GRAPH_CURRENT_ALGORITHM = graphDfs;
        if(GRAPH_IS_VISUALISED) {
            fsReset();
        }
        GRAPH_CURRENT_ALGORITHM();
        updateGraphExplanation();
        updateGraphInfo();
    } else {
        alert('Please select start and target nodes');
    }
});

graphBfsButton.addEventListener("click", () => {
    if (!GRAPH_IS_SELECTING_START && !GRAPH_IS_SELECTING_FINISH) {
        GRAPH_CURRENT_ALGORITHM = graphBfs;
        if(GRAPH_IS_VISUALISED) {
            fsReset()
        }
        GRAPH_CURRENT_ALGORITHM();
        updateGraphExplanation();
        updateGraphInfo();
    } else {
        alert('Please select start and target nodes');
    }
});

graphResetButton.addEventListener("click", () => {
    graphReset()
});

/*
westminsterButton.addEventListener("click", () => {
    fullReset();
    mapWestminster();
});
*/

function fsReset() {
    GRAPH_VISITED_ARRAY = [];
    const oldStart = GRAPH_START_NODE_INDEX;
    const oldFinish = GRAPH_FINISH_NODE_INDEX;
    resetNodes();
    GRAPH_START_NODE_INDEX = oldStart;
    GRAPH_FINISH_NODE_INDEX = oldFinish;
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.object.isStart = true;
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node.object.isFinish = true;
    GRAPH_VISITED_COUNTER = 0;
    GRAPH_ALGORITHM_TIMER = 0;
    updateGraphInfo();
}

function graphReset() {
    GRAPH_CURRENT_ALGORITHM = undefined;
    GRAPH_CURRENT_SORT_CRITERIA = undefined;
    updateGraphExplanation();
    GRAPH_START_NODE_INDEX = null;
    GRAPH_FINISH_NODE_INDEX = null;
    GRAPH_VISITED_COUNTER = 0;
    GRAPH_ALGORITHM_TIMER = 0;
    resetNodes();
    SELECTED_NODES_INDEXES = [];
    GRAPH_IS_VISUALISED = false;
    GRAPH_IS_SELECTING_START = true;
    GRAPH_IS_SELECTING_FINISH = false;
    GRAPH_IS_VISUALISING = false;
    GRAPH_VISITED_ARRAY = [];
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';

    updateGraphInfo();
}

function resetNodes() {
    for (const edgelist of GRAPH_ADJACENCY_LIST.adjacencyList) {
        edgelist.vertex.node.key = Infinity;
        edgelist.vertex.node.object.reset();
        edgelist.vertex.node.previousVertex = undefined;
    }
}

function fullReset() {
    GRAPH_START_NODE_INDEX = null;
    GRAPH_FINISH_NODE_INDEX = null;
    SELECTED_NODES_INDEXES = [];
    GRAPH_IS_VISUALISED = false;
    GRAPH_IS_SELECTING_START = true;
    GRAPH_IS_SELECTING_FINISH = false;
    GRAPH_ADJACENCY_LIST = new AdjacencyList();
    GRAPH_VISITED_ARRAY = [];
    GRAPH_VISITED_COUNTER = 0;
    GRAPH_ALGORITHM_TIMER = 0;
    updateGraphInfo();
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function graphResetForRevisualisation() {
    GRAPH_VISITED_ARRAY = [];
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(i != GRAPH_START_NODE_INDEX && i != GRAPH_FINISH_NODE_INDEX) {
            GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.reset();
        }
    };
    GRAPH_VISITED_COUNTER = 0;
    GRAPH_ALGORITHM_TIMER = 0;
    updateGraphInfo();
}


function randomiseEdges() {
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        setTimeout(() => {
            const neighbours = getNeighbours(GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex);
            for (let j = 0; j < neighbours.length; j++) {
                const neighbour = neighbours[j];
                //const tempEdge = new Line(GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.object, GRAPH_ADJACENCY_LIST.adjacencyList[neighbour.index].vertex.object);
                    //GRAPH_ADJACENCY_LIST.addDirectedEdge(GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex, GRAPH_ADJACENCY_LIST.adjacencyList[neighbour.index].vertex, 1, tempEdge);
            }
        }, i * 2)
    }

}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


function animate() {
    context.clearRect(0, 0, RIGHT_BOUNDS, BOTTOM_BOUNDS);
    requestAnimationFrame(animate);
    updateGraphExplanation();

    if (RENDER_IMAGE_SRC != undefined) {
        var img = new Image();
        img.src = RENDER_IMAGE_SRC;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    for(let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = GRAPH_ADJACENCY_LIST.adjacencyList[i];
        const edges = edgeList.edges;
        if (edges != null) {
            for (j = 0; j < edges.length; j++) {
                const edge = edges[j];
                edge.lineObject.update();
            }
        }
    }
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.update();
    }
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.triangles.length; i++) {
        GRAPH_ADJACENCY_LIST.triangles[i].update();
    }
}

mapWestminster();
animate();

function updateEdges(edge) {

} 

//Dijkstra logic
function graphDijkstra() {
    const startTime = Date.now();
    GRAPH_IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_START_NODE_INDEX].vertex.node.key = 0;
    //Initialise the min-heap
    initialiseGraphHeap();
    //We loop as long as we have unvisited nodes
    while(GRAPH_UNVISITED_HEAP.length() > 0) {
        let closestNode = GRAPH_UNVISITED_HEAP.removeRoot();
        //console.log(`closest node: ${closestNode}`)
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

function visualiseGraphDijkstra() {
    updateNodesInShortestPathOrder();
    if(GRAPH_IS_VISUALISED) {
        for (let i = 0; i < GRAPH_VISITED_ARRAY.length; i++) {
                GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_VISITED_ARRAY[i].index].vertex.node.object.visualVisited = true;
                GRAPH_VISITED_COUNTER = GRAPH_VISITED_COUNTER + 1;
                updateGraphInfo();
                if(GRAPH_VISITED_ARRAY[i].index === GRAPH_FINISH_NODE_INDEX) {
                    graphAnimateShortestPath();
                }
            
        }
        
    } else {
        for (let i = 0; i < GRAPH_VISITED_ARRAY.length; i++) {
            setTimeout(() => {
                GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_VISITED_ARRAY[i].index].vertex.node.object.visualVisited = true;
                GRAPH_VISITED_COUNTER = GRAPH_VISITED_COUNTER + 1;
                updateGraphInfo();
                if(GRAPH_VISITED_ARRAY[i].index === GRAPH_FINISH_NODE_INDEX) {
                    graphAnimateShortestPath();
                }
            }, 20 * i);
            
        }
    }
}

function initialiseGraphHeap() {
    GRAPH_UNVISITED_HEAP = new BinaryHeap([], GRAPH_CURRENT_SORT_CRITERIA);
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        GRAPH_UNVISITED_HEAP.insert(GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node);
    }
}

function graphGetUnvisitedNeighbours(index) {
    var neighbours = []
    const edgeList = GRAPH_ADJACENCY_LIST.adjacencyList[index];
    if(edgeList.edges != null) {
        for (let i = 0; i < edgeList.edges.length; i++) {
            const edge = edgeList.edges[i]
            if (!edge.to.node.object.isVisited) {
                neighbours.push(edge);
            }
        }
    }
    return neighbours;
}

function graphUpdateUnvisitedNeighbours(index) {
    const unvisitedNeighbourEdges = graphGetUnvisitedNeighbours(index);
    const vertex = GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex;
    for (let i = 0; i < unvisitedNeighbourEdges.length; i++) {
        const edge = unvisitedNeighbourEdges[i];
        //Update only if new distance is less than known distance
        if(edge.to.node.key > vertex.node.key + edge.weight) {
            var replacement = new HeapNode(vertex.node.key + edge.weight, edge.to.node.object);
            replacement.index = edge.to.index;
            replacement.previousVertex = vertex;
            GRAPH_UNVISITED_HEAP.replace(edge.to.node, replacement);
            edge.to.node = replacement;
        }
    }
}

function graphLessThanWithHeuristic(lhs, rhs) {
    if((lhs.key + graphCalculateHeuristic(lhs.index)) < (rhs.key + graphCalculateHeuristic(rhs.index))) {
        return true;
    } else {
        return false;
    }
}

function graphLessThan(lhs, rhs) {
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

function graphAnimateShortestPath() {
    updateNodesInShortestPathOrder();
    if(GRAPH_IS_VISUALISED) {
        for(let i = 0; i < GRAPH_NODES_IN_SHORTEST_PATH_ORDER.length; i++) {
            const currentNode = GRAPH_NODES_IN_SHORTEST_PATH_ORDER[GRAPH_NODES_IN_SHORTEST_PATH_ORDER.length - 1 - i]
            const index = currentNode.index;

            GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
        }
    } else {
        for(let i = 0; i < GRAPH_NODES_IN_SHORTEST_PATH_ORDER.length; i++) {
            setTimeout(() => {
                if(!GRAPH_IS_VISUALISED) {
                    const currentNode = GRAPH_NODES_IN_SHORTEST_PATH_ORDER[GRAPH_NODES_IN_SHORTEST_PATH_ORDER.length - 1 - i]
                    const index = currentNode.index;
                    
                    GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
                    if(i == GRAPH_NODES_IN_SHORTEST_PATH_ORDER.length - 1) {
                        GRAPH_IS_VISUALISING = false;
                        GRAPH_IS_VISUALISED = true;
                    }
                }
            }, 20 * i)
        }
    }
}

function updateNodesInShortestPathOrder() {
    GRAPH_NODES_IN_SHORTEST_PATH_ORDER = [];
    let currentNode = GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node;
    while (currentNode != undefined) {
        GRAPH_NODES_IN_SHORTEST_PATH_ORDER.unshift(currentNode);
        if(currentNode.previousVertex === undefined) {
            break;
        }
        currentNode = currentNode.previousVertex.node;
    }
}

function graphCalculateHeuristic(index) {
    const xDisance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node.object.x) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.x);
    const yDistance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node.object.y) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node.object.y);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
};

function calculateDistance(lhs, rhs) {
    const xDisance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[lhs.index].vertex.node.object.x) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[rhs.index].vertex.node.object.x);
    const yDistance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[lhs.index].vertex.node.object.y) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[rhs.index].vertex.node.object.y);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
}


function updateGraphVisitedCounter() {
    //visitedCounter.innerHTML = `<h3>Visited: ${VISITED_COUNTER}</h3>`;
    if(document.getElementById("graph-visited-counter") != null) {
        document.getElementById("graph-visited-counter").innerHTML = `
        <p id="graph-visited-counter">
            The algorithm visited ${GRAPH_VISITED_COUNTER} nodes
        </p>`
    }
}

function updateGraphPathLength() {
    if(document.getElementById("graph-path-length") != null) {
        document.getElementById("graph-path-length").innerHTML = `
        <p id="graph-path-length">
            The length of the shortest path is ${GRAPH_ADJACENCY_LIST.adjacencyList[GRAPH_FINISH_NODE_INDEX].vertex.node.key} units
        </p>`
    }
}

function updateGraphTimer() {
    if(document.getElementById("graph-algorithm-timer") != null) {
        document.getElementById("graph-algorithm-timer").innerHTML = `
        <p>
            Time taken in ms: ${GRAPH_ALGORITHM_TIMER}
        </p>`;
    }
}

function updateGraphInfo() {
    updateGraphVisitedCounter();
    updateGraphTimer();
    updateGraphPathLength();
}