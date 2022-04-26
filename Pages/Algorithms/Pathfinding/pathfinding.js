let GRID_COLS = 40;
let GRID_ROWS = 40;
const GRID_BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)"
var IS_DRAGGING_START = false;
var IS_DRAGGING_FINISH = false;
var IS_VISUALISING = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var START_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + Math.floor(GRID_COLS/4);
var FINISH_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + 3 * Math.floor(GRID_COLS/4);
var GRID_QUEUE = new PriorityQueue();
var VISITED_ARRAY = [];
var CURRENT_ALGORITHM = undefined;
var CURRENT_SORT_CRITERIA = undefined;

const gridAstarButton = document.getElementById("grid-visualise-astar");
const gridBfsButton = document.getElementById("grid-visualise-bfs");
const gridDfsButton = document.getElementById("grid-visualise-dfs");
const gridDijkstraButton = document.getElementById("grid-visualise-dijkstra");
const recursiveDivisionButton = document.getElementById("recursive-division");
const gridResetButton = document.getElementById("grid-reset-button");

//Explanations
const gridExplanation = document.getElementById("grid-explanation");
//const graphExplanation = document.getElementById("graph-explanation");

//Algo info
var VISITED_COUNTER = 0;
const visitedCounter = document.getElementById("visited-counter");
var ALGORITHM_TIMER = 0;

var GRAPH_VISITED_COUNTER = 0;
const graphVisitedCounter = document.getElementById("graph-visited-counter");
var GRAPH_ALGORITHM_TIMER = 0;

var UNVISITED_HEAP = new BinaryHeap([], lessThanWithHeuristic);
const gridView = document.getElementById('grid-view');
const graphView = document.getElementById('graph-view');

//Grid logic
const grid = document.getElementById('pathfinding-grid');
var fragment = document.createDocumentFragment();
let i = 0;
while (i<GRID_COLS*GRID_ROWS) {
    const div = document.createElement('div');
    const coordinate = i%GRID_COLS + (Math.floor(i/GRID_COLS) * GRID_COLS)
    div.id = `node-${i}`;
    div.className = 'node';
    //div.textContent = `${i}`;
    div.node = new HeapNode(Infinity, {
        isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
        isStart: coordinate === START_NODE_INDEX ? true : false,
        isVisited: false,
        isWall: false,
        weight: 1,
        coordinate: coordinate,
        isQueued: false
    });
    div.onmousedown = () => {
        handleMouseDown(coordinate);
    }
    div.onmouseup = () => {
        handleMouseUp(coordinate);
    }
    div.onmouseenter = () => {
        handleMouseEnter(coordinate);
    };

    div.onmouseleave = () => {
        handleMouseLeave(coordinate);
    }
    if(coordinate === START_NODE_INDEX) {
        div.classList.add("node-start");
    }
    if(coordinate === FINISH_NODE_INDEX) {
        div.classList.add("node-finish");
    }
    div.style.borderTop = GRID_BORDER_COLOR;
    div.style.borderLeft = GRID_BORDER_COLOR;
    if(coordinate >= ((GRID_COLS*GRID_ROWS) - GRID_COLS)) {
        div.style.borderBottom = GRID_BORDER_COLOR;
    }
    if(coordinate%GRID_COLS === GRID_COLS-1) {
        div.style.borderRight = GRID_BORDER_COLOR;
    }
    fragment.append(div);
    i++;
}
grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
grid.append(fragment);

//Explanations
function setUpGridExplanation() {
    gridExplanation.innerHTML = `
    <h2>Click on an algorithm to view its description</h2>
    `
}


grid.onmouseleave = () => {
    IS_CLICKING = false;
}

const GRID_NODES = document.querySelectorAll(".node");
//Button logic
gridResetButton.addEventListener("click", () => {
    if(IS_VISUALISING) {
        return
    }
    reset();
});

recursiveDivisionButton.addEventListener("click", async () => {
    await generate()
});

async function generate() {
    Promise.all([
        await addOuterWalls(),
        await addInnerWalls(true, 1, GRID_COLS - 2, 1, GRID_ROWS - 2, 0)
    ])
}

