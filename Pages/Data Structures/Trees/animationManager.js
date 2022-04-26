var timer;

function reorderSibling(node1, node2) 
{
    node1.parentNode.replaceChild(node1, node2);
    node1.parentNode.insertBefore(node2, node1); 
}

var ANIMATION_SPEED_DEFAULT = 75;

var objectManager;
var animationManager;
var canvas;

var paused = false;
var playPauseBackButton;
var skipBackButton;
var stepBackButton;
var stepForwardButton;
var skipForwardButton;

var widthEntry;
var heightEntry;
var sizeButton;

function timeout()
{
	// We need to set the timeout *first*, otherwise if we
	// try to clear it later, we get behavior we don't want ...
    timer = setTimeout('timeout()', 30); 
	animationManager.update();
	objectManager.draw();	
}


function doStep() {
	animationManager.step();
}


function doSkip() {
	animationManager.skipForward();
}


function doSkipBack() {
	animationManager.skipBack();
}


function doStepBack() {
	animationManager.stepBack();
}

function initCanvas() {
	canvas = document.getElementById("canvas");
	objectManager = new ObjectManager();
	animationManager = new AnimationManager(objectManager);
    
	animationManager.SetSpeed(speed);
	
	element.setAttribute("style", "width:200px");

	canvas.width = width;
	canvas.height = height;
    
	animationManager.addListener("AnimationStarted", this, animStarted);
	animationManager.addListener("AnimationEnded", this, this.animEnded);
	animationManager.addListener("AnimationWaiting", this, this.animWaiting);
    
	objectManager.width = canvas.width;
	objectManager.height = canvas.height;

	return animationManager;
}


