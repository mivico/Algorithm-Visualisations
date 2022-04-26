const HEAP_WIDTH = 0.2;
const HEAP_VERTICAL_GAP = 0.15;
var IS_DELETING = false;
var heapArray = [];
var DRAW_COUNTER = 0.1;
var DRAW_WIDTH = 0.03;
var DRAW_HEIGHT= 0.1;
var WIDTH_COUNTER = 0.8;
var DEPTH_ARRAY = [];
var OFFSET_ARRAY = [];
var OBJECT_MANAGER = new ObjectManager();
var SPLAY_TREE = new SplayTree(null, OBJECT_MANAGER);

//Buttons
const initialiseButton = document.getElementById("initialise");
const buildButton = document.getElementById("build");
const deleteButton = document.getElementById("delete");
const insertButton = document.getElementById("insert");


function handleMouseDown(coordinate) {
    
}

function handleMouseUp(coordinate) {

}

function handleMouseEnter(coordinate) {

}

function handleMouseLeave(coordinate) {

}

async function initialiseTree() {
    var tempTree = new TreeNode("foo");
    tempTree.setLeftChild(new TreeNode("bar"));
    tempTree.setRightChild(new TreeNode("fooBar"));
    tempTree.leftChild.setLeftChild(new TreeNode("agboon"));
    tempTree.rightChild.setLeftChild(new TreeNode("Accenture"));
    tempTree.rightChild.setRightChild(new TreeNode("Graduate"));
    tempTree.leftChild.leftChild.setLeftChild(new TreeNode("Kablam"));
    tempTree.leftChild.leftChild.leftChild.setLeftChild(new TreeNode("Kablamaboo"));
    tempTree.leftChild.leftChild.leftChild.setRightChild(new TreeNode("Kablam Splice"));
    SPLAY_TREE = tempTree;
    //updateDrawHeight();
    //updateDrawWidth();
    WIDTH_COUNTER = 0.1;
    drawTree(SPLAY_TREE);
    drawEdges(SPLAY_TREE);
    console.log(TREE_ADJACENCY_LIST.adjacencyList)
}


initialiseButton.addEventListener("click", () => {
    initialiseTree();
});

buildButton.addEventListener("click", () => {
    
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

var TREE_ADJACENCY_LIST = new AdjacencyList();
var NODE_RADIUS = canvas.width/60;

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
    TREE_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originalx = MOUSE_X/canvas.width;
    TREE_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.originaly = MOUSE_Y/canvas.height;
}

function createVertexAt(xProp, yProp, tree) {
    //console.log(`creating at ${xProp}, ${yProp}`)
    const tempCircle = new Circle(xProp, yProp);
    const tempNode = {
        tree: tree, 
        object: tempCircle
    };
    tempNode.object.draw();
    tempNode.index = TREE_ADJACENCY_LIST.createVertex(tempNode).index;
    tree.index = tempNode.index;
    //console.log(TREE_ADJACENCY_LIST.adjacencyList);
}

function handleMouseClick(e) {
    createVertexFromClick()
    console.log(TREE_ADJACENCY_LIST.adjacencyList)
}

function handleMouseHold() {

}

function updateCurrentVertexIndex() {
    for (let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        if(MOUSE_X < TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x + NODE_RADIUS && MOUSE_X > TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.x - NODE_RADIUS &&
            MOUSE_Y < TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y + NODE_RADIUS && MOUSE_Y > TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object.y - NODE_RADIUS) {
                CURRENT_VERTEX_INDEX = i;
                return;
        }
    }
    CURRENT_VERTEX_INDEX = undefined;
}

function handleEdgeCreation() {
    //Mouse was just clicked. Handle the vertex creation pipeline

    //Bare in mind that the CURRENT_VERTEX_INDEX represents the index of the circle that was just clicked
    if(TREE_ADJACENCY_LIST.adjacencyList[CURRENT_VERTEX_INDEX].vertex.node.object.isSelected) {
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
                const tempEdge = new Line(TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node, TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node, 1);
                tempEdge.draw()
                TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex.node.object.isSelected = false;
                TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex.node.object.isSelected = false;
                TREE_ADJACENCY_LIST.addDirectedEdge(TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[0]].vertex, TREE_ADJACENCY_LIST.adjacencyList[SELECTED_NODES_INDEXES[1]].vertex, 1, tempEdge);
                
                SELECTED_NODES_INDEXES = [];
            }
            
        }
    } else {
        //Node was just deselected
        SELECTED_NODES_INDEXES = []
    }
}

