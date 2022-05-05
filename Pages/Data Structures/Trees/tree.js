class TreeNode {
    constructor(value) {
        this.value = value;
        this.leftChild = null;
        this.rightChild = null;
        this.parent = null;
        this.index = null;
        this.mod = 0;

        this.setRightChild = (node) => {
            this.rightChild = node;
            node.parent = this;
        }

        this.setLeftChild = (node) => {
            this.leftChild = node;
            node.parent = this;
        }

        this.isRightChild = () => {
            if (this.parent && this.parent.rightChild) {
                return this === this.parent.rightChild
            }
            return false
        }

        this.isLeftChild = () => {
            if (this.parent && this.parent.leftChild) {
                return this === this.parent.leftChild
            }
            return false
        }
    }
}