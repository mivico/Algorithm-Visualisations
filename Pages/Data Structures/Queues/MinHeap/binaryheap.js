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
        this.decreaseKey = (node, newKey) => {
            const index = this.index(node);
            this.nodes[index].key = newKey;
            this.shiftUp(index);
        }

        this.init = () => {
            this.configureHeap();
        }
        
        this.init();
    }
    
}