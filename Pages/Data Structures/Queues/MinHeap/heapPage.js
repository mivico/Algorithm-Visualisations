var GRID_COLS = 12;
const ORIGINAL_GRID_COLS = GRID_COLS;
const HEAP_WIDTH = 0.2;
const HEAP_VERTICAL_GAP = 0.15;
var IS_DELETING = false;
const GRID_BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)"
var heapArray = [];
var DRAW_COUNTER = 0.1;
var DRAW_INSTRUCTIONS = [];
var FRAME_NUMBER = 0;

//Buttons
const initialiseButton = document.getElementById("initialise");
const buildButton = document.getElementById("build");
const deleteButton = document.getElementById("delete");
const insertButton = document.getElementById("insert");

//Grid logic
const grid = document.getElementById('heap-grid');
var fragment = document.createDocumentFragment();
let i = 0;
while (i<GRID_COLS) {
    const div = document.createElement('div');
    const coordinate = i;
    div.id = `node-${i}`;
    div.className = 'node';
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
    div.style.borderTop = GRID_BORDER_COLOR;
    div.style.borderLeft = GRID_BORDER_COLOR;
    div.style.borderBottom = GRID_BORDER_COLOR;
    if(coordinate === GRID_COLS-1) {
        div.style.borderRight = GRID_BORDER_COLOR;
    }
    fragment.append(div);
    i++;
}
grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
grid.append(fragment);

const GRID_NODES = document.querySelectorAll(".node");

function handleMouseDown(coordinate) {
    
}

function handleMouseUp(coordinate) {

}

function handleMouseEnter(coordinate) {

}

function handleMouseLeave(coordinate) {

}

async function initialiseHeapArray() {
    heapArray = [];
    HEAP_ADJACENCY_LIST = new AdjacencyList();
    drawHeap();
    syncArray();
    for (let i = 0; i < GRID_COLS; i++) {
        await sleep(200);
        const key = Math.floor(getRandomArbitrary(1,100));
        const node = new HeapNode(key, {});
        heapArray.push(node);
        syncArray();
        drawHeap();
    }
    //drawTree();
    //drawEdges();
}

function syncArray() {
    for (let i = 0; i < heapArray.length; i++) {
        const div = document.getElementById(`node-${i}`)
        div.innerHTML = `
            <p>
            ${heapArray[i].key}
            </p>
        `
    }
    if(GRID_COLS == ORIGINAL_GRID_COLS) {
        return
    }
    for (let i = heapArray.length; i < ORIGINAL_GRID_COLS; i++) {
        const div = document.getElementById(`node-${i}`)
        div.innerHTML = `
            <p>
            
            </p>
        `
    }
}

initialiseButton.addEventListener("click", () => {
    initialiseHeapArray();
});

buildButton.addEventListener("click", () => {
    if (heapArray.length === 0) {
        alert('Please initialise the heap array first');
    } else {
        build();
    }
});

deleteButton.addEventListener("click", () => {
    IS_DELETING = !IS_DELETING;
});

insertButton.addEventListener("click", () => {
    insert();
});


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const canvasDiv = document.getElementById('canvas-holder');

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
var IS_CLICKING = false;
var IS_SELECTING = false;
var EDGE_ARRAY = [];
var CURRENT_VERTEX_INDEX = undefined;
var SELECTED_NODES_INDEXES = [];
var START_CLICK = 0;

var HEAP_ADJACENCY_LIST = new AdjacencyList();
var NODE_RADIUS = canvas.width/40;

const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)";
var IS_VISUALISING = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;

