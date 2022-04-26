const canvas = document.getElementById('main-sorting-canvas');
const context = canvas.getContext('2d');
const canvasDiv = document.getElementById('canvas-holder');
const quickSortButton = document.getElementById('quicksort-button');
const heapSortButton = document.getElementById('heapsort-button');
//const mergeSortButton = document.getElementById('mergesort-button');
const insertionSortButton = document.getElementById('insertionsort-button');
const bubbleSortButton = document.getElementById('bubblesort-button');
const shellSortButton = document.getElementById('shellsort-button');
const resetButton = document.getElementById('reset-button');


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
var CURRENT_BAR_INDEX = undefined;
var START_CLICK = 0;

var NODE_RADIUS = 4;

const BORDER_COLOR = "1px solid rgba(50, 50, 150, 0.4)";
var IS_VISUALISING = false;
var IS_VISUALISED = false;
var IS_CLICKING = false;
var CURRENT_ALGORITHM = undefined;
var BAR_ARRAY = [];

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
        if(e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width) {
            MOUSE_X = e.x - CANVAS_X_OFFSET;
        } else if (e.x - CANVAS_X_OFFSET < 0) {
            MOUSE_X = 0;
        } else if (e.x - CANVAS_X_OFFSET > canvas.width) {
            MOUSE_X = canvas.width;
        }
        if(e.y - CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + window.scrollY  < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET + window.scrollY ;
        } else if(e.y - CANVAS_Y_OFFSET + window.scrollY < 0) {
            MOUSE_Y = window.scrollY ;
        } else if(e.y - CANVAS_Y_OFFSET + window.scrollY > canvas.height) {
            MOUSE_Y = canvas.height + window.scrollY;
        }

    } else {
        if(e.x - CANVAS_X_OFFSET > 0 && e.x - CANVAS_X_OFFSET < canvas.width) {
            MOUSE_X = e.x - CANVAS_X_OFFSET;
        }
        if(e.y - CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - CANVAS_Y_OFFSET + window.scrollY < canvas.height) {
            MOUSE_Y = e.y - CANVAS_Y_OFFSET + window.scrollY ;
        }
    }

    if(CURRENT_BAR_INDEX != undefined) {
        canvasDiv.style.cursor = 'pointer'
    } else {
        canvasDiv.style.cursor = 'default'
    }
    
/*
    if(IS_CLICKING && CURRENT_VERTEX_INDEX != undefined && IS_SELECTING) {
        
    } else {
        //updateCurrentVertexIndex();
    }
    */
}

window.onmousedown = (e) => {
    IS_CLICKING = true;
    START_CLICK = Date.now();
    if(CURRENT_BAR_INDEX != undefined) {
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

function createBar() {
    const height = Math.random();
    const tempBar = new Bar(height, BAR_ARRAY.length);
    const tempNode = new HeapNode(height, tempBar);
    BAR_ARRAY.push(tempNode);
}

function handleMouseClick(e) {
    initialiseBars()
    //createBar()
}

function handleMouseHold() {
    
}

quickSortButton.addEventListener("click", () => {
    quickSort(0, BAR_ARRAY.length - 1);
});

heapSortButton.addEventListener("click", () => {
    heapSort();
});
/*
mergeSortButton.addEventListener("click", () => {
    BAR_ARRAY = mergeSort(BAR_ARRAY);
});
*/
insertionSortButton.addEventListener("click", () => {
    insertionSort();
});

bubbleSortButton.addEventListener("click", () => {
    bubbleSort();
});

shellSortButton.addEventListener("click", () => {
    shellSort();
});

resetButton.addEventListener("click", () => {
    reset()
});

function reset() {
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function fullReset() {
    canvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function animate() {
    context.clearRect(0, 0, RIGHT_BOUNDS, BOTTOM_BOUNDS);
    requestAnimationFrame(animate);
    
    for (let i = 0; i < BAR_ARRAY.length; i++) {
        BAR_ARRAY[i].object.index = i;
        BAR_ARRAY[i].object.update();
    }
}

animate();

function initialiseBars() {
    BAR_ARRAY = [];
    for (let i = 0; i < 200; i++) {
        createBar();
    }
}