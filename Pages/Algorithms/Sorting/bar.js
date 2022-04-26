class Bar {
    constructor(height, index) {
        //We will pass in the proportions. Use that to map to coordinates
        this.height = height * canvas.height;
        this.index = index;
        this.isBeingCompared = false;
        this.isPivot = false;

        this.draw = () => {
            const width = canvas.width / BAR_ARRAY.length;
            //console.log(width)
            context.beginPath();
            //context.rect(width, this.height, this.index * width, canvas.height);

            if(this.isBeingCompared) {
                context.fillStyle = `rgba(255, 0, 255, 0.7)`;
                context.fillRect(this.index * width, canvas.height - this.height, width, this.height)
            } else if(this.isPivot) {
                context.fillStyle = `rgba(255, 0, 0, 0.7)`;
                context.fillRect(this.index * width, canvas.height - this.height, width, this.height)
            } else {
                context.strokeStyle = `rgba(0, 0, 255, 0.7)`;
                context.strokeRect(this.index * width, canvas.height - this.height, width, this.height)
            }
        }
        
        this.update = () => {
            this.draw();
        }

        this.reset = () => {
        }
    }
}