function createVertexFromClick() {
    OBJECT_MANAGER.addNode(20, MOUSE_X/canvas.width, MOUSE_Y/canvas.height);
    /*
    const tempCircle = new Circle(MOUSE_X/canvas.width, MOUSE_Y/canvas.height);
    const tempNode = {
        tree: new TreeNode("foo"), 
        object: tempCircle
    };
    
    tempNode.object.draw();
    tempNode.index = TREE_ADJACENCY_LIST.createVertex(tempNode).index;
    */
}

function createEdge(index1, index2) {
    const tempEdge = new Line(TREE_ADJACENCY_LIST.adjacencyList[index1].vertex.node, TREE_ADJACENCY_LIST.adjacencyList[index2].vertex.node, 1);
    tempEdge.draw()
    TREE_ADJACENCY_LIST.addUndirectedEdge(TREE_ADJACENCY_LIST.adjacencyList[index1].vertex, TREE_ADJACENCY_LIST.adjacencyList[index2].vertex, 1, tempEdge);
}

function animate() {
    context.clearRect(0, 0, RIGHT_BOUNDS, BOTTOM_BOUNDS);
    OBJECT_MANAGER.draw();
    requestAnimationFrame(animate);
    /*
    requestAnimationFrame(animate);

    for(let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = TREE_ADJACENCY_LIST.adjacencyList[i];
        const edges = edgeList.edges;
        if (edges != null) {
            for (j = 0; j < edges.length; j++) {
                const edge = edges[j];
                edge.lineObject.update();
            }
        }
    }
    for (let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        const object = TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object;
        object.update();
        context.font = `${NODE_RADIUS}px`;
        context.textAlign = 'center'
        context.fillStyle = `black`;
        context.fillText(TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.tree.value, object.x, object.y);
    }
    for (let i = 0; i < TREE_ADJACENCY_LIST.triangles.length; i++) {
        TREE_ADJACENCY_LIST.triangles[i].update();
    }
    */
}

function updateDrawWidth() {
    const nodeCount = getfullCount(SPLAY_TREE) - 1;
    if (nodeCount > 0) {
        DRAW_WIDTH = 0.8/nodeCount;
    } else {
        DRAW_WIDTH = 1;
    }
}

function getfullCount(tree) {
    if (tree == null) {
        return 0;
    }
 
    return 1 + (getfullCount(tree.leftChild) + getfullCount(tree.rightChild));
}

function updateDrawHeight() {
    const levels = maxDepth(SPLAY_TREE) - 1;
    DRAW_HEIGHT = 0.8/levels;
}

/*
function drawTree(tree, depth = 0.1) {
    if(tree.leftChild) {
        drawTree(tree.leftChild, depth + DRAW_HEIGHT)
    }
    
    createVertexAt(WIDTH_COUNTER, depth, tree);
    WIDTH_COUNTER += DRAW_WIDTH;

    if(tree.rightChild) {
        drawTree(tree.rightChild, depth + DRAW_HEIGHT)
    }
}
*/


/*
function drawTree(tree, depth = 0, height = 0.1) {
    createVertexAt(DEPTH_ARRAY[depth], height, tree);
    DEPTH_ARRAY[depth] += DRAW_WIDTH;

    if(tree.leftChild) {
        drawTree(tree.leftChild, depth + 1, height + DRAW_HEIGHT)
    }

    if(tree.rightChild) {
        drawTree(tree.rightChild, depth + 1, height + DRAW_HEIGHT)
    }
}
*/

function getAdjacencyListRepresentation(tree) {
    for (let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = TREE_ADJACENCY_LIST.adjacencyList[i];
        if(edgeList.vertex.node.tree == tree) {
            return TREE_ADJACENCY_LIST.adjacencyList[i].vertex.node.object
        }
    }
}