async function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
    if (h) {
        if (maxX - minX < 2) {
            //Region too small
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY)/2)*2;
        await addHWall(minX, maxX, y);

        Promise.all([addInnerWalls(!h, minX, maxX, minY, y-1, gate), addInnerWalls(!h, minX, maxX, y + 1, maxY, gate)]);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX)/2)*2;
        await addVWall(minY, maxY, x);
        Promise.all([addInnerWalls(!h, minX, x-1, minY, maxY, gate), addInnerWalls(!h, x + 1, maxX, minY, maxY, gate)]);
    }
}

async function addHWall(minX, maxX, y) {
    var hole = Math.floor(randomNumber(minX, maxX)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i != hole) {
            const coordinate = i + y * GRID_COLS;
            await drawWall(coordinate);
        }
    }
}

async function addVWall(minY, maxY, x) {
    var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i != hole) {
            const coordinate = x + i * GRID_COLS;
            await drawWall(coordinate);
        }
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function addOuterWalls() {
    for (let i = 0; i < GRID_COLS; i++) {
        await Promise.all([drawWall(i), drawWall(i + (GRID_ROWS - 1) * (GRID_COLS))]);
    }
    for (let i = 1; i < GRID_ROWS - 1; i ++) {
        await Promise.all([drawWall(i * GRID_COLS), drawWall((i * GRID_COLS) + GRID_COLS - 1)]);
    }
}

async function recursiveDivision(x, y, width, height) {
    if (width < 4 || height < 4) {
        return
    }
    //If dir = 0, horizontal line
    //If dir = 1, vertical line
    const dir = chooseOrientation(width, height);
    let wx = dir === 0 ? x : getRndInteger(x + 1, width - x);
    let wy = dir === 0 ? getRndInteger(y + 1, height - y) : y;
    const px = dir === 0 ? getRndInteger(wx, width - wx) : wx;
    const py = dir === 0 ? wy: getRndInteger(wy, height - wy);
    const dx = dir === 0 ? 1 : 0;
    const dy = dir === 0 ? 0 : 1;
    const length = dir === 0 ? width : height;
    const perp = dir === 0 ? 1 : 0;

    for (let i = 0; i < length; i++) {
        if (!(wx === px && wy === py)) {
            //Draw wall
            const coordinate = wx + wy * GRID_COLS;
            await drawWall(coordinate)
        }
        wx += dx;
        wy += dy;
    }

    //Call recursiveDivision on the two subfields now created

    //Firstly, we need the bounds of the two fields
    //We already know where the wall was drawn

    const x1 = x;
    const x2 = dir === 0 ? x : wx + 1;
    const y1 = y;
    const y2 = dir === 0 ? wy + 1 : y;

    const width1 = dir === 0 ? width : wx - x;
    const width2 = dir === 0 ? width : width - (wx - x + 1);
    const height1 = dir === 0 ? wy - y : height;
    const height2 = dir === 0 ? height - (wy - y + 1): height;

    //await Promise.all([recursiveDivision(x1, y1, width1, height1), recursiveDivision(x2, y2, width2, height2)]);
    await recursiveDivision(x1, y1, width1, height1);
    await recursiveDivision(x2, y2, width2, height2);
}

function chooseOrientation(width, height) {
    let dir;
    if (width > height) {
        //Bisect with a vertical line
        dir = 1;
    } else if (height > width) {
        //Bisect with a horizontal line
        dir = 0;
    } else {
        dir = getRndInteger(0, 2)
    }
    return dir;
}

function updateVisitedCounter() {
    if(document.getElementById("visited-counter") != null) {
        document.getElementById("visited-counter").innerHTML = `
        <p id="visited-counter">
            The algorithm visited ${VISITED_COUNTER} nodes
        </p>`
    }
}

function updateGridPathLength() {
    if(document.getElementById("path-length") != null) {
        document.getElementById("path-length").innerHTML = `
        <p id="visited-counter">
            The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].node.key}
        </p>`
    }
}

function updateTimer() {
    if(document.getElementById("algorithm-timer") != null) {
        document.getElementById("algorithm-timer").innerHTML = `
        <p>
            Time taken in ms: ${ALGORITHM_TIMER}
        </p>`;
    }
}

function updateInfo() {
    updateVisitedCounter();
    updateTimer();
    updateGridPathLength();
}


