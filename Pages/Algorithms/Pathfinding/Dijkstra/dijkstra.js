const doc = document;
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");

class HeapNode {
    constructor(key, object) {
        this.key = key;
        this.object = object;
    }
}


class BinaryHeap {
    constructor(array, orderCriteria) {

        this.configureHeap = () => {
            this.nodes = array;
            for (let i = Math.floor((this.length() / 2) - 1); i >= 0; i--) {
                this.shiftDown(i);
            }
        };
        this.isEmpty = () => {
            return this.length() === 0;
        };
        this.length = () => {
            return this.nodes.length;
        }
        this.parentIndex = (index) => {
            return Math.floor((index - 1) / 2);
        };
        this.leftChild = (ofIndex) => {
            return (2 * ofIndex) + 1;
        };
        this.rightChild = (ofIndex) => {
            return (2 * ofIndex) + 2;
        };
        this.peek = () => {
            return this.nodes[0];
        };
        this.insert = (value) => {
            this.nodes.push(value);
            this.shiftUp(this.length() - 1);
        };
        this.replace = (oldNode, value) => {
            if (this.index(oldNode) === undefined) {
                return;
            }
            
            this.removeWithoutIndex(oldNode);
            this.insert(value);
        };
        this.swapAt = (first, second) => {
            const temp = this.nodes[first];
            this.nodes[first] = this.nodes[second];
            this.nodes[second] = temp;
        };
        this.removeRoot = () => {
            if (this.isEmpty() === true) {
                return undefined;
            }

            if (this.length() === 1) {
                return this.nodes.pop();
            } else {
                // Use the last node to replace the first one, then fix the heap by
                // shifting this new first node into its proper position.
                let value = this.nodes[0];
                this.nodes[0] = this.nodes.pop();
                this.shiftDown(0);
                return value;
            }
        };
        this.index = (of) => {
            return this.nodes.indexOf(of);
        };
        this.remove = (index) => {
            if (index >= this.length()) {
                return;
            };

            const size = this.length() - 1;
            if (index != size) {
                this.swapAt(index, size);
                this.shiftDown(index, size);
                this.shiftUp(index);
            }
            return this.nodes.pop();
        };
        this.removeWithoutIndex = (node) => {
            const index = this.index(node);
            return this.remove(index);
        };
        this.shiftUp = (index) => {
            let childIndex = index;
            let child = this.nodes[childIndex];
            let parentIndex = this.parentIndex(childIndex);

            while (childIndex > 0 && orderCriteria(child, this.nodes[parentIndex])) {
                this.nodes[childIndex] = this.nodes[parentIndex];
                childIndex = parentIndex;
                parentIndex = this.parentIndex(childIndex);
            }

            this.nodes[childIndex] = child;
        };
        this.shiftDown = (index, endIndex) => {
            if (endIndex === undefined) {
                endIndex = this.length();
            }
            const leftChildIndex = this.leftChild(index);
            const rightChildIndex = leftChildIndex + 1;

            let first = index;
            if (leftChildIndex < endIndex && orderCriteria(this.nodes[leftChildIndex], this.nodes[first])) {
                first = leftChildIndex;
            }
            if (rightChildIndex < endIndex && orderCriteria(this.nodes[rightChildIndex], this.nodes[first])) {
                first = rightChildIndex;
            }
            if (first == index) {
                return;
            }

            this.swapAt(index, first);

            this.shiftDown(first, endIndex);
        };

        this.init = () => {
            this.configureHeap();
        }
        
        this.init();
    }
    
}

var isSelectingStart = true;
var isSelectingFinish = false;
var startNodeIndex = null;
var finishNodeIndex = null;
var dijkstraUnvisitedHeap = new BinaryHeap([], (lhs, rhs) => {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
});
var dijkstraVisitedArray = [];

menuOpen.addEventListener("click", () => {
  overlay.classList.add("overlay--active");
});

menuClose.addEventListener("click", () => {
  overlay.classList.remove("overlay--active");
});

//Grid logic
let isClicking = false;
const grid = doc.getElementById('dijkstra-grid');
const fragment = document.createDocumentFragment();
let i = 0;
while (i<1000) {
    const div = document.createElement('div');
    div.id = `dijkstra-node-${i}`;
    div.className = 'dijkstra-node';
    div.textContent = `${i}`;
    div.node = new HeapNode(Infinity, {
        isFinish: false,
        isStart: false,
        isVisited: false,
        isWall: false,
        weight: 1,
        coordinate: i%50 + (Math.floor(i/50) * 50)
    });
    div.onmousedown = () => {
        isClicking = true
    }
    div.onmouseup = () => {
        isClicking = false
    }
    div.onmouseenter = () => {
        if(isClicking === true && isSelectingStart === false && isSelectingFinish === false) {
            if(div.classList.contains("dijkstra-node-wall")) {
                div.classList.remove("dijkstra-node-wall");
                div.node.object.isWall = false;
            } else {
                div.classList.add("dijkstra-node-wall");
                div.node.object.isWall = true;
            }
        }
    };
    fragment.append(div);
    i++;
}
grid.append(fragment);

