class PriorityQueue {
    constructor() {
        this.array = [];
        this.enqueue = (element) => {
            //Override
            this.array.push(element);
        }
        this.dequeue = () => {
            //Override
        }

        this.length = () => {
            return this.array.length;
        }
    }
}

class Stack extends PriorityQueue {
    constructor() {
        super();
        this.dequeue = () => {
            return this.array.pop();
        }
    }
}

class Queue extends PriorityQueue {
    constructor() {
        super();
        this.dequeue = () => {
            return this.array.shift();
        }
    }
}
