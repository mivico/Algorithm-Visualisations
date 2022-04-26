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

class BSTNode extends AnimatedCircle {
    constructor (val, id, initialX, initialY) {
        super(id, val)
        this.data = val;
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = canvas.width * this.initialX;
        this.y = canvas.height * this.initialY;
        this.graphicID = id;

        this.left = null;
        this.right = null;
        this.parent = null;

        this.isLeftChild = () => {
	        if (this. parent == null) {
		        return true;
	        }
	        return this.parent.left == this;
        }
    }
}


class SplayTree {
    constructor (tree, objectManager) {
        this.objectManager = objectManager;
        this.linkColor = "#007700";
        this.highlightCircleColor = "#007700";
        this.foregroundColor = "#007700";
        this.backgroundColor = "#EEFFEE";
        this.printColor = this.foregroundColor;

        this.widthDelta = 0.08;
        this.heightDelta = 0.08;

        this.startingX = 0.5;
        this.startingY = 0.1;

        this.treeRoot = tree;
        this.nextIndex = 0;

        //Animation
        this.commands = []

        this.init = () => {
            
        }

        this.cmd = () => {
            var command = arguments[0];
            for(let i = 1; i < arguments.length; i++) {
                command = command + "<;>" + String(arguments[i]);
            }
            this.commands.push(command);
        }

        this.createCircle = (graphicID, embeddedValue, startingX, startyingY) => {
            this.objectManager.addCircleObject(graphicID, embeddedValue);
            this.objectManager.setNewPositions(graphicID, startingX, startyingY, 0);
        }

        this.insertElement = (insertedValue) => {
            this.commands = new Array();	
            this.highlightID = this.nextIndex++;
            
            if (this.treeRoot == null) {
                this.createCircle(this.nextIndex, insertedValue, this.startingX, this.startingY);
                this.cmd("SetForegroundColor", this.nextIndex, this.foregroundColor);
                this.cmd("SetBackgroundColor", this.nextIndex, this.backgroundColor);
                this.cmd("Step");				
                this.treeRoot = new BSTNode(insertedValue, this.nextIndex, this.startingX, this.startingY)
                this.nextIndex += 1;
            } else {
                this.createCircle(this.nextIndex, insertedValue, 0.1, 0.1);
                this.cmd("SetForegroundColor", this.nextIndex, this.foregroundColor);
                this.cmd("SetBackgroundColor", this.nextIndex, this.backgroundColor);
                this.cmd("Step");				
                var insertElem = new BSTNode(insertedValue, this.nextIndex, 100, 100)
                
                this.nextIndex += 1;
                this.cmd("SetHighlight", insertElem.graphicID, 1);
                this.insert(insertElem, this.treeRoot)
                //this.resizeTree();
                this.cmd("SetText", 0 , "Splay inserted element to root of tree");
                this.cmd("Step");
                //this.splayUp(insertElem);
            }
            this.cmd("SetText", 0, "");	
            return this.commands;
        }

        this.insert = (elem, tree) => {
            this.cmd("SetHighlight", tree.graphicID , 1);
            this.cmd("SetHighlight", elem.graphicID , 1);
            
            if (elem.data < tree.data) {
                this.cmd("SetText", 0,  elem.data + " < " + tree.data + ".  Looking at left subtree");				
            }
            else {
                this.cmd("SetText",  0, elem.data + " >= " + tree.data + ".  Looking at right subtree");				
            }
            this.cmd("Step");
            this.cmd("SetHighlight", tree.graphicID, 0);
            this.cmd("SetHighlight", elem.graphicID, 0);
            
            if (elem.data < tree.data) {
                if (tree.left == null) {
                    this.cmd("SetText", 0,"Found null tree, inserting element");				
                    
                    this.cmd("SetHighlight", elem.graphicID, 0);
                    tree.left=elem;
                    elem.parent = tree;
                    this.cmd("Connect", tree.graphicID, elem.graphicID, this.linkColor);
                } else {
                    this.cmd("CreateHighlightCircle", this.highlightID, this.highlightCircleColor, tree.x, tree.y);
                    this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
                    this.cmd("Step");
                    this.cmd("Delete", this.highlightID);
                    this.insert(elem, tree.left);
                }
            } else {
                if (tree.right == null) {
                    this.cmd("SetText",  0, "Found null tree, inserting element");				
                    this.cmd("SetHighlight", elem.graphicID, 0);
                    tree.right=elem;
                    elem.parent = tree;
                    this.cmd("Connect", tree.graphicID, elem.graphicID, this.linkColor);
                    elem.x = tree.x + this.widthDelta/2;
                    elem.y = tree.y + this.heightDelta
                    this.cmd("Move", elem.graphicID, elem.x, elem.y);
                } else {
                    this.cmd("CreateHighlightCircle", this.highlightID, this.highlightCircleColor, tree.x, tree.y);
                    this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
                    this.cmd("Step");
                    this.cmd("Delete", this.highlightID);
                    this.insert(elem, tree.right);
                }
            }
            
        }

        this.resizeTree = () => {
            var startingPoint  = this.startingX;
            this.resizeWidths(this.treeRoot);
            if (this.treeRoot != null) {
                if (this.treeRoot.leftWidth > startingPoint) {
                    startingPoint = this.treeRoot.leftWidth;
                } else if (this.treeRoot.rightWidth > startingPoint) {
                    startingPoint = Math.max(this.treeRoot.leftWidth, 2 * startingPoint - this.treeRoot.rightWidth);
                }
                this.setNewPositions(this.treeRoot, startingPoint, this.startingY, 0);
                this.animateNewPositions(this.treeRoot);
                this.cmd("Step");
            }
        }

        this.setNewPositions = (tree, xPosition, yPosition, side) => {
            if (tree != null) {
                tree.y = yPosition;
                if (side == -1) {
                    xPosition = xPosition - tree.rightWidth;
                } else if (side == 1) {
                    xPosition = xPosition + tree.leftWidth;
                }
                tree.x = xPosition;
                this.setNewPositions(tree.left, xPosition, yPosition + this.heightDelta, -1)
                this.setNewPositions(tree.right, xPosition, yPosition + this.heightDelta, 1)
            }
        }

        this.reset = () => {
            this.treeRoot = null;
            this.nextIndex = 0;
        }
    }
}
