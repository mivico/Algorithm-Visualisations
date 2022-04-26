class ObjectManager {
    constructor () {
        this.Nodes = [];
        this.Edges = [];
        this.framenum = 0;

        this.nextID = 0;

        this.addNode = (value, initialX, initialY) => {
            const newNode = new BSTNode(value, this.nextID, initialX, initialY);
            this.nextID++;
            this.Nodes.push(newNode);
        }

        this.draw = () => {
            this.framenum++;
            var i;
            var j;
            for (i = 0; i < this.Nodes.length; i++) {
                if (this.Nodes[i] != null && !this.Nodes[i].highlighted && this.Nodes[i].addedToScene && !this.Nodes[i].alwaysOnTop) {
                    this.Nodes[i].draw();	
                }
            }
            for (i = 0; i < this.Nodes.length; i++) {
                if (this.Nodes[i] != null && (this.Nodes[i].highlighted && !this.Nodes[i].alwaysOnTop) && this.Nodes[i].addedToScene) {
                    this.Nodes[i].pulseHighlight(this.framenum);
                    this.Nodes[i].draw();	
                }
            }
            
            for (i = 0; i < this.Nodes.length; i++) {
                if (this.Nodes[i] != null && this.Nodes[i].alwaysOnTop && this.Nodes[i].addedToScene) {
                    this.Nodes[i].pulseHighlight(this.framenum);
                    this.Nodes[i].draw();	
                }
            }
        }

        this.clearAllObjects = () => {
            this.Nodes = [];
            this.Edges = [];
        }
    }
}