function drawTree(tree) {
    setupTree(tree);
    addmods(tree);
}

function setupTree(tree, depth = 0, height = 0.1) {
    if (tree.leftChild) {
        setupTree(tree.leftChild, depth + 1, height + DRAW_HEIGHT);
    }

    if (tree.rightChild) {
        setupTree(tree.rightChild, depth + 1, height + DRAW_HEIGHT);
    }

    var place = 0.1;
    const drawingY = height;
    var drawingX = 0.1;
  
    if (!tree.leftChild && !tree.rightChild) {
      place = DEPTH_ARRAY[depth];


      console.log(`${tree.value} has no children`)
      console.log(`drawing ${tree.value} at ${place}`)
    } else if (tree.leftChild && tree.rightChild) {
        s = getAdjacencyListRepresentation(tree.leftChild).originalx + getAdjacencyListRepresentation(tree.rightChild).originalx;
        place = s / 2;


        console.log(`${tree.value} has 2 children`)
        console.log(`drawing ${tree.value} at ${place}`)
    } else if (tree.leftChild) {
        place = getAdjacencyListRepresentation(tree.leftChild).originalx + DRAW_WIDTH;


        console.log(`${tree.value} has a left child`);
        console.log(`got left child ${tree.leftChild.value} x value of ${getAdjacencyListRepresentation(tree.leftChild).originalx}`);
        console.log(`drawing ${tree.value} at ${place}`)
    } else if (tree.rightChild) {
        //console.log(`right child of ${tree.rightChild.value} is ${getAdjacencyListRepresentation(tree.rightChild)}`)
        place = getAdjacencyListRepresentation(tree.rightChild).originalx - DRAW_WIDTH;


        console.log(`${tree.value} has a right child`);
        console.log(`got right child ${tree.rightChild.value} x value of ${getAdjacencyListRepresentation(tree.rightChild).originalx}`);
        console.log(`drawing ${tree.value} at ${place}`)
    }

    OFFSET_ARRAY[depth] = Math.max(OFFSET_ARRAY[depth], DEPTH_ARRAY[depth] - place);
    console.log(OFFSET_ARRAY[depth])

    if (tree.leftChild || tree.rightChild) {
        place += OFFSET_ARRAY[depth];
    }
    
    DEPTH_ARRAY[depth] += 2*DRAW_WIDTH
    tree.mod = OFFSET_ARRAY[depth];

    drawingX = place;
    createVertexAt(drawingX, drawingY, tree);
}


function addmods(tree, modsum = 0) {
    const rep = getAdjacencyListRepresentation(tree);
    console.log(rep)
    console.log(modsum)
    rep.originalx += modsum;
    modsum += tree.mod;
  
    if (tree.leftChild) {
        addmods(tree.leftChild, modsum)
    }

    if (tree.rightChild) {
        addmods(tree.rightChild, modsum)
    }
  }

function drawEdges(tree) {
    if(tree.leftChild) {
        drawEdges(tree.leftChild)
    }
    
    if(tree.parent) {
        createEdge(tree.index, tree.parent.index);
    }

    if(tree.rightChild) {
        drawEdges(tree.rightChild)
    }
}

function maxDepth(tree) {
    if (tree == null) {
        return 0;
    }

    var leftDepth = maxDepth(tree.leftChild);
    var rightDepth = maxDepth(tree.rightChild);

    // Choose the larger one and add the root to it.
    if (leftDepth > rightDepth) {
        return leftDepth + 1;
    } else {
        return rightDepth + 1;
    }
}

async function build() {
    
}

async function deleteNode(index) {
    
}

function shiftChildren(tree) {
    const rep = getAdjacencyListRepresentation(tree);
    if (tree.leftChild) {
        moveNode(tree.leftChild, rep.originalx - DRAW_WIDTH, rep.originaly + DRAW_HEIGHT);
        shiftChildren(tree.leftChild);
    }
    if (tree.rightChild) {
        moveNode(tree.rightChild, rep.originalx + DRAW_WIDTH, rep.originaly + DRAW_HEIGHT);
        shiftChildren(tree.rightChild);
    }
}

