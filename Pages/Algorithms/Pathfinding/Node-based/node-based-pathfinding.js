const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const canvasDiv = document.getElementById('canvas-holder');
const dijkstraButton = document.getElementById('visualise-dijkstra');
const astarButton = document.getElementById('visualise-astar');
const resetButton = document.getElementById('reset-button');
const westminsterButton = document.getElementById('westminster-button');

var printStatement = [];

var RENDER_IMAGE_SRC = undefined;

canvas.width = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;
canvas.style.backgroundColor = canvasDiv.style.backgroundColor;

var CANVAS_X_OFFSET = canvas.offsetLeft;
var CANVAS_Y_OFFSET = canvas.offsetTop;

var LEFT_BOUNDS = CANVAS_X_OFFSET;
var RIGHT_BOUNDS = canvas.width;
var TOP_BOUNDS = CANVAS_Y_OFFSET - window.scrollY;
var BOTTOM_BOUNDS = canvas.height;

var MOUSE_X = 0;
var MOUSE_Y = 0;
var IS_CLICKING = false;
var IS_SELECTING = false;
var EDGE_ARRAY = [];
var CURRENT_VERTEX_INDEX = undefined;
var SELECTED_NODES_INDEXES = []
var START_CLICK = 0;

var GRAPH_ADJACENCY_LIST = new AdjacencyList();
var UNVISITED_HEAP = new BinaryHeap([], lessThanWithHeuristic);

var NODE_RADIUS = 4;

let GRID_COLS = 40;
let GRID_ROWS = 15;
const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)";
var IS_VISUALISING = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var START_NODE_INDEX = null;
var FINISH_NODE_INDEX = null;
var VISITED_ARRAY = [];
var NODES_IN_SHORTEST_PATH_ORDER = [];
var CURRENT_ALGORITHM = undefined;

var CURRENT_SORT_CRITERIA = lessThanWithHeuristic;

var IS_SELECTING_START = true;
var IS_SELECTING_FINISH = false;


window.onresize = () => {
    CANVAS_X_OFFSET = canvas.offsetLeft;
    CANVAS_Y_OFFSET = canvas.offsetTop;
    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;

    LEFT_BOUNDS = CANVAS_X_OFFSET;
    RIGHT_BOUNDS = canvas.width;
    TOP_BOUNDS = CANVAS_Y_OFFSET - window.scrollY;
    BOTTOM_BOUNDS = canvas.height;
}