function search() {
    if(IS_VISUALISING) {
        return
    }
    if (IS_VISUALISED) {
        resetForRevisualisation();
        IS_VISUALISED = false;
    }
    switch (CURRENT_ALGORITHM) {
        case "dfs":
            GRID_QUEUE = new Stack();
            gridfirstSearch();
            gridAddNeighboursToStack;
        case "bfs":
            GRID_QUEUE = new Queue();
            gridfirstSearch();
            break;
        case "dijkstra":
            CURRENT_SORT_CRITERIA = lessThan;
            dijkstra();
            break;
        case "astar": 
            CURRENT_SORT_CRITERIA = lessThanWithHeuristic;
            dijkstra();
            break;
    }
    updateGridExplanation();
    updateInfo();
}

function reset() {
    START_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + Math.floor(GRID_COLS/4);
    FINISH_NODE_INDEX = Math.floor(GRID_ROWS/2)*GRID_COLS + 3 * Math.floor(GRID_COLS/4);
    VISITED_COUNTER = 0;
    ALGORITHM_TIMER = 0;
    IS_VISUALISED = false;
    CURRENT_ALGORITHM == undefined;
    CURRENT_SORT_CRITERIA = undefined;
    initialiseGridNodes();
    updateInfo();
    updateGridExplanation();
}

function resetForRevisualisation() {
    GRID_NODES.forEach((pathNode) => {
        const coordinate = pathNode.node.object.coordinate
        if(pathNode.classList.contains("node-visited")) {
            pathNode.classList.remove("node-visited");
        }
        if(pathNode.classList.contains("node-visited-revisualisation")) {
            pathNode.classList.remove("node-visited-revisualisation");
        }
        if(pathNode.classList.contains("node-shortest-path")) {
            pathNode.classList.remove("node-shortest-path");
        }
        if(pathNode.classList.contains("node-shortest-path-revisualisation")) {
            pathNode.classList.remove("node-shortest-path-revisualisation");
        }
        pathNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: pathNode.node.object.isWall,
            weight: pathNode.node.object.weight,
            coordinate: coordinate,
            isQueued: false
        });
    })
    VISITED_COUNTER = 0;
    ALGORITHM_TIMER = 0;
    QUEUE_TIMER = 0;
    updateInfo();
}

//Event handlers
function handleMouseDown(coordinate) {
    if(IS_VISUALISING) {
        return
    }
    const node = GRID_NODES[coordinate];
    if (node.classList.contains("node-start")) {
        IS_DRAGGING_START = true;
    } else if (node.classList.contains("node-finish")) {
        IS_DRAGGING_FINISH = true
    } else {
        IS_CLICKING = true
        if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
            if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                revisualise();
            } else {
                if(node.classList.contains("node-visited")) {
                    node.classList.remove("node-visited");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    revisualise();
                } else if(node.classList.contains("node-visited-revisualisation")) {
                    node.classList.remove("node-visited-revisualisation");
                    node.node.object.isVisited = false;
                    node.classList.add("node-wall");
                    node.node.object.isWall = true;
                    revisualise();
                } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise();
                }
            }
        }
    }
}

function handleMouseUp(coordinate) {
    const node = GRID_NODES[coordinate];
    IS_CLICKING = false;
    if(IS_DRAGGING_START) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        IS_DRAGGING_START = false;
    }
    if(IS_DRAGGING_FINISH) {
        node.node.object.isWall = false;
        node.classList.remove("node-wall")
        IS_DRAGGING_FINISH = false;
    }
}

function handleMouseEnter(coordinate) {
    const node = GRID_NODES[coordinate];
    if(IS_DRAGGING_START) {
        node.classList.add("node-start");
         START_NODE_INDEX = coordinate;
        revisualise();
    } else if (IS_DRAGGING_FINISH) {
        node.classList.add("node-finish");
     FINISH_NODE_INDEX = coordinate;
     revisualise();
     
 } else if(IS_CLICKING === true) {
         if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
             if(node.classList.contains("node-visited")) {
                node.classList.remove("node-visited");
                node.node.object.isVisited = false;
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise();
             } else if(node.classList.contains("node-wall")) {
                node.classList.remove("node-wall");
                node.node.object.isWall = false;
                revisualise();
             } else {
                node.classList.add("node-wall");
                node.node.object.isWall = true;
                revisualise();
             }
         }
     }
}

