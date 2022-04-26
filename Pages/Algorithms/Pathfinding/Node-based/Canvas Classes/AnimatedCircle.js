class AnimatedCircle extends AnimatedObject {
    constructor (objectID, objectLabel) {
        super();
        this.objectID = objectID;
        this.label = objectLabel;
        this.radius = NODE_RADIUS;
        this.thickness = 3;
        this.x = 0;
        this.y = 0;
        this.alpha = 1.0;
        this.addedToScene = true;
        this.highlightIndex = -1;
        
        this.draw = () => {
            context.globalAlpha = this.alpha;
        
            if (this.highlighted) {
                context.fillStyle = "#ff0000";
                context.beginPath();
                context.arc(this.x,this.y,this.radius + this.highlightDiff,0,Math.PI*2, true);
                context.closePath();
                context.fill();
            }
            
            context.fillStyle = this.backgroundColor;
            context.strokeStyle = this.foregroundColor;
            context.lineWidth = 1;
            context.beginPath();
            context.arc(this.x,this.y,this.radius,0,Math.PI*2, true);
            context.closePath();
            context.fill();
            context.stroke();
            context.textAlign = 'center';
            context.font = '10px sans-serif';
            context.textBaseline = 'middle'; 
            context.lineWidth = 1;
            context.fillStyle = this.foregroundColor;
            /*
            var strList = this.label.split("\n");
            if (strList.length == 1) {
                     if (this.highlightIndexDirty && this.highlightIndex != -1) {
                          this.leftWidth = context.measureText(this.label.substring(0,this.highlightIndex)).width;
                          this.centerWidth = context.measureText(this.label.substring(this.highlightIndex, this.highlightIndex+1)).width;
                          this.textWidth = context.measureText(this.label).width;
                          this.highlightIndexDirty = false;
                     } if (this.highlightIndex != -1 && this.highlightIndex < this.label.length) {
                            var  startingXForHighlight = this.x - this.textWidth / 2;
                            context.textAlign = 'left';
                            var leftStr = this.label.substring(0, this.highlightIndex);
                            var highlightStr = this.label.substring(this.highlightIndex, this.highlightIndex + 1)
                            var rightStr = this.label.substring(this.highlightIndex + 1)
                            context.fillText(leftStr, startingXForHighlight, this.y)
                            context.strokeStyle = "#FF0000";
                            context.fillStyle = "#FF0000";
                            context.fillText(highlightStr, startingXForHighlight + this.leftWidth, this.y)
        
        
                            context.strokeStyle = this.labelColor;
                            context.fillStyle = this.labelColor;
                            context.fillText(rightStr, startingXForHighlight + this.leftWidth + this.centerWidth, this.y)
                        } else {
                            context.fillText(this.label, this.x, this.y); 		
                        }
            } else if (strList.length % 2 == 0) {
                var i;
                var mid = strList.length / 2;
                for (i = 0; i < strList.length / 2; i++) {
                    context.fillText(strList[mid - i - 1], this.x, this.y - (i + 0.5) * 12);
                    context.fillText(strList[mid + i], this.x, this.y + (i + 0.5) * 12);
                }		
            } else {
                var mid = (strList.length - 1) / 2;
                var i;
                context.fillText(strList[mid], this.x, this.y);
                for (i = 0; i < mid; i++) {
                    context.fillText(strList[mid - (i + 1)], this.x, this.y - (i + 1) * 12);			
                    context.fillText(strList[mid + (i + 1)], this.x, this.y + (i + 1) * 12);			
                }
            }
            */
        }

        this.update = () => {
            
        }

        this.getWidth = () => {
            return this.radius * 2;
        }

        this.setWidth = (newWidth) => {
            this.radius = newWidth / 2;
        }
    }
}