window.onmousemove = (e) => {
    CANVAS_X_OFFSET = canvas.offsetLeft;
    CANVAS_Y_OFFSET = canvas.offsetTop;

    if(IS_SELECTING) {
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

    if(CURRENT_VERTEX_INDEX != undefined) {
        canvasDiv.style.cursor = 'pointer'
    } else {
        canvasDiv.style.cursor = 'default'
    }
    

    if(IS_CLICKING && CURRENT_VERTEX_INDEX != undefined && IS_SELECTING) {
        GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originalx = MOUSE_X/canvas.width;
        GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originaly = MOUSE_Y/canvas.height;

    } else {
        updateCurrentVertexIndex();
    }
}

window.onmousedown = (e) => {
    IS_CLICKING = true;
    START_CLICK = Date.now();
    if(CURRENT_VERTEX_INDEX != undefined) {
        IS_SELECTING = true;
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
    IS_SELECTING = false;
    IS_CLICKING = false;
    START_CLICK = 0;
}

function isInCavas(e) {
    return e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width && e.y - CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + window.scrollY < canvas.height;
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
    console.log(GRAPH_ADJACENCY_LIST)
    if(CURRENT_VERTEX_INDEX != undefined) {
        console.log(GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.key);
        GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected = !GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected;
        handleEdgeCreation(); 
    }
    if(!IS_SELECTING && CURRENT_VERTEX_INDEX == undefined) {
        createVertex();
    }
}

function handleMouseHold() {
    if(CURRENT_VERTEX_INDEX != undefined) {
        if(IS_SELECTING_FINISH) {
            GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isFinish = true;
            FINISH_NODE_INDEX = CURRENT_VERTEX_INDEX
            IS_SELECTING_START = false;
            IS_SELECTING_FINISH = false;
        }
        if(IS_SELECTING_START) {
            GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isStart = true;
            START_NODE_INDEX = CURRENT_VERTEX_INDEX
            IS_SELECTING_START = false;
            IS_SELECTING_FINISH = true;
        }
    }
}

function updateCurrentVertexIndex() {
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(MOUSE_X < GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x + NODE_RADIUS && MOUSE_X > GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x - NODE_RADIUS &&
            MOUSE_Y < GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y + NODE_RADIUS && MOUSE_Y > GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y - NODE_RADIUS) {
                CURRENT_VERTEX_INDEX = i;
                return;
        }
    }
    CURRENT_VERTEX_INDEX = undefined;
}

function handleEdgeCreation() {
    //Mouse was just clicked. Handle the vertex creation pipeline

    //Bare in mind that the CURRENT_VERTEX_INDEX represents the index of the circle that was just clicked
    if(GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected) {
        //Node was just selected
        if (SELECTED_NODES_INDEXES.length == 0) {
            //No nodes in selected array so add this node
            SELECTED_NODES_INDEXES.push(CURRENT_VERTEX_INDEX);
        } else if (SELECTED_NODES_INDEXES.length == 1) {
            if(SELECTED_NODES_INDEXES[0] === CURRENT_VERTEX_INDEX) {
                SELECTED_NODES_INDEXES = [];
            } else {
                //2 different nodes have been selected
                SELECTED_NODES_INDEXES.push(CURRENT_VERTEX_INDEX);
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
           //START_NODE_INDEX = SELECTED_NODES_INDEXES[0];
           //FINISH_NODE_INDEX = SELECTED_NODES_INDEXES[1];
           //dijkstra()
        }
    } else {
        //Node was just deselected
        SELECTED_NODES_INDEXES = []
    }
}

dijkstraButton.addEventListener("click", () => {
    if (!IS_SELECTING_START && !IS_SELECTING_FINISH) {
        CURRENT_SORT_CRITERIA = lessThan;
        if(IS_VISUALISED) {
            resetForRevisualisation();
        }
        dijkstra();
    }
});

astarButton.addEventListener("click", () => {
    
    if (!IS_SELECTING_START && !IS_SELECTING_FINISH) {
        CURRENT_SORT_CRITERIA = lessThanWithHeuristic;
        if(IS_VISUALISED) {
            resetForRevisualisation();
        }
        dijkstra();
    }
    
   /*
   var temp = "";
   for (let i = 0; i < printStatement.length; i++) {
       temp = temp + printStatement[i];
   }
   console.log(temp);
   */
});

resetButton.addEventListener("click", () => {
    reset()
});

westminsterButton.addEventListener("click", () => {
    fullReset();
    mapWestminster();
});

function reset() {
    START_NODE_INDEX = null;
    FINISH_NODE_INDEX = null;
    resetNodes();
    SELECTED_NODES_INDEXES = [];
    IS_VISUALISED = false;
    IS_SELECTING_START = true;
    IS_SELECTING_FINISH = false;
    IS_VISUALISING = false;
    VISITED_ARRAY = [];
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function resetNodes() {
    for (const edgelist of GRAPH_ADJACENCY_LIST.adjacencyList) {
        edgelist.vertex.node.key = Infinity;
        edgelist.vertex.node.object.reset();
        edgelist.vertex.node.previousVertex = undefined;
    }
}

function fullReset() {
    START_NODE_INDEX = null;
    FINISH_NODE_INDEX = null;
    SELECTED_NODES_INDEXES = [];
    IS_VISUALISED = false;
    IS_SELECTING_START = true;
    IS_SELECTING_FINISH = false;
    GRAPH_ADJACENCY_LIST = new AdjacencyList();
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function resetForRevisualisation() {
    VISITED_ARRAY = [];
    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(i != START_NODE_INDEX && i != FINISH_NODE_INDEX) {
            GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.reset();;
        }
    };
}

function randomiseVertices() {
    for (let i = 0; i < GRID_ROWS; i++) {
        for (let j = 0; j < GRID_COLS; j++) {
            const x = (window.innerWidth / GRID_COLS) * j;
            const y = (window.innerHeight / GRID_ROWS) * i;
    
            setTimeout(() => {
                const tempCircle = new Circle((x + 3*NODE_RADIUS)/canvas.width, (y +  3*NODE_RADIUS)/canvas.height);
                const tempNode = new HeapNode(Infinity, tempCircle);
                tempNode.index = GRAPH_ADJACENCY_LIST.createVertex(tempNode).index;
                if(i === GRID_ROWS - 1 && j === GRID_COLS - 1) {
                    randomiseEdges();
                }
            }, i * 30)
        }
    }

    //Randomise edges
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

animate();
//randomiseVertices();

function updateEdges(edge) {

} 

//Set up start node placement
const INITIAL_START_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + Math.floor(GRID_COLS/4);
const INITIAL_FINISH_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + 3 * Math.floor(GRID_COLS/4);

START_NODE_INDEX = INITIAL_START_NODE_INDEX;
FINISH_NODE_INDEX = INITIAL_FINISH_NODE_INDEX;

//Dijkstra logic
function dijkstra() {
    IS_VISUALISING = true;
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    GRAPH_ADJACENCY_LIST.adjacencyList[START_NODE_INDEX].vertex.node.key = 0;
    //Initialise the min-heap
    initialiseHeap();
    //We loop as long as we have unvisited nodes
    while(UNVISITED_HEAP.length() > 0) {
        let closestNode = UNVISITED_HEAP.removeRoot();
        //console.log(`closest node: ${closestNode}`)
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            console.log('terminating as the closest node distance is infinity');
            visualiseDijkstra();
            return VISITED_ARRAY;
        } 
        //We have the closest vertex. We need its index
        updateUnvisitedNeighbours(closestNode.index);
        VISITED_ARRAY.push(closestNode);
        closestNode.object.isVisited = true;
        GRAPH_ADJACENCY_LIST.adjacencyList[closestNode.index].vertex.node.object.isVisited = true;
        if(closestNode.index === FINISH_NODE_INDEX) {
            console.log('terminating due to hitting target');
            visualiseDijkstra();
            return VISITED_ARRAY;
        }
    }
}

function visualiseDijkstra() {
    updateNodesInShortestPathOrder();
    console.log(`Nodes searched: ${VISITED_ARRAY.length - 2}`)
    if(IS_VISUALISED) {
        for (let i = 0; i < VISITED_ARRAY.length; i++) {
                GRAPH_ADJACENCY_LIST.adjacencyList[VISITED_ARRAY[i].index].vertex.node.object.visualVisited = true;
                if(VISITED_ARRAY[i].index === FINISH_NODE_INDEX) {
                    animateShortestPath();
                }
            
        }
        
    } else {
        for (let i = 0; i < VISITED_ARRAY.length; i++) {
            setTimeout(() => {
                GRAPH_ADJACENCY_LIST.adjacencyList[VISITED_ARRAY[i].index].vertex.node.object.visualVisited = true;
                if(VISITED_ARRAY[i].index === FINISH_NODE_INDEX) {
                    animateShortestPath();
                }
            }, 20 * i);
            
        }
    }
}

function getNeighbours(vertex) {
    const neighbours = []
    const coordinate = vertex.index;

    //If not on first row, push neighbour directly above
    if(coordinate >= GRID_COLS) {
        neighbours.push(GRAPH_ADJACENCY_LIST.adjacencyList[vertex.index - GRID_COLS].vertex);
    }
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%GRID_COLS != GRID_COLS-1) {
        neighbours.push(GRAPH_ADJACENCY_LIST.adjacencyList[vertex.index + 1].vertex);
    }
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%GRID_COLS != 0) {
        neighbours.push(GRAPH_ADJACENCY_LIST.adjacencyList[vertex.index - 1].vertex);
    }
    //If not on bottom row, push neighbour directly below
    if(coordinate < GRID_COLS*GRID_ROWS - GRID_COLS) {
        neighbours.push(GRAPH_ADJACENCY_LIST.adjacencyList[vertex.index + GRID_COLS].vertex);
    } 




    return neighbours;
}


function initialiseHeap() {
    UNVISITED_HEAP = new BinaryHeap([], CURRENT_SORT_CRITERIA);


    for (let i = 0; i < GRAPH_ADJACENCY_LIST.adjacencyList.length; i++) {
        UNVISITED_HEAP.insert(GRAPH_ADJACENCY_LIST.adjacencyList[i].vertex.node);
    }
}

function getUnvisitedNeighbours(index) {
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

function updateUnvisitedNeighbours(index) {
    const unvisitedNeighbourEdges = getUnvisitedNeighbours(index);
    const vertex = GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex;
    for (let i = 0; i < unvisitedNeighbourEdges.length; i++) {
        const edge = unvisitedNeighbourEdges[i];
        //Update only if new distance is less than known distance
        if(edge.to.node.key > vertex.node.key + edge.weight) {
            var replacement = new HeapNode(vertex.node.key + edge.weight, edge.to.node.object);
            replacement.index = edge.to.index;
            replacement.previousVertex = vertex;
            UNVISITED_HEAP.replace(edge.to.node, replacement);
            edge.to.node = replacement;
        }
    }
}

function lessThanWithHeuristic(lhs, rhs) {
    if((lhs.key + calculateHeuristic(lhs.index)) < (rhs.key + calculateHeuristic(rhs.index))) {
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

function animateShortestPath() {
    updateNodesInShortestPathOrder();
    if(IS_VISUALISED) {
        for(let i = 0; i < NODES_IN_SHORTEST_PATH_ORDER.length; i++) {
            const currentNode = NODES_IN_SHORTEST_PATH_ORDER[NODES_IN_SHORTEST_PATH_ORDER.length - 1 - i]
            const index = currentNode.index;

            GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
        }
    } else {
        for(let i = 0; i < NODES_IN_SHORTEST_PATH_ORDER.length; i++) {
            setTimeout(() => {
                if(!IS_VISUALISED) {
                    const currentNode = NODES_IN_SHORTEST_PATH_ORDER[NODES_IN_SHORTEST_PATH_ORDER.length - 1 - i]
                    const index = currentNode.index;
                    
                    GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
                    if(i == NODES_IN_SHORTEST_PATH_ORDER.length - 1) {
                        IS_VISUALISING = false;
                        IS_VISUALISED = true;
                    }
                }
            }, 20 * i)
        }
    }
}

function updateNodesInShortestPathOrder() {
    NODES_IN_SHORTEST_PATH_ORDER = [];
    let currentNode = GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node;
    while (currentNode != undefined) {
        NODES_IN_SHORTEST_PATH_ORDER.unshift(currentNode);
        if(currentNode.previousVertex === undefined) {
            break;
        }
        currentNode = currentNode.previousVertex.node;
    }
}

function calculateHeuristic(index) {
    const xDisance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.x) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.x);
    const yDistance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.y) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.y);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
};

function calculateDistance(lhs, rhs) {
    const xDisance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[lhs.index].vertex.node.object.x) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[rhs.index].vertex.node.object.x);
    const yDistance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[lhs.index].vertex.node.object.y) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[rhs.index].vertex.node.object.y);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
}