grid.onmouseleave = () => {
    isClicking = false;
}

const dijkstraNodes = doc.querySelectorAll(".dijkstra-node");
dijkstraNodes.forEach((dijkstraNode, nodeIndx) => {
    dijkstraNode.addEventListener("click", () => {
        if(isSelectingStart === true) {
            dijkstraNode.classList.add("dijkstra-node-start");
            dijkstraNode.node.object.isStart = true;
            startNodeIndex = nodeIndx;
            isSelectingStart = false;
            isSelectingFinish = true;
        } else if (isSelectingFinish === true) {
            if(dijkstraNode.node.object.isStart === false) {
                dijkstraNode.classList.add("dijkstra-node-finish");
                dijkstraNode.node.object.isFinish = true;
                finishNodeIndex = nodeIndx;
                isSelectingStart = false;
                isSelectingFinish = false;
            }
        } else if(dijkstraNode.classList.contains("dijkstra-node-wall")) {
            if(dijkstraNode.node.object.isStart === false && dijkstraNode.node.object.isFinish === false) {
                dijkstraNode.classList.remove("dijkstra-node-wall");
                dijkstraNode.node.object.isWall = false;
            }
            console.log(dijkstraNode.node.object.coordinate);
        } else {
            if(dijkstraNode.node.object.isStart === false && dijkstraNode.node.object.isFinish === false) {
            dijkstraNode.classList.add("dijkstra-node-wall");
            dijkstraNode.node.object.isWall = true;
            }
            console.log(dijkstraNode.node);
        }
    })
});

//Reset button logic
const resetButton = doc.getElementById("reset-button");
resetButton.addEventListener("click", () => {
    dijkstraNodes.forEach((dijkstraNode) => {
        dijkstraNode.className = "dijkstra-node";
        dijkstraNode.node = new HeapNode(Infinity, {
            isFinish: false,
            isStart: false,
            isVisited: false,
            isWall: false,
            weight: 1,
            coordinate: dijkstraNode.node.object.coordinate
        });
    })
    isSelectingStart = true;
    isSelectingFinish = false;
    startNodeIndex = null;
    finishNodeIndex = null;
});

const visualiseButton = doc.getElementById("visualise-button");
visualiseButton.addEventListener("click", () => {
    if(isSelectingStart === false && isSelectingFinish === false) {
        dijkstra();
    }
});

//Dijkstra logic
//Note that this is a 50x20 grid. Coordinate (x,y) would be 20y + x

//This function takes in the entire grid, the start node and end node, then returns an array of all nodes visited
/*
function dijkstra() {
    if(startNodeIndex === finishNodeIndex) {
        return false
    }

    // At the start, all nodes have already been initialised to infinity
    //This array allows us to animate the shortest paths
    const visitedNodesInOrder = [];
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    dijkstraNodes[startNodeIndex].node.key = 0;
    //Initialise the min-heap
    initialiseHeap();

    while(dijkstraHeap.length()) {
        //We first extract the closest node from the heap. As it is a min heap, it will always be the first element
        const closestNode = dijkstraHeap.removeRoot();
        console.log(closestNode.object.coordinate);
        //The continue keyword ends one iteration of the loop. Essentially, if the closest node is a wall, we start again with a smaller array since we have shifted the array
        if(closestNode.object.isWall === true) {
            console.log("isWall so continuing");
            continue;
        } 
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            console.log("Iteration stopped due to infinity")
            console.log(dijkstraHeap.nodes);
            return visitedNodesInOrder;
        } 
        closestNode.object.isVisited = true;
        if(!dijkstraNodes[closestNode.object.coordinate].classList.contains("dijkstra-node-start") && !dijkstraNodes[closestNode.object.coordinate].classList.contains("dijkstra-node-finish")) {
            dijkstraNodes[closestNode.object.coordinate].classList.add("dijkstra-node-visited");
        }

        visitedNodesInOrder.push(closestNode);
        if(closestNode.object.coordinate === finishNodeIndex) {
            console.log("Iteration stopped due to hitting target")
            return visitedNodesInOrder;
        }
        //Here, we update all the unvisited nodes of the closest node. We do that by setting all their distances to this distance + 1
        updateUnvisitedNeighbours(closestNode)
        //We then go again until one of the return clauses are reached
    }
}


function updateUnvisitedNeighbours(node) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node);
    for (const neighbour of unvisitedNeighbours) {
        var replacement = new HeapNode(node.key + 1, {
            isFinish: neighbour.object.isFinish,
            isStart: neighbour.object.isStart,
            isVisited: neighbour.object.isVisited,
            isWall: neighbour.object.isWall,
            coordinate: neighbour.object.coordinate
        });
        replacement.previousNode = node;
        dijkstraHeap.replace(neighbour.object.coordinate, replacement);
    }
}

function getUnvisitedNeighbours(node) {
    const neighbours = []
    const coordinate = node.object.coordinate;

    //If not on first row, push neighbour directly above
    if(coordinate > 49) neighbours.push(dijkstraNodes[coordinate - 50].node);
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%50 != 49) neighbours.push(dijkstraNodes[coordinate + 1].node);
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%50 != 0) neighbours.push(dijkstraNodes[coordinate - 1].node);
    //If not on bottom row, push neighbour directly below
    if(coordinate < 950) neighbours.push(dijkstraNodes[coordinate + 50].node);
    return neighbours.filter(neighbour => !neighbour.object.isVisited);
}
*/

