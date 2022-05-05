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
var SPLAY_TREE = null;
const ANIMATION_SPEED = 20;

var FRAME_NUMBER = 0;

var MIN_HEIGHT = 0.2;
var MAX_HEIGHT = 0.8;

var MIN_WIDTH = 0.1;
var MAX_WIDTH = 0.9;

var SIBLING_MAX_WIDTH = 0.2;

//Buttons
const initialiseButton = document.getElementById("initialise");
const buildButton = document.getElementById("build");
const deleteButton = document.getElementById("delete");
const insertButton = document.getElementById("insert");


let path1 = [];
let path2 = [];


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
}

function handleMouseClick(e) {
    //createVertexFromClick()
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

function createEdge(index1, index2) {
    const tempEdge = new Line(TREE_ADJACENCY_LIST.adjacencyList[index1].vertex.node, TREE_ADJACENCY_LIST.adjacencyList[index2].vertex.node, 1);
    tempEdge.draw()
    TREE_ADJACENCY_LIST.addUndirectedEdge(TREE_ADJACENCY_LIST.adjacencyList[index1].vertex, TREE_ADJACENCY_LIST.adjacencyList[index2].vertex, 1, tempEdge);
}

function animate() {
    FRAME_NUMBER++;
    context.clearRect(0, 0, RIGHT_BOUNDS, BOTTOM_BOUNDS);
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

function maxForDepth(tree, searchingDepth, depth = 0) {
    if (depth === searchingDepth) {
        return 1
    }
    if (tree.leftChild && tree.rightChild) {
        return maxForDepth(tree.leftChild, searchingDepth, depth + 1) + maxForDepth(tree.rightChild, searchingDepth, depth + 1) 
    } else if (tree.leftChild) {
        return maxForDepth(tree.leftChild, searchingDepth, depth + 1)
    } else if (tree.rightChild) {
        return maxForDepth(tree.rightChild, searchingDepth, depth + 1)
    }
    return 0;
}

// Finds the path from root node to given root of the tree.
function findLCA(n1, n2) {
    path1 = [];
    path2 = [];
    return findLCAInternal(SPLAY_TREE, n1, n2);
}

function findLCAInternal(tree, n1, n2) {
  
    if (!findPath(tree, n1, path1) || !findPath(tree, n2, path2)) {
        console.log((path1.length > 0) ? "n1 is present" : "n1 is missing");
        console.log((path2.length > 0) ? "n2 is present" : "n2 is missing");
        return -1;
    }

    let i;
    for (i = 0; i < path1.length && i < path2.length; i++) {
          
    // System.out.println(path1.get(i) + " " + path2.get(i));
        if (path1[i] != path2[i]) {
            break;
        }
    }

    return path1[i-1];
}

function findPath(node, n, path) {
        // base case
        if (node == null) {
            return false;
        }
          
        // Store this node . The node will be removed if
        // not in path from node to n.
        path.push(node);
  
        if (node == n) {
            return true;
        }
  
        if (node.leftChild != null && findPath(node.leftChild, n, path)) {
            return true;
        }
  
        if (node.rightChild != null && findPath(node.rightChild, n, path)) {
            return true;
        }
  
        // If not present in subtree rooted with node,
        // remove node from
        // path[] and return false
        path.pop();
  
        return false;
    }

function reshuffleXCoords(node) {
    const depth = getDepth(node);
    const nodesInLevel = maxForDepth(depth);
    if (depth === 0 && nodesInLevel === 0 && (maxDepth(SPLAY_TREE) - 1) === 0) {
        moveNodeX(node, 0.5)
    } else {
        if(node.parent) {
            const parentX = TREE_ADJACENCY_LIST.adjacencyList[node.parent.index].vertex.node.object.originalx;
            const distanceFromParent = DRAW_WIDTH;
            const newX = node.isLeftChild() ? parentX - distanceFromParent : parentX + distanceFromParent;
            moveNodeX(node, newX);
            if (isLeftOfRoot(node) && newX >= 0.5) {
                moveTree(SPLAY_TREE.leftChild, -DRAW_WIDTH, 0)
            } else if(!isLeftOfRoot(node) && newX <= 0.5) {
                moveTree(SPLAY_TREE.rightChild, DRAW_WIDTH, 0)
            }


            const clash = isClash(node);
            if(clash) {
                console.log(`clash detetcted`)
                //console.log(clash)
                const lca = findLCA(node, clash);
                //console.log(`lca of ${clash.value} and ${node.value} is ${lca.value}`)
                if (isLeftOfRoot(node)) {
                    moveTree(lca.leftChild, -DRAW_WIDTH - NODE_RADIUS/canvas.width, 0)
                } else {
                    moveTree(lca.rightChild, DRAW_WIDTH + NODE_RADIUS/canvas.width, 0)
                }
            }

        }

        if (node.leftChild) {
            reshuffleXCoords(node.leftChild)
        }
        if (node.rightChild) {
            reshuffleXCoords(node.rightChild)
        }
    }
}

function reshuffleYCoords(node) {
    const depth = getDepth(node);
    const maxD = maxDepth(SPLAY_TREE) - 1;
    if (depth == 0 && maxD == 0) {
        moveNodeY(node, 0.5);
    } else {
        const space = (MAX_HEIGHT - MIN_HEIGHT)/maxD;
        moveNodeY(node, MIN_HEIGHT + (depth)*space);


        if (node.leftChild) {
            reshuffleYCoords(node.leftChild)
        }
        if (node.rightChild) {
            reshuffleYCoords(node.rightChild)
        }
    }
}

function reshuffle(node) {
    reshuffleYCoords(node);
    reshuffleXCoords(node);
}

function insert() {
    
    
    var tempTree = new TreeNode(getRndInteger(1, 100));
    if (SPLAY_TREE == null) {
        SPLAY_TREE = tempTree;
        createVertexAt(0.5, 0.2, SPLAY_TREE);
    } else {
        const position = findRightPosition(tempTree);
        const rep = getAdjacencyListRepresentation(position.node);

        if (position.child == "left") {
            position.node.setLeftChild(tempTree);
            createVertexAt(rep.originalx, rep.originaly, tempTree);
        } else {
            position.node.setRightChild(tempTree);
            createVertexAt(rep.originalx, rep.originaly, tempTree);
        }
    }
    reshuffle(SPLAY_TREE)
    drawEdges(tempTree);
}


function moveTree(tree, xAmount, yAmount) {
    const rep = getAdjacencyListRepresentation(tree);
    if(!rep) {
        return
    }

    moveNodeX(tree, xOfInterest(rep) + xAmount)
    moveNodeY(tree, yOfInterest(rep) + yAmount)
    //rep.originalx += xAmount;
    //rep.originaly += yAmount;

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

function xOfInterest(node) {
    const animatingX = node.animationNewX;
    if (animatingX) {
        return animatingX
    } else {
        return node.originalx
    }
}

function yOfInterest(node) {
    const animatingY = node.animationNewY;
    if (animatingY) {
        return animatingY
    } else {
        return node.originaly
    }
}

function isClash(tree) {
    const rep = getAdjacencyListRepresentation(tree);
    for (let i = 0; i < TREE_ADJACENCY_LIST.adjacencyList.length; i++) {
        const edgeList = TREE_ADJACENCY_LIST.adjacencyList[i];
        const edgeListTree = edgeList.vertex.node.tree;
        const circle = edgeList.vertex.node.object;
        if (tree != edgeListTree && (Math.abs(xOfInterest(rep) - xOfInterest(circle)) < NODE_RADIUS/canvas.width) && (Math.abs(yOfInterest(rep) - yOfInterest(circle)) < NODE_RADIUS/canvas.width)) {
            //console.log("clash detected");
            //console.log(rep)
            //console.log(circle)
            return edgeListTree
        }
       /*
        if (tree != edgeListTree && Math.abs(rep.originalx - circle.originalx) < 0.0001) {
            return edgeListTree
        }
        */
        
    }
    return false
}

function splay() {

}







function moveNodeX(tree, newX, frames = ANIMATION_SPEED) {
    const rep = getAdjacencyListRepresentation(tree);
    rep.moveX(newX, frames);
    //rep.originalx = newX;
    
}

function moveNodeY(tree, newY, frames = ANIMATION_SPEED) {
    const rep = getAdjacencyListRepresentation(tree);
    rep.moveY(newY, frames);
    //rep.originaly = newY;
}

function moveNode(tree, newX, newY) {
    //moveNodeX(tree, newX);
    //moveNodeY(tree, newY);
    //console.log(`moving ${tree.value} to ${newX}, ${newY}`);
    const rep = getAdjacencyListRepresentation(tree);
    rep.originalx = newX;
    rep.originaly = newY;
}

/*
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
*/


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




