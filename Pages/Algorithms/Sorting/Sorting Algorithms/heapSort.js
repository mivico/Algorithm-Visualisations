
async function heapSort() {
    //Build heap
    const heap = new BinaryHeap(BAR_ARRAY, lessThan);
    const size = BAR_ARRAY.length
    let tempArray = [];
    BAR_ARRAY = heap.nodes;
    for (let i = 0; i < size; i++) {
        let tempNode = heap.removeRoot();
        tempNode.object.isBeingCompared = true;
        tempArray.push(tempNode);
        await sleep(2);
        tempArray[tempArray.length - 1].object.isBeingCompared = false;
        BAR_ARRAY = heap.nodes.concat(tempArray);
    }
    return
}

function lessThan(lhs, rhs) {
    if(lhs.key < rhs.key) {
        return true;
    } else {
        return false;
    }
}