var ANIMATION_BLOCK_ARRAY = [];
for (let i = 0; i < 13; i++) {
    ANIMATION_BLOCK_ARRAY.push(document.getElementById(`anim-block-${i}`))
}

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

    NODE_RADIUS = canvas.width/40;
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

    if(CURRENT_VERTEX_INDEX != undefined && IS_DELETING) {
        canvasDiv.style.cursor = 'pointer'
    } else {
        canvasDiv.style.cursor = 'default'
    }
    

    if(IS_CLICKING && CURRENT_VERTEX_INDEX != undefined && IS_SELECTING) {
        //handleVertexMove();
    } else {
        if(IS_DELETING) {
            updateCurrentVertexIndex();
        }
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

function handleVertexMove() {
    HEAP_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originalx = MOUSE_X/canvas.width;
    HEAP_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originaly = MOUSE_Y/canvas.height;
}

function createVertex() {
    //console.log('created vertex')
    const tempCircle = new Circle(MOUSE_X/canvas.width, MOUSE_Y/canvas.height);
    const tempNode = new HeapNode(Infinity, tempCircle);
    
    tempNode.object.draw();
    tempNode.index = HEAP_ADJACENCY_LIST.createVertex(tempNode).index;
}

function createVertexAt(xProp, yProp, key) {
    const tempCircle = new Circle(xProp, yProp);
    const tempNode = new HeapNode(key, tempCircle);
    tempNode.object.draw();
    tempNode.index = HEAP_ADJACENCY_LIST.createVertex(tempNode).index;
}

function handleMouseClick(e) {
    //console.log(HEAP_ADJACENCY_LIST)
    if(IS_DELETING && CURRENT_VERTEX_INDEX != undefined) {
        deleteNode(CURRENT_VERTEX_INDEX);
        IS_DELETING = false;
    }
}

function handleMouseHold() {
}

function updateCurrentVertexIndex() {
    for (let i = 0; i < HEAP_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(MOUSE_X < HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x + NODE_RADIUS && MOUSE_X > HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x - NODE_RADIUS &&
            MOUSE_Y < HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y + NODE_RADIUS && MOUSE_Y > HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y - NODE_RADIUS) {
                CURRENT_VERTEX_INDEX = i;
                return;
        }
    }
    CURRENT_VERTEX_INDEX = undefined;
}

function handleEdgeCreation() {
    //Mouse was just clicked. Handle the vertex creation pipeline

    //Bare in mind that the CURRENT_VERTEX_INDEX represents the index of the circle that was just clicked
    if(HEAP_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected) {
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
                const tempEdge = new Line(HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node, HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node, 1);
                tempEdge.draw()
                HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node.object.isSelected = false;
                HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node.object.isSelected = false;
                HEAP_ADJACENCY_LIST.addDirectedEdge(HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex, HEAP_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex, 1, tempEdge);
                
                SELECTED_NODES_INDEXES = [];
            }
            
        }
    } else {
        //Node was just deselected
        SELECTED_NODES_INDEXES = []
    }
}

function createEdge(index1, index2) {
    const tempEdge = new Line(HEAP_ADJACENCY_LIST.adjacencyList[index1].vertex.node, HEAP_ADJACENCY_LIST.adjacencyList[index2].vertex.node, 1);
    tempEdge.draw()
    HEAP_ADJACENCY_LIST.addUndirectedEdge(HEAP_ADJACENCY_LIST.adjacencyList[index1].vertex, HEAP_ADJACENCY_LIST.adjacencyList[index2].vertex, 1, tempEdge);
}

function animate() {
    context.clearRect(0, 0, RIGHT_BOUNDS, BOTTOM_BOUNDS);
    requestAnimationFrame(animate);

    for(let i = 0; i < HEAP_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = HEAP_ADJACENCY_LIST.adjacencyList[i];
        const edges = edgeList.edges;
        if (edges != null) {
            for (j = 0; j < edges.length; j++) {
                const edge = edges[j];
                edge.lineObject.update();
            }
        }
    }
    for (let i = 0; i < HEAP_ADJACENCY_LIST.adjacencyList.length; i++) {
        HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.update();
        if(i < heapArray.length) {
            context.font = `${NODE_RADIUS}px`;
            context.textAlign = 'center'
            context.fillStyle = `black`;
            context.fillText(heapArray[i].key, HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x, HEAP_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y);
        }
    }
    for (let i = 0; i < HEAP_ADJACENCY_LIST.triangles.length; i++) {
        HEAP_ADJACENCY_LIST.triangles[i].update();
    }

    syncArray()
}
animate();

