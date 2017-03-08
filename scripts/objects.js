/* Object Definitions */
function Node(xPos,yPos){
	this.x=xPos;
	this.y=yPos;
	this.r=20;
	this.bThickness=1;
	this.bcol="black";
	this.col="#FF383F";
	this.name="";
	this.neighbours=[];
	this.coloring="";

	/*Slowly moving a node 
	  Usage: node.move(milliseconds,new X position, new Y position)
	  This code looks like shit and there's probably a better way of doing it*/
	this.move=function(time,xPos,yPos){
		var myself=this; //because the setInterval function changes 'this' to point to 'window'
		var frameRate=10;
		var xDisplacement=xPos-myself.x;
		var yDisplacement=yPos-myself.y;
		var tickCount=time/frameRate;
		var timer=setInterval(function(){
			myself.x+=xDisplacement/tickCount;
			myself.y+=yDisplacement/tickCount;
			refreshCanvas();
			if(withinRange(myself.x,xPos,0.1) && withinRange(myself.y,yPos,1)) clearInterval(timer);
		},frameRate);
	}
}

function Edge(v1,v2){
	console.log(v1)
	this.v1=v1;
	this.v2=v2;
	this.thickness=2;
	this.colour="#A9A9A9";
}