function dijkstra() {
    // At the start, all nodes have already been initialised to infinity
    //Just as in dijkstra's algorithm, we first set the start node to a distane of 0.
    dijkstraNodes[startNodeIndex].node.key = 0;
    //Initialise the min-heap
    initialiseHeap();
    //We loop as long as we have unvisited nodes
    while(dijkstraUnvisitedHeap.length() > 0) {
        let closestNode = dijkstraUnvisitedHeap.removeRoot();
        if(closestNode.key === Infinity) {
            console.log("Iteration stopped due to infinity")
            console.log(dijkstraUnvisitedHeap.nodes);
            return dijkstraVisitedArray;
        } 
        //The continue keyword ends one iteration of the loop. Essentially, if the closest node is a wall, we start again with a smaller array since we have shifted the array
        if(closestNode.object.isWall === true) {
            console.log("isWall so continuing");
            continue;
        } 
        //If we are surrounded/ there is no path for us to take, return the computed path as there is no path possible
        if(closestNode.key === Infinity) {
            console.log("Iteration stopped due to infinity")
            console.log(dijkstraUnvisitedHeap.nodes);
            return dijkstraVisitedArray;
        } 
        updateUnvisitedNeighbours(closestNode);
        dijkstraVisitedArray.push(closestNode);
        closestNode.object.isVisited = true;
        if(!dijkstraNodes[closestNode.object.coordinate].classList.contains("dijkstra-node-start") && !dijkstraNodes[closestNode.object.coordinate].classList.contains("dijkstra-node-finish")) {
            dijkstraNodes[closestNode.object.coordinate].classList.add("dijkstra-node-visited");
            dijkstraNodes[closestNode.object.coordinate].node.object.isVisited = true;
        }
        if(closestNode.object.coordinate === finishNodeIndex) {
            console.log("Iteration stopped due to hitting target")
            return dijkstraVisitedArray;
        }
    }
}

function getUnvisitedNeighbours(node) {
    const neighbours = []
    const coordinate = node.object.coordinate;

    //If not on first row, push neighbour directly above
    if(coordinate > 49) {
        if(dijkstraNodes[coordinate - 50].node.object.isVisited === false) {
            neighbours.push(dijkstraNodes[coordinate - 50].node);
        }
    }
    //If not on right edge of grid, push neighbour to the right
    if(coordinate%50 != 49) {
        if(dijkstraNodes[coordinate + 1].node.object.isVisited === false) {
            neighbours.push(dijkstraNodes[coordinate + 1].node);
        }
    }
    //If not on left edge of grid, push neighbour to the left
    if(coordinate%50 != 0) {
        if(dijkstraNodes[coordinate - 1].node.object.isVisited === false) {
            neighbours.push(dijkstraNodes[coordinate - 1].node);
        }
    }
    //If not on bottom row, push neighbour directly below
    if(coordinate < 950) {
        if(dijkstraNodes[coordinate + 50].node.object.isVisited === false) {
            neighbours.push(dijkstraNodes[coordinate + 50].node);
        }
    } 
    return neighbours;
}

function updateUnvisitedNeighbours(node) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node);
    for (const neighbour of unvisitedNeighbours) {
        //Update only if new distance is less than known distance

        if(neighbour.key > node.key + neighbour.object.weight) {
            var replacement = new HeapNode(node.key + neighbour.object.weight, {
                isFinish: neighbour.object.isFinish,
                isStart: neighbour.object.isStart,
                isVisited: neighbour.object.isVisited,
                isWall: neighbour.object.isWall,
                coordinate: neighbour.object.coordinate,
                weight: neighbour.object.weight
            });
            replacement.previousNode = node;
            dijkstraUnvisitedHeap.replace(neighbour, replacement);
            dijkstraNodes[neighbour.object.coordinate].node.key = replacement.key;
        }
    }
}

function initialiseHeap() {
    dijkstraUnvisitedHeap = new BinaryHeap([], (lhs, rhs) => {
        if(lhs.key < rhs.key) {
            return true;
        } else {
            return false;
        }
    });

    for (let i = 0; i < dijkstraNodes.length; i++) {
        dijkstraUnvisitedHeap.insert(dijkstraNodes[i].node);
    }
}

function getNodesInShortestPathOrder() {
    const nodesInShortestPathOrder = [];
    let currentNode = dijkstraNodes[finishNodeIndex];
    while (currentNode != null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}