function insert() {
    SPLAY_TREE.insertElement(24);
    /*
    var tempTree = new TreeNode(getRndInteger(1, 100));
    if (SPLAY_TREE == null) {
        SPLAY_TREE = tempTree;
        createVertexAt(0.5, 0.2, SPLAY_TREE)
    } else {
        const position = findRightPosition(tempTree);

        const rep = getAdjacencyListRepresentation(position.node);

        if (position.child == "left") {
            position.node.setLeftChild(tempTree);
            createVertexAt(rep.originalx - DRAW_WIDTH, rep.originaly + DRAW_HEIGHT, tempTree);
        } else {
            position.node.setRightChild(tempTree);
            createVertexAt(rep.originalx + DRAW_WIDTH, rep.originaly + DRAW_HEIGHT, tempTree);
        }
    }
    drawEdges(tempTree);

    resolveClash(tempTree)
    */
}

function resolveClash(tree) {
    const clash = isClash(tree);
    if (clash) {
        //We have a clash
        console.log(`we have a clash with ${clash.value}`)

        //Firstly, we find if the tree is on the left or the right. This way, we know whether to move it to the left or right
        var dir = 1;
        if (isLeftOfRoot(tree)) {
            dir = -1;
        }

        if (clash === SPLAY_TREE) {
            //Clashing with root. Move new node
            moveTree(dir === 1 ? SPLAY_TREE.rightChild : SPLAY_TREE.leftChild, dir*DRAW_WIDTH, 0);
        } else {
            //Clash with a normal subtree

            //We need to see if the new node is to the left or right of the node it is clshing with
            var clashRelation = 1;
            if (tree.value <= clash.value) {
                clashRelation = -1;
            }

            shiftNode(clash, dir*DRAW_WIDTH, 0);
            moveTree(clashRelation === -1 ? clash.rightChild : clash.leftChild, dir*DRAW_WIDTH, 0);
            var clashParent = clash;
            while (clashParent != SPLAY_TREE) {
                moveTree(clashRelation === -1 ? clash.rightChild : clash.leftChild, dir*DRAW_WIDTH, 0);
                ensureBinaryProperty(clashParent);
                clashParent = clashParent.parent;
            }
        }

        const parent = tree.parent;
        if (parent && parent != SPLAY_TREE) {
            resolveClash(parent)
        }
    }
}

function ensureBinaryProperty(tree) {
    const rep = getAdjacencyListRepresentation(tree);
    if(!rep) {
        return
    }

    if (tree.leftChild) {
        const leftRep = getAdjacencyListRepresentation(tree.leftChild);
        if (leftRep.originalx > rep.originalx) {
            const temp = leftRep.originalx;
            leftRep.originalx = rep.originalx;
            rep.originalx = temp;
        } else if (Math.abs(leftRep.originalx - rep.originalx) < 0.001) {
            moveTree(tree.leftRep, -DRAW_WIDTH, 0);
        }
    }

    if (tree.rightChild) {
        const rightRep = getAdjacencyListRepresentation(tree.leftChild);
        if (rightRep.originalx < rep.originalx) {
            const temp = rightRep.originalx;
            rightRep.originalx = rep.originalx;
            rep.originalx = temp;
        } else if (Math.abs(rightRep.originalx - rep.originalx) < 0.001) {
            moveTree(tree.rightChild, DRAW_WIDTH, 0);
        }
    }
}

function moveTree(tree, xAmount, yAmount) {
    const rep = getAdjacencyListRepresentation(tree);
    if(!rep) {
        return
    }
    rep.originalx += xAmount;
    rep.originaly += yAmount;

    if (tree.leftChild) {
        moveTree(tree.leftChild, xAmount, yAmount)
    }

    if (tree.rightChild) {
        moveTree(tree.rightChild, xAmount, yAmount)
    }
}

function isLeftOfRoot(tree) {
    if (tree.value <= SPLAY_TREE.value) {
        return true
    }
}

