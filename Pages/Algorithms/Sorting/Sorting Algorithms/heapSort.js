
async function heapSort() {
    //Build heap
    const heap = new BinaryHeap(BAR_ARRAY, lessThan)
    heap.configureHeap;
    const size = BAR_ARRAY.length
    let tempArray = [];
    BAR_ARRAY = heap.nodes;
    for (let i = 0; i < size; i++) {
        let tempNode = heap.removeRoot();
        tempNode.object.isBeingCompared = true;
        tempArray.push(tempNode);
        await sleep(2);
        tempArray[tempArray.length - 1].object.isBeingCompared = false;
        BAR_ARRAY = tempArray.concat(heap.nodes);
    }
    return
}

/*
async function heapSort() {
    console.log("should be heapsorting");
    //Build heap
    const heap = new BinaryHeap(BAR_ARRAY, lessThan);

    //Reinitialise array
    BAR_ARRAY = [];
    for (let i = 0; i < heap.nodes.length; i++) {
        BAR_ARRAY.push(heap.nodes[i]);
    }
    const size = BAR_ARRAY.length;
    for (let i = 0; i < size; i++) {
        const heapLength = heap.nodes.length;

        const temp = heap.nodes[0];
        heap.nodes[0] = heap.nodes[heapLength - 1];
        heap.nodes[heapLength - 1] = temp;

        const temp2 = BAR_ARRAY[0];
        BAR_ARRAY[0] = BAR_ARRAY[heapLength - 1];
        BAR_ARRAY[heapLength - 1] = temp2;

        heap.nodes.pop();
        heap.configureHeap();
    }
    console.log(BAR_ARRAY)
    return
}
*/


function lessThan(lhs, rhs) {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
}