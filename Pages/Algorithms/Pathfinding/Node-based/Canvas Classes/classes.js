class Circle {
    constructor(x, y) {
        //We will pass in the proportions. Use that to map to coordinates
        this.x = x * canvas.width;
        this.y = y * canvas.height;

        this.originalx = x
        this.originaly = y

        this.isSelected = false;
        this.isVisited = false;
        this.visualVisited = false;
        this.isStart = false;
        this.isFinish = false;
        this.isQueued = false;
        this.isShortestPath = false;
        this.isSwapping = false;

        this.red = 200;
        this.dr = 1;
        this.accr = 1.01;

        this.draw = () => {
            context.beginPath();
            if(this.isFinish || this.isStart) {
                context.arc(this.x, this.y, NODE_RADIUS*2, 0, Math.PI * 2, false);
            } else if(this.visualVisited) {
                context.arc(this.x, this.y, NODE_RADIUS*1.5, 0, Math.PI * 2, false);
            } else {
                context.arc(this.x, this.y, NODE_RADIUS, 0, Math.PI * 2, false);
            }

            if(this.isStart) {
                context.fillStyle = `green`;
                context.fill();
            } else if (this.isFinish) {
                context.fillStyle = `red`;
                context.fill();
            } else if (this.isSwapping) {
                context.fillStyle = `green`;
                context.fill();
            } else if (this.isShortestPath) {
                context.fillStyle = `rgba(255, 0, 255, 0.7)`;
                context.fill();
            } else if(this.visualVisited) {
                context.fillStyle = `rgba(0, 190, 218, 1)`;
                context.fill();
            } else if(this.isSelected) {
                context.fillStyle = `rgba(${this.red}, 0, 0, 0.7)`;
                context.fill();
            } 
            /* else if (this.isQueued) {
                context.fillStyle = `rgba(20, 200, 72, 0.7)`;
                context.fill();
            } 
            */ else {
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
            this.visualVisited = false;
            this.isStart = false;
            this.isFinish = false;
            this.isShortestPath = false;
            this.isQueued = false;
        }
    }
}

class Line {
    constructor(node1, node2, weight) {
        this.node1 = node1;
        this.node2 = node2;
        this.x1 = node1.object.x;
        this.x2 = node2.object.x;
        this.y1 = node1.object.y;
        this.y2 = node2.object.y;
        this.weight = weight;

        this.shouldDeinit = false;

        this.draw = () => {
            var headlen = 5; // length of head in pixels
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

            if(this.weight < 50) {
                context.strokeStyle = 'green';
            } else if (this.weight < 300) {
                context.strokeStyle = 'yellow';
            } else {
                context.strokeStyle = 'red';
            }
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
        this.node1 = node1;
        this.node2 = node2;
        this.x1 = node1.object.x;
        this.x2 = node2.object.x;
        this.y1 = node1.object.y;
        this.y2 = node2.object.y;
        this.weight = weight;

        this.shouldDeinit = false;

        this.draw = () => {
            var headlen = 5; // length of head in pixels
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
            
            
            if(this.weight < 50) {
                context.strokeStyle = 'green';
            } else if (this.weight < 300) {
                context.strokeStyle = 'yellow';
            } else {
                context.strokeStyle = 'red';
            }
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


class Triangle {
    constructor(node1, node2, node3, item) {
        this.node1 = node1;
        this.node2 = node2;
        this.node3 = node3;
        this.x1 = node1.object.x;
        this.x2 = node2.object.x;
        this.x3 = node3.object.x;
        this.y1 = node1.object.y;
        this.y2 = node2.object.y;
        this.y3 = node3.object.y;

        this.shouldDeinit = false;

        this.draw = () => {
            context.beginPath();
            context.moveTo(this.x1, this.y1);
            context.lineTo(this.x2, this.y2);
            context.lineTo(this.x3, this.y3);
            
            if(item == 'grass') {
                context.fillStyle = 'rgba(0, 255, 0, 0.3)';
            } else if (item == 'water') {
                context.fillStyle = 'blue';
            }
            context.fill();
        }
        
        this.update = () => {
            if(this.x1 === null || this.x2 === null || this.y1 === null || this.y2 === null || this.x3 === null || this.y3 === null) {
                console.log('should deinit')
                this.shouldDeinit = true;
                return;
            }
            this.x1 = node1.object.x;
            this.x2 = node2.object.x;
            this.x3 = node3.object.x;
            this.y1 = node1.object.y;
            this.y2 = node2.object.y;
            this.y3 = node3.object.y;
            this.draw();
        }
    }
}