class AnimationManager {
    constructor(objectManager) {
        // Holder for all animated objects.
        // All animation is done by manipulating objects in this container
        this.animatedObjects = objectManager;
    
        // Control variables for stopping / starting animation
        
        this.animationPaused = false;
        this.awaitingStep = false;
        this.currentlyAnimating = false;

        // Array holding the code for the animation.  This is 
        // an array of strings, each of which is an animation command
        // currentAnimation is an index into this array
        this.AnimationSteps = [];
        this.currentAnimation = 0;
        
        this.previousAnimationSteps = [];
        
        // Control variables for where we are in the current animation block.
        //  currFrame holds the frame number of the current animation block,
        //  while animationBlockLength holds the length of the current animation
        //  block (in frame numbers).  
        this.currFrame = 0;
        this.animationBlockLength = 0;

        //  The animation block that is currently running.  Array of singleAnimations
        this.currentBlock = null;
        
	    this.animationBlockLength = 10;

        this.lerp = (from, to, percent) => {
            return (to - from) * percent + from;
        }
        
        // Pause / unpause animation
        this.SetPaused = (pausedValue) => {
            this.animationPaused = pausedValue;
            if (!this.animationPaused)
            {
                this.step();
            }
        }

        // Set the speed of the animation, from 0 (slow) to 100 (fast)
        this.SetSpeed = (newSpeed) => {
            this.animationBlockLength = Math.floor((100-newSpeed) / 2);
        }
        
    
        this.parseBool = (str) => {
            var uppercase = str.toUpperCase();
            var returnVal =  !(uppercase == "False" || uppercase == "f" || uppercase == " 0" || uppercase == "0" || uppercase == "");
            return returnVal;
    
        }

        this.parseColor = (clr) => {
            if (clr.charAt(0) == "#") {
                 return clr;
            } else if (clr.substring(0,2) == "0x") {
                return "#" + clr.substring(2);
            }
        }

        this.changeSize = () => {
            var width = parseInt(widthEntry.value);
		    var height = parseInt(heightEntry.value);
		
		    if (width > 100) {
                canvas.width = width;
                this.animatedObjects.width = width;
                setCookie("VisualizationWidth", String(width), 30);
		    }
            if (height > 100) {
                canvas.height = height;
                this.animatedObjects.height = height;
                setCookie("VisualizationHeight", String(height), 30);
            }
            width.value = canvas.width;
            heightEntry.value = canvas.height;
            
            this.animatedObjects.draw();
            this.fireEvent("CanvasSizeChanged",{width:canvas.width, height:canvas.height});	
        }

        this.startNextBlock = () => {
            this.awaitingStep = false;
            this.currentBlock = [];
            if (this.currentAnimation == this.AnimationSteps.length ) {
                this.currentlyAnimating = false;
                this.awaitingStep = false;
                this.fireEvent("AnimationEnded","NoData");
                clearTimeout(timer);
                this.animatedObjects.update();
                this.animatedObjects.draw();
                return;
            }
            this.undoAnimationStepIndices.push(this.currentAnimation);

            var foundBreak= false;
            var anyAnimations= false;
            
            while (this.currentAnimation < this.AnimationSteps.length && !foundBreak) {			
                var nextCommand = this.AnimationSteps[this.currentAnimation].split("<;>");
                if (nextCommand[0].toUpperCase() == "CREATECIRCLE") {
                    this.animatedObjects.addCircleObject(parseInt(nextCommand[1]), nextCommand[2]); {
                        this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[3]), parseInt(nextCommand[4]));
                    }
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1]))); 
                }
                else if (nextCommand[0].toUpperCase() == "CONNECT") {
                    if (nextCommand.length > 7) {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]), 
                                                                            parseInt(nextCommand[2]), 
                                                                            this.parseColor(nextCommand[3]), 
                                                                            parseFloat(nextCommand[4]), 
                                                                            this.parseBool(nextCommand[5]), 
                                                                            nextCommand[6], 
                                                                            parseInt(nextCommand[7]));
                    }
                    else if (nextCommand.length > 6)
                    {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]), 
                                                                            parseInt(nextCommand[2]),
                                                                            this.parseColor(nextCommand[3]),
                                                                            parseFloat(nextCommand[4]),
                                                                            this.parseBool(nextCommand[5]),
                                                                            nextCommand[6],
                                                                            0);
                    }
                    else if (nextCommand.length > 5)
                    {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]), 
                                                                            parseInt(nextCommand[2]),
                                                                            this.parseColor(nextCommand[3]),
                                                                            parseFloat(nextCommand[4]),
                                                                            this.parseBool(nextCommand[5]),
                                                                            "",
                                                                            0);
                    }
                    else if (nextCommand.length > 4)
                    {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                                                                            parseInt(nextCommand[2]),
                                                                            this.parseColor(nextCommand[3]),
                                                                            parseFloat(nextCommand[4]),
                                                                            true,
                                                                            "",
                                                                            0);
                    }
                    else if (nextCommand.length > 3)
                    {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                                                                            parseInt(nextCommand[2]),
                                                                            this.parseColor(nextCommand[3]),
                                                                            0.0,
                                                                            true,
                                                                            "",
                                                                            0);
                    }
                    else
                    {
                        this.animatedObjects.connectEdge(parseInt(nextCommand[1]),
                                                                            parseInt(nextCommand[2]),
                                                                            "#000000",
                                                                            0.0,
                                                                            true,
                                                                            "",
                                                                            0);
                        
                    }
                    undoBlock.push(new UndoConnect(parseInt(nextCommand[1]), parseInt (nextCommand[2]), false));
                }
                else if (nextCommand[0].toUpperCase() == "CREATERECTANGLE")
                {
                    if (nextCommand.length == 9)
                    {
                        this.animatedObjects.addRectangleObject(parseInt(nextCommand[1]), // ID
                                                                nextCommand[2], // Label
                                                                parseInt(nextCommand[3]), // w
                                                                parseInt(nextCommand[4]), // h
                                                                nextCommand[7], // xJustify
                                                                nextCommand[8],// yJustify
                                                                "#ffffff", // background color
                                                                "#000000"); // foreground color
                    }
                    else
                    {
                        this.animatedObjects.addRectangleObject(parseInt(nextCommand[1]), // ID
                                                                nextCommand[2], // Label
                                                                parseInt(nextCommand[3]), // w
                                                                parseInt(nextCommand[4]), // h
                                                                "center", // xJustify
                                                                "center",// yJustify
                                                                "#ffffff", // background color
                                                                "#000000"); // foreground color
                        
                    }
                    if (nextCommand.length > 6)
                    {
                        this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                    }
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                }
                
                else if (nextCommand[0].toUpperCase() == "MOVE")
                {
                    var objectID = parseInt(nextCommand[1]);
                    var nextAnim =  new SingleAnimation(objectID, 
                                                        this.animatedObjects.getNodeX(objectID), 
                                                        this.animatedObjects.getNodeY(objectID), 
                                                        parseInt(nextCommand[2]),
                                                        parseInt(nextCommand[3]));
                    this.currentBlock.push(nextAnim);

                    undoBlock.push(new UndoMove(nextAnim.objectID, nextAnim.toX, nextAnim.toY, nextAnim.fromX, nextAnim.fromY));

                    anyAnimations = true;
                }
                
                else if (nextCommand[0].toUpperCase() == "MOVETOALIGNRIGHT")
                {
                    var id = parseInt(nextCommand[1]);
                    var otherId = parseInt(nextCommand[2]);
                                    var newXY = this.animatedObjects.getAlignRightPos(id, otherId);


                    var nextAnim =  new SingleAnimation(id,
                                        this.animatedObjects.getNodeX(id), 
                                        this.animatedObjects.getNodeY(id), 
                                        newXY[0],
                                        newXY[1]);
                    this.currentBlock.push(nextAnim);
                    undoBlock.push(new UndoMove(nextAnim.objectID, nextAnim.toX, nextAnim.toY, nextAnim.fromX, nextAnim.fromY));
                    anyAnimations = true;
                }

                else if (nextCommand[0].toUpperCase() == "STEP")
                {
                    foundBreak = true;
                }
                else if (nextCommand[0].toUpperCase() == "SETFOREGROUNDCOLOR")
                {
                    var id = parseInt(nextCommand[1]);
                    var oldColor = this.animatedObjects.foregroundColor(id);
                    this.animatedObjects.setForegroundColor(id, this.parseColor(nextCommand[2]));
                    undoBlock.push(new UndoSetForegroundColor(id, oldColor));
                }
                else if (nextCommand[0].toUpperCase() == "SETBACKGROUNDCOLOR")
                {
                    id = parseInt(nextCommand[1]);
                    oldColor = this.animatedObjects.backgroundColor(id);
                    this.animatedObjects.setBackgroundColor(id, this.parseColor(nextCommand[2]));
                    undoBlock.push(new UndoSetBackgroundColor(id, oldColor));
                }
                else if (nextCommand[0].toUpperCase() == "SETHIGHLIGHT")
                {
                    var newHighlight = this.parseBool(nextCommand[2]);
                    this.animatedObjects.setHighlight( parseInt(nextCommand[1]), newHighlight);
                    undoBlock.push(new UndoHighlight( parseInt(nextCommand[1]), !newHighlight));
                }
                else if (nextCommand[0].toUpperCase() == "DISCONNECT")
                {
                    var undoConnect = this.animatedObjects.disconnect(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
                    if (undoConnect != null)
                    {
                        undoBlock.push(undoConnect);
                    }
                }
                else if (nextCommand[0].toUpperCase() == "SETALPHA")
                {
                    var oldAlpha = this.animatedObjects.getAlpha(parseInt(nextCommand[1]));
                    this.animatedObjects.setAlpha(parseInt(nextCommand[1]), parseFloat(nextCommand[2]));
                    undoBlock.push(new UndoSetAlpha(parseInt(nextCommand[1]), oldAlpha));					
                }
                else if (nextCommand[0].toUpperCase() == "SETTEXT")
                {
                    if (nextCommand.length > 3)
                    {
                        var oldText = this.animatedObjects.getText(parseInt(nextCommand[1]), parseInt(nextCommand[3]));
                        this.animatedObjects.setText(parseInt(nextCommand[1]), nextCommand[2], parseInt(nextCommand[3]));
                        if (oldText != undefined)
                        {
                            undoBlock.push(new UndoSetText(parseInt(nextCommand[1]), oldText, parseInt(nextCommand[3]) ));			
                        }	
                    }
                    else
                    {
                        oldText = this.animatedObjects.getText(parseInt(nextCommand[1]), 0);
                        this.animatedObjects.setText(parseInt(nextCommand[1]), nextCommand[2], 0);
                        if (oldText != undefined)
                        {
                            undoBlock.push(new UndoSetText(parseInt(nextCommand[1]), oldText, 0));	
                        }
                    }
                }
                else if (nextCommand[0].toUpperCase() == "DELETE")
                {
                    var objectID  = parseInt(nextCommand[1]);
                    
                    var i;
                    var removedEdges = this.animatedObjects.deleteIncident(objectID);
                    if (removedEdges.length > 0)
                    {
                        undoBlock = undoBlock.concat(removedEdges);
                    }
                    var obj = this.animatedObjects.getObject(objectID);
                    if (obj != null)
                    {
                        undoBlock.push(obj.createUndoDelete());
                        this.animatedObjects.removeObject(objectID);
                    }
                }
                else if (nextCommand[0].toUpperCase() == "CREATEHIGHLIGHTCIRCLE")
                {
                    if (nextCommand.length > 5)
                    {
                        this.animatedObjects.addHighlightCircleObject(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), parseFloat(nextCommand[5]));
                    }
                    else
                    {
                        this.animatedObjects.addHighlightCircleObject(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), 20);						
                    }
                    if (nextCommand.length > 4)
                    {
                        this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[3]), parseInt(nextCommand[4]));
                    }
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                    
                    
                }
                else if (nextCommand[0].toUpperCase() == "CREATELABEL")
                {
                    if (nextCommand.length == 6)
                    {
                        this.animatedObjects.addLabelObject(parseInt(nextCommand[1]), nextCommand[2], this.parseBool(nextCommand[5]));						
                    }
                    else
                    {
                        this.animatedObjects.addLabelObject(parseInt(nextCommand[1]), nextCommand[2], true);
                    }
                    if (nextCommand.length >= 5)
                    {
                        
                        this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseFloat(nextCommand[3]), parseFloat(nextCommand[4]));
                    }
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                }
                else if (nextCommand[0].toUpperCase() == "SETEDGECOLOR")
                {
                    var from = parseInt(nextCommand[1]);
                    var to = parseInt(nextCommand[2]);
                    var newColor = this.parseColor(nextCommand[3]);
                    var oldColor = this.animatedObjects.setEdgeColor(from, to, newColor);				
                    undoBlock.push(new UndoSetEdgeColor(from, to, oldColor));
                }
                else if (nextCommand[0].toUpperCase() == "SETEDGEALPHA")
                {
                    var from = parseInt(nextCommand[1]);
                    var to = parseInt(nextCommand[2]);
                    var newAlpha = parseFloat(nextCommand[3]);
                    var oldAplpha = this.animatedObjects.setEdgeAlpha(from, to, newAlpha);				
                    undoBlock.push(new UndoSetEdgeAlpha(from, to, oldAplpha));
                }
                
                
                else if (nextCommand[0].toUpperCase() == "SETEDGEHIGHLIGHT")
                {
                    var newHighlight = this.parseBool(nextCommand[3]);
                    var from = parseInt(nextCommand[1]);
                    var to = parseInt(nextCommand[2]);
                    var oldHighlight = this.animatedObjects.setEdgeHighlight(from, to, newHighlight);
                    undoBlock.push(new UndoHighlightEdge(from, to, oldHighlight));
                }
                else if (nextCommand[0].toUpperCase() == "SETHEIGHT")
                {
                    id = parseInt(nextCommand[1]);
                    var oldHeight = this.animatedObjects.getHeight(id);
                    this.animatedObjects.setHeight(id, parseInt(nextCommand[2]));
                    undoBlock.push(new UndoSetHeight(id, oldHeight));
                }
                else if (nextCommand[0].toUpperCase() == "SETLAYER")
                {
                    this.animatedObjects.setLayer(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
                    //TODO: Add undo information here
                }
                
                
                else if (nextCommand[0].toUpperCase() == "CREATELINKEDLIST")
                {
                    if (nextCommand.length == 11)
                    {
                        this.animatedObjects.addLinkedListObject(parseInt(nextCommand[1]), nextCommand[2], 
                            parseInt(nextCommand[3]), parseInt(nextCommand[4]), parseFloat(nextCommand[7]), 
                            this.parseBool(nextCommand[8]), this.parseBool(nextCommand[9]),parseInt(nextCommand[10]), "#FFFFFF", "#000000");
                    }
                    else
                    {
                        this.animatedObjects.addLinkedListObject(parseInt(nextCommand[1]), nextCommand[2], parseInt(nextCommand[3]), parseInt(nextCommand[4]), 0.25, true, false, 1, "#FFFFFF", "#000000");
                    }
                    if (nextCommand.length > 6)
                    {
                        this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                        undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                    }
                    
                }
                else if (nextCommand[0].toUpperCase() == "SETNULL")
                {
                    var oldNull = this.animatedObjects.getNull(parseInt(nextCommand[1]));
                    this.animatedObjects.setNull(parseInt(nextCommand[1]), this.parseBool(nextCommand[2]));
                    undoBlock.push(new UndoSetNull(parseInt(nextCommand[1]), oldNull));					
                }
                else if (nextCommand[0].toUpperCase() == "SETTEXTCOLOR")
                {
                    if (nextCommand.length > 3)
                    {
                        oldColor = this.animatedObjects.getTextColor(parseInt(nextCommand[1]), parseInt(nextCommand[3]));
                        this.animatedObjects.setTextColor(parseInt(nextCommand[1]), this.parseColor(nextCommand[2]), parseInt(nextCommand[3]));
                        undoBlock.push(new UndoSetTextColor(parseInt(nextCommand[1]), oldColor, parseInt(nextCommand[3]) ));					
                    }
                    else
                    {
                        oldColor = this.animatedObjects.getTextColor(parseInt(nextCommand[1]), 0);
                        this.animatedObjects.setTextColor(parseInt(nextCommand[1]),this.parseColor(nextCommand[2]), 0);
                        undoBlock.push(new UndoSetTextColor(parseInt(nextCommand[1]), oldColor, 0));					
                    }
                }
                
                
                else if (nextCommand[0].toUpperCase() == "CREATEBTREENODE")
                {

                    this.animatedObjects.addBTreeNode(parseInt(nextCommand[1]), parseFloat(nextCommand[2]), parseFloat(nextCommand[3]), 
                                parseInt(nextCommand[4]),this.parseColor(nextCommand[7]), this.parseColor(nextCommand[8]));
                    this.animatedObjects.setNodePosition(parseInt(nextCommand[1]), parseInt(nextCommand[5]), parseInt(nextCommand[6]));
                    undoBlock.push(new UndoCreate(parseInt(nextCommand[1])));
                }

                else if (nextCommand[0].toUpperCase() == "SETWIDTH")
                {
                    var id = parseInt(nextCommand[1]);
                    this.animatedObjects.setWidth(id, parseInt(nextCommand[2]));
                    var oldWidth = this.animatedObjects.getWidth(id);
                    undoBlock.push(new UndoSetWidth(id, oldWidth));
                }
                else if (nextCommand[0].toUpperCase() == "SETNUMELEMENTS")
                {
                    var oldElem = this.animatedObjects.getObject(parseInt(nextCommand[1]));
                    undoBlock.push(new UndoSetNumElements(oldElem, parseInt(nextCommand[2])));
                    this.animatedObjects.setNumElements(parseInt(nextCommand[1]), parseInt(nextCommand[2]));
                }
                else if (nextCommand[0].toUpperCase() == "SETPOSITION")
                {
                    var id = parseInt(nextCommand[1])
                    var oldX = this.animatedObjects.getNodeX(id);
                    var oldY = this.animatedObjects.getNodeY(id);
                    undoBlock.push(new UndoSetPosition(id, oldX, oldY));
                    this.animatedObjects.setNodePosition(id, parseInt(nextCommand[2]), parseInt(nextCommand[3]));
                }
                else if (nextCommand[0].toUpperCase() == "ALIGNRIGHT")
                {
                    var id = parseInt(nextCommand[1])
                    var oldX = this.animatedObjects.getNodeX(id);
                    var oldY = this.animatedObjects.getNodeY(id);
                    undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                    this.animatedObjects.alignRight(id, parseInt(nextCommand[2]));
                }
                else if (nextCommand[0].toUpperCase() == "ALIGNLEFT")
                {
                    var id = parseInt(nextCommand[1])
                    var oldX = this.animatedObjects.getNodeX(id);
                    var oldY = this.animatedObjects.getNodeY(id);
                    undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                    this.animatedObjects.alignLeft(id, parseInt(nextCommand[2]));
                }
                else if (nextCommand[0].toUpperCase() == "ALIGNTOP")
                {
                    var id = parseInt(nextCommand[1])
                    var oldX = this.animatedObjects.getNodeX(id);
                    var oldY = this.animatedObjects.getNodeY(id);
                    undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                    this.animatedObjects.alignTop(id, parseInt(nextCommand[2]));
                }
                else if (nextCommand[0].toUpperCase() == "ALIGNBOTTOM")
                {
                    var id = parseInt(nextCommand[1])
                    var oldX = this.animatedObjects.getNodeX(id);
                    var oldY = this.animatedObjects.getNodeY(id);
                    undoBlock.push(new UndoSetPosition(id, oldX. oldY));
                    this.animatedObjects.alignBottom(id, parseInt(nextCommand[2]));
                }





                else if (nextCommand[0].toUpperCase() == "SETHIGHLIGHTINDEX")
                {
                    var id = parseInt(nextCommand[1]);
                    var index = parseInt(nextCommand[2]);
                                    var oldIndex = this.animatedObjects.getHighlightIndex(id)
                    undoBlock.push(new UndoSetHighlightIndex(id, oldIndex));
                    this.animatedObjects.setHighlightIndex(id,index);
                }
                else
                {
        //			throw "Unknown command: " + nextCommand[0];					
                }
                
                this.currentAnimation = this.currentAnimation+1;
            }
            this.currFrame = 0;

            // Hack:  If there are not any animations, and we are currently paused,
            // then set the current frame to the end of the anumation, so that we will
            // advance immediagely upon the next step button.  If we are not paused, then
            // animate as normal.

            if (!anyAnimations && this.animationPaused || (!anyAnimations && this.currentAnimation == this.AnimationSteps.length) )
            {
                this.currFrame = this.animationBlockLength;
            }

            this.undoStack.push(undoBlock);
        }


	//  Start a new animation.  The input parameter commands is an array of strings,
	//  which represents the animation to start
	this.StartNewAnimation =  function(commands)
	{
		clearTimeout(timer);
		if (this.AnimationSteps != null)
		{
			this.previousAnimationSteps.push(this.AnimationSteps);
			this.undoAnimationStepIndicesStack.push(this.undoAnimationStepIndices);
		}
		if (commands == undefined || commands.length == 0)
		{
			this.AnimationSteps = ["Step"];
		}
		else
		{
			this.AnimationSteps = commands;
		}
		this.undoAnimationStepIndices = new Array();
		this.currentAnimation = 0;
		this.startNextBlock();
		this.currentlyAnimating = true;
		this.fireEvent("AnimationStarted","NoData");
		timer = setTimeout('timeout()', 30); 

	}
    
	// Step forwards one step.  A no-op if the animation is not currently paused
	this.step = function()
	{
		if (this.awaitingStep)
		{
			this.startNextBlock();
			this.fireEvent("AnimationStarted","NoData");
			this.currentlyAnimating = true;
			// Re-kick thie timer.  The timer should be going now, but we've had some difficulty with
			// it timing itself out, so we'll be safe and kick it now.
			clearTimeout(timer);
			timer = setTimeout('timeout()', 30); 			
		}
	}

	this.resetAll = function()
	{
		this.clearHistory();
		this.animatedObjects.clearAllObjects();
		this.animatedObjects.draw();
		clearTimeout(timer);
	}
	
	
	this.setLayer = function(shown, layers)
	{
		this.animatedObjects.setLayer(shown, layers)
		// Drop in an extra draw call here, just in case we are not
		// in the middle of an update loop when this changes
		this.animatedObjects.draw();
	}
	
	
	this.setAllLayers = function(layers)
	{
		this.animatedObjects.setAllLayers(layers);
		// Drop in an extra draw call here, just in case we are not
		// in the middle of an update loop when this changes
		this.animatedObjects.draw();
	}
	 
	
	this.update = function()
	{
		
		if (this.currentlyAnimating)
		{
			this.currFrame = this.currFrame + 1;
			var i;
			for (i = 0; i < this.currentBlock.length; i++)
			{
				if (this.currFrame == this.animationBlockLength || (this.currFrame == 1 && this.animationBlockLength == 0))
				{
					this.animatedObjects.setNodePosition(this.currentBlock[i].objectID,
													     this.currentBlock[i].toX,
													     this.currentBlock[i].toY);
				}
				else if (this.currFrame < this.animationBlockLength)
				{
					var objectID = this.currentBlock[i].objectID;
					var percent = 1 / (this.animationBlockLength - this.currFrame);
					var oldX = this.animatedObjects.getNodeX(objectID);
					var oldY = this.animatedObjects.getNodeY(objectID);
					var targetX = this.currentBlock[i].toX;
					var targety  = this.currentBlock[i].toY;						
					var newX = this.lerp(this.animatedObjects.getNodeX(objectID), this.currentBlock[i].toX, percent);
					var newY = this.lerp(this.animatedObjects.getNodeY(objectID), this.currentBlock[i].toY, percent);
					this.animatedObjects.setNodePosition(objectID, newX, newY);
				}
			}
			if (this.currFrame >= this.animationBlockLength)
			{
				if (this.doingUndo)
				{
					if (this.finishUndoBlock(this.undoStack.pop()))
					{
						this.awaitingStep = true;
						this.fireEvent("AnimationWaiting","NoData");
					}

				}
				else
				{
					if (this.animationPaused && (this.currentAnimation < this.AnimationSteps.length))
					{
						this.awaitingStep = true;
						this.fireEvent("AnimationWaiting","NoData");
						this.currentBlock = [];
					}
					else
					{
						this.startNextBlock();
					}
				}
			}
			this.animatedObjects.update();		
		
		}

		
	}
    }
}


				
function SingleAnimation(id, fromX, fromY, toX, toY)
{
	this.objectID = id;
	this.fromX = fromX;
	this.fromY = fromY;
	this.toX = toX;
	this.toY = toY;	
}