async function drawWall(coordinate) {
    const node = GRID_NODES[coordinate];
    await sleep(0.1)
    if(!node.classList.contains("node-start") && !node.classList.contains("node-finish")) {
        if(node.classList.contains("node-visited")) {
           node.classList.remove("node-visited");
           node.node.object.isVisited = false;
           node.classList.add("node-wall");
           node.node.object.isWall = true;
           revisualise();
        } else if(node.classList.contains("node-wall")) {
           node.classList.remove("node-wall");
           node.node.object.isWall = false;
           revisualise();
        } else {
           node.classList.add("node-wall");
           node.node.object.isWall = true;
           revisualise();
        }
    }
}

function handleMouseLeave(coordinate) {
    const node = GRID_NODES[coordinate];
    if (IS_DRAGGING_START) {
        node.classList.remove("node-start");
    } else if (IS_DRAGGING_FINISH) {
        node.classList.remove("node-finish");
    }
}

gridDijkstraButton.addEventListener("click", () => {
   CURRENT_ALGORITHM = "dijkstra";
   search();
});

gridAstarButton.addEventListener("click", () => {
    CURRENT_ALGORITHM = "astar";
    search();
});

gridBfsButton.addEventListener("click", () => {
    CURRENT_ALGORITHM = "bfs";
    search();
});

gridDfsButton.addEventListener("click", () => {
    CURRENT_ALGORITHM = "dfs";
    search();
});

function initialiseGridNodes() {
    GRID_NODES.forEach((pathNode) => {
        const coordinate = pathNode.node.object.coordinate
        pathNode.className = "node";
        if(coordinate === START_NODE_INDEX) {
            pathNode.classList.add("node-start");
        }
        if(coordinate === FINISH_NODE_INDEX) {
            pathNode.classList.add("node-finish");
        }
        pathNode.node = new HeapNode(Infinity, {
            isFinish: coordinate === FINISH_NODE_INDEX ? true : false,
            isStart: coordinate === START_NODE_INDEX ? true : false,
            isVisited: false,
            isWall: false,
            weight: 1,
            coordinate: coordinate,
            isQueued: false
        });
    })
}