function isClash(tree) {
    const rep = getAdjacencyListRepresentation(tree);
    for (let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = TREE_ADJACENCY_LIST.adjacencyList[i];
        const edgeListTree = edgeList.vertex.node.tree;
        const circle = edgeList.vertex.node.object;
        /*
        if (tree != edgeListTree && rep.originalx == circle.originalx && rep.originaly == circle.originaly) {
            return true
        }
        */
        if (tree != edgeListTree && Math.abs(rep.originalx - circle.originalx) < 0.0001) {
            return edgeListTree
        }
        
    }
    return false
}

function shiftNode(tree, xAmount, yAmount) {
    const rep = getAdjacencyListRepresentation(tree);
    rep.originalx += xAmount;
    rep.originaly += yAmount;
}

function moveNode(tree, newX, newY) {
    const rep = getAdjacencyListRepresentation(tree);
    console.log(`moving ${tree.value} to ${newX}, ${newY}`);
    rep.originalx = newX;
    rep.originaly = newY;
}

function reshuffle() {
    if (SPLAY_TREE.leftChild) {
        var tree = SPLAY_TREE.leftChild;
        while (tree) {
            //console.log(`on left node ${tree.value}`)
            if (tree.rightChild) {
                const parentRep = getAdjacencyListRepresentation(tree.parent);
                const parenty = parentRep.originaly;
                console.log(`total of ${tree.value} right child is ${total(tree.rightChild)}`);
                moveNode(tree, 0.5 - ((total(tree.rightChild) + 1) * DRAW_WIDTH), parenty + DRAW_HEIGHT)
                shiftChildren(tree);
            }
            tree = tree.leftChild;
        }
    }

    if(SPLAY_TREE.rightChild) {
        var tree = SPLAY_TREE.rightChild;
        while (tree) {
            //console.log(`on right node ${tree.value}`)
            if(tree.leftChild) {
                const parentRep = getAdjacencyListRepresentation(tree.parent);
                const parenty = parentRep.originaly;
                console.log(`total of ${tree.value} left child is ${total(tree.leftChild)}`)
                moveNode(tree, 0.5 + ((total(tree.leftChild) + 1) * DRAW_WIDTH), parenty + DRAW_HEIGHT);
                shiftChildren(tree);
            }
            tree = tree.rightChild;
        }
    }
}

function total(tree) {
    if (!tree.leftChild && !tree.rightChild) {
        return 1
    }

    if (tree.leftChild && tree.rightChild) {
        return 1 + total(tree.leftChild) + total(tree.rightChild)
    } else if (tree.leftChild) {
        return 1 + total(tree.leftChild)
    } else if (tree.rightChild) {
        return 1 + total(tree.rightChild)
    }
}

function xPos(tree) {
    if(tree.value < SPLAY_TREE.value) {
        return 0.5 - (total(tree) * DRAW_WIDTH)
    } else {
        return 0.5 + (total(tree) * DRAW_WIDTH)
    }
}

function getLeftmost() {
    var current = SPLAY_TREE;
    while (current.leftChild) {
        current = current.leftChild
    }

    return current
}


function getRightmost() {
    var current = SPLAY_TREE;
    while (current.rightChild) {
        current = current.rightChild
    }

    return current
}

function getDepth(tree) {
    var counter = 0;
    var parent = tree.parent;
    while (parent) {
        counter++;
        parent = parent.parent;
    }
    return counter;
}

function findRightPosition(tree) {
    var current = SPLAY_TREE;
    while (current.leftChild || current.rightChild) {
        if (!current.leftChild && tree.value <= current.value) {
            return {
                node: current,
                child: "left"
            }
        }
        if (!current.rightChild && tree.value > current.value) {
            return {
                node: current,
                child: "right"
            }
        }

        if (tree.value <= current.value) {
            current = current.leftChild
        } else {
            current = current.rightChild
        }
    }

    if (tree.value <= current.value) {
        return {
            node: current,
            child: "left"
        }
    } else {
        return {
            node: current,
            child: "right"
        }
    }
}

async function swap(index1, index2) {
    
}

function highlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.add("active-anim");
}

function unHighlightBlock(block) {
    ANIMATION_BLOCK_ARRAY[block].classList.remove("active-anim");
}

animate();




