class Circle {
    constructor(x, y) {
        //We will pass in the proportions. Use that to map to coordinates
        this.x = x * canvas.width;
        this.y = y * canvas.height;

        this.originalx = x
        this.originaly = y

        this.isSelected = false;
        this.isVisited = false;
        this.isStart = false;
        this.isFinish = false;
        this.isShortestPath = false;

        this.red = 200;
        this.dr = 1;
        this.accr = 1.01;

        this.draw = () => {
            context.beginPath();
            context.arc(this.x, this.y, NODE_RADIUS, 0, Math.PI * 2, false);

            if(this.isStart) {
                context.fillStyle = `rgba(0, 0, 255, 0.7)`;
                context.fill();
            } else if (this.isFinish) {
                context.fillStyle = `rgba(0, 255, 0, 0.7)`;
                context.fill();
            } else if (this.isShortestPath) {
                context.fillStyle = `rgba(0, 0, 0, 0.7)`;
                context.fill();
            } else if(this.isVisited) {
                context.fillStyle = `rgba(255, 255, 0, 0.7)`;
                context.fill();
            } else if(this.isSelected) {
                context.fillStyle = `rgba(${this.red}, 0, 0, 0.7)`;
                context.fill();
            } else {
                context.strokeStyle = `rgba(0, 0, 255, 0.7)`;
                context.stroke();
            }
        }
        
        this.update = () => {
            if(this.red >= 254 || this.red <=200) {
                this.accr = 1/this.accr;
                this.dr *= -1;
            }


            this.x = this.originalx * canvas.width;
            this.y = this.originaly * canvas.height;
            
            this.dr *= this.accr;
            this.red += this.dr;
            this.draw();
        }

        this.reset = () => {
            this.isSelected = false;
            this.isVisited = false;
            this.isStart = false;
            this.isFinish = false;
            this.isShortestPath = false;
        }
    }
}

class Line {
    constructor(node1, node2) {
        this.x1 = node1.object.x;
        this.x2 = node2.object.x;
        this.y1 = node1.object.y;
        this.y2 = node2.object.y;

        this.shouldDeinit = false;

        this.draw = () => {
            context.beginPath();
            context.moveTo(this.x1, this.y1);
            context.lineTo(this.x2, this.y2);
            
            context.strokeStyle = 'blue';
            context.stroke();
        }
        
        this.update = () => {
            if(this.x1 === null || this.x2 === null || this.y1 === null || this.y2 === null) {
                console.log('should deinit')
                this.shouldDeinit = true;
                return;
            }
            this.x1 = node1.object.x;
            this.x2 = node2.object.x;
            this.y1 = node1.object.y;
            this.y2 = node2.object.y;
            this.draw();
        }
    }
}

class Arrow {
    constructor(node1, node2, weight) {
        this.x1 = node1.object.x;
        this.x2 = node2.object.x;
        this.y1 = node1.object.y;
        this.y2 = node2.object.y;
        this.weight = weight;

        this.shouldDeinit = false;

        this.draw = () => {
            var headlen = 20; // length of head in pixels
            var dx = this.x2 - this.x1;
            var dy = this.y2 - this.y1;
            var angle = Math.atan2(dy, dx);

            const myAngle = Math.PI/2 - Math.atan(dx/dy);

            var compX1 = dy < 0 ? this.x1 - Math.cos(myAngle)*NODE_RADIUS : this.x1 + Math.cos(myAngle)*NODE_RADIUS;
            var compX2 = dy < 0 ? this.x2 + Math.cos(myAngle)*NODE_RADIUS : this.x2 - Math.cos(myAngle)*NODE_RADIUS;

            var compY1 = dy < 0 ? this.y1 - Math.sin(myAngle)*NODE_RADIUS : this.y1 + Math.sin(myAngle)*NODE_RADIUS;
            var compY2 = dy < 0 ? this.y2 + Math.sin(myAngle)*NODE_RADIUS : this.y2 - Math.sin(myAngle)*NODE_RADIUS;


            //Line
            context.beginPath();
            context.moveTo(compX1, compY1);
            context.lineTo(compX2, compY2);
            
            //Arrow
            context.lineTo(compX2 - headlen * Math.cos(angle - Math.PI / 6), compY2 - headlen * Math.sin(angle - Math.PI / 6));
            context.moveTo(compX2, compY2);
            context.lineTo(compX2 - headlen * Math.cos(angle + Math.PI / 6), compY2 - headlen * Math.sin(angle + Math.PI / 6));
            

            context.strokeStyle = 'blue';
            context.stroke();
        }

        this.update = () => {
            if(this.x1 === null || this.x2 === null || this.y1 === null || this.y2 === null) {
                console.log('should deinit')
                this.shouldDeinit = true;
                return;
            }
            this.x1 = node1.object.x;
            this.x2 = node2.object.x;
            this.y1 = node1.object.y;
            this.y2 = node2.object.y;
            this.draw();
        }
    }
}