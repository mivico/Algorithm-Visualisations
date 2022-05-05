class LinearDataStructure {
    constructor() {
        this.array = [];
        this.enqueue = (element) => {
            this.array.push(element);
        }
        this.dequeue = () => {
            //Override
            throw 'Function must be overridden';
        }

        this.length = () => {
            return this.array.length;
        }
    }
}

class Stack extends LinearDataStructure {
    constructor() {
        super();
        this.dequeue = () => {
            return this.array.pop();
        }
    }
}

class Queue extends LinearDataStructure {
    constructor() {
        super();
        this.dequeue = () => {
            return this.array.shift();
        }
    }
}
