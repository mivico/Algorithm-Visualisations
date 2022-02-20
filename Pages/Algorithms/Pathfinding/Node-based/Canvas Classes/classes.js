class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.isSelected = false;

        this.red = 200;
        this.dr = 1;
        this.accr = 1.01;

        this.draw = () => {
            context.beginPath();
            context.arc(this.x, this.y, NODE_RADIUS, 0, Math.PI * 2, false);
            if(this.isSelected) {
                context.fillStyle = `rgba(${this.red}, 0, 0, 0.7)`;
                context.fill();
            } else {
                context.fillStyle = `rgba(0, 0, 255, 0.7)`;
                context.fill();
            }
        }
        
        this.update = () => {
            if(this.red >= 254 || this.red <=200) {
                this.accr = 1/this.accr;
                this.dr *= -1;
            }
            
            this.dr *= this.accr;
            this.red += this.dr;
            this.draw();
        }
    }
}

class Line {
    constructor(c1, c2) {
        this.x1 = c1.x;
        this.x2 = c2.x;
        this.y1 = c1.y;
        this.y2 = c2.y;

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
            this.x1 = c1.x;
            this.x2 = c2.x;
            this.y1 = c1.y;
            this.y2 = c2.y;
            this.draw();
        }
    }
}