function drawHeap() {
    HEAP_ADJACENCY_LIST = new AdjacencyList();
   for (let i = 0; i < heapArray.length; i++) {
       createVertexAt(xPos(i), yPos(i), heapArray[i].key);
       if (i != 0) {
           createEdge(i, getParentIndex(i));
       }
   }
}


function drawTree() {
    planToDrawTree(0);
    executeDrawTree();
}

function planToDrawTree(index) {
    if(leftChild(index)) {
        planToDrawTree(leftIndex(index))
    }

    const maxNodes = Math.pow(2, getLevel(heapArray.length - 1) + 1) - 1;
    const widthBetweeen = 0.8/maxNodes;

    DRAW_INSTRUCTIONS.push({
        x: DRAW_COUNTER,
        y: yPos(index),
        actualKey: heapArray[index].key,
        key: index
    })

    DRAW_COUNTER += widthBetweeen;

    if(rightChild(index)) {
        planToDrawTree(rightIndex(index))
    }
}

function executeDrawTree() {
    DRAW_INSTRUCTIONS = mergeSort(DRAW_INSTRUCTIONS);
    for (let i = 0; i < DRAW_INSTRUCTIONS.length; i++) {
        const instruction = DRAW_INSTRUCTIONS[i];
        createVertexAt(instruction.x, instruction.y, instruction.actualKey)
    }
}

function drawEdges() {
    for (let i = 0; i < heapArray.length; i++) {
      if (i != 0) {
        createEdge(i, getParentIndex(i));
        }
    }
}

function moveRight(index, n) {
    HEAP_ADJACENCY_LIST.adjacencyList[index].vertex.node.object.x += n;
    if(leftChild(index)) {
        HEAP_ADJACENCY_LIST.adjacencyList[leftIndex(index)].vertex.node.object.x += n;
    }
    if(rightChild(index)) {
        HEAP_ADJACENCY_LIST.adjacencyList[rightIndex(index)].vertex.node.object.x += n;
    }
}
  

function xPos(index) {
    if(index === 0) {
        return 0.5
    } else {
        if(isLeftIndex(index)) {
            return xPos(getParentIndex(index)) - HEAP_WIDTH/(getLevel(index))
        } else {
            return xPos(getParentIndex(index)) + HEAP_WIDTH/(getLevel(index))
        }
    }
}

function yPos(index) {
    if(index === 0) {
        return 0.25;
    } else {
        return yPos(getParentIndex(index)) + HEAP_VERTICAL_GAP;
    }
}


function lessThan(lhs, rhs) {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
}

function getParentIndex(index) {
    return Math.floor((index - 1) / 2);
}

function leftChild(index) {
    return heapArray[leftIndex(index)];
}

function rightChild(index) {
    return heapArray[rightIndex(index)];
}

function leftIndex(index) {
    return (2 * index) + 1;
};

function rightIndex(index) {
    return (2 * index) + 2;
};

function isLeftIndex(index) {
    return index === leftIndex(getParentIndex(index))
}

function isRightIndex(index) {
    return index === rightIndex(getParentIndex(index))
}

function getLevel(index) {
    return Math.floor(Math.log2(index + 1))
}

function totalLevels() {
    return Math.floor(Math.log2(heapArray.length))
}

async function startAnimation() {
    while (true) {
        await build();
        await sleep(3000);
        initialiseHeapArray()
        //initialiseAdjacencyList()
        drawHeap();
    }
}

async function build() {
    for (let i = heapArray.length-1; getParentIndex(i) >= 0; i = i-2) {
        const parent = getParentIndex(i);
        const left = leftIndex(parent);
        const right = rightIndex(parent)

        document.getElementById(`node-${parent}`).classList.add('node-selected');
        HEAP_ADJACENCY_LIST.adjacencyList[parent].vertex.node.object.isSelected = true;
        if(left < heapArray.length) {
            document.getElementById(`node-${left}`).classList.add('node-selected');
            HEAP_ADJACENCY_LIST.adjacencyList[left].vertex.node.object.isSelected = true;
        }
        if(right < heapArray.length) {
            document.getElementById(`node-${right}`).classList.add('node-selected');
            HEAP_ADJACENCY_LIST.adjacencyList[right].vertex.node.object.isSelected = true;
        }
        await sleep(800);
        highlightBlock(2);
        await heapify(parent);
        unHighlightBlock(2)

        document.getElementById(`node-${parent}`).classList.remove('node-selected');
        HEAP_ADJACENCY_LIST.adjacencyList[parent].vertex.node.object.isSelected = false;
        if(left < heapArray.length) {
            document.getElementById(`node-${left}`).classList.remove('node-selected');
            HEAP_ADJACENCY_LIST.adjacencyList[left].vertex.node.object.isSelected = false;
        }
        if(right < heapArray.length) {
            document.getElementById(`node-${right}`).classList.remove('node-selected');
            HEAP_ADJACENCY_LIST.adjacencyList[right].vertex.node.object.isSelected = false;
        }
        await sleep(800);
    }
}

