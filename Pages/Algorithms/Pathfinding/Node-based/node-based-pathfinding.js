const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var MOUSE_X = 0;
var MOUSE_Y = 0;
var IS_CLICKING = false;
var IS_SELECTING = false;
var VERTEX_ARRAY = [];
var EDGE_ARRAY = [];
var CURRENT_VERTEX_INDEX = undefined;
var SELECTED_NODES_INDEXES = []
var START_CLICK = 0;

var NODE_RADIUS = 30;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


window.onmousemove = (e) => {
    MOUSE_X = e.x;
    MOUSE_Y = e.y;


    if(IS_CLICKING && CURRENT_VERTEX_INDEX != undefined && IS_SELECTING) {
        VERTEX_ARRAY[CURRENT_VERTEX_INDEX].x = MOUSE_X;
        VERTEX_ARRAY[CURRENT_VERTEX_INDEX].y = MOUSE_Y;
    } else {
        updateCircleIndex();
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
    if(CURRENT_VERTEX_INDEX != undefined) {
        //Remove selected node
        VERTEX_ARRAY[CURRENT_VERTEX_INDEX].x = null;
        VERTEX_ARRAY[CURRENT_VERTEX_INDEX].y = null;
        VERTEX_ARRAY.splice(CURRENT_VERTEX_INDEX, 1);
    } else {
        randomiseVertices();
    }
}

window.onmouseup = (e) => {
    const clickDuration = Date.now() - START_CLICK;
    if(clickDuration < 200) {
        //Click, wasn't a hold
    if(CURRENT_VERTEX_INDEX != undefined) {
        VERTEX_ARRAY[CURRENT_VERTEX_INDEX].isSelected = !VERTEX_ARRAY[CURRENT_VERTEX_INDEX].isSelected;
        handleVertexCreation(); 
    }
    } else {
        //Held the mouse
    }
    if(!IS_SELECTING && CURRENT_VERTEX_INDEX == undefined) {
        const tempNode = new Circle(MOUSE_X, MOUSE_Y);
        VERTEX_ARRAY.push(tempNode);
    }

    IS_SELECTING = false;
    IS_CLICKING = false;
    START_CLICK = 0;
}

function updateCircleIndex() {
    for (let i = 0; i < VERTEX_ARRAY.length; i++) {
        if(MOUSE_X < VERTEX_ARRAY[i].x + NODE_RADIUS && MOUSE_X > VERTEX_ARRAY[i].x - NODE_RADIUS &&
            MOUSE_Y < VERTEX_ARRAY[i].y + NODE_RADIUS && MOUSE_Y > VERTEX_ARRAY[i].y - NODE_RADIUS) {
                CURRENT_VERTEX_INDEX = i;
                return;
        }
    }
    CURRENT_VERTEX_INDEX = undefined;
}

function handleVertexCreation() {
    //Mouse was just clicked. Handle the vertex creation pipeline

    //Bare in mind that the CURRENT_VERTEX_INDEX represents the index of the circle that was just clicked
    if(VERTEX_ARRAY[CURRENT_VERTEX_INDEX].isSelected) {
        //Node was just selected
        if (SELECTED_NODES_INDEXES.length == 0) {
            //No nodes in selected array so add this node
            SELECTED_NODES_INDEXES.push(CURRENT_VERTEX_INDEX);
        } else if (SELECTED_NODES_INDEXES.length == 1) {
            //2 different nodes have been selected
            SELECTED_NODES_INDEXES.push(CURRENT_VERTEX_INDEX);
            const tempEdge = new Line(VERTEX_ARRAY[SELECTED_NODES_INDEXES[0]], VERTEX_ARRAY[SELECTED_NODES_INDEXES[1]]);
            tempEdge.draw()
            VERTEX_ARRAY[SELECTED_NODES_INDEXES[0]].isSelected = false;
            VERTEX_ARRAY[SELECTED_NODES_INDEXES[1]].isSelected = false;
            SELECTED_NODES_INDEXES = [];
            EDGE_ARRAY.push(tempEdge);
        }
    } else {
        //Node was just deselected
        SELECTED_NODES_INDEXES = []
    }
}

function randomiseVertices() {
    for (let i = 0; i < 100; i++) {
        const x = getRandomArbitrary(NODE_RADIUS, window.innerWidth - NODE_RADIUS);
        const y = getRandomArbitrary(NODE_RADIUS, window.innerHeight - NODE_RADIUS);

        setTimeout(() => {
            const tempNode = new Circle(x, y);
            VERTEX_ARRAY.push(tempNode);
        }, i * 30)
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


function animate() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate);
    for(let i = 0; i < EDGE_ARRAY.length; i++) {
        if(EDGE_ARRAY[i].shouldDeinit === true) {
            console.log('removing edge');
            EDGE_ARRAY[i] = null;
            EDGE_ARRAY.splice(i, 1);
        } else {
            EDGE_ARRAY[i].update();
        }
    }
    for(let i = 0; i < VERTEX_ARRAY.length; i++) {
        VERTEX_ARRAY[i].update();
    }
    if(VERTEX_ARRAY.length > 200) {
        NODE_RADIUS = 10;
    }
}

animate();