class AnimatedObject {
    constructor () {
        this.backgroundColor = "#FFFFFF";
        this.foregroundColor = "#000000";
        this.highlighted = false;
        this.objectID = -1;
        this.layer = 0;
        this.addedToScene = true;
        this.label = "";
        this.labelColor = "#000000";
        this.alpha = 1.0;
        this.x = 0;
        this.y = 0;
        this.highlightIndex = -1;
        this.alwaysOnTop = false;

        this.setBackgroundColor = (newColor) => {
            this.backgroundColor = newColor;
        }

        this.setForegroundColor = (newColor) => {
            this.foregroundColor = newColor;
            this.labelColor = newColor;
        }

        this.setAlpha = (newAlpha) => {
            this.alpha = newAlpha;
        }

        this.getWidth = () => {
            return 0;
        }

        this.getHeight = () => {
            return 0;
        }

        this.centerX = () => {
            return this.x
        }

        this.setWidth = (newWidth) => {
            
        }

        this.centerY = () => {
            return this.y
        }

        this.getAlignLeftPos = (otherObject) => {
            return [otherObject.right() + this.getWidth() / 2, otherObject.centerY()];
        }

        this.getAlignRightPos = (otherObject) => {
            return [otherObject.left() - this.getWidth() / 2, otherObject.centerY()];
        }

        this.getAlignTopPos = (otherObject) => {
            return [otherObject.centerX(), otherObject.top() - this.getHeight() / 2];
        }

        this.getAlignBottomPos = (otherObject) => {
            return [otherObject.centerX(), otherObject.bottom() + this.getHeight() / 2];
        }

        this.alignLeft = (otherObject) => {
            this.y = otherObject.centerY();
            this.x = otherObject.right() + this.getWidth() / 2;	
        }

        this.alignRight = (otherObject) => {
            this.y = otherObject.centerY();
            this.x = otherObject.left() - this.getWidth() / 2;	
        }

        this.alignTop = (otherObject) => {
            this.x = otherObject.centerX();
            this.y = otherObject.top() - this.getHeight() / 2;	
        }

        this.alignBottom = (otherObject) => {
            this.x = otherObject.centerX();
            this.y = otherObject.bottom() + this.getHeight() / 2;	
        }

        this.identifier = () => {
            return this.objectID;
        }

        this.draw = () => {

        }

        this.update = () => {
            
        }
    }
}	