class LinkedListNode {
    constructor(object) {
        this.object = object;
        this.next = null;
        this.previous = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.last = () => {
            if(this.head === null) {
                return null
            }
            var node = this.head;
            while (node.next != null) {
                node = node.next;
            }
            return node;
        }

        this.isEmpty = () => {
            return this.head === null;
        }

        this.length = () => {
            if(this.head === null) {
                return 0;
            }

            var node = this.head;
            var count = 1;
            while (node.next != null) {
                node = node.next;
                count += 1
            }
            return count
        }

        this.nodeAt = (index) => {
            if(this.head === null) {
                return null
            }
            if(index < 0) {
                return null;
            }

            if(index === 0) {
                return this.head;
            } else {
                var node = this.head.next;
                for (let i = 1; i < index; i++) {
                    node = node.next
                    if (node === null) {
                        break
                    }
                }

                return node;
            }
        }

        this.append = (node) =>  {
            const newNode = node;
            const lastNode = this.last();

            if(lastNode != null) {
                newNode.previous = lastNode
                lastNode.next = newNode
            } else {
                this.head = newNode
            }
        }

        this.appendObject = (object) => {
            const newNode = new LinkedListNode(object);
            this.append(newNode);
        }

        this.appendLinkedList = (list) => {
            var nodeToCopy = list.head;
            while (nodeToCopy != null) {
                this.appendObject(nodeToCopy.object)
                nodeToCopy = nodeToCopy.next;
            }
        }

        this.insertObject = (object, index) => {
            const newNode = new LinkedListNode(object);
            insert(newNode, index)
        }

        this.insert = (newNode, index) => {
            if (index === 0) {
                newNode.next = this.head;
                this.head.previous = newNode;
                this.head = newNode;
            } else {
                const prev = this.nodeAt(index - 1);
                const next = prev.next;
                newNode.previous = prev;
                newNode.next = next;
                next.previous = newNode;
                prev.next = newNode;
            }
        }

        this.insertLinkedList = (list, index) => {
            if (this.isEmpty()) {
                return;
            }
            
            if (index === 0) {
                list.last().next = this.head;
                this.head = list.head;
            } else {
                const prev = nodeAt(index - 1)
                const next = prev.next;
                
                prev.next = list.head;
                list.head.previous = prev;
                
                list.last.next = next;
                next.previous = list.last();
            }
        }

        this.removeAll = () => {
            this.head = null;
        }

        this.removeNode = (node) => {
            let prev = node.previous;
            let next = node.next;
            
            if(prev != null) {
                prev.next = next;
            } else {
                this.head = next;
            }
            
            next.previous = prev;
            
            node.previous = null;
            node.next = null;
            return node.object;
        }

        this.removeLast = () => {
            if (this.last() === null) {
                return null;
            }
            return removeNode(last());
        }

        this.removeAt = (index) =>  {
            const node = this.nodeAt(index)
            return removeNode(node);
        }

        this.reverse = () => {
            var node = this.head;
            while (node != null) {
                var currentNode = node;
                node = currentNode.next;
                const temp = currentNode.next;
                currentNode.next = currentNode.previous;
                currentNode.previous = temp;
                this.head = currentNode;
            }
        }
    }
}