const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const canvasDiv = document.getElementById('canvas-holder');
const dijkstraButton = document.getElementById('visualise-dijkstra');
const astarButton = document.getElementById('visualise-astar');
const resetButton = document.getElementById('reset-button');

canvas.width = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;
canvas.style.backgroundColor = canvasDiv.style.backgroundColor;

var CANVAS_X_OFFSET = canvas.offsetLeft;
var CANVAS_Y_OFFSET = canvas.offsetTop;

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

var NODE_RADIUS = canvas.width/100;

let GRID_COLS = 40;
let GRID_ROWS = 15;
const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)";
var IS_VISUALISING = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var START_NODE_INDEX = null;
var FINISH_NODE_INDEX = null;
var VISITED_ARRAY = [];
var CURRENT_ALGORITHM = undefined;
var CURRENT_SORT_CRITERIA = lessThanWithHeuristic;

var IS_SELECTING_START = true;
var IS_SELECTING_FINISH = false;


window.onresize = () => {
    CANVAS_X_OFFSET = canvas.offsetLeft;
    CANVAS_Y_OFFSET = canvas.offsetTop;
    canvas.width = canvasDiv.clientWidth;
    canvas.height = canvasDiv.clientHeight;

    if(canvas.width/100 > 30) {
        NODE_RADIUS = 30;
    } else if (canvas.width/100 < 10) {
        NODE_RADIUS = 10;
    } else {
        NODE_RADIUS = canvas.width/100;
    }
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
        if(e.y - CANVAS_Y_OFFSET - NODE_RADIUS > 0 && e.y - CANVAS_Y_OFFSET + NODE_RADIUS  < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET;
        } else if(e.y - CANVAS_Y_OFFSET - NODE_RADIUS < 0) {
            MOUSE_Y = NODE_RADIUS;
        } else if(e.y - CANVAS_Y_OFFSET + NODE_RADIUS  > canvas.height) {
            MOUSE_Y = canvas.height - NODE_RADIUS;
        }

    } else {
        if(e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width) {
            MOUSE_X = e.x - CANVAS_X_OFFSET;
        }
        if(e.y - CANVAS_Y_OFFSET > 0 && e.y - CANVAS_Y_OFFSET < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET;
        }
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
    return e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width && e.y - CANVAS_Y_OFFSET > 0 && e.y - CANVAS_Y_OFFSET < canvas.height;
}

function createVertex() {
    //const tempCircle = new Circle(MOUSE_X, MOUSE_Y);
    const tempCircle = new Circle(MOUSE_X/canvas.width, MOUSE_Y/canvas.height);
    const tempNode = new HeapNode(Infinity, tempCircle);
    tempNode.object.draw();
    tempNode.index = GRAPH_ADJACENCY_LIST.createVertex(tempNode).index;
}

function handleMouseClick(e) {
    if(CURRENT_VERTEX_INDEX != undefined) {
        GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected = !GRAPH_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected;
        handleEdgeCreation(); 
    }
    if(!IS_SELECTING && CURRENT_VERTEX_INDEX == undefined) {
        createVertex();
    }
    console.log(GRAPH_ADJACENCY_LIST);
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
                const tempEdge = new Arrow(GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node, GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node, 1);
                tempEdge.draw()
                GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node.object.isSelected = false;
                GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node.object.isSelected = false;
                GRAPH_ADJACENCY_LIST.addDirectedEdge(GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex, GRAPH_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex, 1, tempEdge);
                
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
        dijkstra();
    }
});

astarButton.addEventListener("click", () => {
    if (!IS_SELECTING_START && !IS_SELECTING_FINISH) {
        CURRENT_SORT_CRITERIA = lessThanWithHeuristic;
        dijkstra();
    }
});

resetButton.addEventListener("click", () => {
    reset()
});

function reset() {
    START_NODE_INDEX = null;
    FINISH_NODE_INDEX = null;
    resetNodes();
    SELECTED_NODES_INDEXES = [];
    IS_VISUALISED = false;
    IS_SELECTING_START = true;
    IS_SELECTING_FINISH = false;
}

function resetNodes() {
    for (const edgelist of GRAPH_ADJACENCY_LIST.adjacencyList) {
        edgelist.vertex.node.key = Infinity;
        edgelist.vertex.node.object.reset();
    }
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
    context.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate);
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
    console.log(START_NODE_INDEX)
    GRAPH_ADJACENCY_LIST.adjacencyList[START_NODE_INDEX].vertex.node.key = 0;
    //Initialise the min-heap
    initialiseHeap();
    //We loop as long as we have unvisited nodes
    let itr = 0;
    while(UNVISITED_HEAP.length() > 0) {
        let closestNode = UNVISITED_HEAP.removeRoot();
        //console.log(`closest node: ${closestNode}`)
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            console.log('terminating as the closest node distance is infinity')
            return VISITED_ARRAY;
        } 
        //We have the closest vertex. We need its edgelist
        const edgeList = GRAPH_ADJACENCY_LIST.adjacencyList[closestNode.index];
        updateUnvisitedNeighbours(edgeList);
        VISITED_ARRAY.push(closestNode);
        if(IS_VISUALISED) {
            closestNode.object.isVisited = true;
            GRAPH_ADJACENCY_LIST.adjacencyList[closestNode.index].vertex.node.object.isVisited = true
            if(closestNode.index === FINISH_NODE_INDEX) {
                animateShortestPath();
            }
            
        } else {
            setTimeout(() => {
                closestNode.object.isVisited = true;
                GRAPH_ADJACENCY_LIST.adjacencyList[closestNode.index].vertex.node.object.isVisited = true
                if(closestNode.index === FINISH_NODE_INDEX) {
                    animateShortestPath();
                }
            }, 200 * itr);
        }
        if(closestNode.index === FINISH_NODE_INDEX) {
            console.log('terminating due to hitting target')
            return VISITED_ARRAY;
        }
        itr++;
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

function getUnvisitedNeighbours(edgeList) {
    var neighbours = []
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

function updateUnvisitedNeighbours(edgeList) {
    const unvisitedNeighbourEdges = getUnvisitedNeighbours(edgeList);
    const vertex = edgeList.vertex;
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
    const nodesInShortestPathOrder = getNodesInShortestPathOrder();
    if(IS_VISUALISED) {
        for(let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
            const index = currentNode.index;

            GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
        }
    } else {
        for(let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                if(!IS_VISUALISED) {
                    const currentNode = nodesInShortestPathOrder[nodesInShortestPathOrder.length - 1 - i]
                    const index = currentNode.index;
                    
                    GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.isShortestPath = true;
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
    let currentNode = GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node;
    while (currentNode != undefined) {
        nodesInShortestPathOrder.unshift(currentNode);
        if(currentNode.previousVertex === undefined) {
            break;
        }
        currentNode = currentNode.previousVertex.node;
    }
    return nodesInShortestPathOrder;
}

function calculateHeuristic(index) {
    const xDisance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.x) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.x);
    const yDistance = Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.y) - Math.floor(GRAPH_ADJACENCY_LIST.adjacencyList[FINISH_NODE_INDEX].vertex.node.object.y);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
};