/*
const animationCanvas = document.getElementById('animation-sorting-canvas');
const animationContext = animationCanvas.getContext('2d');
const animationCanvasDiv = document.getElementById('animation-sorting-canvas-holder');


animationCanvas.width = animationCanvasDiv.clientWidth;
animationCanvas.height = animationCanvasDiv.clientHeight;
animationCanvas.style.backgroundColor = animationCanvasDiv.style.backgroundColor;

var ANIMATION_CANVAS_X_OFFSET = animationCanvas.offsetLeft;
var ANIMATION_CANVAS_Y_OFFSET = animationCanvas.offsetTop;

var ANIMATION_LEFT_BOUNDS = ANIMATION_CANVAS_X_OFFSET;
var ANIMATION_RIGHT_BOUNDS = animationCanvas.width;
var ANIMATION_TOP_BOUNDS = ANIMATION_CANVAS_Y_OFFSET - window.scrollY;
var ANIMATION_BOTTOM_BOUNDS = animationCanvas.height;

var ANIMATION_MOUSE_X = 0;
var ANIMATION_MOUSE_Y = 0;
var ANIMATION_IS_CLICKING = false;
var ANIMATION_IS_SELECTING = false;
var ANIMATION_CURRENT_BAR_INDEX = undefined;
var ANIMATION_START_CLICK = 0;

var ANIMATION_IS_CLICKING = false;
var ANIMATION_BAR_ARRAY = [];

window.onresize = () => {
    ANIMATION_CANVAS_X_OFFSET = animationCanvas.offsetLeft;
    ANIMATION_CANVAS_Y_OFFSET = animationCanvas.offsetTop;
    animationCanvas.width = animationCanvasDiv.clientWidth;
    animationCanvas.height = animationCanvasDiv.clientHeight;

    ANIMATION_LEFT_BOUNDS = ANIMATION_CANVAS_X_OFFSET;
    ANIMATION_RIGHT_BOUNDS = animationCanvas.width;
    ANIMATION_TOP_BOUNDS = ANIMATION_CANVAS_Y_OFFSET - window.scrollY;
    ANIMATION_BOTTOM_BOUNDS = animationCanvas.height;
}



window.onmousemove = (e) => {
    ANIMATION_CANVAS_X_OFFSET = animationCanvas.offsetLeft;
    ANIMATION_CANVAS_Y_OFFSET = animationCanvas.offsetTop;

    if(ANIMATION_IS_SELECTING) {
        if(e.x - ANIMATION_CANVAS_X_OFFSET > 0 && e.x - ANIMATION_CANVAS_X_OFFSET < animationCanvas.width) {
            ANIMATION_MOUSE_X = e.x - ANIMATION_CANVAS_X_OFFSET;
        } else if (e.x - ANIMATION_CANVAS_X_OFFSET < 0) {
            ANIMATION_MOUSE_X = 0;
        } else if (e.x - ANIMATION_CANVAS_X_OFFSET > animationCanvas.width) {
            ANIMATION_MOUSE_X = animationCanvas.width;
        }
        if(e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY  < animationCanvas.height) {
            ANIMATION_MOUSE_Y = e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY ;
        } else if(e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY < 0) {
            ANIMATION_MOUSE_Y = window.scrollY ;
        } else if(e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY > animationCanvas.height) {
            ANIMATION_MOUSE_Y = animationCanvas.height + window.scrollY;
        }

    } else {
        if(e.x - ANIMATION_CANVAS_X_OFFSET > 0 && e.x - ANIMATION_CANVAS_X_OFFSET < animationCanvas.width) {
            ANIMATION_MOUSE_X = e.x - ANIMATION_CANVAS_X_OFFSET;
        }
        if(e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY < animationCanvas.height) {
            ANIMATION_MOUSE_Y = e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY ;
        }
    }

    if(ANIMATION_CURRENT_BAR_INDEX != undefined) {
        animationCanvasDiv.style.cursor = 'pointer'
    } else {
        animationCanvasDiv.style.cursor = 'default'
    }
}

window.onmousedown = (e) => {
    ANIMATION_IS_CLICKING = true;
    ANIMATION_START_CLICK = Date.now();
    if(ANIMATION_CURRENT_BAR_INDEX != undefined) {
        ANIMATION_IS_SELECTING = true;
    }
}

window.ondblclick = (e) => {
    
}

window.onmouseup = (e) => {
    if(isInCavas(e)) {
        const clickDuration = Date.now() - ANIMATION_START_CLICK;
        if(clickDuration < 200) {
           handleMouseClick(e);
        } else {
            handleMouseHold();
        }
    }
    ANIMATION_IS_SELECTING = false;
    ANIMATION_IS_CLICKING = false;
    ANIMATION_START_CLICK = 0;
}

function isInCavas(e) {
    return e.x - ANIMATION_CANVAS_X_OFFSET > 0 && e.x - ANIMATION_CANVAS_X_OFFSET < animationCanvas.width && e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY > 0 && e.y - ANIMATION_CANVAS_Y_OFFSET + window.scrollY < animationCanvas.height;
}

function createBar() {
    const height = Math.random();
    const tempBar = new Bar(height, ANIMATION_BAR_ARRAY.length);
    const tempNode = new HeapNode(height, tempBar);
    ANIMATION_BAR_ARRAY.push(tempNode);
}

function handleMouseClick(e) {
    initialiseBars()
    //createBar()
}

function handleMouseHold() {
    
}

quickSortButton.addEventListener("click", () => {
    quickSort(0, ANIMATION_BAR_ARRAY.length - 1);
});

heapSortButton.addEventListener("click", () => {
    heapSort();
});

mergeSortButton.addEventListener("click", () => {
    ANIMATION_BAR_ARRAY = mergeSort(ANIMATION_BAR_ARRAY);
});

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
    animationCanvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function fullReset() {
    animationCanvas.style.backgroundColor = 'rgba(255, 255, 255, 0)';
}

function animate() {
    animationContext.clearRect(0, 0, ANIMATION_RIGHT_BOUNDS, ANIMATION_BOTTOM_BOUNDS);
    requestAnimationFrame(animate);
    
    for (let i = 0; i < ANIMATION_BAR_ARRAY.length; i++) {
        ANIMATION_BAR_ARRAY[i].object.index = i;
        ANIMATION_BAR_ARRAY[i].object.update();
    }
}

animate();

function initialiseBars() {
    ANIMATION_BAR_ARRAY = [];
    for (let i = 0; i < 200; i++) {
        createBar();
    }
}
*/