async function heapify(index) {
    highlightBlock(8);
    await sleep(1000);
    unHighlightBlock(8);
    const size = heapArray.length
    var smallest = index; // Initialize smallest as root
    var left = leftIndex(index);
    var right = rightIndex(index);
 
    // If left child is smaller than root
        if (left < size && heapArray[left].key < heapArray[smallest].key) {
        highlightBlock(9);
        await sleep(1000);
        unHighlightBlock(9);
        smallest = left;
    }
 
    // If right child is smaller than smallest so far
    if (right < size && heapArray[right].key < heapArray[smallest].key) {
        highlightBlock(10);
        await sleep(1000);
        unHighlightBlock(10);
        smallest = right;
    }
 
    // If smallest is not root
    if (smallest != index) {
        highlightBlock(11);
        await sleep(1000);
        await swap(index, smallest);
        unHighlightBlock(11);
 
        // Recursively heapify the affected sub-tree
        highlightBlock(12);
        await sleep(1000);
        await heapify(smallest);
        unHighlightBlock(12);
    }
}

async function deleteNode(index) {
    highlightBlock(3);
    await sleep(400);
    swap(index, heapArray.length - 1);
    unHighlightBlock(3);

    highlightBlock(4);
    await sleep(400);
    const lastIndex = heapArray.length - 1;
    const parent = getParentIndex(lastIndex);

    for (let i = 0; i < HEAP_ADJACENCY_LIST.adjacencyList[parent].edges.length; i++) {
        const edge = HEAP_ADJACENCY_LIST.adjacencyList[parent].edges[i];
        if (edge.to === HEAP_ADJACENCY_LIST.adjacencyList[lastIndex].vertex) {
            HEAP_ADJACENCY_LIST.adjacencyList[parent].edges.splice(i, 1);
            break
        }
    }
    HEAP_ADJACENCY_LIST.adjacencyList.pop();
    heapArray.pop();

    GRID_COLS = GRID_COLS - 1;
    unHighlightBlock(4);
    await sleep(400);

    highlightBlock(5);
    await build();
    unHighlightBlock(5);
}

async function insert() {
    if (GRID_COLS >= ORIGINAL_GRID_COLS) {
        alert("Please delete an element before attempting to insert")
        return
    }
    highlightBlock(6);
    GRID_COLS = GRID_COLS+1;
    const key = Math.floor(getRandomArbitrary(1,100));
    const node = new HeapNode(key, {});
    heapArray.push(node);
    syncArray();
    drawHeap();
    await sleep(200);
    unHighlightBlock(6);
    highlightBlock(7);
    await build();
    unHighlightBlock(7);
}

async function swap(index1, index2) {
    HEAP_ADJACENCY_LIST.adjacencyList[index1].vertex.node.object.isSwapping = true;
    HEAP_ADJACENCY_LIST.adjacencyList[index2].vertex.node.object.isSwapping = true;
    await sleep(400);
    const temp = heapArray[index1];
    heapArray[index1] = heapArray[index2];
    heapArray[index2] = temp;

    HEAP_ADJACENCY_LIST.adjacencyList[index1].vertex.node.object.isSwapping = false;
    HEAP_ADJACENCY_LIST.adjacencyList[index2].vertex.node.object.isSwapping = false;
}

function highlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.add("active-anim");
}

function unHighlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.remove("active-anim");
}