function lessThanWithHeuristic(lhs, rhs) {
    if((lhs.key + calculateHeuristic(lhs.object.coordinate)) < (rhs.key + calculateHeuristic(rhs.object.coordinate))) {
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

function calculateHeuristic(coordinate) {
    const xDisance = FINISH_NODE_INDEX%GRID_COLS - coordinate%GRID_COLS;
    const yDistance = Math.floor(FINISH_NODE_INDEX/GRID_COLS) - Math.floor(coordinate/GRID_COLS);

    return Math.sqrt((xDisance * xDisance) + (yDistance * yDistance));
};

function revisualise() {
    if(IS_VISUALISED) {
        resetForRevisualisation();
        switch (CURRENT_ALGORITHM) {
            case "dfs":
                gridfirstSearch();
                break;
            case "bfs":
                gridfirstSearch();
                break;
            case "dijkstra":
                dijkstra();
                break;
            case "astar": 
            dijkstra();
                break;
        }
        updateInfo();
        IS_VISUALISING = false;
    }
}

function updateGridExplanation() {
    if(CURRENT_ALGORITHM == "dijkstra") {
        gridExplanation.innerHTML = gridExplanationDijkstra
    } else if(CURRENT_ALGORITHM == "astar") {
        gridExplanation.innerHTML = gridExplanationAstar
    } else if(CURRENT_ALGORITHM == "bfs") {
        gridExplanation.innerHTML = gridExplanationBfs
    } else if(CURRENT_ALGORITHM == "dfs") {
        gridExplanation.innerHTML = gridExplanationDfs
    } else {
        gridExplanation.innerHTML = `
        <h2>Click on an algorithm to view its description</h2>
        `
    }
}

function updateGraphExplanation() {
    if(GRAPH_CURRENT_ALGORITHM == graphDijkstra && GRAPH_CURRENT_SORT_CRITERIA === graphLessThan) {
        document.getElementById("graph-explanation").innerHTML = graphExplanationDijkstra
    } else if(GRAPH_CURRENT_ALGORITHM == graphDijkstra && GRAPH_CURRENT_SORT_CRITERIA === graphLessThanWithHeuristic) {
        document.getElementById("graph-explanation").innerHTML = graphExplanationAstar
    } else if(GRAPH_CURRENT_ALGORITHM == graphBfs) {
        document.getElementById("graph-explanation").innerHTML = graphExplanationBfs
    } else if(GRAPH_CURRENT_ALGORITHM == graphDfs) {
        document.getElementById("graph-explanation").innerHTML = graphExplanationDfs
    } else {
        if (GRAPH_IS_SELECTING_START || GRAPH_IS_SELECTING_FINISH) {
            document.getElementById("graph-explanation").innerHTML = `
            <h2>Click on a start node then a target node</h2>
            `
        } else {
            document.getElementById("graph-explanation").innerHTML = `
            <h2>Click on an algorithm to view its description</h2>
            `
        }
    }
}

//Grid explanation text
const gridExplanationDijkstra = `
<div>
    <h2>
        Dijkstra's Algorithm
    </h2>
    <p>
        Dijkstra's algorithm guarantees the shortest path in a weighted graph
    </p>
    <br>
    <p>
        This is an unweighted example where all grid nodes have a maximum of 4 neighbours with a weighted path of 1 between them 
    </p>
    <br>
    <p>
        In this implementation, we are using a min-heap as the priority queue
    </p>
    <br>
    <p>
        The standard Dijkstra's algortihm does not include a heuristic
    </p>
    <br>
    <p id="visited-counter">
        The algorithm visited ${VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="algorithm-timer">
        Time taken in ms: ${ALGORITHM_TIMER}
    </p>
    <br>
    <p id="path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key}
    </p>
</div>
`
const gridExplanationAstar = `
<div>
    <h2>
        A* Search
    </h2>
    <p>
        The A* search algortihm guarantees the shortest path in a weighted graph
    </p>
    <br>
    <p>
        This is an unweighted example where all grid nodes have a maximum of 4 neighbours with a weighted path of 1 between them 
    </p>
    <br>
    <p>
        In this implementation, we are using a min-heap as the priority queue
    </p>
    <br>
    <p>
        The A* search algortihm uses a heuristic with it's min-heap to aid in its calculations. This is the differentiator between A* and Dijkstra's
    </p>
    <br>
    <p>
        The A* search uses a different sorting criteria for its heap. Rather than the element with the smallest distance being at the front of the heap, it's the element with the smallest (distance + physical distance) to the target node
    </p>
    <br>
    <p id="visited-counter">
        The algorithm visited ${VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="algorithm-timer">
        Time taken in ms: ${ALGORITHM_TIMER}
    </p>
    <br>
    <p id="path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key}
    </p>
</div>
`
const gridExplanationBfs = `
<div>
    <h2>
        Breadth First Search
    </h2>
    <p>
        The breadth first search algortihm does not guarantee the shortest path in a weighted graph but it does guarantee it in an unweighted
    </p>
    <br>
    <p>
        This is an unweighted example where all grid nodes have a maximum of 4 neighbours with a weighted path of 1 between them 
    </p>
    <br>
    <p>
        The breadth first search is implemented with a queue as the priority queue
    </p>
    <br>
    <p id="visited-counter">
        The algorithm visited ${VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="algorithm-timer">
        Time taken in ms: ${ALGORITHM_TIMER}
    </p>
    <br>
    <p id="path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key}
    </p>
</div>
`
const gridExplanationDfs = `
<div>
    <h2>
        Depth First Search
    </h2>
    <p>
        The depth first search algortihm does not guarantee the shortest path in a weighted or unweighted graph. It only guarantees that a path is found if one exists
    </p>
    <br>
    <p>
        This is an unweighted example where all grid nodes have a maximum of 4 neighbours with a weighted path of 1 between them 
    </p>
    <br>
    <p>
        The depth first search is implemented with a stack as the priority queue
    </p>
    <br>
    <p>
        In this implementation, the neighbours are added to the stack in a down, left, right, up order
    </p>
    <br>
    <p id="visited-counter">
        The algorithm visited ${VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="algorithm-timer">
        Time taken in ms: ${ALGORITHM_TIMER}
    </p>
    <br>
    <p id="path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key}
    </p>
</div>
`

//Graph explanation text
const graphExplanationDijkstra = `
<div>
    <h2>
        Dijkstra's Algorithm
    </h2>
    <p>
        Dijkstra's algorithm guarantees the shortest path in a weighted graph
    </p>
    <br>
    <p>
        This is a weighted example
    </p>
    <br>
    <p>
        In this implementation, all green edges have a weight of 1 unit, yellow have a weight of 5 units and red have a weight of 10 units. This initial weight is then multiplied by the physical pixel distance between the nodes to reach a new weight
    </p>
    <br>
    <p>
        In this implementation, we are using a min-heap as the priority queue
    </p>
    <br>
    <p>
        The standard Dijkstra's algortihm does not include a heuristic
    </p>
    <br>
    <p id="graph-visited-counter">
        The algorithm visited ${GRAPH_VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="graph-algorithm-timer">
        Time taken in ms: ${GRAPH_ALGORITHM_TIMER}
    </p>
    <br>
    <p id="graph-path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key} units
    </p>
</div>
`
const graphExplanationAstar = `
<div>
    <h2>
        A* Search
    </h2>
    <p>
        The A* search algortihm guarantees the shortest path in a weighted graph
    </p>
    <br>
    <p>
        This is a weighted example
    </p>
    <br>
    <p>
        In this implementation, all green edges have a weight of 1, yellow have a weight of 5 and red have a weight of 10. This initial weight is then multiplied by the physical distance between the nodes to reach a new weight
    </p>
    <br>
    <p>
        In this implementation, we are using a min-heap as the priority queue
    </p>
    <br>
    <p>
        The A* search algortihm uses a heuristic with it's min-heap to aid in its calculations. This is the differentiator between A* and Dijkstra's
    </p>
    <br>
    <p>
        The A* search uses a different sorting criteria for its heap. Rather than the element with the smallest distance being at the front of the heap, it's the element with the smallest (distance + physical distance) to the target node
    </p>
    <br>
    <p id="graph-visited-counter">
        The algorithm visited ${GRAPH_VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="graph-algorithm-timer">
        Time taken in ms: ${GRAPH_ALGORITHM_TIMER}
    </p>
    <br>
    <p id="graph-path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key} units
    </p>
</div>
`
const graphExplanationBfs = `
<div>
    <h2>
        Breadth First Search
    </h2>
    <p>
        The breadth first search algortihm does not guarantee the shortest path in a weighted graph but it does guarantee it in an unweighted
    </p>
    <br>
    <p>
        This is a weighted example
    </p>
    <br>
    <p>
        In this implementation, all green edges have a weight of 1, yellow have a weight of 5 and red have a weight of 10. This initial weight is then multiplied by the physical distance between the nodes to reach a new weight
    </p>
    <br>
    <p>
        The breadth first search is implemented with a queue as the priority queue
    </p>
    <br>
    <p id="graph-visited-counter">
        The algorithm visited ${GRAPH_VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="graph-algorithm-timer">
        Time taken in ms: ${GRAPH_ALGORITHM_TIMER}
    </p>
    <br>
    <p id="graph-path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key} units
    </p>
</div>
`
const graphExplanationDfs = `
<div>
    <h2>
        Depth First Search
    </h2>
    <p>
        The depth first search algortihm does not guarantee the shortest path in a weighted or unweighted graph
    </p>
    <br>
    <p>
        This is a weighted example
    </p>
    <br>
    <p>
        In this implementation, all green edges have a weight of 1, yellow have a weight of 5 and red have a weight of 10. This initial weight is then multiplied by the physical distance between the nodes to reach a new weight
    </p>
    <br>
    <p>
        The depth first search is implemented with a stack as the priority queue
    </p>
    <br>
    <p id="graph-visited-counter">
        The algorithm visited ${GRAPH_VISITED_COUNTER} nodes
    </p>
    <br>
    <p id="graph-algorithm-timer">
        Time taken in ms: ${GRAPH_ALGORITHM_TIMER}
    </p>
    <br>
    <p id="graph-path-length">
        The length of the shortest path is ${GRID_NODES[FINISH_NODE_INDEX].key} units
    </p>
</div>
`